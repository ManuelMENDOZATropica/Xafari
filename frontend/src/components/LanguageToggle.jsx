import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const SUPPORTED_LANGUAGES = ["es", "en", "pt"];
const LANGUAGE_FLAGS = {
  es: "🇪🇸",
  en: "🇺🇸",
  pt: "🇧🇷",
};

export default function LanguageToggle({ className = "" }) {
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

  // AJUSTES REALIZADOS:
  // 1. w-[60px] h-[60px]: Fuerza el tamaño exacto del botón.
  // 2. p-0: Elimina cualquier relleno interno que pueda encoger la imagen.
  // 3. bg-transparent: Asegura que no haya fondo blanco.
  const buttonClasses = `flex items-center justify-center w-[60px] h-[60px] p-0 border-none bg-transparent hover:opacity-90 active:scale-95 transition-transform ${className}`;

  return (
    <div ref={toggleRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={buttonClasses}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {/* IMAGEN AJUSTADA:
            - w-[60px] h-[60px]: Misma medida que el botón.
            - object-fill / object-cover: Asegura que llene todo el cuadrado. 
        */}
        <img 
          src="/iconos/cambioIdioma.png" 
          alt={t("language")} 
          className="w-[60px] h-[60px] object-cover block" 
          aria-hidden={true} 
        />
        <span className="sr-only">{t("language")}</span>
      </button>

      {isOpen && (
        // El menú se abre hacia arriba (bottom-full) porque el botón suele estar abajo
        <div className="absolute right-0 bottom-full mb-2 w-40 rounded-2xl border border-gray-200 bg-white/95 p-2 shadow-lg backdrop-blur z-50">
          <div className="flex flex-col" role="listbox">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => handleSelect(lang)}
                className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${
                  lang === currentLanguage
                    ? "bg-gray-100 text-gray-900 font-medium" 
                    : "bg-transparent text-gray-700 hover:bg-gray-50" 
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