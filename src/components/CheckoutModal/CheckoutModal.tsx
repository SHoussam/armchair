import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"
import { api, ApiError } from "@/services/api"
import "./CheckoutModal.css"
import { formatPriceDH } from "@/utils/pricing"
import { CITIES, City, fetchCities } from "@/data/data"
import LocationPicker from "../LocationPicker/LocationPicker"
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
  UserCheck,
  FileText,
  Mail,
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
  { id: 1, labelKey: "steps.address", icon: MapPin },
  { id: 2, labelKey: "steps.summary", icon: CreditCard },
  { id: 3, labelKey: "steps.payment", icon: FileCheck },
  { id: 4, labelKey: "steps.confirm", icon: CheckCircle2 },
]

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { t } = useTranslation("checkout")
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
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [resolvedLocationId, setResolvedLocationId] = useState<number | null>(null)
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
      if (e.key === "Escape" && isOpen) handleClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [isOpen, onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProofFile(file)
      if (file.type === "application/pdf") {
        setProofPreview(file.name)
      } else {
        const reader = new FileReader()
        reader.onload = (ev) => setProofPreview(ev.target?.result as string)
        reader.readAsDataURL(file)
      }
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
      newErrors.name = t("errors.nameRequired")
    }
    if (!email.trim()) {
      newErrors.email = t("errors.emailRequired")
    } else if (!validateEmail(email)) {
      newErrors.email = t("errors.emailInvalid")
    }
    if (!phone.trim()) {
      newErrors.phone = t("errors.phoneRequired")
    } else if (!validatePhone(phone)) {
      newErrors.phone = t("errors.phoneInvalid")
    }
    if (deliveryMethod === "delivery" && !address.trim()) {
      newErrors.address = t("errors.addressRequired")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const hasActiveErrors = Object.values(errors).some((msg) => Boolean(msg && msg.trim()))
  const canProceedStep1 = Boolean(
    name.trim() &&
    email.trim() &&
    phone.trim() &&
    (deliveryMethod === "pickup" || address.trim()) &&
    cityId &&
    !hasActiveErrors
  )
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
        if (!user) {
          formData.append("customer_name", name.trim())
          formData.append("customer_email", email.trim())
          formData.append("customer_phone", phone.trim())
        } else if (phone.trim()) {
          formData.append("customer_phone", phone.trim())
        }
        const shippingAddress = deliveryMethod === "pickup" ? t("fields.pickup") : `${address}, ${selectedCity.name}`
        formData.append("shipping_address", shippingAddress)
        formData.append("city_id", String(selectedCity.id))
        formData.append("delivery_method", deliveryMethod)
        if (resolvedLocationId) formData.append("location_id", String(resolvedLocationId))
        if (gpsCoords) {
          formData.append("latitude", String(gpsCoords.lat))
          formData.append("longitude", String(gpsCoords.lng))
        }

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
          if (notes.trim()) {
            formData.append(`items[${index}][special_request]`, notes.trim())
          }
        })

        if (proofFile) {
          formData.append("proof_image", proofFile)
        }

        const data = await api.postForm<{ success: boolean; data: { order_number: string }; message?: string }>(
          "/orders",
          formData
        )

        if (data.success && data.data?.order_number) {
          setOrderId(data.data.order_number)
          setStep(4)
        } else {
          setErrors({ general: data.message || t("errors.generalSubmitFailed") })
        }
      } catch (err) {
        if (err instanceof ApiError) {
          setErrors({ general: err.message })
        } else {
          setErrors({ general: t("errors.networkError") })
        }
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
    handleClose()
  }

  const getWhatsAppLink = () => {
    const items = state.items.map((i) => {
      const price = formatPriceDH(i.unitPrice * i.qty)
      return `- ${i.product.name} x${i.qty} = ${price}`
    }).join("%0A")
    const msg = `*${t("whatsapp.newOrder")}: ${orderId}*%0A%0A` +
      `*${t("whatsapp.customer")}:* ${name}%0A` +
      `*${t("whatsapp.phone")}:* ${phone}%0A` +
      `*${t("whatsapp.address")}:* ${address}, ${selectedCity.name}%0A%0A` +
      `*${t("whatsapp.items")}:*%0A${items}%0A%0A` +
      `*${t("whatsapp.subtotal")}:* ${formatPriceDH(totalPrice)}%0A` +
      `*${t("whatsapp.shipping")}:* ${shipping === 0 ? t("freeShippingText") : formatPriceDH(shipping)}%0A` +
      `*${t("whatsapp.total")}:* ${formatPriceDH(grandTotal)}%0A` +
      `*${t("whatsapp.advance")}:* ${formatPriceDH(advanceAmount)}%0A` +
      `*${t("whatsapp.balance")}:* ${formatPriceDH(balanceAmount)}`
    return `https://wa.me/212666896776?text=${msg}`
  }

  const [closing, setClosing] = useState(false)
  const handleClose = () => {
    setClosing(true)
    setTimeout(() => { setClosing(false); onClose() }, 250)
  }

  if (!isOpen && !closing) return null

  return (
    <div className={`checkout-overlay ${closing ? "closing" : ""}`} onClick={handleBackdropClick} role="dialog" aria-modal="true" aria-label="Checkout">
      <div className={`checkout-modal ${closing ? "closing" : ""}`}>
        {/* Header */}
        <div className="checkout-header">
          <button className="checkout-close" onClick={onClose} aria-label={t("closeAria")}>
            <X size={18} />
          </button>
          <h2 className="checkout-title">{t("title")}</h2>
          <p className="checkout-subtitle">{t("subtitle")}</p>
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
                <span className="step-label">{t(s.labelKey)}</span>
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
                {t("step1Title")}
              </h3>

              {user && (
                <div style={{ background: "rgba(176,141,62,0.08)", border: "1px solid rgba(176,141,62,0.25)", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "var(--color-primary, #b08d3e)" }}>
                  <UserCheck size={18} style={{ flexShrink: 0 }} />
                  <span>{t("authNote")} <strong>{user.name}</strong> ({user.email}). {t("authSecureNote")}</span>
                </div>
              )}

              <div className="checkout-field">
                  <label htmlFor="co-name">{t("fields.fullName")} *</label>
                <div className={`checkout-input-wrap ${errors.name ? "has-error" : ""}`}>
                  <User size={16} className="checkout-input-icon" />
                  <input id="co-name" type="text" placeholder={t("placeholders.name")} value={name} onChange={(e) => { setName(e.target.value); setErrors(prev => ({ ...prev, name: "" })) }} required />
                </div>
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>

              <div className="checkout-row-2">
                <div className="checkout-field">
                  <label htmlFor="co-email">{t("fields.email")} *</label>
                <div className={`checkout-input-wrap ${errors.email ? "has-error" : ""}`}>
                  <Mail size={16} className="checkout-input-icon" />
                  <input id="co-email" type="email" placeholder={t("placeholders.email")} value={email} onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: "" })) }} required />
                </div>
                {errors.email && <span className="field-error">{errors.email}</span>}
                </div>
                <div className="checkout-field">
                  <label htmlFor="co-phone">{t("fields.phone")} * <span className="field-hint">({t("fields.phoneHint")})</span></label>
                <div className={`checkout-input-wrap ${errors.phone ? "has-error" : ""}`}>
                  <Phone size={16} className="checkout-input-icon" />
                  <input id="co-phone" type="tel" placeholder={t("placeholders.phone")} value={phone} onChange={(e) => { setPhone(e.target.value); setErrors(prev => ({ ...prev, phone: "" })) }} required />
                </div>
                {errors.phone && <span className="field-error">{errors.phone}</span>}
                </div>
              </div>

              <div className="checkout-field">
                <label htmlFor="co-city">{t("fields.city")} *</label>
                <LocationPicker
                  cities={citiesList}
                  selectedCityId={cityId}
                  onSelect={(city) => setCityId(city.id)}
                  onGpsLocate={(lat, lng) => setGpsCoords({ lat, lng })}
                  onLocationResolved={(quote) => {
                    setResolvedLocationId(quote.locationId)
                    setGpsCoords(quote.coords)
                  }}
                />
                {selectedCity.zone === "tanger" && totalPrice >= FREE_SHIPPING_THRESHOLD && (
                  <span className="field-success">{t("freeShipping")}</span>
                )}
              </div>

              <div className="checkout-field">
                <label>{t("fields.deliveryMethod")} *</label>
              <div className="delivery-method-options">
                <button
                  type="button"
                  className={`delivery-method-btn ${deliveryMethod === "delivery" ? "selected" : ""}`}
                  onClick={() => setDeliveryMethod("delivery")}
                >
                  {t("fields.delivery")}
                </button>
                <button
                  type="button"
                  className={`delivery-method-btn ${deliveryMethod === "pickup" ? "selected" : ""}`}
                  onClick={() => setDeliveryMethod("pickup")}
                >
                  {t("fields.pickup")}
                </button>
              </div>
              </div>

              <div className="checkout-field">
                <label htmlFor="co-address">{t("fields.streetAddress")} *</label>
              <div className={`checkout-input-wrap ${errors.address ? "has-error" : ""}`}>
                <Home size={16} className="checkout-input-icon" />
                <input id="co-address" type="text" placeholder={t("placeholders.address")} value={address} onChange={(e) => { setAddress(e.target.value); setErrors(prev => ({ ...prev, address: "" })) }} required={deliveryMethod === "delivery"} />
              </div>
                {errors.address && <span className="field-error">{errors.address}</span>}
              </div>

              <div className="checkout-field">
                <label htmlFor="co-notes">{t("fields.orderNotes")}</label>
              <textarea id="co-notes" className="checkout-textarea" placeholder={t("placeholders.notes")} value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
              </div>
            </div>
          )}

          {/* ── STEP 2: Summary ── */}
          {step === 2 && (
            <div className="checkout-step-content">
              <h3 className="step-content-title">
                <CreditCard size={18} />
                {t("step2Title")}
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
                  <span>{t("subtotal")}</span>
                  <span>{formatPriceDH(totalPrice)}</span>
                </div>
                <div className="checkout-total-row">
                  <span>{t("shippingTo")} {selectedCity.name}</span>
                  <span>{shipping === 0 ? t("freeShippingText") : formatPriceDH(shipping)}</span>
                </div>
                <div className="checkout-total-row grand">
                  <span>{t("total")}</span>
                  <span>{formatPriceDH(grandTotal)}</span>
                </div>
              </div>

              <div className="deposit-box">
                <div className="deposit-header">
                  <span className="deposit-badge">{t("depositBadge")}</span>
                </div>
                <div className="deposit-grid">
                  <div className="deposit-item">
                    <span className="deposit-label">{t("advanceLabel")}</span>
                    <span className="deposit-value advance">{formatPriceDH(advanceAmount)}</span>
                    <span className="deposit-desc">{t("advanceDesc")}</span>
                  </div>
                  <div className="deposit-item">
                    <span className="deposit-label">{t("balanceLabel")}</span>
                    <span className="deposit-value balance">{formatPriceDH(balanceAmount)}</span>
                    <span className="deposit-desc">{t("balanceDesc")}</span>
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
                {t("step3Title")}
              </h3>

              <div className="rib-box">
                <div className="rib-header">
                  <span className="rib-title">{t("ribTitle")}</span>
                  <button className="rib-copy-btn" onClick={copyRib}>
                    {ribCopied ? <><CheckCircle2 size={14} /> {t("ribCopied")}</> : <><Copy size={14} /> {t("ribCopy")}</>}
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
                <label className="upload-label">{t("uploadLabel")} *</label>
              <p className="upload-hint">{t("uploadHint")}</p>
                {proofPreview ? (
                  <div className="upload-preview">
                    {proofFile?.type === "application/pdf" ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px", background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: "8px", width: "100%", boxSizing: "border-box" }}>
                        <FileText size={32} style={{ color: "#ef4444", flexShrink: 0 }} />
                        <div style={{ textAlign: "left", overflow: "hidden" }}>
                          <p style={{ fontWeight: 600, fontSize: "14px", margin: 0, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{proofFile.name}</p>
                          <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>{t("pdfDoc")} ({(proofFile.size / 1024).toFixed(0)} KB)</p>
                        </div>
                      </div>
                    ) : (
                      <img src={proofPreview} alt="Transfer proof" />
                    )}
                    <button className="upload-remove" onClick={() => { setProofFile(null); setProofPreview(null) }}>
                      <X size={14} /> {t("uploadRemove")}
                    </button>
                  </div>
                ) : (
                  <label className="upload-dropzone" htmlFor="co-proof">
                    <Upload size={32} className="upload-icon" />
                    <span className="upload-text">{t("uploadDropText")}</span>
                    <span className="upload-hint-text">{t("uploadDropHint")}</span>
                    <input id="co-proof" type="file" accept="image/jpeg,image/png,image/jpg,application/pdf" onChange={handleFileChange} hidden />
                  </label>
                )}
              </div>

              <div className="payment-instructions">
                <h4>{t("howToPayTitle")}</h4>
                <ol>
                  <li>Transfer <strong>{formatPriceDH(advanceAmount)}</strong> {t("howToPaySteps")[0]}</li>
                  <li>{t("howToPaySteps")[1]}</li>
                  <li>{t("howToPaySteps")[2]}</li>
                  <li>{t("howToPaySteps")[3]}</li>
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
                {t("orderPlaced")}
              </h3>
              <p className="confirm-subtitle">
                {t("orderSubmitted", { orderId })}
              </p>

              <div className="confirm-card">
                <div className="confirm-row">
                  <span className="confirm-lbl">{t("orderId")}</span>
                  <span className="confirm-val">{orderId}</span>
                </div>
                <div className="confirm-row">
                  <span className="confirm-lbl">{t("advanceDue")}</span>
                  <span className="confirm-val gold">{formatPriceDH(advanceAmount)}</span>
                </div>
                <div className="confirm-row">
                  <span className="confirm-lbl">{t("deliveryTo")}</span>
                  <span className="confirm-val">{selectedCity.name}</span>
                </div>
              </div>

              <p className="confirm-note">
                {t("confirmNote")}
              </p>

              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="confirm-whatsapp-btn"
              >
                <MessageCircle size={18} />
                {t("confirmWhatsApp")}
              </a>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="checkout-footer">
          {step > 1 && step < 4 && (
            <button className="btn-back" onClick={handleBack} disabled={isSubmitting}>
              <ChevronLeft size={16} /> {t("btnBack")}
            </button>
          )}
          {step < 4 ? (
            <button
              className="btn-next"
              onClick={handleNext}
              disabled={(step === 1 && !canProceedStep1) || (step === 3 && (!canProceedStep3 || isSubmitting))}
            >
              {isSubmitting ? t("btnSubmitting") : step === 3 ? t("btnPlaceOrder") : t("btnContinue")}
              {step < 3 && <ChevronRight size={16} />}
            </button>
          ) : (
            <button className="btn-next" onClick={handleFinish}>
              <CheckCircle2 size={16} /> {t("btnDone")}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
