import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Welcome() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-6 relative">
      {/* Botón para abrir el modal */}
      <div className="absolute top-4 left-4">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 border border-gray-500 bg-white text-black rounded-lg shadow-md hover:bg-gray-200"
        >
          {t("whatIsXafari")}
        </button>
      </div>

      {/* Botón para cambiar idioma */}
      <div className="absolute top-4 right-4">
        <button
          className="px-4 py-2 border border-gray-500 bg-white text-black rounded-lg shadow-md hover:bg-gray-200"
          onClick={() => i18n.changeLanguage(i18n.language === "es" ? "en" : "es")}
        >
          {t("language")}
        </button>
      </div>

      {/* Texto principal */}
      <div className="text-center mt-20">
        <p className="text-lg font-semibold text-gray-700">
          {t("welcome")}
        </p>
      </div>

      {/* Botones principales */}
      <div className="flex flex-col gap-4 mt-10">
        <button
          onClick={() => navigate("/register")}
          className="px-4 py-2 border border-gray-500 bg-white text-black rounded-lg shadow-md hover:bg-gray-200"
        >
          {t("newAdventure")}
        </button>

        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 border border-gray-500 bg-white text-black rounded-lg shadow-md hover:bg-gray-200"
        >
          {t("alreadyUser")}
        </button>
      </div>

      {/* Modal con Animación */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <h2 className="text-xl font-bold mb-2">{t("whatIsXafari")}</h2>
              <p className="text-gray-700">{t("xafariDescription")}</p>
              <button
                onClick={() => setIsOpen(false)}
                className="mt-4 px-4 py-2 bg-white text-black border border-gray-500 rounded-lg shadow-md hover:bg-gray-200"
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
