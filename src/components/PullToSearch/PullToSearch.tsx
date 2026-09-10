import { useState, useEffect, useRef, useLayoutEffect } from "react"
import { Search, X } from "lucide-react"
import { Product, products as defaultProducts, fetchProducts } from "@/data/data"

interface PullToSearchProps {
  query: string
  onChange: (q: string) => void
  onSelectProduct: (product: Product) => void
}

// Viewport guard: this whole feature only exists at/below the mobile breakpoint.
const MOBILE_BREAKPOINT = 768

export default function PullToSearch({ query, onChange, onSelectProduct }: PullToSearchProps) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= MOBILE_BREAKPOINT)
  const barRef = useRef<HTMLDivElement>(null)
  const [term, setTerm] = useState(query)
  const [isFocused, setIsFocused] = useState(false)
  const [productList, setProductList] = useState<Product[]>(defaultProducts)
  const [results, setResults] = useState<Product[]>([])

  // Keep the feature gated to mobile across resizes (desktop stays untouched).
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Hide-on-load: measure the bar and scroll it exactly out of view above the
  // screen, so pulling down from the top reveals it (native iOS offset logic).
  useLayoutEffect(() => {
    if (!isMobile) return
    const bar = barRef.current
    if (!bar) return
    const height = bar.offsetHeight
    const hideBar = () => {
      window.scrollTo({ top: height, behavior: "instant" as ScrollBehavior })
    }
    hideBar()
    // Re-apply after a frame + a beat to win over scroll restoration/smooth CSS.
    const raf = requestAnimationFrame(hideBar)
    const timer = window.setTimeout(hideBar, 250)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(timer)
    }
  }, [isMobile])

  // Sync with the shared search query (desktop navbar also writes to it).
  useEffect(() => {
    setTerm(query)
  }, [query])

  // Fetch live products for autocomplete.
  useEffect(() => {
    let isMounted = true
    fetchProducts().then((prods) => {
      if (isMounted && prods && prods.length > 0) {
        setProductList(prods)
      }
    })
    return () => { isMounted = false }
  }, [])

  // Filter live results as the user types.
  useEffect(() => {
    const q = term.toLowerCase().trim()
    if (!q) {
      setResults([])
      return
    }
    const matches = productList.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.desc && p.desc.toLowerCase().includes(q))
    )
    setResults(matches)
  }, [term, productList])

  // Escape closes the dropdown.
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFocused(false)
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  // Desktop: nothing to render, layout remains completely untouched.
  if (!isMobile) return null

  const handleChange = (val: string) => {
    setTerm(val)
    onChange(val)
  }

  const handleClear = () => {
    setTerm("")
    onChange("")
  }

  const handleSelect = (product: Product) => {
    setIsFocused(false)
    onSelectProduct(product)
  }

  return (
    <div className="pull-to-search" ref={barRef}>
      <div className="pull-to-search-bar">
        <Search className="pull-to-search-icon" size={18} />
        <input
          type="text"
          className="pull-to-search-input"
          placeholder="Search armchairs, salons, mattresses..."
          value={term}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          aria-label="Search products"
        />
        {term && (
          <button type="button" className="pull-to-search-clear" onClick={handleClear} aria-label="Clear search">
            <X size={15} />
          </button>
        )}
      </div>

      {isFocused && term.trim().length > 0 && (
        <div className="pull-to-search-dropdown">
          {results.length > 0 ? (
            <div className="navbar-search-results">
              {results.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className="navbar-search-item"
                  onClick={() => handleSelect(p)}
                >
                  <img src={p.img} alt={p.imgAlt || p.name} className="navbar-search-thumb" />
                  <div className="navbar-search-item-info">
                    <div className="navbar-search-item-name">{p.name}</div>
                    <div className="navbar-search-item-meta">
                      <span className="navbar-search-item-cat">{p.category}</span>
                      <span className="navbar-search-item-price">MAD {p.price?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="pull-to-search-empty">No furniture found for "{term}"</div>
          )}
        </div>
      )}
    </div>
  )
}