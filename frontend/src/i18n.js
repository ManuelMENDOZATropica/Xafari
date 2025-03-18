import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector) // Detecta idioma del navegador
  .use(initReactI18next)
  .init({
    resources: {
        es: {
          translation: {
            welcome: "Descubre todas las sorpresas y aventuras que Xcaret México tiene para ti y tu familia.",
            newAdventure: "Empieza nueva aventura",
            alreadyUser: "Ya soy usuario",
            whatIsXafari: "¿Qué es Xafari?",
            xafariDescription: "Xafari es una experiencia interactiva dentro del Hotel Xcaret México donde los huéspedes pueden explorar, descubrir secretos y ganar recompensas a través de dinámicas gamificadas.",
            language: "Idioma",
            close: "Cerrar"
          }
        },
        en: {
          translation: {
            welcome: "Discover all the surprises and adventures that Xcaret México has for you and your family.",
            newAdventure: "Start a new adventure",
            alreadyUser: "I am already a user",
            whatIsXafari: "What is Xafari?",
            xafariDescription: "Xafari is an interactive experience inside Hotel Xcaret México where guests can explore, discover secrets, and earn rewards through gamified dynamics.",
            language: "Language",
            close: "Close"
          }
        }
      }
      ,
    fallbackLng: "es", // Idioma por defecto
    interpolation: { escapeValue: false },
  });

export default i18n;
