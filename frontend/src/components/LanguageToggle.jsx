import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "./CloseIcon";

const LANGUAGES = [
  { code: "es", label: "ESPAÑOL" },
  { code: "en", label: "ENGLISH" },
];

export default function LanguageToggle({ className = "" }) {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const current = i18n.language?.split("-")[0] ?? "es";

  return (
    <>
      {/* ── Botón icono ─────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => { setOpen(true); }}
        aria-label={t("language")}
        className={`flex items-center justify-center w-[52px] h-[52px] bg-transparent border-none p-0 active:scale-90 transition-transform ${className}`}
      >
        <img
          src="/iconos/menuIdioma.png"
          alt={t("language")}
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
                {t("language")}
              </h2>

              {/* Opciones de idioma */}
              <div className="flex flex-col gap-3 mb-10">
                {LANGUAGES.map((lang) => {
                  const isActive = current === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => { i18n.changeLanguage(lang.code); setOpen(false); }}
                      className="w-full font-bold uppercase transition-all active:scale-[0.98]"
                      style={{
                        height: "60px",
                        borderRadius: "30px",
                        backgroundColor: isActive ? "#80A850" : "#F4E6C7",
                        color: isActive ? "#F7F3EA" : "#4B3621",
                        fontSize: "0.875rem",
                        letterSpacing: "0.10em",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: isActive ? "2px 2px 4px rgba(0,0,0,0.2)" : "none",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {lang.label}
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