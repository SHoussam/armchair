"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { formatPriceDH } from "@/utils/pricing"
import { CITIES, City, fetchCities } from "@/data/data"
import {
  X,
  MapPin,
  CreditCard,
  FileCheck,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Upload,
  Copy,
  Phone,
  User,
  Mail,
  Building2,
  Home,
  MessageCircle,
} from "lucide-react"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
}

const STORE_RIB = {
  bank: "Attijariwafa Bank",
  rib: "007 780 0001 2345 6789 0123 45",
  account: "123456789012345",
  key: "45",
  holder: "Abdelatif Furnishings (مفروشات عبداللطيف)",
}

const STEPS = [
  { id: 1, label: "Address", icon: MapPin },
  { id: 2, label: "Summary", icon: CreditCard },
  { id: 3, label: "Payment", icon: FileCheck },
  { id: 4, label: "Confirm", icon: CheckCircle2 },
]

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { state, totalPrice, clearCart, closeCart } = useCart()
  const { user } = useAuth()

  const [step, setStep] = useState(1)
  const [citiesList, setCitiesList] = useState<City[]>(CITIES)

  // Step 1: Contact & Address
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [cityId, setCityId] = useState<string | number>(CITIES[0]?.id || 1)
  const [notes, setNotes] = useState("")

  // Validation errors & loading
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delivery method
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("delivery")

  // Step 3: Payment
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [proofPreview, setProofPreview] = useState<string | null>(null)
  const [ribCopied, setRibCopied] = useState(false)

  // Step 4: Confirmation
  const [orderId, setOrderId] = useState("")

  useEffect(() => {
    let isMounted = true
    fetchCities().then((cities) => {
      if (isMounted && cities && cities.length > 0) {
        setCitiesList(cities)
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  const selectedCity = citiesList.find((c) => String(c.id) === String(cityId)) || citiesList[0] || { id: 1, name: "Tanger", zone: "tanger", shipping: 0 }
  const FREE_SHIPPING_THRESHOLD = 800
  const shipping = deliveryMethod === "pickup"
    ? 0
    : selectedCity.zone === "tanger" && totalPrice >= FREE_SHIPPING_THRESHOLD
      ? 0
      : selectedCity.shipping
  const grandTotal = totalPrice + shipping
  const advanceAmount = Math.round(grandTotal * 0.3)
  const balanceAmount = grandTotal - advanceAmount

  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setProofFile(null)
      setProofPreview(null)
      setRibCopied(false)
      setOrderId("")
      setNotes("")
      setErrors({})
      setIsSubmitting(false)

      if (user) {
        setName(user.name || "")
        setEmail(user.email || "")
        setPhone(user.phone || "")
      }

      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isOpen, user])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [isOpen, onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProofFile(file)
      const reader = new FileReader()
      reader.onload = (ev) => setProofPreview(ev.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const copyRib = () => {
    navigator.clipboard.writeText(STORE_RIB.rib.replace(/\s/g, ""))
    setRibCopied(true)
    setTimeout(() => setRibCopied(false), 2000)
  }

  const validatePhone = (value: string): boolean => {
    const cleaned = value.replace(/[\s\-\(\)]/g, "")
    return /^(\+212|00212|0)(6|7)[0-9]{8}$/.test(cleaned)
  }

  const validateEmail = (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = "Name is required"
    }
    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email"
    }
    if (!phone.trim()) {
      newErrors.phone = "Phone is required"
    } else if (!validatePhone(phone)) {
      newErrors.phone = "Enter a valid Moroccan phone (e.g., 0666123456 or +212666123456)"
    }
    if (deliveryMethod === "delivery" && !address.trim()) {
      newErrors.address = "Address is required for delivery"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const canProceedStep1 = name.trim() && email.trim() && phone.trim() && (deliveryMethod === "pickup" || address.trim()) && cityId && Object.keys(errors).length === 0
  const canProceedStep3 = proofFile !== null

  const handleNext = async () => {
    if (step === 1) {
      if (!validateForm()) return
      setStep(2)
    } else if (step === 2) {
      setStep(3)
    } else if (step === 3 && canProceedStep3) {
      setIsSubmitting(true)
      setErrors({})
      try {
        const formData = new FormData()
        formData.append("customer_name", name)
        formData.append("customer_email", email)
        const shippingAddress = deliveryMethod === "pickup" ? "Pickup at store" : `${address}, ${selectedCity.name}`
        formData.append("shipping_address", shippingAddress)
        formData.append("city_id", String(selectedCity.id))
        formData.append("delivery_method", deliveryMethod)

        state.items.forEach((item, index) => {
          formData.append(`items[${index}][product_id]`, String(item.product.id))
          formData.append(`items[${index}][quantity]`, String(item.qty))
          formData.append(`items[${index}][unit_price]`, String(item.unitPrice))
          formData.append(`items[${index}][calculated_unit_price]`, String(item.unitPrice))

          const colorId = item.product.colorIds?.[item.colorIdx]
          if (colorId != null) {
            formData.append(`items[${index}][color_id]`, String(colorId))
          }

          if (item.length1) formData.append(`items[${index}][length]`, String(item.length1))
          if (item.length2) formData.append(`items[${index}][width]`, String(item.length2))

          const bd = item.priceBreakdown as Record<string, unknown> | undefined
          const height = bd?.height ?? bd?.seatHeight ?? null
          if (height != null) {
            formData.append(`items[${index}][height]`, String(height))
          }

          const pricingData = item.priceBreakdown || {
            calculated_unit_price: item.unitPrice,
            seatSize: item.seatSize,
            length1: item.length1,
            length2: item.length2,
            headrests: item.headrests,
            chaiseOrientation: item.chaiseOrientation,
            styleId: item.styleId,
          }
          formData.append(`items[${index}][pricing_data]`, JSON.stringify(pricingData))
        })

        if (proofFile) {
          formData.append("proof_image", proofFile)
        }

        const token = typeof window !== "undefined" ? localStorage.getItem("sanctum_token") : null
        const headers: Record<string, string> = {
          Accept: "application/json",
        }
        if (token) {
          headers["Authorization"] = `Bearer ${token}`
        }

        const res = await fetch("/api/orders", {
          method: "POST",
          body: formData,
          headers,
        })

        const data = await res.json()

        if (res.ok && data.success && data.data?.order_number) {
          setOrderId(data.data.order_number)
          setStep(4)
        } else {
          setErrors({ general: data.message || "Failed to place order. Please try again." })
        }
      } catch (err) {
        setErrors({ general: "Network error occurred while submitting order." })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleFinish = () => {
    clearCart()
    closeCart()
    onClose()
  }

  const getWhatsAppLink = () => {
    const items = state.items.map((i) => {
      const price = formatPriceDH(i.unitPrice * i.qty)
      return `- ${i.product.name} x${i.qty} = ${price}`
    }).join("%0A")
    const msg = `*New Order: ${orderId}*%0A%0A` +
      `*Customer:* ${name}%0A` +
      `*Phone:* ${phone}%0A` +
      `*Address:* ${address}, ${selectedCity.name}%0A%0A` +
      `*Items:*%0A${items}%0A%0A` +
      `*Subtotal:* ${formatPriceDH(totalPrice)}%0A` +
      `*Shipping:* ${shipping === 0 ? "Free" : formatPriceDH(shipping)}%0A` +
      `*Total:* ${formatPriceDH(grandTotal)}%0A` +
      `*Advance (30%):* ${formatPriceDH(advanceAmount)}%0A` +
      `*Balance (70%):* ${formatPriceDH(balanceAmount)}`
    return `https://wa.me/212666896776?text=${msg}`
  }

  if (!isOpen) return null

  return (
    <div className="checkout-overlay" onClick={handleBackdropClick} role="dialog" aria-modal="true" aria-label="Checkout">
      <div className="checkout-modal">
        {/* Header */}
        <div className="checkout-header">
          <button className="checkout-close" onClick={onClose} aria-label="Close checkout">
            <X size={18} />
          </button>
          <h2 className="checkout-title">Checkout</h2>
          <p className="checkout-subtitle">Complete your order in a few steps</p>
        </div>

        {/* Step Indicator */}
        <div className="checkout-steps">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            const isActive = step === s.id
            const isDone = step > s.id
            return (
              <div key={s.id} className={`checkout-step-indicator ${isActive ? "active" : ""} ${isDone ? "done" : ""}`}>
                <div className="step-circle">
                  {isDone ? <CheckCircle2 size={16} /> : <Icon size={16} />}
                </div>
                <span className="step-label">{s.label}</span>
                {i < STEPS.length - 1 && <div className="step-connector" />}
              </div>
            )
          })}
        </div>

        {/* Step Content */}
        <div className="checkout-body">
          {errors.general && (
            <div className="checkout-general-error" style={{ color: "#ef4444", padding: "8px 12px", borderRadius: "6px", backgroundColor: "#fef2f2", marginBottom: "16px", fontSize: "14px" }}>
              {errors.general}
            </div>
          )}

          {/* ── STEP 1: Address ── */}
          {step === 1 && (
            <div className="checkout-step-content">
              <h3 className="step-content-title">
                <MapPin size={18} />
                Contact & Delivery Address
              </h3>

              <div className="checkout-field">
                <label htmlFor="co-name">Full Name *</label>
                <div className="checkout-input-wrap">
                  <User size={16} className="checkout-input-icon" />
                  <input id="co-name" type="text" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              </div>

              <div className="checkout-row-2">
                <div className="checkout-field">
                  <label htmlFor="co-email">Email *</label>
                  <div className={`checkout-input-wrap ${errors.email ? "has-error" : ""}`}>
                    <Mail size={16} className="checkout-input-icon" />
                    <input id="co-email" type="email" placeholder="you@example.com" value={email} onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: "" })) }} required />
                  </div>
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>
                <div className="checkout-field">
                  <label htmlFor="co-phone">Phone * <span className="field-hint">(Moroccan)</span></label>
                  <div className={`checkout-input-wrap ${errors.phone ? "has-error" : ""}`}>
                    <Phone size={16} className="checkout-input-icon" />
                    <input id="co-phone" type="tel" placeholder="0666 123 456" value={phone} onChange={(e) => { setPhone(e.target.value); setErrors(prev => ({ ...prev, phone: "" })) }} required />
                  </div>
                  {errors.phone && <span className="field-error">{errors.phone}</span>}
                </div>
              </div>

              <div className="checkout-field">
                <label htmlFor="co-city">City *</label>
                <div className="checkout-input-wrap has-select">
                  <Building2 size={16} className="checkout-input-icon" />
                  <select id="co-city" value={cityId} onChange={(e) => setCityId(e.target.value)}>
                    {citiesList.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} {c.shipping > 0 ? `- ${formatPriceDH(c.shipping)}` : '(Free shipping)'}</option>
                    ))}
                  </select>
                </div>
                {selectedCity.zone === "tanger" && totalPrice >= FREE_SHIPPING_THRESHOLD && (
                  <span className="field-success">Free shipping available!</span>
                )}
              </div>

              <div className="checkout-field">
                <label>Delivery Method *</label>
                <div className="delivery-method-options" style={{ display: "flex", gap: "12px", marginTop: "6px" }}>
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("delivery")}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: "8px",
                      border: `2px solid ${deliveryMethod === "delivery" ? "#d4a853" : "#333"}`,
                      backgroundColor: deliveryMethod === "delivery" ? "rgba(212, 168, 83, 0.1)" : "transparent",
                      color: deliveryMethod === "delivery" ? "#d4a853" : "#999",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: 600,
                      transition: "all 0.2s",
                    }}
                  >
                    Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("pickup")}
                    style={{
                      flex: 1,
                      padding: "12px",
                      borderRadius: "8px",
                      border: `2px solid ${deliveryMethod === "pickup" ? "#d4a853" : "#333"}`,
                      backgroundColor: deliveryMethod === "pickup" ? "rgba(212, 168, 83, 0.1)" : "transparent",
                      color: deliveryMethod === "pickup" ? "#d4a853" : "#999",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: 600,
                      transition: "all 0.2s",
                    }}
                  >
                    Pickup (Free)
                  </button>
                </div>
              </div>

              <div className="checkout-field">
                <label htmlFor="co-address">Street Address *</label>
                <div className={`checkout-input-wrap ${errors.address ? "has-error" : ""}`}>
                  <Home size={16} className="checkout-input-icon" />
                  <input id="co-address" type="text" placeholder="Street, apartment, building..." value={address} onChange={(e) => { setAddress(e.target.value); setErrors(prev => ({ ...prev, address: "" })) }} required={deliveryMethod === "delivery"} />
                </div>
                {errors.address && <span className="field-error">{errors.address}</span>}
              </div>

              <div className="checkout-field">
                <label htmlFor="co-notes">Order Notes (optional)</label>
                <textarea id="co-notes" className="checkout-textarea" placeholder="Special instructions, landmarks, preferred delivery time..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
              </div>
            </div>
          )}

          {/* ── STEP 2: Summary ── */}
          {step === 2 && (
            <div className="checkout-step-content">
              <h3 className="step-content-title">
                <CreditCard size={18} />
                Order Summary & Deposit
              </h3>

              <div className="checkout-items-list">
                {state.items.map((item) => (
                  <div key={item.key} className="checkout-item">
                    <img src={item.product.img} alt={item.product.imgAlt} className="checkout-item-img" />
                    <div className="checkout-item-info">
                      <div className="checkout-item-name">{item.product.name}</div>
                      <div className="checkout-item-meta">
                        {item.styleLabel} · Qty {item.qty}
                      </div>
                    </div>
                    <div className="checkout-item-price">
                      {formatPriceDH(item.unitPrice * item.qty)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="checkout-totals">
                <div className="checkout-total-row">
                  <span>Subtotal</span>
                  <span>{formatPriceDH(totalPrice)}</span>
                </div>
                <div className="checkout-total-row">
                  <span>Shipping to {selectedCity.name}</span>
                  <span>{shipping === 0 ? "Free" : formatPriceDH(shipping)}</span>
                </div>
                <div className="checkout-total-row grand">
                  <span>Total</span>
                  <span>{formatPriceDH(grandTotal)}</span>
                </div>
              </div>

              <div className="deposit-box">
                <div className="deposit-header">
                  <span className="deposit-badge">Deposit Required</span>
                </div>
                <div className="deposit-grid">
                  <div className="deposit-item">
                    <span className="deposit-label">Advance (30%)</span>
                    <span className="deposit-value advance">{formatPriceDH(advanceAmount)}</span>
                    <span className="deposit-desc">Pay now to start production</span>
                  </div>
                  <div className="deposit-item">
                    <span className="deposit-label">Balance (70%)</span>
                    <span className="deposit-value balance">{formatPriceDH(balanceAmount)}</span>
                    <span className="deposit-desc">Due before shipping</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: Payment ── */}
          {step === 3 && (
            <div className="checkout-step-content">
              <h3 className="step-content-title">
                <FileCheck size={18} />
                Payment Details & Upload
              </h3>

              <div className="rib-box">
                <div className="rib-header">
                  <span className="rib-title">Store Bank Details (RIB)</span>
                  <button className="rib-copy-btn" onClick={copyRib}>
                    {ribCopied ? <><CheckCircle2 size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
                  </button>
                </div>
                <div className="rib-grid">
                  <div className="rib-row"><span className="rib-lbl">Bank</span><span className="rib-val">{STORE_RIB.bank}</span></div>
                  <div className="rib-row"><span className="rib-lbl">RIB</span><span className="rib-val rib-number">{STORE_RIB.rib}</span></div>
                  <div className="rib-row"><span className="rib-lbl">Account</span><span className="rib-val">{STORE_RIB.account}</span></div>
                  <div className="rib-row"><span className="rib-lbl">Key</span><span className="rib-val">{STORE_RIB.key}</span></div>
                  <div className="rib-row"><span className="rib-lbl">Holder</span><span className="rib-val">{STORE_RIB.holder}</span></div>
                </div>
                <p className="rib-note">
                  Transfer <strong>{formatPriceDH(advanceAmount)}</strong> (30% advance) to this account.
                </p>
              </div>

              <div className="upload-box">
                <label className="upload-label">Upload Transfer Receipt *</label>
                <p className="upload-hint">Take a photo or select a screenshot of your bank transfer confirmation</p>
                {proofPreview ? (
                  <div className="upload-preview">
                    <img src={proofPreview} alt="Transfer proof" />
                    <button className="upload-remove" onClick={() => { setProofFile(null); setProofPreview(null) }}>
                      <X size={14} /> Remove
                    </button>
                  </div>
                ) : (
                  <label className="upload-dropzone" htmlFor="co-proof">
                    <Upload size={32} className="upload-icon" />
                    <span className="upload-text">Tap to select image</span>
                    <span className="upload-hint-text">JPG, PNG — max 5MB</span>
                    <input id="co-proof" type="file" accept="image/*" onChange={handleFileChange} hidden />
                  </label>
                )}
              </div>

              <div className="payment-instructions">
                <h4>How to Pay:</h4>
                <ol>
                  <li>Transfer <strong>{formatPriceDH(advanceAmount)}</strong> to the account above</li>
                  <li>Take a photo of your transfer confirmation</li>
                  <li>Upload the photo using the button above</li>
                  <li>Click "Place Order" and we'll verify your payment</li>
                </ol>
              </div>
            </div>
          )}

          {/* ── STEP 4: Confirmation ── */}
          {step === 4 && (
            <div className="checkout-step-content confirmation-step">
              <div className="confirm-check">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="step-content-title" style={{ justifyContent: "center", textAlign: "center" }}>
                Order Placed Successfully!
              </h3>
              <p className="confirm-subtitle">
                Your order <strong>{orderId}</strong> has been submitted. We will verify your payment and begin production.
              </p>

              <div className="confirm-card">
                <div className="confirm-row">
                  <span className="confirm-lbl">Order ID</span>
                  <span className="confirm-val">{orderId}</span>
                </div>
                <div className="confirm-row">
                  <span className="confirm-lbl">Advance Due</span>
                  <span className="confirm-val gold">{formatPriceDH(advanceAmount)}</span>
                </div>
                <div className="confirm-row">
                  <span className="confirm-lbl">Delivery To</span>
                  <span className="confirm-val">{selectedCity.name}</span>
                </div>
              </div>

              <p className="confirm-note">
                Send your transfer receipt on WhatsApp to confirm your order faster.
              </p>

              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="confirm-whatsapp-btn"
              >
                <MessageCircle size={18} />
                Confirm on WhatsApp
              </a>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="checkout-footer">
          {step > 1 && step < 4 && (
            <button className="checkout-back-btn" onClick={handleBack} disabled={isSubmitting}>
              <ChevronLeft size={16} /> Back
            </button>
          )}
          {step < 4 ? (
            <button
              className="checkout-next-btn"
              onClick={handleNext}
              disabled={(step === 1 && !canProceedStep1) || (step === 3 && (!canProceedStep3 || isSubmitting))}
            >
              {isSubmitting ? "Submitting..." : step === 3 ? "Place Order" : "Continue"}
              {step < 3 && <ChevronRight size={16} />}
            </button>
          ) : (
            <button className="checkout-next-btn" onClick={handleFinish}>
              <CheckCircle2 size={16} /> Done
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
