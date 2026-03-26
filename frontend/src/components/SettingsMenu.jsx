import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import XafariContext from "./XafariContext";

const SUPPORTED_LANGUAGES = ["es", "en", "pt"];

const LANGUAGE_FLAGS = {
  es: "🇲🇽",
  en: "🇺🇸",
  pt: "🇧🇷",
};

const SOUND_OPTIONS = [
  { value: "full", labelKey: "soundFull", icon: "full" },
  { value: "medium", labelKey: "soundMedium", icon: "medium" },
  { value: "vibrate", labelKey: "soundVibrate", icon: "vibrate" },
  { value: "off", labelKey: "soundOff", icon: "off" },
];

const SOUND_ICONS = {
  full: (
    <img src="/iconos/icon_volumen3.svg" alt="Full Volume" className="h-6 w-6 object-contain" />
  ),
  medium: (
    <img src="/iconos/icon_volumen2.svg" alt="Medium Volume" className="h-6 w-6 object-contain" />
  ),
  vibrate: (
    <img src="/iconos/icon_volumen1.svg" alt="Vibrate" className="h-6 w-6 object-contain" />
  ),
  off: (
    <img src="/iconos/icon_volumen0.png" alt="Muted" className="h-6 w-6 object-contain" />
  ),
};

export default function SettingsMenu() {
  const { soundSetting, setSoundSetting, triggerClickFeedback } =
    useContext(XafariContext);
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const location = useLocation();

  const currentLanguage = useMemo(() => {
    return i18n.language?.split("-")[0] ?? "es";
  }, [i18n.language]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleOpenRequest = () => setIsOpen(true);

    window.addEventListener("open-settings-menu", handleOpenRequest);
    return () => {
      window.removeEventListener("open-settings-menu", handleOpenRequest);
    };
  }, []);

  const handleSoundSelect = (value) => {
    setSoundSetting(value);
    if (typeof triggerClickFeedback === "function") {
      triggerClickFeedback(value);
    }
  };

  const handleLanguageSelect = (lang) => {
    i18n.changeLanguage(lang);
  };

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const buttonLabel = isOpen
    ? t("settingsCloseLabel")
    : t("settingsOpenLabel");

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex flex-col items-end">
      <div className="pointer-events-auto relative" ref={containerRef}>
        <button
          type="button"
          onClick={toggleMenu}
          aria-haspopup="true"
          aria-expanded={isOpen}
          aria-label={buttonLabel}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-md border border-white/40 text-gray-600 shadow-lg p-0 transition-all hover:bg-white active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-300"
        >
          <img
            src="/iconos/icon_ajustes.svg"
            alt={buttonLabel}
            className="w-6 h-6 object-contain"
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-3 w-72 max-w-[90vw]">
            <div className="rounded-2xl border border-gray-300 bg-white/90 backdrop-blur-md shadow-xl">
              <div className="p-5">
                <div className="mb-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                    {t("settingsMenuTitle")}
                  </p>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t("settingsMenuSubtitle")}
                  </h2>
                </div>

                <div className="space-y-4">
                  <section
                    aria-label={t("settingsLanguageTitle")}
                    className="space-y-2"
                  >
                    <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">
                      {t("settingsLanguageTitle")}
                    </h3>

                    <div className="grid grid-cols-3 gap-2">
                      {SUPPORTED_LANGUAGES.map((lang) => {
                        const isActive = currentLanguage === lang;
                        return (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => handleLanguageSelect(lang)}
                            className={`flex flex-col items-center justify-center gap-1 rounded-full border py-2.5 transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 ${isActive
                              ? "border-emerald-500/50 bg-emerald-600/90 text-white shadow-lg scale-105"
                              : "border-gray-200 bg-gray-50/50 text-gray-700 hover:bg-gray-100"
                              }`}
                            aria-pressed={isActive}
                          >
                            <span className="text-xl" aria-hidden="true">
                              {LANGUAGE_FLAGS[lang]}
                            </span>
                            <span className="text-[8px] font-bold uppercase tracking-widest leading-none">
                              {t(`languages.${lang}`)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                  <section
                    aria-label={t("settingsSoundTitle")}
                    className="space-y-2"
                  >
                    <h3 className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">
                      {t("settingsSoundTitle")}
                    </h3>

                    <div role="radiogroup" className="space-y-2">
                      {SOUND_OPTIONS.map((option) => {
                        const isActive = soundSetting === option.value;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleSoundSelect(option.value)}
                            className={`flex w-full items-center justify-between rounded-full border px-4 py-2 transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 ${isActive
                              ? "border-emerald-500/50 bg-emerald-600/10 text-emerald-800 shadow-sm"
                              : "border-gray-200 bg-gray-50/30 text-gray-600 hover:bg-gray-100/50"
                              }`}
                            role="radio"
                            aria-checked={isActive}
                            aria-label={`${t("soundMenu")}: ${t(option.labelKey)}`}
                            data-skip-sound-click="true"
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${isActive ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"
                                  }`}
                                aria-hidden="true"
                              >
                                {SOUND_ICONS[option.icon]}
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-widest">
                                {t(option.labelKey)}
                              </span>
                            </div>

                            <span
                              aria-hidden="true"
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${isActive ? "bg-emerald-400" : "bg-slate-300"
                                }`}
                            >
                              <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${isActive ? "translate-x-5" : "translate-x-1"
                                  }`}
                              />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                  <Link
                    to="/privacy"
                    onClick={() => setIsOpen(false)}
                    className="flex h-10 items-center justify-center gap-2 rounded-full bg-white/50 border border-gray-300 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-800 shadow-sm backdrop-blur-md transition-all hover:bg-white/80 active:scale-95"
                  >
                    <span>{t("settingsLegalButton")}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}