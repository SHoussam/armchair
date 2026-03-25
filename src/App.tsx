import { useRef, useState } from "react"
import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import FeaturesBanner from "@/components/FeaturesBanner"
import ProductGrid from "@/components/ProductGrid"
import CartDrawer from "@/components/CartDrawer"
import ProductModal from "@/components/ProductModal"
import SearchBar from "@/components/SearchBar"
import Footer from "@/components/Footer"
import Toast from "@/components/Toast"
import { CartProvider } from "@/context/CartContext"
import { Product } from "@/data/products"

function ShopPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const shopRef = useRef<HTMLDivElement>(null)

  const scrollToShop = () => {
    shopRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleCloseSearch = () => {
    setSearchOpen(false)
    setSearchQuery("")
  }

  return (
    <div className="min-h-screen">
      <Navbar onSearchClick={() => setSearchOpen(true)} />

      <main>
        <Hero onShopClick={scrollToShop} />

        <FeaturesBanner />

        <div ref={shopRef}>
          <ProductGrid
            searchQuery={searchQuery}
            onViewDetail={(product) => setSelectedProduct(product)}
          />
        </div>

        {/* Testimonials */}
        <section id="testimonials">
          <div className="section-header">
            <p className="section-eyebrow">Customer Reviews</p>
            <h2 className="section-title">Loved Across Tanger</h2>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-quote">"</div>
              <p className="testimonial-text">
                The Moroccan salon we ordered is absolutely stunning. The quality of the fabric and the wood craftsmanship is exceptional. Delivered on time and perfectly fitted. شكراً جزيلاً!
              </p>
              <div className="testimonial-author">
                <div>
                  <div className="testimonial-name">Fatima B.</div>
                  <div className="testimonial-role">Tanger, Morocco</div>
                  <div className="testimonial-stars">★★★★★</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-quote">"</div>
              <p className="testimonial-text">
                I bought the Ortho Comfort mattress and it completely changed my sleep. After years of back pain, I finally wake up refreshed. Highly recommend مفروشات عبداللطيف.
              </p>
              <div className="testimonial-author">
                <div>
                  <div className="testimonial-name">Karim M.</div>
                  <div className="testimonial-role">Tetouan, Morocco</div>
                  <div className="testimonial-stars">★★★★★</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-quote">"</div>
              <p className="testimonial-text">
                Best furniture shop in Tanger without a doubt. The team was helpful on WhatsApp from day one and helped me choose the perfect salon for my living room. Very professional!
              </p>
              <div className="testimonial-author">
                <div>
                  <div className="testimonial-name">Nadia H.</div>
                  <div className="testimonial-role">Sidi Deris, Tanger</div>
                  <div className="testimonial-stars">★★★★★</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map + Contact section */}
        <section className="contact-section">
          <div className="contact-grid">
            <div className="contact-info">
              <p className="section-eyebrow" style={{ justifyContent: "flex-start" }}>Visit Us</p>
              <h2 className="contact-title">Find Us in Tanger</h2>
              <p className="contact-desc">
                Come visit our showroom to see our full collection of Moroccan salons, mattresses, and furnishings in person.
              </p>
              <div className="contact-details">
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <span>Sidi Deris, Tanger 9000, Morocco</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <a href="tel:+212666896776">0666 896 776</a>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">💬</span>
                  <a href="https://wa.me/212666896776" target="_blank" rel="noopener noreferrer">
                    WhatsApp: 0666 896 776
                  </a>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📸</span>
                  <a href="https://www.instagram.com/abdellatif_elfouissi" target="_blank" rel="noopener noreferrer">
                    @abdellatif_elfouissi
                  </a>
                </div>
              </div>
            </div>
            <div className="contact-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13192.553076219254!2d-5.8285!3d35.7595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd0b875cf4034d07%3A0x3f2424fd26acf8b6!2sSidi%20Deris%2C%20Tanger!5e0!3m2!1sen!2sma!4v1680000000000"
                width="100%" height="100%" style={{ border: 0, borderRadius: "12px", minHeight: "260px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="مفروشات عبداللطيف location in Tanger"
              />
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="cta-banner">
          <h2>Transform Your Home Today</h2>
          <p>
            Browse our collection of premium Moroccan salons, mattresses, and furnishings. Contact us on WhatsApp for a free consultation and custom quotes.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-white" onClick={scrollToShop}>
              Browse Collection
            </button>
            <a href="https://wa.me/212666896776" target="_blank" rel="noopener noreferrer" className="btn-whatsapp-cta">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </section>
      </main>

      <Footer />

      <CartDrawer />
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      <SearchBar
        isOpen={searchOpen}
        query={searchQuery}
        onChange={setSearchQuery}
        onClose={handleCloseSearch}
        onSelectProduct={(product: Product) => {
          setSelectedProduct(product)
        }}
      />
      <Toast />

      {/* Floating WhatsApp button */}
      <a
        href="https://wa.me/212666896776"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="Contact us on WhatsApp"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  )
}

export default function App() {
  return (
    <CartProvider>
      <ShopPage />
    </CartProvider>
  )
}