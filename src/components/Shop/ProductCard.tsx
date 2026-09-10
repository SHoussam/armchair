import { useState } from "react"
import { Heart } from "lucide-react"
import { Product } from "@/data/data"
import { useCart } from "@/context/CartContext"
import { renderStars } from "@/utils/helpers"

interface ProductCardProps {
  product: Product
  onViewDetail: (product: Product) => void
}

export default function ProductCard({ product, onViewDetail }: ProductCardProps) {
  const { toggleWishlist, isWishlisted, showToast } = useCart()
  const [selectedColorIdx, setSelectedColorIdx] = useState(0)
  const [imgLoaded, setImgLoaded] = useState(false)

  const wished = isWishlisted(product.id)

  const handlePersonalize = (e: React.MouseEvent) => {
    e.stopPropagation()
    onViewDetail(product)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleWishlist(product.id)
    showToast(!wished ? "Removed from wishlist" : "Added to wishlist ♥")
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
          alt={product.imgAlt}
          className={imgLoaded ? "loaded" : ""}
          onLoad={() => setImgLoaded(true)}
        />

        {/* Badge */}
        {product.badge && (
          <span className={badgeClass}>{product.badge}</span>
        )}

        {/* Quick Personalize Button */}
        <button className="quick-add" onClick={handlePersonalize}>
          <span className="desktop-only">⚙ Personalize &amp; Price</span>
          <span className="mobile-only">Configure &amp; Dimensions</span>
        </button>
      </div>

      <div className="product-card-body">
        <div className="product-category">
          {product.category}
          <span className="desktop-only" style={{ marginLeft: "6px", color: "var(--gold-text)", fontSize: "0.68rem" }}>· Bespoke</span>
          <span className="mobile-only product-bespoke-tag">Atelier Sizing</span>
        </div>
        <div className="product-name">{product.name}</div>
        <div className="product-stars">
          {renderStars(product.rating)} <span>({product.reviews})</span>
        </div>
        <div className="product-price-row">
          <span className="product-price">
            From {product.price.toLocaleString()} MAD
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
        aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
      >
        <Heart size={19} fill={wished ? "currentColor" : "none"} strokeWidth={2} />
      </button>
    </article>
  )
}
