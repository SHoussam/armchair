import { useState, useEffect, useRef } from "react"
import { Search, Heart, Clock, User, LogIn, UserPlus, X, Menu, Home, LayoutGrid, ShoppingBag, LogOut, Sun, Moon } from "lucide-react"
import { Product, products as defaultProducts, fetchProducts } from "@/data/data"
import { useCart } from "@/context/CartContext"
import { useTheme } from "@/context/ThemeContext"
import { useAuth } from "@/context/AuthContext"

interface NavbarProps {
  isAuthenticated: boolean
  searchQuery?: string
  onSearchChange?: (q: string) => void
  onSelectProduct?: (product: Product) => void
  onAuthClick?: (tab: "login" | "signup") => void
  onOrdersClick?: () => void
  onAccountClick?: () => void
  onWishlistClick?: () => void
  onCartClick?: () => void
  onCatalogClick?: () => void
}

export default function Navbar({
  isAuthenticated,
  searchQuery = "",
  onSearchChange,
  onSelectProduct,
  onAuthClick,
  onOrdersClick,
  onAccountClick,
  onWishlistClick,
  onCartClick,
  onCatalogClick
}: NavbarProps) {
  const { totalItems, state: cartState } = useCart()
  const { theme, toggleTheme } = useTheme()
  const { logout } = useAuth()
  const [searchTerm, setSearchTerm] = useState(searchQuery)
  const [isFocused, setIsFocused] = useState(false)
  const [productList, setProductList] = useState<Product[]>(defaultProducts)
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false)
  const lastScrollY = useRef(0)

  // Sync external search query
  useEffect(() => {
    setSearchTerm(searchQuery)
  }, [searchQuery])

  // Fetch live products for autocomplete
  useEffect(() => {
    let isMounted = true
    fetchProducts().then((prods) => {
      if (isMounted && prods && prods.length > 0) {
        setProductList(prods)
      }
    })
    return () => { isMounted = false }
  }, [])

  // Filter live search results as user types
  useEffect(() => {
    const q = searchTerm.toLowerCase().trim()
    if (!q) {
      setSearchResults([])
      return
    }
    const matches = productList.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.desc && p.desc.toLowerCase().includes(q))
    )
    setSearchResults(matches)
  }, [searchTerm, productList])

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsFocused(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Mobile: scroll-up to reveal search bar
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      if (currentY < 80) {
        setMobileSearchVisible(true)
      } else if (currentY > lastScrollY.current + 10) {
        setMobileSearchVisible(false)
      }
      lastScrollY.current = currentY
    }
    setMobileSearchVisible(window.scrollY < 80)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [drawerOpen])

  const handleInputChange = (val: string) => {
    setSearchTerm(val)
    onSearchChange?.(val)
  }

  const handleClear = () => {
    setSearchTerm("")
    onSearchChange?.("")
  }

  const handleProductClick = (product: Product) => {
    setIsFocused(false)
    onSelectProduct?.(product)
  }

  return (
    <header className="top-navbar">
      <div className="top-navbar-container flex items-center justify-between">
        
        {/* Left: Hamburger (mobile) + Brand */}
        <div className="navbar-left flex items-center">
          <button
            type="button"
            className="navbar-hamburger"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <a
            href={import.meta.env.BASE_URL || "/armchair/"}
            className="navbar-brand flex items-center"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <span className="navbar-logo-badge">M</span>
            <span className="navbar-brand-name">
              مفروشات <strong>عبد اللطيف</strong>
            </span>
          </a>
        </div>

        {/* Center: Real In-Bar Search (desktop only via CSS) */}
        <div className={`navbar-center flex items-center justify-center ${!isAuthenticated ? "expanded" : "compact"}`}>
          <div className="navbar-search-wrapper" ref={searchContainerRef}>
            <div className="navbar-search-bar">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                className="navbar-search-input"
                placeholder="Search armchairs, salons, mattresses..."
                value={searchTerm}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                aria-label="Search products"
              />
              {searchTerm && (
                <button
                  type="button"
                  className="navbar-search-clear"
                  onClick={handleClear}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* In-bar search suggestions dropdown */}
            {isFocused && searchTerm.trim().length > 0 && (
              <div className="navbar-search-dropdown">
                {searchResults.length > 0 ? (
                  <div className="navbar-search-results">
                    {searchResults.slice(0, 5).map((product) => (
                      <div
                        key={product.id}
                        className="navbar-search-item"
                        role="button"
                        tabIndex={0}
                        onClick={() => handleProductClick(product)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleProductClick(product);
                          }
                        }}
                        aria-label={product.name}
                      >
                        <img src={product.img} alt={product.imgAlt || product.name} className="navbar-search-thumb" />
                        <div className="navbar-search-item-info">
                          <div className="navbar-search-item-name">{product.name}</div>
                          <div className="navbar-search-item-meta">
                            <span className="navbar-search-item-cat">{product.category}</span>
                            <span className="navbar-search-item-price">MAD {product.price?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="navbar-search-empty">
                    No furniture found for "{searchTerm}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="navbar-right flex items-center">
          {/* Dark / Light Mode Switcher */}
          <button
            type="button"
            className="nav-icon-btn theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Desktop Cart Button */}
          <button
            type="button"
            className="nav-cart-btn flex items-center"
            onClick={onCartClick}
            aria-label={`Shopping cart with ${totalItems} items`}
          >
            <ShoppingBag size={18} />
            <span className="nav-cart-label">Cart</span>
            {totalItems > 0 && <span className="nav-badge">{totalItems}</span>}
          </button>

          {!isAuthenticated ? (
            /* Visitor State */
            <div className="visitor-actions flex items-center">
              <button 
                type="button"
                onClick={() => onAuthClick?.("login")}
                className="btn-login flex items-center"
              >
                <LogIn size={16} />
                <span>Log In</span>
              </button>
              <button 
                type="button"
                onClick={() => onAuthClick?.("signup")}
                className="btn-signup flex items-center"
              >
                <UserPlus size={16} />
                <span>Sign Up</span>
              </button>
            </div>
          ) : (
            /* Customer State */
            <div className="customer-actions flex items-center">
              <button 
                type="button"
                onClick={onWishlistClick}
                className="nav-item-btn flex items-center"
                aria-label="Wishlist"
              >
                <Heart size={18} />
                <span className="nav-item-label">Wishlist</span>
                {cartState.wishlist.length > 0 && (
                  <span className="nav-badge-pill">{cartState.wishlist.length}</span>
                )}
              </button>
              <button 
                type="button"
                onClick={onOrdersClick}
                className="nav-item-btn flex items-center" 
                aria-label="History"
              >
                <Clock size={18} />
                <span className="nav-item-label">History</span>
              </button>
              <div className="nav-divider" />
              <a 
                href={`${import.meta.env.BASE_URL || "/armchair/"}account`}
                onClick={(e) => {
                  e.preventDefault();
                  onAccountClick?.();
                }}
                className="btn-profile flex items-center"
              >
                <User size={17} />
                <span>Profile</span>
              </a>
            </div>
          )}
        </div>

      </div>

      {/* Mobile: Scroll-up Search Bar */}
      <div className={`mobile-search-reveal ${mobileSearchVisible ? "visible" : ""}`}>
        <div className="mobile-search-inner">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="mobile-search-input"
            placeholder="Search armchairs, salons, mattresses..."
            value={searchTerm}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            aria-label="Search products"
          />
          {searchTerm && (
            <button type="button" className="navbar-search-clear" onClick={handleClear} aria-label="Clear search">
              <X size={15} />
            </button>
          )}
        </div>
        {isFocused && searchTerm.trim().length > 0 && (
          <div className="mobile-search-dropdown">
            {searchResults.length > 0 ? (
              <div className="navbar-search-results">
                {searchResults.slice(0, 5).map((product) => (
                  <div
                    key={product.id}
                    className="navbar-search-item"
                    onClick={() => handleProductClick(product)}
                  >
                    <img src={product.img} alt={product.imgAlt || product.name} className="navbar-search-thumb" />
                    <div className="navbar-search-item-info">
                      <div className="navbar-search-item-name">{product.name}</div>
                      <div className="navbar-search-item-meta">
                        <span className="navbar-search-item-cat">{product.category}</span>
                        <span className="navbar-search-item-price">MAD {product.price?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="navbar-search-empty">No furniture found for "{searchTerm}"</div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Drawer Overlay */}
      {drawerOpen && <div className="mobile-drawer-overlay" onClick={() => setDrawerOpen(false)} />}

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${drawerOpen ? "open" : ""}`}>
        <div className="mobile-drawer-header">
          <span className="navbar-logo-badge">M</span>
          <span className="mobile-drawer-brand">مفروشات <strong>عبد اللطيف</strong></span>
          <button type="button" className="mobile-drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>
        <nav className="mobile-drawer-nav">
          <button className="mobile-drawer-item" onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setDrawerOpen(false) }}>
            <Home size={20} /> <span>Home</span>
          </button>
          <button className="mobile-drawer-item" onClick={() => {
            if (onCatalogClick) {
              onCatalogClick();
            } else {
              document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
            }
            setDrawerOpen(false);
          }}>
            <LayoutGrid size={20} /> <span>Catalog</span>
          </button>
          <button className="mobile-drawer-item" onClick={() => { onWishlistClick?.(); setDrawerOpen(false) }}>
            <Heart size={20} /> <span>Wishlist</span>
            {cartState.wishlist.length > 0 && <span className="mobile-drawer-badge">{cartState.wishlist.length}</span>}
          </button>
          <button className="mobile-drawer-item" onClick={() => { onCartClick?.(); setDrawerOpen(false) }}>
            <ShoppingBag size={20} /> <span>Cart</span>
            {totalItems > 0 && <span className="mobile-drawer-badge">{totalItems}</span>}
          </button>
          <button className="mobile-drawer-item" onClick={() => { onOrdersClick?.(); setDrawerOpen(false) }}>
            <Clock size={20} /> <span>History</span>
          </button>
          <button className="mobile-drawer-item" onClick={toggleTheme}>
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </button>
          <div className="mobile-drawer-divider" />
          {isAuthenticated ? (
            <>
              <button className="mobile-drawer-item" onClick={() => { onAccountClick?.(); setDrawerOpen(false) }}>
                <User size={20} /> <span>Account</span>
              </button>
              <button className="mobile-drawer-item" onClick={() => { logout(); setDrawerOpen(false) }}>
                <LogOut size={20} /> <span>Log Out</span>
              </button>
            </>
          ) : (
            <>
              <button className="mobile-drawer-item" onClick={() => { onAuthClick?.("login"); setDrawerOpen(false) }}>
                <LogIn size={20} /> <span>Log In</span>
              </button>
              <button className="mobile-drawer-item primary" onClick={() => { onAuthClick?.("signup"); setDrawerOpen(false) }}>
                <UserPlus size={20} /> <span>Sign Up</span>
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
