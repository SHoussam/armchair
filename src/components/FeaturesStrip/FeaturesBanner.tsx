import { Truck, RotateCcw, ShieldCheck, Star, Ruler, Hammer, Sparkles, MapPin } from "lucide-react"
import { useAutoScrollOnMobile } from "@/hooks/useAutoScrollOnMobile"

export default function FeaturesBanner() {
  const scrollRef = useAutoScrollOnMobile<HTMLElement>(3200)

  return (
    <section className="features-strip" ref={scrollRef}>
      {/* ── DESKTOP ONLY ITEMS (Unchanged) ── */}
      <div className="feature-item desktop-only">
        <div className="feature-icon-wrap">
          <Truck size={18} />
        </div>
        <div>
          <p className="feature-text-title">Delivery in Tanger</p>
          <p className="feature-text-sub">Free delivery on large orders</p>
        </div>
      </div>

      <div className="feature-item desktop-only">
        <div className="feature-icon-wrap">
          <RotateCcw size={18} />
        </div>
        <div>
          <p className="feature-text-title">Easy Returns</p>
          <p className="feature-text-sub">Hassle-free return policy</p>
        </div>
      </div>

      <div className="feature-item desktop-only">
        <div className="feature-icon-wrap">
          <ShieldCheck size={18} />
        </div>
        <div>
          <p className="feature-text-title">Quality Guaranteed</p>
          <p className="feature-text-sub">Premium materials only</p>
        </div>
      </div>

      <div className="feature-item desktop-only">
        <div className="feature-icon-wrap">
          <Star size={18} />
        </div>
        <div>
          <p className="feature-text-title">Custom Orders</p>
          <p className="feature-text-sub">Made-to-measure available</p>
        </div>
      </div>

      {/* ── MOBILE ONLY ATELIER ITEMS (/frontend-design) ── */}
      <div className="feature-item mobile-only feature-item--mobile">
        <div className="feature-icon-wrap feature-icon-wrap--mobile">
          <MapPin size={17} />
        </div>
        <div>
          <p className="feature-text-title">Atelier Sidi Deris</p>
          <p className="feature-text-sub">Workshop direct · Zero middlemen</p>
        </div>
      </div>

      <div className="feature-item mobile-only feature-item--mobile">
        <div className="feature-icon-wrap feature-icon-wrap--mobile">
          <Ruler size={17} />
        </div>
        <div>
          <p className="feature-text-title">Centimeter Precision</p>
          <p className="feature-text-sub">Custom sizing to your room layout</p>
        </div>
      </div>

      <div className="feature-item mobile-only feature-item--mobile">
        <div className="feature-icon-wrap feature-icon-wrap--mobile">
          <Sparkles size={17} />
        </div>
        <div>
          <p className="feature-text-title">35 kg/m³ HR Foam</p>
          <p className="feature-text-sub">High-resilience orthopaedic core</p>
        </div>
      </div>

      <div className="feature-item mobile-only feature-item--mobile">
        <div className="feature-icon-wrap feature-icon-wrap--mobile">
          <Truck size={17} />
        </div>
        <div>
          <p className="feature-text-title">Tanger White-Glove</p>
          <p className="feature-text-sub">Direct delivery &amp; in-home installation</p>
        </div>
      </div>
    </section>
  )
}
