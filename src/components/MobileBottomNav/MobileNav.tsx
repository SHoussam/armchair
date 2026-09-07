"use client"

import { useState, useEffect, useRef } from "react"
import { Home, LayoutGrid, Heart, ShoppingBag, User } from "lucide-react"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"

interface MobileNavProps {
  onCatalogClick: () => void
  onWishlistClick: () => void
  onCartClick: () => void
  onProfileClick: () => void
}

export default function MobileNav({ onCatalogClick, onWishlistClick, onCartClick, onProfileClick }: MobileNavProps) {
  const { totalItems, state } = useCart()
  const { isAuthenticated } = useAuth()
  const wishlistCount = state.wishlist.length
  const [hidden, setHidden] = useState(false)
  const [atBottom, setAtBottom] = useState(false)
  const lastScroll = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY
      const delta = current - lastScroll.current
      const docHeight = document.documentElement.scrollHeight
      const winHeight = window.innerHeight
      const scrolledToBottom = current + winHeight >= docHeight - 60

      setAtBottom(scrolledToBottom)

      if (delta > 8 && current > 80) {
        setHidden(true)
      } else if (delta < -4 || scrolledToBottom) {
        setHidden(false)
      }

      lastScroll.current = current
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className={`mobile-bottom-nav ${hidden && !atBottom ? "hidden" : ""}`}>
      <button className="mobile-bottom-nav-item" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <Home size={20} />
        <span>Home</span>
      </button>
      <button className="mobile-bottom-nav-item" onClick={onCatalogClick}>
        <LayoutGrid size={20} />
        <span>Catalog</span>
      </button>
      <button className="mobile-bottom-nav-item" onClick={onWishlistClick}>
        <Heart size={20} />
        {wishlistCount > 0 && <span className="mobile-bottom-nav-badge">{wishlistCount}</span>}
        <span>Wishlist</span>
      </button>
      <button className="mobile-bottom-nav-item" onClick={onCartClick}>
        <ShoppingBag size={20} />
        {totalItems > 0 && <span className="mobile-bottom-nav-badge">{totalItems}</span>}
        <span>Cart</span>
      </button>
      <button className="mobile-bottom-nav-item" onClick={onProfileClick}>
        <User size={20} />
        <span>Account</span>
      </button>
    </nav>
  )
}
