import { useContext } from "react";
import { useTranslation } from "react-i18next";
import XafariContext from "./XafariContext";

const SOUND_OPTIONS = [
  { value: "full", labelKey: "soundFull", icon: "🔊" },
  { value: "medium", labelKey: "soundMedium", icon: "🔉" },
  { value: "vibrate", labelKey: "soundVibrate", icon: "📳" },
  { value: "off", labelKey: "soundOff", icon: "🔇" },
];

export default function SoundMenu() {
  const { soundSetting, setSoundSetting } = useContext(XafariContext);
  const { t } = useTranslation();

  return (
    <div className="fixed top-24 right-4 z-40 flex flex-col items-center gap-2">
      <div className="rounded-2xl bg-white/90 p-2 shadow-lg backdrop-blur">
        <div className="flex flex-col gap-2">
          {SOUND_OPTIONS.map((option) => {
            const isActive = soundSetting === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setSoundSetting(option.value);
                  if (
                    option.value === "vibrate" &&
                    typeof navigator !== "undefined" &&
                    navigator.vibrate
                  ) {
                    navigator.vibrate(100);
                  }
                }}
                className={`flex h-12 w-12 items-center justify-center rounded-full text-2xl transition ${
                  isActive
                    ? "bg-emerald-100 text-emerald-600 shadow-inner"
                    : "bg-white/0 text-gray-700 hover:bg-gray-100"
                }`}
                aria-label={`${t("soundMenu")}: ${t(option.labelKey)}`}
                title={t(option.labelKey)}
              >
                <span role="img" aria-hidden="true">
                  {option.icon}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
