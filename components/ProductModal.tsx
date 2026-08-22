"use client"

import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import {
  Product,
  upholsteryStyles,
  SofaConfig,
  MattressConfig,
  ChairConfig,
  AccessoryConfig,
  SeatSize,
} from "@/data/data"
import { useCart } from "@/context/CartContext"
import {
  calculateSofaPrice,
  calculateMattressPrice,
  calculateChairPrice,
  calculateAccessoryPrice,
  formatPriceDH,
} from "@/src/utils/pricing"
import SofaVisualizer from "./SofaVisualizer"
import MattressVisualizer from "./MattressVisualizer"
import ChairVisualizer from "./ChairVisualizer"
import AccessoryVisualizer from "./AccessoryVisualizer"

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])
  return isMobile
}

interface ProductModalProps {
  product: Product | null
  onClose: () => void
}

function renderStars(rating: number): string {
  return "★".repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? "½" : "")
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addItem, toggleCart, showToast } = useCart()
  const isMobile = useIsMobile()
  const modalBodyRef = useRef<HTMLDivElement>(null)
  const touchStartY = useRef(0)

  // Swipe-down to close on mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const deltaY = e.changedTouches[0].clientY - touchStartY.current
    if (deltaY > 100 && modalBodyRef.current && modalBodyRef.current.scrollTop <= 0) {
      onClose()
    }
  }, [onClose])

  // Common options
  const [selectedColorIdx, setSelectedColorIdx] = useState(0)
  const [selectedStyleId, setSelectedStyleId] = useState(upholsteryStyles[0].id)
  const [qty, setQty] = useState(1)
  const [activeVisView, setActiveVisView] = useState<"configurator" | "photo">("photo")
  const hasCustomized = useRef(false)

  // Sofa State
  const [seatSize, setSeatSize] = useState<SeatSize>(70)
  const [sofaL1, setSofaL1] = useState(2.7)
  const [sofaL2, setSofaL2] = useState(2.0)
  const [headrests, setHeadrests] = useState(2)
  const [chaiseOrientation, setChaiseOrientation] = useState<"left" | "right">("left")

  // Mattress State
  const [mattressSizeId, setMattressSizeId] = useState("queen_160_200")
  const [isCustomMattressSize, setIsCustomMattressSize] = useState(false)
  const [mattressWidth, setMattressWidth] = useState(1.60)
  const [mattressLength, setMattressLength] = useState(2.00)
  const [mattressThicknessId, setMattressThicknessId] = useState("t25")
  const [mattressCoreId, setMattressCoreId] = useState("pocket_springs")
  const [mattressFirmnessId, setMattressFirmnessId] = useState("ortho_firm")

  // Chair State
  const [chairWidth, setChairWidth] = useState(0.85)
  const [chairLegId, setChairLegId] = useState("natural_oak")
  const [chairTuftingId, setChairTuftingId] = useState("smooth")

  // Accessory State
  const [accessoryPackId, setAccessoryPackId] = useState("pack_4")
  const [accessorySizeId, setAccessorySizeId] = useState("s45")
  const [accessoryFillId, setAccessoryFillId] = useState("microfiber")

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedColorIdx(0)
      setSelectedStyleId(upholsteryStyles[0].id)
      setQty(1)
      setActiveVisView("photo")
      hasCustomized.current = false

      const config = product.config

      if (config.type === "sofa") {
        setSeatSize(config.defaultSeatSize || 70)
        setSofaL1(config.baseLength1 || 2.7)
        setSofaL2(config.baseLength2 || 2.0)
        setHeadrests(config.defaultHeadrests ?? 2)
        setChaiseOrientation("left")
      } else if (config.type === "mattress") {
        setMattressSizeId(config.defaultSizeId || config.sizes[0]?.id || "queen_160_200")
        setIsCustomMattressSize(false)
        const defSize = config.sizes.find((s) => s.id === config.defaultSizeId) || config.sizes[0]
        if (defSize) {
          setMattressWidth(defSize.width)
          setMattressLength(defSize.length)
        }
        setMattressThicknessId(config.thicknessOptions[0]?.id || "t20")
        setMattressCoreId(config.coreOptions[0]?.id || "pocket_springs")
        setMattressFirmnessId(config.firmnessLevels[0]?.id || "medium")
      } else if (config.type === "chair") {
        setChairWidth(config.baseWidth || 0.85)
        setChairLegId(config.legFinishes[0]?.id || "natural_oak")
        setChairTuftingId(config.tuftingStyles[0]?.id || "smooth")
      } else if (config.type === "accessory") {
        setAccessoryPackId(config.packOptions[1]?.id || config.packOptions[0]?.id || "pack_4")
        setAccessorySizeId(config.sizeOptions[0]?.id || "s45")
        setAccessoryFillId(config.fillOptions[0]?.id || "microfiber")
      }
    }

    if (product) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [product])

  // Escape key listener
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose])

  // Auto-switch to SVG blueprint when user customizes anything
  useEffect(() => {
    if (!product || hasCustomized.current) return
    const config = product.config
    // Detect if any value differs from its default
    let changed = false
    if (config.type === "sofa") {
      const sc = config as SofaConfig
      changed = seatSize !== sc.defaultSeatSize ||
        sofaL1 !== sc.baseLength1 ||
        sofaL2 !== sc.baseLength2 ||
        headrests !== (sc.defaultHeadrests ?? 2)
    } else if (config.type === "mattress") {
      const defSize = config.sizes.find((s) => s.id === config.defaultSizeId) || config.sizes[0]
      changed = mattressSizeId !== (config.defaultSizeId || config.sizes[0]?.id) ||
        (defSize !== undefined && (mattressWidth !== defSize.width || mattressLength !== defSize.length))
    } else if (config.type === "chair") {
      changed = chairWidth !== (config as ChairConfig).baseWidth
    } else if (config.type === "accessory") {
      changed = accessoryPackId !== (config.packOptions[1]?.id || config.packOptions[0]?.id)
    }
    if (changed) {
      hasCustomized.current = true
      setActiveVisView("configurator")
    }
  }, [product, seatSize, sofaL1, sofaL2, headrests, mattressSizeId, mattressWidth, mattressLength, chairWidth, accessoryPackId])

  const selectedStyle = useMemo(
    () => upholsteryStyles.find((style) => style.id === selectedStyleId) ?? upholsteryStyles[0],
    [selectedStyleId]
  )

  // Dynamic Price Breakdown based on Product Type
  const pricingData = useMemo(() => {
    if (!product) return null
    const config = product.config

    if (config.type === "sofa") {
      const sofaConf = config as SofaConfig
      const calc = calculateSofaPrice({
        seatSize,
        length1: sofaL1,
        length2: sofaL2,
        baseLength1: sofaConf.baseLength1,
        baseLength2: sofaConf.baseLength2,
        headrests,
        chaiseOrientation,
        fabricMultiplier: selectedStyle.multiplier,
        sofaConfig: sofaConf,
      })
      return { type: "sofa" as const, data: calc, unitPrice: calc.finalPrice }
    }

    if (config.type === "mattress") {
      const matConf = config as MattressConfig
      const calc = calculateMattressPrice({
        sizeId: mattressSizeId,
        isCustomSize: isCustomMattressSize,
        customWidth: mattressWidth,
        customLength: mattressLength,
        thicknessId: mattressThicknessId,
        coreId: mattressCoreId,
        firmnessId: mattressFirmnessId,
        mattressConfig: matConf,
      })
      return { type: "mattress" as const, data: calc, unitPrice: calc.finalPrice }
    }

    if (config.type === "chair") {
      const chairConf = config as ChairConfig
      const calc = calculateChairPrice({
        width: chairWidth,
        legFinishId: chairLegId,
        tuftingStyleId: chairTuftingId,
        styleId: selectedStyle.id,
        chairConfig: chairConf,
      })
      return { type: "chair" as const, data: calc, unitPrice: calc.finalPrice }
    }

    if (config.type === "accessory") {
      const accConf = config as AccessoryConfig
      const calc = calculateAccessoryPrice({
        packId: accessoryPackId,
        sizeId: accessorySizeId,
        fillId: accessoryFillId,
        styleId: selectedStyle.id,
        accessoryConfig: accConf,
      })
      return { type: "accessory" as const, data: calc, unitPrice: calc.finalPrice }
    }

    return null
  }, [
    product,
    seatSize,
    sofaL1,
    sofaL2,
    headrests,
    chaiseOrientation,
    selectedStyle,
    mattressSizeId,
    isCustomMattressSize,
    mattressWidth,
    mattressLength,
    mattressThicknessId,
    mattressCoreId,
    mattressFirmnessId,
    chairWidth,
    chairLegId,
    chairTuftingId,
    accessoryPackId,
    accessorySizeId,
    accessoryFillId,
  ])

  if (!product || !pricingData) return null

  const currentUnitPrice = pricingData.unitPrice
  const currentTotalPrice = currentUnitPrice * qty

  const sofaPricing = pricingData.type === "sofa" ? pricingData.data : null
  const mattressPricing = pricingData.type === "mattress" ? pricingData.data : null
  const chairPricing = pricingData.type === "chair" ? pricingData.data : null
  const accessoryPricing = pricingData.type === "accessory" ? pricingData.data : null

  const handleAddToCart = () => {
    const config = product.config

    if (config.type === "sofa" && sofaPricing) {
      addItem(product, selectedColorIdx, {
        qty,
        styleId: selectedStyle.id,
        styleLabel: selectedStyle.label,
        seatSize,
        length1: sofaL1,
        length2: sofaL2,
        headrests,
        chaiseOrientation,
        unitPrice: sofaPricing.finalPrice,
        priceBreakdown: sofaPricing,
      })
      showToast(`${product.name} (${seatSize}cm · ${sofaL1.toFixed(2)}m × ${sofaL2.toFixed(2)}m) added to cart`)
    } else if (config.type === "mattress" && mattressPricing) {
      addItem(product, selectedColorIdx, {
        qty,
        styleId: selectedStyle.id,
        styleLabel: selectedStyle.label,
        unitPrice: mattressPricing.finalPrice,
        priceBreakdown: mattressPricing,
      })
      showToast(`${product.name} (${mattressPricing.sizeLabel}) added to cart`)
    } else if (config.type === "chair" && chairPricing) {
      addItem(product, selectedColorIdx, {
        qty,
        styleId: selectedStyle.id,
        styleLabel: selectedStyle.label,
        unitPrice: chairPricing.finalPrice,
        priceBreakdown: chairPricing,
      })
      showToast(`${product.name} (${Math.round(chairWidth * 100)}cm width) added to cart`)
    } else if (config.type === "accessory" && accessoryPricing) {
      addItem(product, selectedColorIdx, {
        qty,
        styleId: selectedStyle.id,
        styleLabel: selectedStyle.label,
        unitPrice: accessoryPricing.finalPrice,
        priceBreakdown: accessoryPricing,
      })
      showToast(`${product.name} (${accessoryPricing.packLabel}) added to cart`)
    }

    onClose()
    toggleCart()
  }

  const handleBgClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  const configType = product.config.type

  return (
    <div
      className={`modal-overlay ${product ? "open" : ""}`}
      onClick={handleBgClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Product configurator for ${product.name}`}
    >
      <div
        className="modal modal-sofa-wide"
        onTouchStart={isMobile ? handleTouchStart : undefined}
        onTouchEnd={isMobile ? handleTouchEnd : undefined}
      >
        <div className="modal-inner">
          {/* Left Column: Interactive Vector Visualizer */}
          <div className="modal-img-col">
            {configType === "sofa" && (
              <SofaVisualizer
                length1={sofaL1}
                length2={sofaL2}
                seatSize={seatSize}
                colorHex={product.colors[selectedColorIdx]}
                colorName={product.colorNames[selectedColorIdx]}
                headrests={headrests}
                chaiseOrientation={chaiseOrientation}
                photoUrl={product.img}
                photoAlt={product.imgAlt}
                modelName={product.name}
                activeView={activeVisView}
                onToggleView={setActiveVisView}
                onLength1Change={setSofaL1}
                onLength2Change={setSofaL2}
                minLength1={(product.config as SofaConfig).minLength1}
                maxLength1={(product.config as SofaConfig).maxLength1}
                minLength2={(product.config as SofaConfig).minLength2}
                maxLength2={(product.config as SofaConfig).maxLength2}
              />
            )}

            {configType === "mattress" && mattressPricing && (
              <MattressVisualizer
                width={mattressPricing.width}
                length={mattressPricing.length}
                thicknessCm={mattressPricing.thicknessCm}
                coreLabel={mattressPricing.coreLabel}
                firmnessLabel={
                  (product.config as MattressConfig).firmnessLevels.find(
                    (f) => f.id === mattressFirmnessId
                  )?.label || "Ortho Support"
                }
                colorHex={product.colors[selectedColorIdx]}
                colorName={product.colorNames[selectedColorIdx]}
                photoUrl={product.img}
                photoAlt={product.imgAlt}
                modelName={product.name}
                activeView={activeVisView}
                onToggleView={setActiveVisView}
              />
            )}

            {configType === "chair" && chairPricing && (
              <ChairVisualizer
                width={chairWidth}
                colorHex={product.colors[selectedColorIdx]}
                colorName={product.colorNames[selectedColorIdx]}
                legFinishId={chairLegId}
                legFinishLabel={chairPricing.legLabel}
                legColorHex={
                  (product.config as ChairConfig).legFinishes.find((l) => l.id === chairLegId)
                    ?.colorHex || "#b89060"
                }
                tuftingStyleId={chairTuftingId}
                tuftingLabel={chairPricing.tuftingLabel}
                photoUrl={product.img}
                photoAlt={product.imgAlt}
                modelName={product.name}
                activeView={activeVisView}
                onToggleView={setActiveVisView}
                onWidthChange={setChairWidth}
                minWidth={(product.config as ChairConfig).minWidth}
                maxWidth={(product.config as ChairConfig).maxWidth}
              />
            )}

            {configType === "accessory" && accessoryPricing && (
              <AccessoryVisualizer
                packCount={accessoryPricing.packCount}
                sizeLabel={accessoryPricing.sizeLabel}
                fillLabel={accessoryPricing.fillLabel}
                colorHex={product.colors[selectedColorIdx]}
                colorName={product.colorNames[selectedColorIdx]}
                photoUrl={product.img}
                photoAlt={product.imgAlt}
                modelName={product.name}
                activeView={activeVisView}
                onToggleView={setActiveVisView}
              />
            )}
          </div>

          {/* Right Column: Customization Controls & Live Summary */}
          <div className="modal-body" ref={modalBodyRef}>
            <button className="modal-close" onClick={onClose} aria-label="Close configurator">
              ✕
            </button>

            <div className="modal-category-row">
              <span className="modal-category">{product.category}</span>
              <span className="modal-badge-custom">Bespoke Configurator</span>
            </div>

            <h2 className="modal-name">{product.name}</h2>

            <div className="modal-stars">
              {renderStars(product.rating)}{" "}
              <span>
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price Header */}
            <div className="modal-price-row">
              <span className="modal-price">{formatPriceDH(currentUnitPrice)}</span>
              <span className="modal-price-tag">
                {configType === "sofa" && sofaPricing &&
                  (sofaPricing.extraMeters > 0
                    ? `Base ${formatPriceDH(sofaPricing.basePrice)} + ${formatPriceDH(sofaPricing.dimensionSupplement)} extra`
                    : `Base for ${seatSize} cm modules`)}
                {configType === "mattress" && mattressPricing && `${mattressPricing.sizeLabel}`}
                {configType === "chair" && `${Math.round(chairWidth * 100)} cm wide with custom legs`}
                {configType === "accessory" && accessoryPricing && `${accessoryPricing.packLabel}`}
              </span>
            </div>

            {/* ───────────────── 1. SOFA CONFIGURATION CONTROLS ───────────────── */}
            {configType === "sofa" && (
              <>
                <div className="sofa-base-info-banner">
                  <div className="base-info-header">
                    <span className="base-icon">📐</span>
                    <span className="base-title">Reference Base Model</span>
                  </div>
                  <div className="base-info-grid">
                    <div className="base-info-item">
                      <span className="base-lbl">Standard Dimensions:</span>
                      <span className="base-val">
                        {(product.config as SofaConfig).baseLength1.toFixed(2)} m ×{" "}
                        {(product.config as SofaConfig).baseLength2.toFixed(2)} m
                      </span>
                    </div>
                    <div className="base-info-item">
                      <span className="base-lbl">Base Seat Module:</span>
                      <span className="base-val">{(product.config as SofaConfig).defaultSeatSize} cm</span>
                    </div>
                    <div className="base-info-item">
                      <span className="base-lbl">Starting Price:</span>
                      <span className="base-val gold">3,000 DH</span>
                    </div>
                    <div className="base-info-item">
                      <span className="base-lbl">Current Rate / Meter:</span>
                      <span className="base-val gold">
                        {(product.config as SofaConfig).seatPricing[seatSize].pricePerMeter.toLocaleString()} DH / m
                      </span>
                    </div>
                  </div>
                </div>

                {/* Seat Size Selector */}
                <div className="custom-section">
                  <div className="custom-section-header">
                    <div className="modal-label">
                      1. Seat Module Size — <span className="highlight-gold">{seatSize} cm</span>
                    </div>
                    <span className="sub-helper">Dictates base price & rate / extra meter</span>
                  </div>
                  <div className="seat-size-grid">
                    {([70, 80, 90] as SeatSize[]).map((size) => {
                      const tier = (product.config as SofaConfig).seatPricing[size]
                      const isSelected = seatSize === size
                      return (
                        <button
                          key={size}
                          type="button"
                          className={`seat-size-card ${isSelected ? "selected" : ""}`}
                          onClick={() => setSeatSize(size)}
                        >
                          <div className="seat-card-top">
                            <span className="seat-size-number">{tier.label}</span>
                            {isSelected && <span className="seat-check">✓</span>}
                          </div>
                          <div className="seat-card-base">Base: {tier.basePrice.toLocaleString()} DH</div>
                          <div className="seat-card-rate">{tier.pricePerMeter.toLocaleString()} DH / m</div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Overall Dimensions */}
                <div className="custom-section">
                  <div className="custom-section-header">
                    <div className="modal-label">
                      2. Overall Dimensions —{" "}
                      <span className="highlight-gold">
                        {sofaL1.toFixed(2)} m × {sofaL2.toFixed(2)} m
                      </span>
                    </div>
                    {(sofaL1 !== (product.config as SofaConfig).baseLength1 ||
                      sofaL2 !== (product.config as SofaConfig).baseLength2) && (
                      <button
                        type="button"
                        className="reset-dim-btn"
                        onClick={() => {
                          setSofaL1((product.config as SofaConfig).baseLength1)
                          setSofaL2((product.config as SofaConfig).baseLength2)
                        }}
                      >
                        ↺ Reset Base
                      </button>
                    )}
                  </div>

                  <div className="dimension-control-row">
                    <div className="dim-header">
                      <span className="dim-name">Horizontal Length (Top side)</span>
                      <span className="dim-badge">{sofaL1.toFixed(2)} m</span>
                    </div>
                    <input
                      type="range"
                      min={(product.config as SofaConfig).minLength1}
                      max={(product.config as SofaConfig).maxLength1}
                      step={(product.config as SofaConfig).stepLength}
                      value={sofaL1}
                      onChange={(e) => setSofaL1(Number(e.target.value))}
                      className="dimension-range-slider"
                    />
                  </div>

                  <div className="dimension-control-row">
                    <div className="dim-header">
                      <span className="dim-name">Chaise / Vertical Length (Side)</span>
                      <span className="dim-badge">{sofaL2.toFixed(2)} m</span>
                    </div>
                    <input
                      type="range"
                      min={(product.config as SofaConfig).minLength2}
                      max={(product.config as SofaConfig).maxLength2}
                      step={(product.config as SofaConfig).stepLength}
                      value={sofaL2}
                      onChange={(e) => setSofaL2(Number(e.target.value))}
                      className="dimension-range-slider"
                    />
                  </div>

                  <div className="orientation-selector-row">
                    <span className="sub-label">Chaise Position:</span>
                    <div className="orientation-buttons">
                      <button
                        type="button"
                        className={`orient-btn ${chaiseOrientation === "left" ? "active" : ""}`}
                        onClick={() => setChaiseOrientation("left")}
                      >
                        Left Chaise
                      </button>
                      <button
                        type="button"
                        className={`orient-btn ${chaiseOrientation === "right" ? "active" : ""}`}
                        onClick={() => setChaiseOrientation("right")}
                      >
                        Right Chaise
                      </button>
                    </div>
                  </div>
                </div>

                {/* Headrests */}
                <div className="custom-section">
                  <div className="modal-label">
                    3. Headrests (Appuis-tête) — <span className="highlight-gold">{headrests} Included</span>
                  </div>
                  <div className="headrest-btn-group">
                    {[0, 1, 2, 3, 4].map((count) => (
                      <button
                        key={count}
                        type="button"
                        className={`headrest-pill ${headrests === count ? "active" : ""}`}
                        onClick={() => setHeadrests(count)}
                      >
                        {count === 0 ? "None (0)" : `${count} Headrests`}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ───────────────── 2. MATTRESS CONFIGURATION CONTROLS ───────────────── */}
            {configType === "mattress" && mattressPricing && (
              <>
                {/* Standard Sizes vs Custom */}
                <div className="custom-section">
                  <div className="custom-section-header">
                    <div className="modal-label">
                      1. Mattress Dimensions —{" "}
                      <span className="highlight-gold">{mattressPricing.sizeLabel}</span>
                    </div>
                    <button
                      type="button"
                      className="reset-dim-btn"
                      onClick={() => setIsCustomMattressSize(!isCustomMattressSize)}
                    >
                      {isCustomMattressSize ? "Standard Sizes" : "⚙ Custom Dimensions"}
                    </button>
                  </div>

                  {!isCustomMattressSize ? (
                    <div className="mattress-size-grid">
                      {(product.config as MattressConfig).sizes.map((s) => {
                        const isSelected = mattressSizeId === s.id
                        return (
                          <button
                            key={s.id}
                            type="button"
                            className={`seat-size-card ${isSelected ? "selected" : ""}`}
                            onClick={() => {
                              setMattressSizeId(s.id)
                              setMattressWidth(s.width)
                              setMattressLength(s.length)
                            }}
                          >
                            <div className="seat-card-top">
                              <span className="seat-size-number" style={{ fontSize: "0.85rem" }}>
                                {s.label}
                              </span>
                              {isSelected && <span className="seat-check">✓</span>}
                            </div>
                            <div className="seat-card-base">Base: {s.basePrice.toLocaleString()} DH</div>
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="custom-dim-panel">
                      <div className="dimension-control-row">
                        <div className="dim-header">
                          <span className="dim-name">Width (Largeur)</span>
                          <span className="dim-badge">{Math.round(mattressWidth * 100)} cm</span>
                        </div>
                        <input
                          type="range"
                          min={(product.config as MattressConfig).customBounds.minWidth}
                          max={(product.config as MattressConfig).customBounds.maxWidth}
                          step={0.05}
                          value={mattressWidth}
                          onChange={(e) => setMattressWidth(Number(e.target.value))}
                          className="dimension-range-slider"
                        />
                      </div>
                      <div className="dimension-control-row">
                        <div className="dim-header">
                          <span className="dim-name">Length (Longueur)</span>
                          <span className="dim-badge">{Math.round(mattressLength * 100)} cm</span>
                        </div>
                        <input
                          type="range"
                          min={(product.config as MattressConfig).customBounds.minLength}
                          max={(product.config as MattressConfig).customBounds.maxLength}
                          step={0.05}
                          value={mattressLength}
                          onChange={(e) => setMattressLength(Number(e.target.value))}
                          className="dimension-range-slider"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Thickness Profile */}
                <div className="custom-section">
                  <div className="modal-label">2. Height Profile & Depth</div>
                  <div className="seat-size-grid">
                    {(product.config as MattressConfig).thicknessOptions.map((t) => {
                      const isSelected = mattressThicknessId === t.id
                      return (
                        <button
                          key={t.id}
                          type="button"
                          className={`seat-size-card ${isSelected ? "selected" : ""}`}
                          onClick={() => setMattressThicknessId(t.id)}
                        >
                          <div className="seat-card-top">
                            <span className="seat-size-number">{t.thicknessCm} cm</span>
                            {isSelected && <span className="seat-check">✓</span>}
                          </div>
                          <div className="seat-card-rate">{t.label.split("—")[1] || "Standard"}</div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Core Support Technology */}
                <div className="custom-section">
                  <div className="modal-label">3. Core Support Layer</div>
                  <select
                    className="modal-select"
                    value={mattressCoreId}
                    onChange={(e) => setMattressCoreId(e.target.value)}
                  >
                    {(product.config as MattressConfig).coreOptions.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label} — {c.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Firmness */}
                <div className="custom-section">
                  <div className="modal-label">4. Ergonomic Firmness Level</div>
                  <div className="headrest-btn-group">
                    {(product.config as MattressConfig).firmnessLevels.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        className={`headrest-pill ${mattressFirmnessId === f.id ? "active" : ""}`}
                        onClick={() => setMattressFirmnessId(f.id)}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ───────────────── 3. ARMCHAIR CONFIGURATION CONTROLS ───────────────── */}
            {configType === "chair" && (
              <>
                <div className="custom-section">
                  <div className="custom-section-header">
                    <div className="modal-label">
                      1. Custom Armchair Width —{" "}
                      <span className="highlight-gold">{Math.round(chairWidth * 100)} cm</span>
                    </div>
                    {chairWidth !== (product.config as ChairConfig).baseWidth && (
                      <button
                        type="button"
                        className="reset-dim-btn"
                        onClick={() => setChairWidth((product.config as ChairConfig).baseWidth)}
                      >
                        ↺ Reset (85 cm)
                      </button>
                    )}
                  </div>
                  <div className="dimension-control-row">
                    <input
                      type="range"
                      min={(product.config as ChairConfig).minWidth}
                      max={(product.config as ChairConfig).maxWidth}
                      step={0.05}
                      value={chairWidth}
                      onChange={(e) => setChairWidth(Number(e.target.value))}
                      className="dimension-range-slider"
                    />
                    <div className="dim-slider-ticks">
                      <span>70 cm (Compact)</span>
                      <span className="tick-base">85 cm (Standard)</span>
                      <span>125 cm (Loveseat)</span>
                    </div>
                  </div>
                </div>

                {/* Leg Finishes */}
                <div className="custom-section">
                  <div className="modal-label">
                    2. Leg Material & Finish —{" "}
                    <span className="highlight-gold">{chairPricing ? chairPricing.legLabel : ""}</span>
                  </div>
                  <div className="seat-size-grid">
                    {(product.config as ChairConfig).legFinishes.map((leg) => {
                      const isSelected = chairLegId === leg.id
                      return (
                        <button
                          key={leg.id}
                          type="button"
                          className={`seat-size-card ${isSelected ? "selected" : ""}`}
                          onClick={() => setChairLegId(leg.id)}
                        >
                          <div className="seat-card-top">
                            <span
                              style={{
                                display: "inline-block",
                                width: 12,
                                height: 12,
                                borderRadius: "50%",
                                backgroundColor: leg.colorHex,
                                border: "1px solid rgba(255,255,255,0.3)",
                              }}
                            />
                            {isSelected && <span className="seat-check">✓</span>}
                          </div>
                          <div className="seat-card-base">{leg.label}</div>
                          <div className="seat-card-rate">
                            {leg.supplement > 0 ? `+${leg.supplement} DH` : "Included"}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Tufting Style */}
                <div className="custom-section">
                  <div className="modal-label">3. Backrest Tufting Craftsmanship</div>
                  <div className="headrest-btn-group">
                    {(product.config as ChairConfig).tuftingStyles.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        className={`headrest-pill ${chairTuftingId === t.id ? "active" : ""}`}
                        onClick={() => setChairTuftingId(t.id)}
                      >
                        {t.label} {t.supplement > 0 ? `(+${t.supplement} DH)` : ""}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ───────────────── 4. ACCESSORIES CONFIGURATION CONTROLS ───────────────── */}
            {configType === "accessory" && (
              <>
                {/* Pack Options */}
                <div className="custom-section">
                  <div className="modal-label">1. Pack Quantity</div>
                  <div className="seat-size-grid">
                    {(product.config as AccessoryConfig).packOptions.map((pack) => {
                      const isSelected = accessoryPackId === pack.id
                      return (
                        <button
                          key={pack.id}
                          type="button"
                          className={`seat-size-card ${isSelected ? "selected" : ""}`}
                          onClick={() => setAccessoryPackId(pack.id)}
                        >
                          <div className="seat-card-top">
                            <span className="seat-size-number">{pack.count} pcs</span>
                            {isSelected && <span className="seat-check">✓</span>}
                          </div>
                          <div className="seat-card-base">{pack.label}</div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Size Options */}
                <div className="custom-section">
                  <div className="modal-label">2. Cushion Dimensions</div>
                  <div className="headrest-btn-group">
                    {(product.config as AccessoryConfig).sizeOptions.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className={`headrest-pill ${accessorySizeId === s.id ? "active" : ""}`}
                        onClick={() => setAccessorySizeId(s.id)}
                      >
                        {s.sizeLabel} {s.supplement > 0 ? `(+${s.supplement} DH)` : ""}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filling Options */}
                <div className="custom-section">
                  <div className="modal-label">3. Inner Core Filling</div>
                  <select
                    className="modal-select"
                    value={accessoryFillId}
                    onChange={(e) => setAccessoryFillId(e.target.value)}
                  >
                    {(product.config as AccessoryConfig).fillOptions.map((fill) => (
                      <option key={fill.id} value={fill.id}>
                        {fill.label}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* ───────────────── COMMON: COLOR SELECTION ───────────────── */}
            <div className="custom-section">
              <div className="modal-label">
                Color & Finish —{" "}
                <span className="modal-color-name">{product.colorNames[selectedColorIdx]}</span>
              </div>
              <div className="modal-colors" id="modalColors">
                {product.colors.map((hex, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`modal-color-swatch ${i === selectedColorIdx ? "selected" : ""}`}
                    style={{ backgroundColor: hex }}
                    title={product.colorNames[i]}
                    aria-label={`Select color ${product.colorNames[i]}`}
                    onClick={() => setSelectedColorIdx(i)}
                  />
                ))}
              </div>
            </div>

            {/* Upholstery Grade (for Sofas, Chairs, Accessories) */}
            {configType !== "mattress" && (
              <div className="custom-section">
                <div className="modal-label">Upholstery Grade</div>
                <select
                  className="modal-select"
                  value={selectedStyleId}
                  onChange={(e) => setSelectedStyleId(e.target.value)}
                >
                  {upholsteryStyles.map((style) => (
                    <option key={style.id} value={style.id}>
                      {style.label}{" "}
                      {style.multiplier > 1
                        ? `(+${Math.round((style.multiplier - 1) * 100)}%)`
                        : "(Standard Included)"}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* ───────────────── LIVE PRICE BREAKDOWN SUMMARY CARD ───────────────── */}
            <div className="price-summary-card">
              <div className="price-summary-title">YOUR CONFIGURATION SUMMARY</div>
              <div className="summary-details-list">
                <div className="summary-row">
                  <span className="sum-label">Product Model</span>
                  <span className="sum-val">{product.name}</span>
                </div>

                {configType === "sofa" && sofaPricing && (
                  <>
                    <div className="summary-row">
                      <span className="sum-label">Dimensions</span>
                      <span className="sum-val">
                        {sofaL1.toFixed(2)} m × {sofaL2.toFixed(2)} m
                        {sofaPricing.extraMeters > 0 && (
                          <span className="sum-extra-tag">
                            {" "}
                            (+{sofaPricing.extraMeters.toFixed(2)} m extra)
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="summary-row">
                      <span className="sum-label">Seat Module</span>
                      <span className="sum-val">{seatSize} cm</span>
                    </div>
                    <div className="summary-row">
                      <span className="sum-label">Chaise Position</span>
                      <span className="sum-val">
                        {chaiseOrientation === "left" ? "Left Chaise" : "Right Chaise"}
                      </span>
                    </div>
                    <div className="summary-row">
                      <span className="sum-label">Headrests</span>
                      <span className="sum-val">{headrests}</span>
                    </div>
                    <div className="summary-divider" />
                    <div className="summary-row">
                      <span className="sum-label">Base Price ({seatSize} cm)</span>
                      <span className="sum-val">{formatPriceDH(sofaPricing.basePrice)}</span>
                    </div>
                    <div className="summary-row">
                      <span className="sum-label">
                        Dimension Extra ({sofaPricing.ratePerMeter} DH/m)
                      </span>
                      <span className="sum-val">
                        {sofaPricing.dimensionSupplement > 0
                          ? `+${formatPriceDH(sofaPricing.dimensionSupplement)}`
                          : "0 DH (Included in base)"}
                      </span>
                    </div>
                  </>
                )}

                {configType === "mattress" && mattressPricing && (
                  <>
                    <div className="summary-row">
                      <span className="sum-label">Dimensions</span>
                      <span className="sum-val">{mattressPricing.sizeLabel}</span>
                    </div>
                    <div className="summary-row">
                      <span className="sum-label">Thickness</span>
                      <span className="sum-val">{mattressPricing.thicknessLabel}</span>
                    </div>
                    <div className="summary-row">
                      <span className="sum-label">Core Support</span>
                      <span className="sum-val">{mattressPricing.coreLabel}</span>
                    </div>
                    <div className="summary-divider" />
                    <div className="summary-row">
                      <span className="sum-label">Base Size Price</span>
                      <span className="sum-val">{formatPriceDH(mattressPricing.baseSizePrice)}</span>
                    </div>
                    {mattressPricing.thicknessSupplement > 0 && (
                      <div className="summary-row">
                        <span className="sum-label">Thickness Upgrade</span>
                        <span className="sum-val">
                          +{formatPriceDH(mattressPricing.thicknessSupplement)}
                        </span>
                      </div>
                    )}
                    {mattressPricing.coreSupplement > 0 && (
                      <div className="summary-row">
                        <span className="sum-label">Core Tech Upgrade</span>
                        <span className="sum-val">+{formatPriceDH(mattressPricing.coreSupplement)}</span>
                      </div>
                    )}
                  </>
                )}

                {configType === "chair" && chairPricing && (
                  <>
                    <div className="summary-row">
                      <span className="sum-label">Width</span>
                      <span className="sum-val">{Math.round(chairWidth * 100)} cm</span>
                    </div>
                    <div className="summary-row">
                      <span className="sum-label">Leg Finish</span>
                      <span className="sum-val">{chairPricing.legLabel}</span>
                    </div>
                    <div className="summary-row">
                      <span className="sum-label">Tufting Craft</span>
                      <span className="sum-val">{chairPricing.tuftingLabel}</span>
                    </div>
                    <div className="summary-divider" />
                    <div className="summary-row">
                      <span className="sum-label">Base Price (85 cm)</span>
                      <span className="sum-val">{formatPriceDH(chairPricing.basePrice)}</span>
                    </div>
                    {chairPricing.widthSupplement > 0 && (
                      <div className="summary-row">
                        <span className="sum-label">Extra Width ({chairPricing.extraWidthCm} cm)</span>
                        <span className="sum-val">+{formatPriceDH(chairPricing.widthSupplement)}</span>
                      </div>
                    )}
                    {chairPricing.legSupplement > 0 && (
                      <div className="summary-row">
                        <span className="sum-label">Leg Finish Supplement</span>
                        <span className="sum-val">+{formatPriceDH(chairPricing.legSupplement)}</span>
                      </div>
                    )}
                    {chairPricing.tuftingSupplement > 0 && (
                      <div className="summary-row">
                        <span className="sum-label">Tufting Craft Supplement</span>
                        <span className="sum-val">
                          +{formatPriceDH(chairPricing.tuftingSupplement)}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {configType === "accessory" && accessoryPricing && (
                  <>
                    <div className="summary-row">
                      <span className="sum-label">Pack</span>
                      <span className="sum-val">{accessoryPricing.packLabel}</span>
                    </div>
                    <div className="summary-row">
                      <span className="sum-label">Size</span>
                      <span className="sum-val">{accessoryPricing.sizeLabel}</span>
                    </div>
                    <div className="summary-row">
                      <span className="sum-label">Filling</span>
                      <span className="sum-val">{accessoryPricing.fillLabel}</span>
                    </div>
                    <div className="summary-divider" />
                    <div className="summary-row">
                      <span className="sum-label">Pack Base Price</span>
                      <span className="sum-val">{formatPriceDH(accessoryPricing.packBasePrice)}</span>
                    </div>
                    {accessoryPricing.sizeSupplement > 0 && (
                      <div className="summary-row">
                        <span className="sum-label">Size Upgrade</span>
                        <span className="sum-val">+{formatPriceDH(accessoryPricing.sizeSupplement)}</span>
                      </div>
                    )}
                    {accessoryPricing.fillSupplement > 0 && (
                      <div className="summary-row">
                        <span className="sum-label">Fill Upgrade</span>
                        <span className="sum-val">+{formatPriceDH(accessoryPricing.fillSupplement)}</span>
                      </div>
                    )}
                  </>
                )}

                <div className="summary-divider" />

                <div className="summary-row total-row">
                  <span className="total-label">TOTAL CONFIGURATION</span>
                  <span className="total-val">{formatPriceDH(currentUnitPrice)}</span>
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div className="modal-qty-section">
              <div className="modal-label">Quantity</div>
              <div className="modal-qty">
                <button
                  className="modal-qty-btn"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="modal-qty-val">{qty}</span>
                <button
                  className="modal-qty-btn"
                  onClick={() => setQty(qty + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button className="modal-add-btn" onClick={handleAddToCart}>
              Add to Cart — {formatPriceDH(currentTotalPrice)}
            </button>

            <p className="modal-note">
              Free delivery in Tanger on orders over 800 DH · Handcrafted to custom specifications
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
