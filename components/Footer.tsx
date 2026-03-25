"use client"

import { useState } from "react"
import { Instagram, Facebook, Phone, MapPin, MessageCircle } from "lucide-react"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setEmail("")
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <footer>
      <div className="footer-grid">
        {/* Brand */}
        <div>
          <p className="footer-brand-name">مفروشات عبداللطيف</p>
          <p className="footer-brand-desc">
            Premium Moroccan salons, mattresses, and home furnishings — handcrafted with passion in Tanger since 1998.
            Visit us or reach out on WhatsApp for a free consultation.
          </p>
          <div className="footer-social">
            <a
              href="https://www.instagram.com/abdellatif_elfouissi"
              target="_blank" rel="noopener noreferrer"
              className="social-link" aria-label="Instagram"
            >
              <Instagram size={15} />
            </a>
            <a
              href="https://www.facebook.com/مفروشاتعبداللطيف"
              target="_blank" rel="noopener noreferrer"
              className="social-link" aria-label="Facebook"
            >
              <Facebook size={15} />
            </a>
            <a
              href="https://wa.me/212666896776"
              target="_blank" rel="noopener noreferrer"
              className="social-link social-whatsapp" aria-label="WhatsApp"
            >
              <MessageCircle size={15} />
            </a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h3 className="footer-col-title">Shop</h3>
          <ul className="footer-links">
            <li><a href="#">All Products</a></li>
            <li><a href="#">Moroccan Salons</a></li>
            <li><a href="#">Mattresses</a></li>
            <li><a href="#">Chairs &amp; Sofas</a></li>
            <li><a href="#">Accessories</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="footer-col-title">Contact Us</h3>
          <ul className="footer-links">
            <li>
              <a href="tel:+212666896776" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Phone size={13} /> 0666 896 776
              </a>
            </li>
            <li>
              <a href="https://wa.me/212666896776" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "8px", color: "#25D366" }}>
                <MessageCircle size={13} /> WhatsApp
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/abdellatif_elfouissi" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Instagram size={13} /> @abdellatif_elfouissi
              </a>
            </li>
            <li>
              <span style={{ display: "flex", alignItems: "center", gap: "8px", opacity: .65 }}>
                <MapPin size={13} /> Sidi Deris, Tanger 9000
              </span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="footer-col-title">Newsletter</h3>
          <p className="footer-brand-desc">Get notified about new collections and exclusive offers.</p>
          <form onSubmit={handleSubmit} className="footer-newsletter-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
              className="footer-newsletter-input"
              aria-label="Newsletter email"
            />
            <button type="submit" className="footer-newsletter-btn">
              {submitted ? "✓" : "Join"}
            </button>
          </form>
          {submitted && (
            <p style={{ fontSize: ".74rem", color: "var(--gold)", marginTop: "8px" }}>
              Welcome to the family! شكراً
            </p>
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} مفروشات عبداللطيف — Abdellatif Furnishings. All rights reserved.</p>
        <p>Sidi Deris, Tanger 9000, Morocco</p>
      </div>
    </footer>
  )
}
