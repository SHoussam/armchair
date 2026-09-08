import { useState, useEffect } from "react"
import { useCart } from "@/context/CartContext"
import { CITIES, City } from "@/data/data"
import CheckoutModal from "../CheckoutModal"

export default function CartDrawer() {
  const { state, removeItem, updateQty, closeCart, clearCart, totalPrice, totalItems, showToast } = useCart()
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [selectedCityId, setSelectedCityId] = useState<string | number | null>(null)

  // Lock body scroll when cart drawer is open
  useEffect(() => {
    if (state.isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [state.isOpen])

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && state.isOpen) {
        closeCart()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [state.isOpen, closeCart])

  const FREE_SHIPPING_THRESHOLD = 800
  const selectedCity = selectedCityId !== null
    ? CITIES.find((c) => String(c.id) === String(selectedCityId))
    : null
  const shipping = selectedCity
    ? selectedCity.zone === "tanger" && totalPrice >= FREE_SHIPPING_THRESHOLD
      ? 0
      : selectedCity.shipping
    : null
  const grandTotal = totalPrice + (shipping ?? 0)
  const progressPct = selectedCity
    ? selectedCity.zone === "tanger"
      ? Math.min(100, (totalPrice / FREE_SHIPPING_THRESHOLD) * 100)
      : 100
    : 0

  const handleCheckout = () => {
    setCheckoutOpen(true)
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay ${state.isOpen ? "open" : ""}`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`cart-drawer ${state.isOpen ? "open" : ""}`}
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="cart-header">
          <h3>Your Cart ({totalItems})</h3>
          <button className="cart-close" onClick={closeCart} aria-label="Close cart">
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="cart-items" id="cartItems">
          {state.items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">
                <svg width="52" height="52" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <p>Your cart is empty.</p>
            </div>
          ) : (
            state.items.map((item) => {
              const p = item.product
              const colorName = p.colorNames[item.colorIdx]
              const colorHex = p.colors[item.colorIdx]
              const breakdown = item.priceBreakdown

              return (
                <div key={item.key} className="cart-item">
                  <img className="cart-item-img" src={p.img} alt={p.imgAlt} />
                  <div className="cart-item-info">
                    <div className="cart-item-name">{p.name}</div>

                    <div className="cart-item-color" style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                      <span
                        style={{
                          display: "inline-block",
                          width: 10, height: 10,
                          borderRadius: "50%",
                          background: colorHex,
                          border: "1px solid rgba(34,29,22,.2)",
                          flexShrink: 0,
                        }}
                      />
                      <span>{colorName}</span>

                      {breakdown?.type === "sofa" && (
                        <>
                          <span>·</span>
                          <span style={{ color: "var(--gold)" }}>{item.seatSize} cm seat</span>
                          <span>·</span>
                          <span>{item.length1?.toFixed(2)}m × {item.length2?.toFixed(2)}m</span>
                          {item.chaiseOrientation && (
                            <>
                              <span>·</span>
                              <span>{item.chaiseOrientation === "left" ? "Left chaise" : "Right chaise"}</span>
                            </>
                          )}
                          {item.headrests !== undefined && item.headrests > 0 && (
                            <>
                              <span>·</span>
                              <span>{item.headrests} {item.headrests === 1 ? "headrest" : "headrests"}</span>
                            </>
                          )}
                        </>
                      )}

                      {breakdown?.type === "mattress" && (
                        <>
                          <span>·</span>
                          <span style={{ color: "var(--gold)" }}>{breakdown.sizeLabel}</span>
                          <span>·</span>
                          <span>{breakdown.thicknessCm} cm</span>
                          <span>·</span>
                          <span>{breakdown.coreLabel}</span>
                        </>
                      )}

                      {breakdown?.type === "chair" && (
                        <>
                          <span>·</span>
                          <span style={{ color: "var(--gold)" }}>{Math.round(breakdown.customWidth * 100)} cm wide</span>
                          <span>·</span>
                          <span>{breakdown.legLabel}</span>
                          <span>·</span>
                          <span>{breakdown.tuftingLabel}</span>
                        </>
                      )}

                      {breakdown?.type === "accessory" && (
                        <>
                          <span>·</span>
                          <span style={{ color: "var(--gold)" }}>{breakdown.packLabel}</span>
                          <span>·</span>
                          <span>{breakdown.sizeLabel}</span>
                          <span>·</span>
                          <span>{breakdown.fillLabel}</span>
                        </>
                      )}

                      {breakdown?.type === "bed" && (
                        <>
                          <span>·</span>
                          <span style={{ color: "var(--gold)" }}>{breakdown.sizeLabel}</span>
                          {breakdown.headboardLabel && (
                            <>
                              <span>·</span>
                              <span>{breakdown.headboardLabel}</span>
                            </>
                          )}
                        </>
                      )}

                      {!breakdown && (
                        <>
                          <span>·</span>
                          <span>{item.styleLabel}</span>
                        </>
                      )}
                    </div>

                    <div className="cart-item-price">
                      MAD {(item.unitPrice * item.qty).toLocaleString()}
                    </div>

                    <div className="cart-item-controls">
                      <button
                        className="qty-btn"
                        onClick={() => updateQty(item.key, item.qty - 1)}
                        aria-label={`Decrease quantity of ${p.name}`}
                      >
                        −
                      </button>
                      <span className="qty-val">{item.qty}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQty(item.key, item.qty + 1)}
                        aria-label={`Increase quantity of ${p.name}`}
                      >
                        +
                      </button>
                      <button
                        className="cart-item-remove"
                        onClick={() => removeItem(item.key)}
                        aria-label={`Remove ${p.name} from cart`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="cart-footer" id="cartFooter">
            <div style={{ marginBottom: 12 }}>
              <label htmlFor="cartCitySelect" style={{ display: "block", fontSize: "0.8rem", color: "var(--muted)", marginBottom: 4 }}>
                Delivery City
              </label>
              <select
                id="cartCitySelect"
                className="modal-select"
                value={selectedCityId ?? ""}
                onChange={(e) => setSelectedCityId(e.target.value ? Number(e.target.value) : null)}
                aria-label="Select delivery city"
              >
                <option value="">Select city...</option>
                {CITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}{c.zone === "tanger" ? " (Free over 800 MAD)" : ` — MAD ${c.shipping}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="shipping-progress-track">
              <div className="shipping-progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="shipping-notice" id="shippingNotice">
              {!selectedCity
                ? "Select your city to see shipping cost"
                : selectedCity.zone === "tanger" && totalPrice < FREE_SHIPPING_THRESHOLD
                  ? `Add MAD ${(FREE_SHIPPING_THRESHOLD - totalPrice).toLocaleString()} more for free shipping!`
                  : selectedCity.zone === "tanger"
                    ? "✓ You qualify for free shipping in Tanger!"
                    : `Shipping to ${selectedCity.name}: MAD ${selectedCity.shipping}`}
            </div>

            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span id="cartSubtotal">MAD {totalPrice.toLocaleString()}</span>
            </div>
            <div className="cart-subtotal">
              <span>Shipping</span>
              <span id="cartShipping">{shipping === null ? "Calculated at checkout" : shipping === 0 ? "Free" : `MAD ${shipping}`}</span>
            </div>
            <div className="cart-total">
              <span>Total</span>
              <span id="cartTotal">MAD {grandTotal.toLocaleString()}</span>
            </div>
            <button
              className="checkout-btn"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </aside>

      <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </>
  )
}
