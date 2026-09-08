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

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      <button 
        type="button"
        className="mobile-bottom-nav-item" 
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Home"
        aria-current="page"
      >
        <Home size={20} />
        <span>Home</span>
      </button>
      <button 
        type="button"
        className="mobile-bottom-nav-item" 
        onClick={onCatalogClick}
        aria-label="Catalog"
      >
        <LayoutGrid size={20} />
        <span>Catalog</span>
      </button>
      <button 
        type="button"
        className="mobile-bottom-nav-item" 
        onClick={onWishlistClick}
        aria-label={`Wishlist with ${wishlistCount} items`}
      >
        <Heart size={20} />
        {wishlistCount > 0 && <span className="mobile-bottom-nav-badge">{wishlistCount}</span>}
        <span>Wishlist</span>
      </button>
      <button 
        type="button"
        className="mobile-bottom-nav-item" 
        onClick={onCartClick}
        aria-label={`Cart with ${totalItems} items`}
      >
        <ShoppingBag size={20} />
        {totalItems > 0 && <span className="mobile-bottom-nav-badge">{totalItems}</span>}
        <span>Cart</span>
      </button>
      <button 
        type="button"
        className="mobile-bottom-nav-item" 
        onClick={onProfileClick}
        aria-label="Account"
      >
        <User size={20} />
        <span>{isAuthenticated ? "Account" : "Log In"}</span>
      </button>
    </nav>
  )
}

