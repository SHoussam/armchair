import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../en";
import fr from "../fr";
import ar from "../ar";

function getSystemLanguage(): string {
  const stored = localStorage.getItem("app-language");
  if (stored) return stored;

  const lang = navigator.language || navigator.languages?.[0] || "en";
  if (lang.startsWith("ar")) return "ar";
  if (lang.startsWith("fr")) return "fr";
  return "en";
}

const resources = {
  en,
  fr,
  ar,
};

i18n.use(initReactI18next).init({
  resources,
  lng: getSystemLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;

export const setLanguage = (lng: string) => {
  i18n.changeLanguage(lng);
  localStorage.setItem("app-language", lng);
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
};
