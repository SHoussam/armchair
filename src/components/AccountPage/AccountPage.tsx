import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { api } from "@/services/api"
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Package,
  ChevronRight,
  Eye,
  Clock,
  CheckCircle2,
  Truck,
  Hammer,
  CreditCard,
  XCircle,
} from "lucide-react"

interface AccountPageProps {
  isOpen: boolean
  onClose: () => void
  onViewOrder?: (orderId: string) => void
}

interface OrderHistory {
  id: string
  date: string
  items: { name: string; qty: number; price: number }[]
  total: number
  status: "pending" | "working" | "waiting_for_final_payment" | "shipping" | "delivered" | "cancelled"
  city: string
}

const MOCK_ORDERS: OrderHistory[] = [
  {
    id: "ORD-4821",
    date: "2026-08-15",
    items: [
      { name: "Royal L-Shaped Salon", qty: 1, price: 4200 },
      { name: "Velvet Accent Armchair", qty: 2, price: 1800 },
    ],
    total: 7800,
    status: "delivered",
    city: "Tanger",
  },
  {
    id: "ORD-5103",
    date: "2026-08-28",
    items: [
      { name: "Royal L-Shaped Salon", qty: 1, price: 3500 },
    ],
    total: 3500,
    status: "shipping",
    city: "Tetouan",
  },
  {
    id: "ORD-5290",
    date: "2026-09-01",
    items: [
      { name: "Velvet Accent Armchair", qty: 1, price: 2150 },
    ],
    total: 2150,
    status: "working",
    city: "Tanger",
  },
]

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pending: { label: "Pending", color: "#998f80", bg: "rgba(153,143,128,.1)", icon: Clock },
  working: { label: "In Production", color: "#b08d3e", bg: "rgba(176,141,62,.1)", icon: Hammer },
  waiting_for_payment: { label: "Awaiting Balance", color: "#b96a4e", bg: "rgba(185,106,78,.1)", icon: CreditCard },
  waiting_for_final_payment: { label: "Awaiting Balance", color: "#b96a4e", bg: "rgba(185,106,78,.1)", icon: CreditCard },
  shipping: { label: "In Transit", color: "#3b82f6", bg: "rgba(59,130,246,.1)", icon: Truck },
  delivered: { label: "Delivered", color: "#1f7a52", bg: "rgba(31,122,82,.1)", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "#dc2626", bg: "rgba(220,38,38,.1)", icon: XCircle },
}

function getStatusBadge(status: string) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  const Icon = config.icon
  return (
    <span className="account-status-badge" style={{ color: config.color, background: config.bg }}>
      <Icon size={13} />
      {config.label}
    </span>
  )
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function AccountPage({ isOpen, onClose, onViewOrder }: AccountPageProps) {
  const { user, token, logout } = useAuth()
  const [orders, setOrders] = useState<OrderHistory[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isOpen || !user) return

    if (!token) {
      setOrders([])
      return
    }

    setIsLoading(true)
    api
      .get<{ success: boolean; data: any[] }>("/orders")
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          if (data.data.length === 0) {
            setOrders([])
          } else {
            const mapped: OrderHistory[] = data.data.map((ord: any) => ({
              id: ord.order_number || `ORD-${ord.id}`,
              date: ord.created_at || new Date().toISOString(),
              items: Array.isArray(ord.items)
                ? ord.items.map((item: any) => ({
                    name: item.product?.name || "Handcrafted Furniture",
                    qty: item.quantity || 1,
                    price: Number(item.calculated_unit_price || item.unit_price || item.total_price || 0),
                  }))
                : [],
              total: Number(ord.total || ord.total_amount || 0),
              status: (ord.status || "pending").toLowerCase(),
              city: ord.city?.name || "Tanger",
            }))
            setOrders(mapped)
          }
        } else {
          setOrders([])
        }
      })
      .catch(() => {
        setOrders([])
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [isOpen, user, token])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

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

  if (!isOpen || !user) return null

  const activeOrders = orders.filter((o) => o.status !== "delivered" && o.status !== "cancelled")
  const pastOrders = orders.filter((o) => o.status === "delivered" || o.status === "cancelled")

  return (
    <div className="account-overlay" onClick={handleBackdropClick} role="dialog" aria-modal="true" aria-label="My Account">
      <div className="account-modal">
        <div className="account-header">
          <h2 className="account-title">My Account</h2>
          <button className="account-close" onClick={onClose} aria-label="Close account">
            <X size={18} />
          </button>
        </div>

        <div className="account-body">
          {/* Profile Card */}
          <div className="account-profile-card">
            <div className="account-avatar">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="account-profile-info">
              <h3 className="account-profile-name">{user.name}</h3>
              <div className="account-profile-detail">
                <Mail size={14} /> {user.email}
              </div>
              {user.phone && (
                <div className="account-profile-detail">
                  <Phone size={14} /> {user.phone}
                </div>
              )}
              <div className="account-profile-detail">
                <Calendar size={14} /> Member since {user.createdAt ? formatDate(user.createdAt) : "Recently"}
              </div>
            </div>
          </div>

          {/* Active Orders */}
          {activeOrders.length > 0 && (
            <div className="account-section">
              <h3 className="account-section-title">
                <Package size={16} />
                Active Orders ({activeOrders.length})
              </h3>
              <div className="account-orders-list">
                {activeOrders.map((order) => (
                  <div key={order.id} className="account-order-card">
                    <div className="account-order-header">
                      <div>
                        <span className="account-order-id">{order.id}</span>
                        <span className="account-order-date">{formatDate(order.date)}</span>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="account-order-items">
                      {order.items.map((item, i) => (
                        <div key={i} className="account-order-item">
                          <span>{item.name} x{item.qty}</span>
                          <span>{item.price.toLocaleString()} DH</span>
                        </div>
                      ))}
                    </div>
                    <div className="account-order-footer">
                      <div className="account-order-total">
                        Total: <strong>{order.total.toLocaleString()} DH</strong>
                      </div>
                      <button className="account-view-btn" onClick={() => onViewOrder?.(order.id)}>
                        <Eye size={14} />
                        View Details
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past Orders */}
          {pastOrders.length > 0 && (
            <div className="account-section">
              <h3 className="account-section-title">
                <CheckCircle2 size={16} />
                Order History ({pastOrders.length})
              </h3>
              <div className="account-orders-list">
                {pastOrders.map((order) => (
                  <div key={order.id} className="account-order-card">
                    <div className="account-order-header">
                      <div>
                        <span className="account-order-id">{order.id}</span>
                        <span className="account-order-date">{formatDate(order.date)}</span>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="account-order-items">
                      {order.items.map((item, i) => (
                        <div key={i} className="account-order-item">
                          <span>{item.name} x{item.qty}</span>
                          <span>{item.price.toLocaleString()} DH</span>
                        </div>
                      ))}
                    </div>
                    <div className="account-order-footer">
                      <div className="account-order-total">
                        Total: <strong>{order.total.toLocaleString()} DH</strong>
                      </div>
                      <button className="account-view-btn" onClick={() => onViewOrder?.(order.id)}>
                        <Eye size={14} />
                        View Details
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {orders.length === 0 && (
            <div className="account-empty">
              <Package size={40} />
              <p>No orders yet</p>
              <span>Browse our collection and place your first order!</span>
            </div>
          )}
        </div>

        <div className="account-footer">
          <button className="account-signout-btn" onClick={() => { logout(); onClose() }}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
