"use client"

import { useState, useEffect } from "react"
import { Product, upholsteryStyles } from "@/data/products"
import { useCart } from "@/context/CartContext"

interface ProductModalProps {
  product: Product | null
  onClose: () => void
}

function renderStars(rating: number): string {
  return "★".repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? "½" : "")
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addItem, toggleCart, showToast } = useCart()
  const [selectedColorIdx, setSelectedColorIdx] = useState(0)
  const [selectedStyleId, setSelectedStyleId] = useState(upholsteryStyles[0].id)
  const [sizeMeters, setSizeMeters] = useState(1)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    if (product) {
      setSelectedColorIdx(0)
      setSelectedStyleId(upholsteryStyles[0].id)
      setSizeMeters(1)
      setQty(1)
    }
    // scroll lock
    if (product) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [product])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose])

  if (!product) return null

  const selectedStyle =
    upholsteryStyles.find((style) => style.id === selectedStyleId) ?? upholsteryStyles[0]
  const pricePerMeter = product.price
  const customUnitPrice = Number((pricePerMeter * selectedStyle.multiplier * sizeMeters).toFixed(2))

  const handleAddToCart = () => {
    addItem(product, selectedColorIdx, {
      qty,
      styleId: selectedStyle.id,
      styleLabel: selectedStyle.label,
      sizeMeters,
      unitPrice: customUnitPrice,
    })
    showToast(`${product.name} configured and added to cart`)
    onClose()
    toggleCart()
  }

  const handleBgClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className={`modal-overlay ${product ? "open" : ""}`}
      onClick={handleBgClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Product detail for ${product.name}`}
    >
      <div className="modal">
        <div className="modal-inner">
          {/* Image */}
          <div className="modal-img">
            <img src={product.img} alt={product.imgAlt} />
          </div>

          {/* Body */}
          <div className="modal-body">
            <button className="modal-close" onClick={onClose} aria-label="Close product detail">
              ✕
            </button>

            <div className="modal-category">{product.category}</div>
            <h2 className="modal-name">{product.name}</h2>

            {/* Stars */}
            <div className="modal-stars">
              {renderStars(product.rating)}{" "}
              <span>
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="modal-price-row">
              <span className="modal-price">${customUnitPrice.toLocaleString()}</span>
              {product.oldPrice && (
                <span className="modal-price-old">${product.oldPrice.toLocaleString()} / m</span>
              )}
            </div>

            <p className="modal-help">
              Base price: ${pricePerMeter.toLocaleString()} per meter
            </p>

            <p className="modal-desc">{product.desc}</p>

            {/* Features */}
            <div className="modal-label">Features</div>
            <div className="modal-features">
              {product.features.map((f) => (
                <div key={f} className="modal-feature">
                  {f}
                </div>
              ))}
            </div>

            {/* Colors — visual swatches + name */}
            <div className="modal-label">
              Color — <span className="modal-color-name">{product.colorNames[selectedColorIdx]}</span>
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

            <div className="modal-row">
              <div>
                <div className="modal-label">Style</div>
                <select
                  className="modal-select"
                  value={selectedStyleId}
                  onChange={(e) => setSelectedStyleId(e.target.value)}
                  aria-label="Select style"
                >
                  {upholsteryStyles.map((style) => (
                    <option key={style.id} value={style.id}>
                      {style.label} (x{style.multiplier})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="modal-label">Size (meters)</div>
                <input
                  className="modal-input"
                  type="number"
                  min={0.5}
                  max={12}
                  step={0.1}
                  value={sizeMeters}
                  onChange={(e) => setSizeMeters(Math.max(0.5, Number(e.target.value || 1)))}
                  aria-label="Customize size in meters"
                />
              </div>
            </div>

            <p className="modal-help">Final unit price = meters × style multiplier × base price.</p>

            {/* Quantity */}
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

            {/* Add to Cart */}
            <button className="modal-add-btn" onClick={handleAddToCart}>
              Add to Cart — ${(customUnitPrice * qty).toLocaleString()}
            </button>

            <p className="modal-note">
              Free shipping on orders over $800 · 30-day returns
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
