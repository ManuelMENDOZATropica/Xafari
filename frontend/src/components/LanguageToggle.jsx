import { useTranslation } from "react-i18next";

const SUPPORTED_LANGUAGES = ["es", "en", "pt"];
const LANGUAGE_FLAGS = {
  es: "🇪🇸",
  en: "🇺🇸",
  pt: "🇧🇷",
};

export default function LanguageToggle({ className = "bg-white" }) {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language?.split("-")[0] ?? "es";

  const handleClick = () => {
    const currentIndex = SUPPORTED_LANGUAGES.indexOf(currentLanguage);
    const nextLanguage =
      SUPPORTED_LANGUAGES[(currentIndex + 1) % SUPPORTED_LANGUAGES.length];

    i18n.changeLanguage(nextLanguage);
  };

  const baseClasses =
    "px-4 py-2 text-sm text-gray-800 rounded-full border border-gray-200 shadow-md hover:bg-gray-100 transition-all";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${baseClasses} ${className}`}
    >
      <span className="sr-only">{t("language")}</span>
      <span className="flex items-center gap-1 text-lg">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <span
            key={lang}
            aria-hidden
            className={
              lang === currentLanguage ? "opacity-100" : "opacity-40"
            }
          >
            {LANGUAGE_FLAGS[lang]}
          </span>
        ))}
      </span>
    </button>
  );
}
