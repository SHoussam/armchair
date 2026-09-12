import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Heart } from "lucide-react"
import { Product, getLocalizedProductName, getLocalizedCategoryName } from "@/data/data"
import { useCart } from "@/context/CartContext"
import { renderStars } from "@/utils/helpers"

interface ProductCardProps {
  product: Product
  onViewDetail: (product: Product) => void
}

export default function ProductCard({ product, onViewDetail }: ProductCardProps) {
  const { t, i18n } = useTranslation("productCard")
  const { toggleWishlist, isWishlisted, showToast } = useCart()
  const [selectedColorIdx, setSelectedColorIdx] = useState(0)
  const [imgLoaded, setImgLoaded] = useState(false)

  const wished = isWishlisted(product.id)
  const localizedName = getLocalizedProductName(product, i18n.language)
  const localizedCat = getLocalizedCategoryName(product.category, i18n.language, product.categoryAr, product.categoryFr)

  const handlePersonalize = (e: React.MouseEvent) => {
    e.stopPropagation()
    onViewDetail(product)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleWishlist(product.id)
    showToast(!wished ? t("removedWishlist") : t("addedWishlist"))
  }

  const handleColorSelect = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation()
    setSelectedColorIdx(idx)
  }

  const badgeClass =
    product.badge === "Sale"
      ? "badge-sale"
      : product.badge === "Best Seller"
      ? "badge-bestseller"
      : product.badge === "Top Rated"
      ? "badge-bestseller"
      : "badge-new"

  return (
    <article className="product-card" onClick={() => onViewDetail(product)}>
      <div className="product-card-img">
        <img
          src={product.img}
          alt={product.imgAlt || localizedName}
          className={imgLoaded ? "loaded" : ""}
          onLoad={() => setImgLoaded(true)}
        />

        {/* Badge */}
        {product.badge && (
          <span className={badgeClass}>{product.badge}</span>
        )}

        {/* Quick Personalize Button */}
        <button className="quick-add" onClick={handlePersonalize}>
          <span className="desktop-only">{t("personalizeDesktop")}</span>
          <span className="mobile-only">{t("personalizeMobile")}</span>
        </button>
      </div>

      <div className="product-card-body">
        <div className="product-category">
          {localizedCat}
          <span className="desktop-only" style={{ marginInlineStart: "6px", color: "var(--gold-text)", fontSize: "0.68rem" }}>
            {t("bespokeTag")}
          </span>
          <span className="mobile-only product-bespoke-tag">{t("atelierSizing")}</span>
        </div>
        <div className="product-name">{localizedName}</div>
        <div className="product-stars">
          {renderStars(product.rating)} <span>({product.reviews})</span>
        </div>
        <div className="product-price-row">
          <span className="product-price">
            {t("fromPrice")} {product.price.toLocaleString()} MAD
          </span>
          {product.oldPrice && (
            <span className="product-price-old">{product.oldPrice.toLocaleString()} MAD</span>
          )}
        </div>
        {/* Visual color swatches */}
        <div className="product-colors">
          {product.colors.map((hex, i) => (
            <button
              key={i}
              type="button"
              className={`color-swatch ${i === selectedColorIdx ? "selected" : ""}`}
              style={{ backgroundColor: hex }}
              onClick={(e) => handleColorSelect(e, i)}
              title={product.colorNames[i]}
              aria-label={`Select color ${product.colorNames[i]}`}
            />
          ))}
        </div>
      </div>

      {/* Wishlist — sibling of img/body for mobile flow */}
      <button
        className={`wishlist-btn ${wished ? "active" : ""}`}
        onClick={handleWishlist}
        aria-label={wished ? `Remove ${localizedName} from wishlist` : `Add ${localizedName} to wishlist`}
      >
        <Heart size={19} fill={wished ? "currentColor" : "none"} strokeWidth={2} />
      </button>
    </article>
  )
}
