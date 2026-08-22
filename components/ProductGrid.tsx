"use client"

import { useState, useRef, useEffect } from "react"
import { products, categories, Product } from "@/data/products"
import ProductCard from "./ProductCard"

interface ProductGridProps {
  searchQuery: string
  onViewDetail: (product: Product) => void
}

type SortOption = "featured" | "price-asc" | "price-desc" | "rating"

export default function ProductGrid({ searchQuery, onViewDetail }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState("All")
  const [sortBy, setSortBy] = useState<SortOption>("featured")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [catSearch, setCatSearch] = useState("")
  const sectionRef = useRef<HTMLElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filtered = products
    .filter((p) => {
      const matchesCategory =
        activeCategory === "All" || p.category.toLowerCase() === activeCategory.toLowerCase()
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.desc.toLowerCase().includes(query)
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price
      if (sortBy === "price-desc") return b.price - a.price
      if (sortBy === "rating") return b.rating - a.rating
      return 0
    })

  const filteredCategories = categories.filter((cat) =>
    cat.toLowerCase().includes(catSearch.toLowerCase())
  )

  useEffect(() => {
    if (mobileOpen) {
      setCatSearch("")
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }
  }, [mobileOpen])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMobileOpen(false)
      }
    }
    if (mobileOpen) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [mobileOpen])

  const handleSelectCategory = (cat: string) => {
    setActiveCategory(cat)
    setMobileOpen(false)
  }

  return (
    <section id="shop" ref={sectionRef}>
      {/* Section header */}
      <div className="section-header">
        <p className="section-eyebrow">Our Selection</p>
        <h2 className="section-title">The Collection</h2>
        <p className="section-sub">Handcrafted armchairs — bespoke upholstery, made to order</p>
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        {/* Desktop tabs */}
        <div className="filter-tabs" id="filterTabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-tab ${activeCategory === cat ? "active" : ""}`}
              data-filter={cat.toLowerCase()}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Mobile dropdown trigger */}
        <div className="cat-dropdown-wrap" ref={dropdownRef}>
          <button
            className="cat-dropdown-trigger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Filter by category"
          >
            <span>{activeCategory}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {mobileOpen && (
            <div className="cat-dropdown-panel">
              <div className="cat-search-wrap">
                <svg className="cat-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  className="cat-search-input"
                  placeholder="Search category..."
                  value={catSearch}
                  onChange={(e) => setCatSearch(e.target.value)}
                />
              </div>
              <ul className="cat-list">
                {filteredCategories.length === 0 ? (
                  <li className="cat-item cat-empty">No match found</li>
                ) : (
                  filteredCategories.map((cat) => (
                    <li key={cat}>
                      <button
                        className={`cat-item ${activeCategory === cat ? "active" : ""}`}
                        onClick={() => handleSelectCategory(cat)}
                      >
                        {cat}
                        {activeCategory === cat && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        <select
          id="sortSelect"
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          aria-label="Sort products"
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <p className="section-title" style={{ fontSize: "1.4rem" }}>No chairs found.</p>
          <p className="section-sub" style={{ marginTop: "12px" }}>Try a different category or search term.</p>
        </div>
      ) : (
        <div className="product-grid" id="productGrid">
          {filtered.map((product, idx) => (
            <div
              key={product.id}
              style={{ animationDelay: `${idx * 0.06}s` }}
            >
              <ProductCard product={product} onViewDetail={onViewDetail} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
