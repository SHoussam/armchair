import { useState, useEffect } from "react"
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle, X, ArrowLeft } from "lucide-react"

export type OrderStatus = "PENDING" | "WORKING" | "WAITING_FOR_FINAL_PAYMENT" | "SHIPPING" | "DELIVERED"

interface TrackedOrder {
  id: string
  productName: string
  productNameAr?: string
  status: OrderStatus
  orderDate: string
  estimatedDelivery: string
  total: number
  depositPaid: number
}

const STATUS_ORDER: OrderStatus[] = [
  "PENDING",
  "WORKING",
  "WAITING_FOR_FINAL_PAYMENT",
  "SHIPPING",
  "DELIVERED",
]

const STATUS_LABELS: Record<OrderStatus, { en: string; ar: string; desc: string }> = {
  PENDING: {
    en: "Order Placed",
    ar: "تم استلام الطلب",
    desc: "Your order has been received and is awaiting payment verification",
  },
  WORKING: {
    en: "In Production",
    ar: "قيد التصنيع",
    desc: "Our artisans are crafting your furniture",
  },
  WAITING_FOR_FINAL_PAYMENT: {
    en: "Awaiting Balance",
    ar: "في انتظار الدفع المتبقي",
    desc: "Final payment is required before shipping",
  },
  SHIPPING: {
    en: "Out for Delivery",
    ar: "قيد التوصيل",
    desc: "Your order is on its way to you",
  },
  DELIVERED: {
    en: "Delivered",
    ar: "تم التوصيل",
    desc: "Your furniture has been delivered",
  },
}

const STATUS_ICONS: Record<OrderStatus, React.ReactNode> = {
  PENDING: <Package size={20} />,
  WORKING: <Clock size={20} />,
  WAITING_FOR_FINAL_PAYMENT: <AlertCircle size={20} />,
  SHIPPING: <Truck size={20} />,
  DELIVERED: <CheckCircle size={20} />,
}

const MOCK_ORDERS: TrackedOrder[] = [
  {
    id: "ORD-2026-001",
    productName: "L-Shaped Salon - Premium Collection",
    productNameAr: "صالة على شكل L - المجموعة الفاخرة",
    status: "WORKING",
    orderDate: "2026-08-15",
    estimatedDelivery: "2026-09-20",
    total: 24500,
    depositPaid: 7350,
  },
  {
    id: "ORD-2026-002",
    productName: "Luxury Armchair - Royal Series",
    productNameAr: "كرسي فاخر - السلسلة الملكية",
    status: "SHIPPING",
    orderDate: "2026-08-20",
    estimatedDelivery: "2026-09-10",
    total: 8500,
    depositPaid: 8500,
  },
]

interface TimelineProps {
  currentStatus: OrderStatus
}

