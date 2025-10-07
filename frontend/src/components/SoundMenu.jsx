import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const activeOption = useMemo(() => {
    return (
      SOUND_OPTIONS.find((option) => option.value === soundSetting) ||
      SOUND_OPTIONS[0]
    );
  }, [soundSetting]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div
      ref={menuRef}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
    >
      <AnimatePresence>
        {open && (
          <motion.div
            key="sound-menu"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="w-52 rounded-2xl bg-white/90 p-3 text-sm shadow-lg backdrop-blur"
          >
            <p className="mb-2 font-semibold text-gray-700">
              {t("soundMenu")}
            </p>
            <div className="flex flex-col gap-2">
              {SOUND_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setSoundSetting(option.value);
                    setOpen(false);
                    if (
                      option.value === "vibrate" &&
                      typeof navigator !== "undefined" &&
                      navigator.vibrate
                    ) {
                      navigator.vibrate(100);
                    }
                  }}
                  className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left transition ${
                    activeOption.value === option.value
                      ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                      : "border-transparent bg-white/80 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-lg">{option.icon}</span>
                  <span className="text-xs font-medium">
                    {t(option.labelKey)}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-gray-800 shadow-lg backdrop-blur transition hover:bg-white"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={t("soundMenu")}
      >
        <span className="text-lg">{activeOption.icon}</span>
        <span>
          {t("soundMenu")}: {t(activeOption.labelKey)}
        </span>
      </button>
    </div>
  );
}
