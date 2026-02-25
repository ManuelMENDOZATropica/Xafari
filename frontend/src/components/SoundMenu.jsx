import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import XafariContext from "./XafariContext";

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

const SOUND_OPTIONS = [
  { value: "full", labelKey: "soundFull" },
  { value: "medium", labelKey: "soundMedium" },
  { value: "vibrate", labelKey: "soundVibrate" },
  { value: "off", labelKey: "soundOff" },
];

export default function SoundMenu() {
  const { soundSetting, setSoundSetting, triggerClickFeedback } =
    useContext(XafariContext);
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
    if (typeof triggerClickFeedback === "function") {
      triggerClickFeedback(value);
    }
    setIsOpen(false);
  };

  const activeOption =
    SOUND_OPTIONS.find((option) => option.value === soundSetting) ||
    SOUND_OPTIONS[0];

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-40 flex flex-col items-end">
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
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${isActive
                        ? "bg-emerald-100 text-emerald-600 shadow-inner"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    aria-label={`${t("soundMenu")}: ${t(option.labelKey)}`}
                    title={t(option.labelKey)}
                    aria-pressed={isActive}
                    data-skip-sound-click="true"
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
