"use client"

import { useState } from "react"
import { Product } from "@/data/products"
import { useCart } from "@/context/CartContext"

interface ProductCardProps {
  product: Product
  onViewDetail: (product: Product) => void
}

function renderStars(rating: number): string {
  return "★".repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? "½" : "")
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
    showToast(wished ? "Removed from wishlist" : "Added to wishlist ♥")
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

        {/* Wishlist */}
        <button
          className={`wishlist-btn ${wished ? "active" : ""}`}
          onClick={handleWishlist}
          aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          {wished ? "♥" : "♡"}
        </button>

        {/* Quick Personalize Button */}
        <button className="quick-add" onClick={handlePersonalize}>
          ⚙ Personalize & Price
        </button>
      </div>

      <div className="product-card-body">
        <div className="product-category">
          {product.category}
          <span style={{ marginLeft: "6px", color: "var(--gold)", fontSize: "0.68rem" }}>· Bespoke</span>
        </div>
        <div className="product-name">{product.name}</div>
        <div className="product-stars">
          {renderStars(product.rating)} <span>({product.reviews})</span>
        </div>
        <div className="product-price-row">
          <span className="product-price">
            From {product.price.toLocaleString()} DH
          </span>
          {product.oldPrice && (
            <span className="product-price-old">{product.oldPrice.toLocaleString()} DH</span>
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
    </article>
  )
}
