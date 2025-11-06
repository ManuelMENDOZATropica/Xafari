import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Flag } from "lucide-react";

const SUPPORTED_LANGUAGES = ["es", "en", "pt"];
const LANGUAGE_FLAGS = {
  es: "🇪🇸",
  en: "🇺🇸",
  pt: "🇧🇷",
};

export default function LanguageToggle({ className = "bg-white" }) {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef(null);

  const currentLanguage = i18n.language?.split("-")[0] ?? "es";

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (toggleRef.current && !toggleRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (lang) => {
    i18n.changeLanguage(lang);
    setIsOpen(false);
  };

  const buttonClasses = `flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-800 shadow-md hover:bg-gray-100 transition-all ${className}`;

  return (
    <div ref={toggleRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={buttonClasses}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <Flag className="h-5 w-5" aria-hidden />
        <span className="sr-only">{t("language")}</span>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-2xl border border-gray-200 bg-white/90 p-2 shadow-lg backdrop-blur">
          <div className="flex flex-col" role="listbox">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => handleSelect(lang)}
                className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${
                  lang === currentLanguage
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                role="option"
                aria-selected={lang === currentLanguage}
              >
                <span aria-hidden className="text-lg">
                  {LANGUAGE_FLAGS[lang]}
                </span>
                <span>{t(`languages.${lang}`)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
