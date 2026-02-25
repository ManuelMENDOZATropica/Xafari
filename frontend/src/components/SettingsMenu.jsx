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
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.5 14.25v-4.5a.75.75 0 0 1 .75-.75H8.4a.75.75 0 0 0 .53-.22l3.08-3.08c.48-.48 1.29-.14 1.29.53v14.14c0 .67-.81 1.01-1.29.53l-3.08-3.08a.75.75 0 0 0-.53-.22H5.25a.75.75 0 0 1-.75-.75Z" />
      <path d="M17.25 8.25c1.5 1.5 1.5 6 0 7.5" />
      <path d="M19.5 6c2.25 2.25 2.25 9.75 0 12" />
    </svg>
  ),
  medium: (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.5 14.25v-4.5a.75.75 0 0 1 .75-.75H8.4a.75.75 0 0 0 .53-.22l3.08-3.08c.48-.48 1.29-.14 1.29.53v14.14c0 .67-.81 1.01-1.29.53l-3.08-3.08a.75.75 0 0 0-.53-.22H5.25a.75.75 0 0 1-.75-.75Z" />
      <path d="M17.25 8.25c1.5 1.5 1.5 6 0 7.5" />
    </svg>
  ),
  vibrate: (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="7.5" y="3" width="9" height="18" rx="2.25" />
      <path d="M5.25 8.25 3.75 9.75 5.25 11.25 3.75 12.75 5.25 14.25 3.75 15.75" />
      <path d="M18.75 8.25 20.25 9.75 18.75 11.25 20.25 12.75 18.75 14.25 20.25 15.75" />
    </svg>
  ),
  off: (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4.5 14.25v-4.5a.75.75 0 0 1 .75-.75H8.4a.75.75 0 0 0 .53-.22l3.08-3.08c.48-.48 1.29-.14 1.29.53v14.14c0 .67-.81 1.01-1.29.53l-3.08-3.08a.75.75 0 0 0-.53-.22H5.25a.75.75 0 0 1-.75-.75Z" />
      <path d="m16.5 7.5 3 3-3 3" />
      <path d="M19.5 7.5 16.5 10.5" />
    </svg>
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
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-md border border-gray-300 text-gray-600 shadow-md p-0 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-300"
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
                    <h3 className="text-sm font-semibold text-gray-800">
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
                            className={`flex flex-col items-center justify-center gap-1 rounded-2xl border text-xs font-semibold uppercase transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${isActive
                              ? "border-sky-300 bg-sky-50 text-sky-700 shadow"
                              : "border-gray-200 bg-white/70 text-gray-700 shadow-sm hover:bg-white"
                              }`}
                            aria-pressed={isActive}
                          >
                            <span className="text-2xl" aria-hidden="true">
                              {LANGUAGE_FLAGS[lang]}
                            </span>
                            <span className="text-[0.65rem] leading-tight">
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
                    <h3 className="text-sm font-semibold text-gray-800">
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
                            className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${isActive
                              ? "border-sky-300 bg-sky-50 text-sky-800 shadow"
                              : "border-gray-200 bg-white/70 text-gray-800 shadow-sm hover:bg-white"
                              }`}
                            role="radio"
                            aria-checked={isActive}
                            aria-label={`${t("soundMenu")}: ${t(
                              option.labelKey
                            )}`}
                            data-skip-sound-click="true"
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`flex h-10 w-10 items-center justify-center rounded-full ${isActive
                                  ? "bg-sky-100 text-sky-600"
                                  : "bg-slate-100 text-slate-500"
                                  }`}
                                aria-hidden="true"
                              >
                                {SOUND_ICONS[option.icon]}
                              </span>
                              <span className="text-sm font-medium">
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
                    className="flex items-center justify-center gap-2 rounded-full bg-white/80 backdrop-blur-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 shadow hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  >
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 4h9a2 2 0 0 1 2 2v14l-6-3-6 3V6a2 2 0 0 1 2-2Z" />
                      <path d="M9 9h6" />
                      <path d="M9 13h3" />
                    </svg>
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