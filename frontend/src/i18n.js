import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import es from "./locales/es/index.js";

// Español va en el bundle inicial (idioma por defecto y de respaldo);
// inglés y portugués se descargan solo si se usan.
const lazyLanguages = {
  en: () => import("./locales/en/index.js"),
  pt: () => import("./locales/pt/index.js"),
};

const lazyBackend = {
  type: "backend",
  init() {},
  read(language, namespace, callback) {
    const lang = language.split("-")[0];
    if (lang === "es") return callback(null, es);
    const loader = lazyLanguages[lang];
    if (!loader) return callback(null, {});
    loader()
      .then((mod) => callback(null, mod.default))
      .catch((err) => callback(err, null));
  },
};

i18n
  .use(lazyBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { es: { translation: es } },
    partialBundledLanguages: true,
    supportedLngs: ["es", "en", "pt"],
    nonExplicitSupportedLngs: true,
    load: "languageOnly",
    fallbackLng: "es",
    interpolation: {
      escapeValue: false,
    },
  });

// <html lang> sigue al idioma activo (lectores de pantalla, traducción automática).
i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = (lng || "es").split("-")[0];
});

export default i18n;
