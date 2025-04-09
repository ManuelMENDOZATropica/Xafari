import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Welcome() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative h-screen w-full overflow-hidden pb-12 font-lufga">
      {/* Imagen de fondo responsive */}
      <div className="absolute inset-0 z-0">
        <img
          src="/img/fondo-xafari.png"
          alt="Fondo Xafari"
          className="w-full h-full object-cover object-bottom md:object-center"
        />
      </div>

      {/* Botones en las esquinas superiores */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-white text-sm text-gray-800 rounded-full border border-gray-200 shadow-md hover:bg-gray-100 transition-all"
        >
          {t("whatIsXafari")}
        </button>
      </div>
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() =>
            i18n.changeLanguage(i18n.language === "es" ? "en" : "es")
          }
          className="px-4 py-2 bg-white text-sm text-gray-800 rounded-full border border-gray-200 shadow-md hover:bg-gray-100 transition-all"
        >
          {t("language")}
        </button>
      </div>

      {/* Capa de contenido */}
      <div className="relative z-10 flex flex-col items-center justify-between h-full px-6 pt-6 pb-12 text-center text-gray-800">
        {/* Texto de bienvenida con fondo blanco */}
        <div className="relative z-10 mt-20 px-6 max-w-xl">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl px-6 py-4 shadow-md">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 leading-tight drop-shadow-md">
              {t("welcome")}
            </h1>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col gap-4 w-full max-w-xs mt-8 z-10">
          <button
            onClick={() => navigate("/register-step1")}
            className="bg-gradient-to-r from-green-500 to-lime-500 text-white text-base font-semibold py-3 rounded-full shadow-lg hover:brightness-105 active:scale-95 transition-all"
          >
            {t("newAdventure")}
          </button>
          <button
            onClick={() => navigate("/login")}
            className="bg-white border border-gray-300 text-gray-800 text-base font-semibold py-3 rounded-full shadow-md hover:bg-gray-50 active:scale-95 transition-all"
          >
            {t("alreadyUser")}
          </button>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl max-w-sm text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <h2 className="text-xl font-bold mb-2 text-gray-800">
                {t("whatIsXafari")}
              </h2>
              <p className="text-gray-700 text-sm">{t("xafariDescription")}</p>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-4 px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg shadow hover:bg-gray-200"
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
