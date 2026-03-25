"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, Menu, X, Search } from "lucide-react"

import { useCart } from "@/context/CartContext"

interface NavbarProps {
  onSearchClick: () => void
}

export default function Navbar({ onSearchClick }: NavbarProps) {
  const { toggleCart, totalItems } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = ["Shop", "Salons", "Mattresses", "Contact"]

  return (
    <>
      <nav className={scrolled ? "scrolled" : ""}>
        <a href="#" className="nav-logo" aria-label="مفروشات عبداللطيف home">
         
           
           
          
          <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
            مفروشات <strong>عبداللطيف</strong>
          </span>
        </a>

        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link}>
              <a href="#">{link}</a>
            </li>
          ))}
        </ul>

        <div className="nav-right">
          <button onClick={onSearchClick} aria-label="Search products" className="nav-search-btn">
            <Search size={18} />
          </button>

          <button onClick={toggleCart} aria-label={`Shopping cart, ${totalItems} items`} className="cart-btn">
            <ShoppingBag size={19} />
            <span className="cart-badge" style={{ display: totalItems > 0 ? "flex" : "none" }}>
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          </button>

          <button className="hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation menu">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
        {navLinks.map((link) => (
          <a key={link} href="#" onClick={() => setMobileOpen(false)}>
            {link}
          </a>
        ))}
        <a href="https://wa.me/212666896776" target="_blank" rel="noopener noreferrer" style={{ color: "#25D366", fontWeight: 700 }}>
          📱 WhatsApp: 0666 896 776
        </a>
      </div>
    </>
  )
}
