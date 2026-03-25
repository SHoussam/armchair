import { useCart } from "@/context/CartContext"

export default function Toast() {
  const { state } = useCart()
  return (
    <div className={`toast ${state.toast ? "show" : ""}`} role="status" aria-live="polite">
      {state.toast}
    </div>
  )
}
