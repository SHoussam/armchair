import { useEffect, useState, useRef, useCallback } from "react"
import { useCart } from "@/context/CartContext"
import { CheckCircle2, X } from "lucide-react"

interface ToastMessage {
  id: number
  message: string
  type?: "success" | "error" | "info"
}

interface SwipeableToastProps {
  toast: ToastMessage
  onDismiss: (id: number) => void
}

function SwipeableToast({ toast, onDismiss }: SwipeableToastProps) {
  const ref = useRef<HTMLDivElement>(null)
  const startX = useRef(0)
  const currentX = useRef(0)
  const isDragging = useRef(false)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
    isDragging.current = true
    if (ref.current) {
      ref.current.style.transition = "none"
    }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return
    currentX.current = e.touches[0].clientX - startX.current
    if (ref.current) {
      const opacity = Math.max(0, 1 - Math.abs(currentX.current) / 150)
      ref.current.style.transform = `translateX(${currentX.current}px)`
      ref.current.style.opacity = String(opacity)
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current) return
    isDragging.current = false
    if (ref.current) {
      ref.current.style.transition = "transform .25s ease, opacity .25s ease"
      if (Math.abs(currentX.current) > 80) {
        ref.current.style.transform = `translateX(${currentX.current > 0 ? 200 : -200}px)`
        ref.current.style.opacity = "0"
        setTimeout(() => onDismiss(toast.id), 200)
      } else {
        ref.current.style.transform = "translateX(0)"
        ref.current.style.opacity = "1"
      }
    }
    currentX.current = 0
  }, [toast.id, onDismiss])

  return (
    <div
      ref={ref}
      className={`toast toast-show toast-${toast.type || "success"}`}
      role="status"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: "pan-y" }}
    >
      <div className="toast-icon">
        <CheckCircle2 size={18} />
      </div>
      <span className="toast-message">{toast.message}</span>
      <button
        className="toast-close"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  )
}

export default function Toast() {
  const { state } = useCart()
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    if (state.toast) {
      const id = Date.now()
      setToasts((prev) => [...prev, { id, message: state.toast!, type: "success" }])

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 2800)
    }
  }, [state.toast])

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <SwipeableToast key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </div>
  )
}
