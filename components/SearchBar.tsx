"use client"

import { useState, useEffect, useRef } from "react"
import { products, Product } from "@/data/products"

interface SearchBarProps {
  isOpen: boolean
  query: string
  onChange: (q: string) => void
  onClose: () => void
  onSelectProduct: (product: Product) => void
}

export default function SearchBar({ isOpen, query, onChange, onClose, onSelectProduct }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [results, setResults] = useState<Product[]>([])

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100)
  }, [isOpen])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose])

  useEffect(() => {
    const q = query.toLowerCase().trim()
    if (!q) {
      setResults([])
      return
    }
    const matches = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q)
    )
    setResults(matches)
  }, [query])

  if (!isOpen) return null

  const handleSelectProduct = (product: Product) => {
    onClose()
    onSelectProduct(product)
  }

  return (
    <div
      className="search-overlay open"
      role="dialog"
      aria-label="Search products"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="search-box">
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          className="search-input"
          type="text"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search armchairs…"
          aria-label="Search products"
        />
        <button className="search-close" onClick={onClose} aria-label="Close search">
          ✕
        </button>
      </div>

      <div className="search-results" id="searchResults">
        {query.trim() && results.length === 0 && (
          <div className="search-empty">
            No results found.
          </div>
        )}
        {results.map((p) => (
          <div
            key={p.id}
            className="search-result-item"
            onClick={() => handleSelectProduct(p)}
          >
            <img className="search-result-img" src={p.img} alt={p.imgAlt} />
            <div>
              <div className="search-result-name">{p.name}</div>
                <div className="search-result-price">${p.price.toLocaleString()} / m</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
