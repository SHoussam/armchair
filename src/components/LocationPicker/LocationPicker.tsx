import { useState, useRef, useEffect, useCallback } from "react"
import { MapPin, Search, Navigation, X, ChevronDown, Check } from "lucide-react"
import { api } from "@/services/api"
import { debounce } from "@/utils/debounce"
import type { City } from "@/data/data"
import "./LocationPicker.css"

interface LocationSuggestion {
  id?: number | null
  name?: string
  city_name?: string
  city?: string
  zone_type?: string
  latitude?: number
  longitude?: number
}

interface LocationPickerProps {
  cities: City[]
  selectedCityId: number | string | null
  onSelect: (city: City) => void
  onGpsLocate: (lat: number, lng: number) => void
  onLocationResolved?: (quote: {
    locationId: number
    coords: { lat: number; lng: number }
    shippingCost: number
    zone: string
    estimatedDelivery: string
  }) => void
  disabled?: boolean
}

export default function LocationPicker({
  cities,
  selectedCityId,
  onSelect,
  onGpsLocate,
  onLocationResolved,
  disabled,
}: LocationPickerProps) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [gpsSuccess, setGpsSuccess] = useState(false)
  const [gpsError, setGpsError] = useState("")
  const [highlightIdx, setHighlightIdx] = useState(-1)
  const [backendResults, setBackendResults] = useState<LocationSuggestion[]>([])
  const [searching, setSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const selectedCity = cities.find((c) => String(c.id) === String(selectedCityId)) || null

  const [displayValue, setDisplayValue] = useState(selectedCity?.name || "")

  useEffect(() => {
    if (selectedCity && !open) {
      setDisplayValue(selectedCity.name)
      setGpsSuccess(false)
    }
  }, [selectedCity, open])

  // Backend search with 300ms debounce
  const searchBackend = useCallback(
    debounce(async (q: string) => {
      if (q.trim().length < 2) {
        setBackendResults([])
        setSearching(false)
        return
      }
      setSearching(true)
      try {
        const data = await api.get<{ success: boolean; data: LocationSuggestion[] }>(
          `/locations/search?q=${encodeURIComponent(q)}`
        )
        if (data.success && Array.isArray(data.data)) {
          setBackendResults(data.data)
        }
      } catch {
        // Silently fall back to local results
      } finally {
        setSearching(false)
      }
    }, 300),
    []
  )

  // Merge backend results with local city matches
  const filtered = query.trim().length > 0
    ? [
        ...cities.filter((c) => {
          const q = query.toLowerCase().trim()
          return c.name.toLowerCase().includes(q) || c.zone.toLowerCase().includes(q)
        }),
        ...backendResults
          .filter((br) => {
            const brName = (br.name || br.city_name || br.city || "").toLowerCase()
            return brName && !cities.some((c) => c.name.toLowerCase() === brName)
          })
          .map((br) => {
            const cityName = br.name || br.city_name || br.city || "Unknown Location"
            const zone = br.zone_type || "national"
            return {
              id: br.id ?? cityName,
              name: cityName,
              zone,
              shipping: zone === "tanger" ? 0 : 350,
              latitude: br.latitude,
              longitude: br.longitude,
              is_active: true,
              isBackendResult: true,
            }
          }),
      ]
    : cities

  const handleQueryChange = useCallback(
    (val: string) => {
      setQuery(val)
      setDisplayValue(val)
      setGpsSuccess(false)
      setHighlightIdx(-1)
      setOpen(true)
      searchBackend(val)
    },
    [searchBackend]
  )

  const handleSelect = (city: City & { isBackendResult?: boolean }) => {
    setQuery("")
    setDisplayValue(city.name)
    setGpsSuccess(false)
    setOpen(false)
    setHighlightIdx(-1)
    setBackendResults([])
    onSelect(city)
    inputRef.current?.blur()
  }

  const handleClear = () => {
    setQuery("")
    setDisplayValue("")
    setGpsSuccess(false)
    setOpen(false)
    setHighlightIdx(-1)
    setGpsError("")
    setBackendResults([])
    inputRef.current?.focus()
  }

  const handleGps = () => {
    if (gpsSuccess) {
      handleClear()
      return
    }
    if (!navigator.geolocation) {
      setGpsError("Geolocation not supported")
      return
    }
    setGpsLoading(true)
    setGpsError("")
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude
        const lng = pos.coords.longitude
        onGpsLocate(lat, lng)

        try {
          const data = await api.post<{
            success: boolean
            data: {
              location: { id: number }
              delivery: { shipping_cost: number; zone: string; estimated_delivery: string }
            }
          }>("/locations/gps", { latitude: lat, longitude: lng })

          if (data.success && data.data?.location && data.data?.delivery) {
            onLocationResolved?.({
              locationId: data.data.location.id,
              coords: { lat, lng },
              shippingCost: data.data.delivery.shipping_cost,
              zone: data.data.delivery.zone,
              estimatedDelivery: data.data.delivery.estimated_delivery,
            })
          }
        } catch {
          // GPS quote failed — proceed without it
        }

        setGpsLoading(false)
        setGpsSuccess(true)
        setDisplayValue("")
        setOpen(false)
      },
      (err) => {
        setGpsLoading(false)
        if (err.code === 1) setGpsError("Permission denied")
        else if (err.code === 2) setGpsError("Location unavailable")
        else setGpsError("Request timed out")
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || filtered.length === 0) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightIdx((prev) => (prev < filtered.length - 1 ? prev + 1 : 0))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightIdx((prev) => (prev > 0 ? prev - 1 : filtered.length - 1))
    } else if (e.key === "Enter" && highlightIdx >= 0) {
      e.preventDefault()
      handleSelect(filtered[highlightIdx])
    } else if (e.key === "Escape") {
      setOpen(false)
      inputRef.current?.blur()
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        listRef.current &&
        !listRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="location-picker">
      {/* GPS Button */}
      <button
        type="button"
        className={`location-gps-btn ${gpsLoading ? "loading" : ""} ${gpsSuccess ? "success" : ""}`}
        onClick={handleGps}
        disabled={disabled || gpsLoading}
      >
        {gpsSuccess ? <Check size={16} /> : <Navigation size={16} />}
        {gpsLoading ? "Locating..." : gpsSuccess ? "Location found" : "Use my current location"}
      </button>
      {gpsError && <span className="location-gps-error">{gpsError}</span>}

      {/* Manual Search — hidden when GPS is active */}
      {!gpsSuccess && (
        <>
          <div className="location-divider">
            <span>or enter manually</span>
          </div>

          <div className="location-input-wrap">
            <Search size={16} className="location-input-icon" />
            <input
              ref={inputRef}
              type="text"
              className="location-input"
              placeholder={searching ? "Searching..." : "Search your city..."}
              value={displayValue}
              onChange={(e) => handleQueryChange(e.target.value)}
              onFocus={() => {
                if (query.trim()) setOpen(true)
              }}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              autoComplete="off"
              role="combobox"
              aria-expanded={open}
              aria-haspopup="listbox"
            />
            {displayValue && (
              <button type="button" className="location-clear" onClick={handleClear} aria-label="Clear">
                <X size={14} />
              </button>
            )}
            <ChevronDown size={16} className="location-chevron" />
          </div>
        </>
      )}

      {/* GPS success hint */}
      {gpsSuccess && (
        <button type="button" className="location-gps-reset" onClick={handleClear}>
          Change location
        </button>
      )}

      {/* Dropdown */}
      {open && filtered.length > 0 && (
        <>
          <div className="location-backdrop" onClick={() => setOpen(false)} />
          <div className="location-dropdown" ref={listRef} role="listbox">
            <div className="location-sheet-grabber" />
            {filtered.map((city, i) => (
              <button
                key={city.id}
                type="button"
                className={`location-option ${String(city.id) === String(selectedCityId) ? "selected" : ""} ${i === highlightIdx ? "highlighted" : ""}`}
                onClick={() => handleSelect(city)}
                role="option"
                aria-selected={String(city.id) === String(selectedCityId)}
              >
                <MapPin size={14} className="location-option-icon" />
                <span className="location-option-name">{city.name}</span>
                <span className="location-option-shipping">
                  {city.shipping > 0 ? `${city.shipping} MAD` : "Free shipping"}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
