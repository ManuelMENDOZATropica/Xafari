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
import introEs from "./locales/es/intro.json";
import legalEs from "./locales/es/legal.json";

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
import introEn from "./locales/en/intro.json";
import legalEn from "./locales/en/legal.json";

// Portugués
import globalPt from "./locales/pt/global.json";
import loginPt from "./locales/pt/login.json";
import homePt from "./locales/pt/home.json";
import registerPt from "./locales/pt/register.json";
import avatarPt from "./locales/pt/avatar.json";
import xecretosPt from "./locales/pt/xecretos.json";
import experienciasPt from "./locales/pt/experiencias.json";
import copyPt from "./locales/pt/copy.json";
import checklistPt from "./locales/pt/checklist.json";
import introPt from "./locales/pt/intro.json";
import legalPt from "./locales/pt/legal.json";

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
          ...introEs,
          ...legalEs
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
          ...introEn,
          ...legalEn
        },
      },
      pt: {
        translation: {
          ...globalPt,
          ...loginPt,
          ...homePt,
          ...registerPt,
          ...avatarPt,
          ...xecretosPt,
          ...experienciasPt,
          ...copyPt,
          ...checklistPt,
          ...introPt,
          ...legalPt,
        },
      },
    },
    fallbackLng: "es",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
