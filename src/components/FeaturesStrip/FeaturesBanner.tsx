import { Truck, RotateCcw, ShieldCheck, Star, Ruler, Hammer, Sparkles, MapPin } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useAutoScrollOnMobile } from "@/hooks/useAutoScrollOnMobile"

export default function FeaturesBanner() {
  const { t } = useTranslation("features")
  const scrollRef = useAutoScrollOnMobile<HTMLElement>(3200)

  return (
    <section className="features-strip" ref={scrollRef}>
      {/* ── DESKTOP ONLY ITEMS (Unchanged) ── */}
      <div className="feature-item desktop-only">
        <div className="feature-icon-wrap">
          <Truck size={18} />
        </div>
        <div>
          <p className="feature-text-title">{t("deliveryTitle")}</p>
          <p className="feature-text-sub">{t("deliverySub")}</p>
        </div>
      </div>

      <div className="feature-item desktop-only">
        <div className="feature-icon-wrap">
          <RotateCcw size={18} />
        </div>
        <div>
          <p className="feature-text-title">{t("returnsTitle")}</p>
          <p className="feature-text-sub">{t("returnsSub")}</p>
        </div>
      </div>

      <div className="feature-item desktop-only">
        <div className="feature-icon-wrap">
          <ShieldCheck size={18} />
        </div>
        <div>
          <p className="feature-text-title">{t("qualityTitle")}</p>
          <p className="feature-text-sub">{t("qualitySub")}</p>
        </div>
      </div>

      <div className="feature-item desktop-only">
        <div className="feature-icon-wrap">
          <Star size={18} />
        </div>
        <div>
          <p className="feature-text-title">{t("customTitle")}</p>
          <p className="feature-text-sub">{t("customSub")}</p>
        </div>
      </div>

      {/* ── MOBILE ONLY ATELIER ITEMS (/frontend-design) ── */}
      <div className="feature-item mobile-only feature-item--mobile">
        <div className="feature-icon-wrap feature-icon-wrap--mobile">
          <MapPin size={17} />
        </div>
        <div>
          <p className="feature-text-title">{t("atelierTitle")}</p>
          <p className="feature-text-sub">{t("atelierSub")}</p>
        </div>
      </div>

      <div className="feature-item mobile-only feature-item--mobile">
        <div className="feature-icon-wrap feature-icon-wrap--mobile">
          <Ruler size={17} />
        </div>
        <div>
          <p className="feature-text-title">{t("precisionTitle")}</p>
          <p className="feature-text-sub">{t("precisionSub")}</p>
        </div>
      </div>

      <div className="feature-item mobile-only feature-item--mobile">
        <div className="feature-icon-wrap feature-icon-wrap--mobile">
          <Sparkles size={17} />
        </div>
        <div>
          <p className="feature-text-title">{t("foamTitle")}</p>
          <p className="feature-text-sub">{t("foamSub")}</p>
        </div>
      </div>

      <div className="feature-item mobile-only feature-item--mobile">
        <div className="feature-icon-wrap feature-icon-wrap--mobile">
          <Truck size={17} />
        </div>
        <div>
          <p className="feature-text-title">{t("whiteGloveTitle")}</p>
          <p className="feature-text-sub">{t("whiteGloveSub")}</p>
        </div>
      </div>
    </section>
  )
}