function StatusTimeline({ currentStatus }: TimelineProps) {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus)

  return (
    <div className="tracking-timeline">
      {STATUS_ORDER.map((status, index) => {
        const isCompleted = index < currentIndex
        const isCurrent = index === currentIndex
        const isPending = index > currentIndex

        return (
          <div
            key={status}
            className={`timeline-step ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""} ${isPending ? "pending" : ""}`}
          >
            <div className="timeline-connector-wrapper">
              {index > 0 && (
                <div className={`timeline-connector ${isCompleted || isCurrent ? "filled" : ""}`} />
              )}
            </div>
            <div className="timeline-step-content">
              <div className="timeline-icon-wrapper">
                <div className="timeline-icon">
                  {STATUS_ICONS[status]}
                </div>
              </div>
              <div className="timeline-info">
                <div className="timeline-label">{STATUS_LABELS[status]?.en || status}</div>
                <div className="timeline-label-ar">{STATUS_LABELS[status]?.ar || ""}</div>
                {(isCompleted || isCurrent) && (
                  <div className="timeline-desc">{STATUS_LABELS[status]?.desc || ""}</div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

interface OrderTrackingPageProps {
  onClose?: () => void
  orderId?: string | null
}

export default function OrderTrackingPage({ onClose, orderId }: OrderTrackingPageProps) {
  const [searchId, setSearchId] = useState(orderId || "")
  const [foundOrder, setFoundOrder] = useState<TrackedOrder | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const fetchOrderFromApi = async (id: string) => {
    setIsLoading(true)
    setNotFound(false)
    const trimmed = id.trim().toUpperCase()

    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(trimmed)}`, {
        headers: { Accept: "application/json" },
      })
      const json = await res.json()

      if (res.ok && json.success && json.data) {
        const data = json.data
        const items = data.items || []
        const firstProduct = items[0]?.product?.name || "Furniture Order"
        const statusKey = (data.status as OrderStatus) || "PENDING"
        const totalAmount = parseFloat(data.total) || 0

        // Derive depositPaid properly from verified payments or order status
        let depositAmount = 0
        if (Array.isArray(data.payments) && data.payments.length > 0) {
          depositAmount = data.payments
            .filter((p: any) => p.status === "verified")
            .reduce((sum: number, p: any) => sum + (parseFloat(p.amount) || 0), 0)
        } else if (statusKey !== "PENDING") {
          depositAmount = Math.round(totalAmount * 0.3)
        }

        const estDelivery = data.estimated_delivery
          ? new Date(data.estimated_delivery).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })
          : "2-3 weeks from payment confirmation"

        const tracked: TrackedOrder = {
          id: data.order_number || trimmed,
          productName: firstProduct + (items.length > 1 ? ` (+${items.length - 1} items)` : ""),
          status: STATUS_ORDER.includes(statusKey) ? statusKey : "PENDING",
          orderDate: data.created_at ? data.created_at.substring(0, 10) : new Date().toISOString().substring(0, 10),
          estimatedDelivery: estDelivery,
          total: totalAmount,
          depositPaid: depositAmount,
        }

        setFoundOrder(tracked)
        setNotFound(false)
        return
      }
    } catch (e) {
      // API error fallback to local search
    } finally {
      setIsLoading(false)
    }

    // Fallback to local mock orders
    const mockFound = MOCK_ORDERS.find((o) => o.id === trimmed)
    if (mockFound) {
      setFoundOrder(mockFound)
      setNotFound(false)
    } else {
      setFoundOrder(null)
      setNotFound(true)
    }
  }

  // Auto-search when orderId prop is provided
  useEffect(() => {
    if (orderId) {
      fetchOrderFromApi(orderId)
    }
  }, [orderId])

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchId.trim()) {
      fetchOrderFromApi(searchId)
    }
  }

  const handleWhatsApp = (order: TrackedOrder) => {
    const statusText = STATUS_LABELS[order.status]?.en || order.status
    const message = encodeURIComponent(
      `Hello, I'd like to inquire about my order ${order.id}. Current status: ${statusText}`
    )
    window.open(`https://wa.me/212666896776?text=${message}`, "_blank")
  }

  return (
    <div className="tracking-page">
      {onClose && (
        <div className="tracking-top-bar">
          <button className="tracking-back-btn" onClick={onClose}>
            <ArrowLeft size={16} />
            <span>Back to Store</span>
          </button>
          <button className="tracking-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
      )}

      <div className="tracking-header">
        <div className="section-eyebrow">Order Status</div>
        <h1 className="tracking-title">Track Your Order</h1>
        <p className="tracking-subtitle">
          Enter your Order ID to see where your furniture is in the production pipeline
        </p>
      </div>

      <div className="tracking-search-section">
        <form onSubmit={handleSearch} className="tracking-search-form">
          <div className="tracking-search-box">
            <Search size={20} className="tracking-search-icon" />
            <input
              type="text"
              placeholder="Enter Order ID (e.g., ORD-A1B2C3D4)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="tracking-search-input"
            />
          </div>
          <button type="submit" className="tracking-search-btn" disabled={isLoading}>
            {isLoading ? "Searching..." : "Track Order"}
          </button>
        </form>

        {notFound && (
          <div className="tracking-not-found">
            <AlertCircle size={18} />
            <span>Order not found. Please check your Order ID and try again.</span>
          </div>
        )}
      </div>

      {foundOrder && (
        <div className="tracking-result">
          <div className="tracking-order-header">
            <div className="tracking-order-id">{foundOrder.id}</div>
            <div className={`tracking-status-badge status-${foundOrder.status.toLowerCase()}`}>
              {STATUS_LABELS[foundOrder.status]?.en || foundOrder.status}
            </div>
          </div>

          <div className="tracking-product-info">
            <div className="tracking-product-name">{foundOrder.productName}</div>
            {foundOrder.productNameAr && <div className="tracking-product-name-ar">{foundOrder.productNameAr}</div>}
          </div>

          <div className="tracking-order-details">
            <div className="tracking-detail-row">
              <span className="tracking-detail-label">Order Date</span>
              <span className="tracking-detail-value">
                {new Date(foundOrder.orderDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="tracking-detail-row">
              <span className="tracking-detail-label">Estimated Delivery</span>
              <span className="tracking-detail-value">
                {foundOrder.estimatedDelivery}
              </span>
            </div>
            <div className="tracking-detail-row">
              <span className="tracking-detail-label">Total</span>
              <span className="tracking-detail-value tracking-price">
                {foundOrder.total.toLocaleString()} DH
              </span>
            </div>
            <div className="tracking-detail-row">
              <span className="tracking-detail-label">Deposit Paid</span>
              <span className="tracking-detail-value tracking-deposit">
                {foundOrder.depositPaid.toLocaleString()} DH
              </span>
            </div>
            {foundOrder.status !== "DELIVERED" && foundOrder.status !== "WAITING_FOR_FINAL_PAYMENT" && (
              <div className="tracking-detail-row">
                <span className="tracking-detail-label">Balance Due</span>
                <span className="tracking-detail-value tracking-balance">
                  {(foundOrder.total - foundOrder.depositPaid).toLocaleString()} DH
                </span>
              </div>
            )}
          </div>

          <div className="tracking-timeline-wrapper">
            <StatusTimeline currentStatus={foundOrder.status} />
          </div>

          <div className="tracking-actions">
            <button
              className="btn-whatsapp-tracking"
              onClick={() => handleWhatsApp(foundOrder)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Inquire via WhatsApp
            </button>
          </div>
        </div>
      )}

      {!foundOrder && !notFound && (
        <div className="tracking-demo-section">
          <p className="tracking-demo-label">Demo Orders (try these IDs):</p>
          <div className="tracking-demo-list">
            {MOCK_ORDERS.map((order) => (
              <button
                key={order.id}
                className="tracking-demo-btn"
                onClick={() => {
                  setSearchId(order.id)
                  fetchOrderFromApi(order.id)
                }}
              >
                <span className="tracking-demo-id">{order.id}</span>
                <span className={`tracking-demo-status status-${order.status.toLowerCase()}`}>
                  {STATUS_LABELS[order.status]?.en}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}