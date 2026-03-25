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
  const { addItem, toggleCart, toggleWishlist, isWishlisted, showToast } = useCart()
  const [selectedColorIdx, setSelectedColorIdx] = useState(0)
  const [imgLoaded, setImgLoaded] = useState(false)

  const wished = isWishlisted(product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem(product, selectedColorIdx, {
      qty: 1,
      styleId: "standard",
      styleLabel: "Standard Weave",
      sizeMeters: 1,
      unitPrice: product.price,
    })
    showToast(`${product.name} added to cart`)
    toggleCart()
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

        {/* Quick Add */}
        <button className="quick-add" onClick={handleAddToCart}>
          + Add to Cart
        </button>
      </div>

      <div className="product-card-body">
        <div className="product-category">{product.category}</div>
        <div className="product-name">{product.name}</div>
        <div className="product-stars">
          {renderStars(product.rating)} <span>({product.reviews})</span>
        </div>
        <div className="product-price-row">
          <span className="product-price">${product.price.toLocaleString()} / m</span>
          {product.oldPrice && (
            <span className="product-price-old">${product.oldPrice.toLocaleString()}</span>
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
