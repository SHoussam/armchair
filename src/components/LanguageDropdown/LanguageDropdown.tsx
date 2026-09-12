import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { setLanguage } from "@/locales/i18n/config";

export default function LanguageDropdown() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "en", label: "EN", fullLabel: "English" },
    { code: "fr", label: "FR", fullLabel: "Français" },
    { code: "ar", label: "AR", fullLabel: "العربية" },
  ];

  const current = languages.find((l) => l.code === i18n.language) || languages[0];

  const handleSelect = (code: string) => {
    setLanguage(code);
    setOpen(false);
  };

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="lang-dropdown-wrap" style={{ position: "relative", display: "inline-flex" }}>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Select language"
        aria-expanded={open}
        style={{
          background: "rgba(120, 120, 128, 0.08)",
          border: "none",
          color: "var(--fg, #221d16)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          padding: "8px 10px",
          borderRadius: "100px",
          fontSize: "0.78rem",
          fontWeight: 600,
          fontFamily: "inherit",
          lineHeight: 1,
          transition: "background 0.2s",
        }}
      >
        <Globe size={16} />
        <span>{current.label}</span>
        <ChevronDown size={12} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>
      {open && (
        <div
          ref={menuRef}
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            background: "var(--surface, #fff)",
            border: "1px solid var(--border-soft, rgba(0,0,0,0.1))",
            borderRadius: "12px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            minWidth: "130px",
            zIndex: 1200,
            padding: "4px 0",
            overflow: "hidden",
          }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleSelect(lang.code)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "100%",
                textAlign: "left",
                padding: "10px 14px",
                background: lang.code === i18n.language ? "rgba(176, 141, 62, 0.1)" : "none",
                border: "none",
                color: "var(--fg, #221d16)",
                fontSize: "0.85rem",
                cursor: "pointer",
                fontWeight: lang.code === i18n.language ? 700 : 400,
                fontFamily: "inherit",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => {
                if (lang.code !== i18n.language) {
                  e.currentTarget.style.background = "rgba(120, 120, 128, 0.06)";
                }
              }}
              onMouseLeave={(e) => {
                if (lang.code !== i18n.language) {
                  e.currentTarget.style.background = "none";
                }
              }}
            >
              <span style={{ fontWeight: 700, fontSize: "0.75rem", color: "var(--fg-dim)", minWidth: "22px" }}>{lang.label}</span>
              <span>{lang.fullLabel}</span>
              {lang.code === i18n.language && (
                <span style={{ marginLeft: "auto", color: "var(--gold, #b08d3e)", fontSize: "0.75rem" }}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
