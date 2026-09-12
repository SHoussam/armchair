import { Home, LayoutGrid, Heart, ShoppingBag, User } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useCart } from "@/context/CartContext"
import { useAuth } from "@/context/AuthContext"

interface MobileNavProps {
  onCatalogClick: () => void
  onWishlistClick: () => void
  onCartClick: () => void
  onProfileClick: () => void
}

export default function MobileNav({ onCatalogClick, onWishlistClick, onCartClick, onProfileClick }: MobileNavProps) {
  const { t } = useTranslation("nav")
  const { totalItems, state } = useCart()
  const { isAuthenticated } = useAuth()
  const wishlistCount = state.wishlist.length

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      <button
        type="button"
        className="mobile-bottom-nav-item"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label={t("home")}
        aria-current="page"
      >
        <Home size={20} />
        <span>{t("home")}</span>
      </button>
      <button
        type="button"
        className="mobile-bottom-nav-item"
        onClick={onCatalogClick}
        aria-label={t("catalog")}
      >
        <LayoutGrid size={20} />
        <span>{t("catalog")}</span>
      </button>
      <button
        type="button"
        className="mobile-bottom-nav-item"
        onClick={onWishlistClick}
        aria-label={t("wishlist")}
      >
        <Heart size={20} />
        {wishlistCount > 0 && <span className="mobile-bottom-nav-badge">{wishlistCount}</span>}
        <span>{t("wishlist")}</span>
      </button>
      <button
        type="button"
        className="mobile-bottom-nav-item"
        onClick={onCartClick}
        aria-label={t("cart")}
      >
        <ShoppingBag size={20} />
        {totalItems > 0 && <span className="mobile-bottom-nav-badge">{totalItems}</span>}
        <span>{t("cart")}</span>
      </button>
      <button
        type="button"
        className="mobile-bottom-nav-item"
        onClick={onProfileClick}
        aria-label={isAuthenticated ? t("profile") : t("logIn")}
      >
        <User size={20} />
        <span>{isAuthenticated ? t("profile") : t("logIn")}</span>
      </button>
    </nav>
  )
}
