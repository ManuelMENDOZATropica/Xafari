import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Español
import globalEs from "./locales/es/global.json";
import loginEs from "./locales/es/login.json";
import homeEs from "./locales/es/home.json";
import registerEs from "./locales/es/register.json";
import avatarEs from "./locales/es/avatar.json";
import xecretosEs from "./locales/es/xecretos.json";
import experienciasEs from "./locales/es/experiencias.json";
import copyEs from "./locales/es/copy.json";
import checklistEs from "./locales/es/checklist.json";

// Inglés
import globalEn from "./locales/en/global.json";
import loginEn from "./locales/en/login.json";
import homeEn from "./locales/en/home.json";
import registerEn from "./locales/en/register.json";
import avatarEn from "./locales/en/avatar.json";
import xecretosEn from "./locales/en/xecretos.json";
import experienciasEn from "./locales/en/experiencias.json";
import copyEn from "./locales/en/copy.json";
import checklistEn from "./locales/en/checklist.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: {
        translation: {
          ...globalEs,
          ...loginEs,
          ...homeEs,
          ...registerEs,
          ...avatarEs,
          ...xecretosEs,
          ...experienciasEs,
          ...copyEs,
          ...checklistEs,
        },
      },
      en: {
        translation: {
          ...globalEn,
          ...loginEn,
          ...homeEn,
          ...registerEn,
          ...avatarEn,
          ...xecretosEn,
          ...experienciasEn,
          ...copyEn,
          ...checklistEn,
        },
      },
    },
    fallbackLng: "es",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
