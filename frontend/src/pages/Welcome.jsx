import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LanguageToggle from "@/components/LanguageToggle";
import { Info } from "lucide-react";

export default function Welcome() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative h-screen w-full overflow-hidden pb-12 font-lufga">
      {/* Imagen de fondo responsive */}
      <div className="absolute inset-0 z-0">
        <img
          src="/img/fondoPrincipal.png"
          alt="Fondo Xafari"
          className="w-full h-full object-cover object-bottom md:object-center"
        />
      </div>

      {/* --- Botón de Información (Esquina superior izquierda) --- */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 bg-[#5D8C97] text-white text-sm rounded-lg shadow-md hover:bg-[#4a7079] transition-all flex items-center justify-center"
          aria-label={t("whatIsXafari")}
        >
           {/* Nota: En tu imagen el botón '¿Qué es Xafari?' es rectangular y azul grisáceo. 
               He ajustado el estilo ligeramente para parecerse más, 
               o puedes dejar el estilo 'rounded-full' anterior si prefieres. */}
          <span className="px-2 font-medium">¿Qué es Xafari?</span>
        </button>
      </div>

      {/* --- Botón Aviso de Privacidad (Esquina inferior izquierda) --- */}
      <div className="absolute bottom-10 left-4 z-20">
        <Link
          to="/privacy"
          className="flex items-center gap-2 rounded-lg bg-[#5D8C97]/90 px-4 py-2 text-xs font-medium text-white shadow-md backdrop-blur transition hover:bg-[#4a7079] focus:outline-none"
          aria-label={t("settingsLegalButton")}
        >
          {t("settingsLegalButton") || "Aviso de Privacidad"}
        </Link>
      </div>

      {/* --- INSTRUCCIÓN 3: Botón de Idioma (Esquina inferior derecha) --- */}
      <div className="absolute bottom-4 right-4 z-20">
        <LanguageToggle />
      </div>

      {/* Capa de contenido principal */}
      <div className="relative z-10 flex flex-col items-center justify-between h-full px-6 pt-24 pb-20 text-center">
        
        {/* --- INSTRUCCIÓN 1 y 2: Logotipo y Texto sin fondo --- */}
        <div className="flex flex-col items-center w-full max-w-md">
          {/* Logotipo */}
          <img 
            src="/iconos/Logotipo_Xafari_Positivo.png" 
            alt="Xafari Logo" 
            className="w-4/5 max-w-[280px] mb-2 drop-shadow-lg"
          />
          
          {/* Texto descriptivo (Sin fondo blanco, texto blanco con sombra) */}
          <h1 className="text-white text-sm md:text-base font-medium leading-tight drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] px-4">
            {t("welcome") || "Descubre las sorpresas y aventuras que Xcaret México tiene para ti y tu familia."}
          </h1>
        </div>

        {/* --- INSTRUCCIÓN 4: Botones (Naranja y Cian) --- */}
        <div className="flex flex-col gap-4 w-full max-w-xs z-10">
          {/* Botón Naranja: Nueva Aventura */}
          <button
            onClick={() => navigate("/intro")}
            className="bg-[#FF6B00] text-white text-lg font-semibold py-3 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            {t("newAdventure") || "Nueva Aventura"}
          </button>

          {/* Botón Cian: Continuar */}
          <button
            onClick={() => navigate("/login")}
            className="bg-[#00C2FF] text-white text-lg font-semibold py-3 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            {t("continue") || "Continuar"}
          </button>
        </div>
      </div>

      {/* Modal (Sin cambios funcionales) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl max-w-sm text-center mx-4"
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
                className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700 transition-colors"
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