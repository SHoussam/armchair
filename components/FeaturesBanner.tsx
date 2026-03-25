import { Truck, RotateCcw, ShieldCheck, Star } from "lucide-react"

export default function FeaturesBanner() {
  return (
    <section className="features-strip">
      <div className="feature-item">
        <div className="feature-icon-wrap">
          <Truck size={18} />
        </div>
        <div>
          <p className="feature-text-title">Delivery in Tanger</p>
          <p className="feature-text-sub">Free delivery on large orders</p>
        </div>
      </div>

      <div className="feature-item">
        <div className="feature-icon-wrap">
          <RotateCcw size={18} />
        </div>
        <div>
          <p className="feature-text-title">Easy Returns</p>
          <p className="feature-text-sub">Hassle-free return policy</p>
        </div>
      </div>

      <div className="feature-item">
        <div className="feature-icon-wrap">
          <ShieldCheck size={18} />
        </div>
        <div>
          <p className="feature-text-title">Quality Guaranteed</p>
          <p className="feature-text-sub">Premium materials only</p>
        </div>
      </div>

      <div className="feature-item">
        <div className="feature-icon-wrap">
          <Star size={18} />
        </div>
        <div>
          <p className="feature-text-title">Custom Orders</p>
          <p className="feature-text-sub">Made-to-measure available</p>
        </div>
      </div>
    </section>
  )
}
