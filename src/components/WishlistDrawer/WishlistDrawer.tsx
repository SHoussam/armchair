import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Heart, X, Trash2, ArrowRight } from "lucide-react"
import { Product, products as defaultProducts, fetchProducts, getLocalizedProductName, getLocalizedCategoryName } from "@/data/data"
import { useCart } from "@/context/CartContext"
import "./WishlistDrawer.css"

interface WishlistDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSelectProduct: (product: Product) => void
  onBrowseClick: () => void
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  onSelectProduct,
  onBrowseClick,
}: WishlistDrawerProps) {
  const { t, i18n } = useTranslation("wishlist")
  const { state, toggleWishlist, showToast } = useCart()
  const [productList, setProductList] = useState<Product[]>(defaultProducts)

  // Fetch product catalog for full metadata
  useEffect(() => {
    let isMounted = true
    fetchProducts().then((prods) => {
      if (isMounted && prods && prods.length > 0) {
        setProductList(prods)
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  const wishlistedProducts = productList.filter((p) => state.wishlist.includes(p.id))

  const handleRemove = (product: Product) => {
    toggleWishlist(product.id)
    const pName = getLocalizedProductName(product, i18n.language)
    showToast(`${pName} - ${t("remove")}`)
  }

  const handlePersonalize = (product: Product) => {
    onClose()
    onSelectProduct(product)
  }

  return (
    <>
      <div
        className={`wishlist-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`wishlist-drawer ${isOpen ? "open" : ""}`} aria-label={t("title")}>
        <div className="wishlist-header">
          <div className="wishlist-header-title">
            <Heart size={20} className="wishlist-heart-icon" />
            <h3>{t("title")} ({wishlistedProducts.length})</h3>
          </div>
          <button className="wishlist-close" onClick={onClose} aria-label={t("closeAria")}>
            <X size={20} />
          </button>
        </div>

        <div className="wishlist-items">
          {wishlistedProducts.length === 0 ? (
            <div className="wishlist-empty">
              <div className="wishlist-empty-icon">
                <Heart size={36} />
              </div>
              <div className="wishlist-empty-title">{t("emptyTitle")}</div>
              <p className="wishlist-empty-text">
                {t("emptyDesc")}
              </p>
              <button
                className="wishlist-explore-btn"
                onClick={() => {
                  onClose()
                  onBrowseClick()
                }}
              >
                {t("browseCollection")}
              </button>
            </div>
          ) : (
            wishlistedProducts.map((product) => {
              const productName = getLocalizedProductName(product, i18n.language)
              const categoryName = getLocalizedCategoryName(product.category, i18n.language, product.categoryAr, product.categoryFr)

              return (
                <div key={product.id} className="wishlist-card">
                  <img
                    src={product.img}
                    alt={product.imgAlt || productName}
                    className="wishlist-card-img"
                  />
                  <div className="wishlist-card-content">
                    <div>
                      <div className="wishlist-card-header">
                        <span className="wishlist-card-cat">{categoryName}</span>
                        <button
                          className="wishlist-card-remove"
                          onClick={() => handleRemove(product)}
                          aria-label={`${t("remove")} ${productName}`}
                          title={t("remove")}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <div className="wishlist-card-name" title={productName}>
                        {productName}
                      </div>
                      <div className="wishlist-card-price">
                        {t("from")} {product.price?.toLocaleString()} DH
                      </div>
                    </div>

                    <div className="wishlist-card-actions">
                      <button
                        className="wishlist-btn-order"
                        onClick={() => handlePersonalize(product)}
                      >
                        <span>{t("personalizeOrder")}</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </aside>
    </>
  )
}
