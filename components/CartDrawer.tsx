"use client"

import { useState } from "react"
import { useCart } from "@/context/CartContext"

export default function CartDrawer() {
  const { state, removeItem, updateQty, closeCart, clearCart, totalPrice, totalItems, showToast } = useCart()
  const [checkedOut, setCheckedOut] = useState(false)

  const FREE_SHIPPING_THRESHOLD = 800
  const shipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : 150
  const grandTotal = totalPrice + shipping
  const progressPct = Math.min(100, (totalPrice / FREE_SHIPPING_THRESHOLD) * 100)

  const handleCheckout = () => {
    setCheckedOut(true)
    showToast("Order submitted! We'll contact you to confirm measurements.")
    setTimeout(() => {
      clearCart()
      closeCart()
      setCheckedOut(false)
    }, 2000)
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
              return (
                <div key={item.key} className="cart-item">
                  <img className="cart-item-img" src={p.img} alt={p.imgAlt} />
                  <div className="cart-item-info">
                    <div className="cart-item-name">{p.name}</div>
                    <div className="cart-item-color" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          width: 10, height: 10,
                          borderRadius: "50%",
                          background: colorHex,
                          border: "1px solid rgba(255,255,255,.2)",
                          flexShrink: 0,
                        }}
                      />
                      {colorName} · {item.styleLabel} · {item.sizeMeters.toFixed(1)} m
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
            {/* Shipping progress */}
            <div className="shipping-progress-track">
              <div className="shipping-progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="shipping-notice" id="shippingNotice">
              {totalPrice < FREE_SHIPPING_THRESHOLD
                ? `Add MAD ${(FREE_SHIPPING_THRESHOLD - totalPrice).toLocaleString()} more for free shipping!`
                : "✓ You qualify for free shipping!"}
            </div>

            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span id="cartSubtotal">MAD {totalPrice.toLocaleString()}</span>
            </div>
            <div className="cart-subtotal">
              <span>Shipping</span>
              <span id="cartShipping">{shipping === 0 ? "Free" : `MAD ${shipping}`}</span>
            </div>
            <div className="cart-total">
              <span>Total</span>
              <span id="cartTotal">MAD {grandTotal.toLocaleString()}</span>
            </div>
            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={checkedOut}
            >
              {checkedOut ? "✓ Order Submitted!" : "Place Order"}
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
