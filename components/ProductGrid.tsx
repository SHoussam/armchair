"use client"

import { useState, useRef } from "react"
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
  const sectionRef = useRef<HTMLElement>(null)

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
