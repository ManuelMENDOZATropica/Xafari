import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import XafariContext from "./XafariContext";

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

const SOUND_OPTIONS = [
  { value: "full", labelKey: "soundFull" },
  { value: "medium", labelKey: "soundMedium" },
  { value: "vibrate", labelKey: "soundVibrate" },
  { value: "off", labelKey: "soundOff" },
];

export default function SoundMenu() {
  const { soundSetting, setSoundSetting } = useContext(XafariContext);
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (value) => {
    setSoundSetting(value);

    if (value === "vibrate" && typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(100);
    }

    setIsOpen(false);
  };

  const activeOption =
    SOUND_OPTIONS.find((option) => option.value === soundSetting) ||
    SOUND_OPTIONS[0];

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-40 flex flex-col items-end pt-12">
      <div className="pointer-events-auto relative" ref={containerRef}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 shadow-md transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white hover:bg-gray-100"
          aria-label={`${t("soundMenu")}: ${t(activeOption.labelKey)}`}
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <span aria-hidden="true">{SOUND_ICONS[soundSetting]}</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-max rounded-2xl border border-gray-200 bg-white p-2 text-gray-800 shadow-lg">
            <div role="group" aria-label={t("soundMenu")} className="flex items-center gap-2">
              {SOUND_OPTIONS.map((option) => {
                const isActive = soundSetting === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                      isActive
                        ? "bg-emerald-100 text-emerald-600 shadow-inner"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                    aria-label={`${t("soundMenu")}: ${t(option.labelKey)}`}
                    title={t(option.labelKey)}
                    aria-pressed={isActive}
                  >
                    <span aria-hidden="true">{SOUND_ICONS[option.value]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
