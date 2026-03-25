"use client"

import { useEffect, useState } from "react"

interface HeroProps {
  onShopClick: () => void
}

export default function Hero({ onShopClick }: HeroProps) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const t = requestAnimationFrame(() => setAnimate(true))
    return () => cancelAnimationFrame(t)
  }, [])

  return (
    <section className={`hero${animate ? " hero-animate" : ""}`}>
      <div className="hero-text">
        <span className="hero-eyebrow">Tanger, Morocco · Since 1998</span>
        <h1 className="hero-title">
          Your Home Deserves <em>True</em> Luxury
        </h1>
        <p className="hero-desc">
          Premium Moroccan salons, custom mattresses, and fine upholstery — handcrafted in Tanger by
          <strong style={{ color: "var(--gold)", fontWeight: 600 }}> مفروشات عبداللطيف</strong>.
          Quality you can feel, comfort that lasts a lifetime.
        </p>

        <div className="hero-actions">
          <button onClick={onShopClick} className="btn-primary">
            Browse Collection
          </button>
          <a href="https://wa.me/212666896776" target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp Us
          </a>
        </div>

        <div className="hero-stats">
          <div>
            <p className="stat-num">650+</p>
            <p className="stat-label">Products Listed</p>
          </div>
          <div>
            <p className="stat-num">2.4K</p>
            <p className="stat-label">Happy Customers</p>
          </div>
          <div>
            <p className="stat-num">25yr</p>
            <p className="stat-label">Of Craftsmanship</p>
          </div>
        </div>
      </div>

      <div className="hero-image">
        <img
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=85"
          alt="Luxury Moroccan salon sofa set in a beautifully decorated living room"
        />
        <div className="hero-badge">
          <p className="hero-badge-label">📍 Location</p>
          <p className="hero-badge-val">Sidi Deris, Tanger</p>
        </div>
      </div>
    </section>
  )
}
