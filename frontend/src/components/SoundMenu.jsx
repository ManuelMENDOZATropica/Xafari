import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import XafariContext from "./XafariContext";
import CloseIcon from "./CloseIcon";

const SOUND_OPTIONS = [
  { value: "full",    labelKey: "soundFull",    icon: "/iconos/icon_volumen3.svg" },
  { value: "medium",  labelKey: "soundMedium",  icon: "/iconos/icon_volumen2.svg" },
  { value: "vibrate", labelKey: "soundVibrate", icon: "/iconos/icon_volumen1.svg" },
  { value: "off",     labelKey: "soundOff",     icon: "/iconos/icon_volumen0.png" },
];

export default function SoundMenu({ className = "" }) {
  const { soundSetting, setSoundSetting, triggerClickFeedback } = useContext(XafariContext);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ── Botón icono ─────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("soundMenu")}
        className={`flex items-center justify-center w-[52px] h-[52px] bg-transparent border-none p-0 active:scale-90 transition-transform ${className}`}
      >
        <img
          src="/iconos/menuSonido.png"
          alt={t("soundMenu")}
          className="w-[52px] h-[52px] object-contain"
          aria-hidden
        />
      </button>

      {/* ── Modal ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="w-full max-w-md relative"
              style={{
                backgroundColor: "#F7F3EA",
                borderRadius: "24px 24px 0 0",
                padding: "32px 24px 48px",
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle bar */}
              <div
                className="mx-auto mb-6 h-1 w-10 rounded-full"
                style={{ backgroundColor: "#C5A27A" }}
              />

              {/* X cerrar */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute top-6 right-6 flex items-center justify-center w-8 h-8 bg-transparent border-none cursor-pointer active:scale-90 transition-transform"
                aria-label={t("close")}
              >
                <CloseIcon size={22} color="#233C15" />
              </button>

              {/* Título */}
              <h2
                className="text-center font-bold mb-8"
                style={{ color: "#233C15", fontSize: "28px" }}
              >
                {t("soundMenu")}
              </h2>

              {/* Opciones de sonido */}
              <div className="flex flex-col gap-3 mb-10">
                {SOUND_OPTIONS.map((opt) => {
                  const isActive = soundSetting === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setSoundSetting(opt.value);
                        if (typeof triggerClickFeedback === "function") triggerClickFeedback(opt.value);
                        setOpen(false);
                      }}
                      className="w-full font-bold uppercase transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                      style={{
                        height: "60px",
                        borderRadius: "30px",
                        backgroundColor: isActive ? "#80A850" : "#F4E6C7",
                        color: isActive ? "#F7F3EA" : "#4B3621",
                        fontSize: "0.875rem",
                        letterSpacing: "0.08em",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: isActive ? "2px 2px 4px rgba(0,0,0,0.2)" : "none",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <img
                        src={opt.icon}
                        alt=""
                        className="w-5 h-5 object-contain"
                        style={{ filter: isActive ? "brightness(0) invert(1)" : "none" }}
                        aria-hidden
                      />
                      {t(opt.labelKey)}
                    </button>
                  );
                })}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
