import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LanguageToggle from "@/components/LanguageToggle";
import { Info } from "lucide-react";
import SoundMenu from "@/components/SoundMenu";

export default function Welcome() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full overflow-hidden pb-12 font-apercu">
      <div className="absolute inset-0 z-0">
        <img
          src="/img/fondoPrincipal.jpg"
          alt={t("welcomeBackgroundAlt")}
          className="h-full w-full object-cover object-bottom md:object-center"
        />
      </div>

      <SoundMenu />

      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center rounded-lg bg-[#5D8C97] p-2 text-sm font-medium text-white shadow-md transition-all hover:bg-[#4a7079]"
          aria-label={t("whatIsXafari")}
        >
          <span className="px-2">{t("whatIsXafari")}</span>
        </button>
      </div>

      <div className="absolute bottom-10 left-4 z-20">
        <Link
          to="/privacy"
          className="flex items-center gap-2 rounded-lg bg-[#5D8C97]/90 px-4 py-2 text-xs font-medium text-white backdrop-blur shadow-md transition hover:bg-[#4a7079] focus:outline-none"
          aria-label={t("settingsLegalButton")}
        >
          {t("settingsLegalButton")}
        </Link>
      </div>

      <div className="absolute bottom-4 right-4 z-20">
        <LanguageToggle />
      </div>

      <div className="relative z-10 flex h-full min-h-screen flex-col items-center justify-between px-4 pt-24 pb-20 text-center md:px-6">
        <div className="flex w-full max-w-md flex-col items-center">
          <img
            src="/iconos/Logotipo_Xafari_Positivo.png"
            alt={t("xafariLogoAlt")}
            className="mb-2 w-4/5 max-w-[280px] drop-shadow-lg"
          />

          <h1 className="px-4 text-sm font-medium leading-tight text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] md:text-base">
            {t("welcome")}
          </h1>
        </div>

        <div className="z-10 flex w-full max-w-xs flex-col gap-4">
          <button
            onClick={() => navigate("/intro")}
            className="rounded-xl bg-[#FF6B00] py-3 text-base font-semibold text-white shadow-lg transition-all hover:brightness-110 active:scale-95 md:text-lg"
          >
            {t("newAdventure")}
          </button>

          <button
            onClick={() => navigate("/login")}
            className="rounded-xl bg-[#00C2FF] py-3 text-base font-semibold text-white shadow-lg transition-all hover:brightness-110 active:scale-95 md:text-lg"
          >
            {t("continue")}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="mx-4 max-w-sm rounded-2xl bg-white/90 p-6 text-center shadow-xl backdrop-blur-sm"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <h2 className="mb-2 text-xl font-bold text-gray-800">{t("whatIsXafari")}</h2>
              <p className="text-sm text-gray-700">{t("xafariDescription")}</p>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-4 rounded-lg bg-gray-800 px-4 py-2 text-white shadow transition-colors hover:bg-gray-700"
              >
                {t("close")}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}