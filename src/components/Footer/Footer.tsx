import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Instagram, Facebook, Phone, MapPin, MessageCircle } from "lucide-react"

export default function Footer() {
  const { t } = useTranslation("footer")
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setEmail("")
    setTimeout(() => setSubmitted(false), 3000)
  }

  const handleCategoryClick = (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <footer>
      <div className="footer-grid">
        {/* Brand */}
        <div>
          <p className="footer-brand-name">مفروشات عبداللطيف</p>
          <p className="footer-brand-desc">
            {t("brandDesc")}
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
          <h3 className="footer-col-title">{t("shopTitle")}</h3>
          <ul className="footer-links">
            <li><a href="#shop" onClick={handleCategoryClick}>{t("allProducts")}</a></li>
            <li><a href="#shop" onClick={handleCategoryClick}>{t("moroccanSalons")}</a></li>
            <li><a href="#shop" onClick={handleCategoryClick}>{t("mattresses")}</a></li>
            <li><a href="#shop" onClick={handleCategoryClick}>{t("chairsSofas")}</a></li>
            <li><a href="#shop" onClick={handleCategoryClick}>{t("accessories")}</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="footer-col-title">{t("contactUs")}</h3>
          <ul className="footer-links">
            <li>
              <a href="tel:+212666896776" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Phone size={13} /> 0666 896 776
              </a>
            </li>
            <li>
              <a href="https://wa.me/212666896776" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--wa)" }}>
                <MessageCircle size={13} /> {t("whatsapp")}
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/abdellatif_elfouissi" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Instagram size={13} /> @abdellatif_elfouissi
              </a>
            </li>
            <li>
              <span style={{ display: "flex", alignItems: "center", gap: "8px", opacity: .65 }}>
                <MapPin size={13} /> {t("address")}
              </span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="footer-col-title">{t("newsletter")}</h3>
          <p className="footer-brand-desc">{t("newsletterDesc")}</p>
          <form onSubmit={handleSubmit} className="footer-newsletter-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={t("newsletterPlaceholder")}
              className="footer-newsletter-input"
              aria-label="Newsletter email"
            />
            <button type="submit" className="footer-newsletter-btn">
              {submitted ? "✓" : t("newsletterJoin")}
            </button>
          </form>
          {submitted && (
            <p style={{ fontSize: ".74rem", color: "var(--gold)", marginTop: "8px" }}>
              {t("newsletterSuccess")} شكراً
            </p>
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} مفروشات عبداللطيف — {t("copyright")}</p>
        <p>{t("addressFull")}</p>
      </div>
    </footer>
  )
}
