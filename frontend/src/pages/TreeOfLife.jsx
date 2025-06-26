import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AvatarRender from "@/components/AvatarRender";
import XecretoRegister from "@/components/XecretoRegister"; // Importa el modal aquí
import { motion, AnimatePresence } from "framer-motion";

export default function TreeOfLife() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [avatarData, setAvatarData] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showXecretoModal, setShowXecretoModal] = useState(false); // Estado para mostrar modal

  useEffect(() => {
    const saved = localStorage.getItem("avatarData");
    if (saved) setAvatarData(JSON.parse(saved));
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden font-lufga text-black">
      {/* Fondo ilustrado */}
      <img
        src="/img/fondoArbolDeLaVida.png"
        alt="Fondo"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Botón de perfil */}
      <div className="absolute top-4 left-4 z-20">
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow flex items-center justify-center hover:bg-white"
            title="Perfil"
          >
            👤
          </button>
          {showProfileMenu && (
            <div className="absolute mt-3 left-0 w-48 bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-300 p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Mi perfil</h3>
              <button
                onClick={() => navigate("/edit-avatar")}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-800 bg-white hover:bg-gray-100 transition"
              >
                {t("editAvatar") || "Editar avatar"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Botón a Xecretos Xptop */}
      <div className="absolute left-4 bottom-[15vh] z-20">
        <button
          onClick={() => navigate("/xecretosxptop")}
          className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow border border-gray-300 flex items-center justify-center hover:bg-white text-xl"
          title="Ir a Xecretos Xptop"
        >
          ✨
        </button>
      </div>

      {/* Botón para abrir modal de cámara */}
      <div className="absolute right-4 bottom-[15vh] z-20">
        <button
          onClick={() => setShowXecretoModal(true)}
          className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow border border-gray-300 flex items-center justify-center hover:bg-white text-xl"
          title="Buscar Xecretos"
        >
          📷
        </button>
      </div>

      {/* Árbol y avatar */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center w-[80vw]">
        <div className="relative">
          <img
            src="/img/arbol-xafari_opt.png"
            alt="Árbol de la Vida"
            className="w-full max-h-[60vh] object-contain"
          />
          <div className="absolute top-[220px] right-[140px] p-4 z-20">
            <AvatarRender className="w-[33px] h-[60px]" />
          </div>
        </div>
      </div>

      {/* Modal Xecreto */}
      
<AnimatePresence>
  {showXecretoModal && (
    <motion.div
      className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative w-full h-full"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.7, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <XecretoRegister />
        <button
          onClick={() => setShowXecretoModal(false)}
          className="absolute top-4 right-4 z-50 bg-white/90 rounded-full w-10 h-10 flex items-center justify-center shadow"
          title="Cerrar"
        >
          ✖
        </button>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>



    </div>
  );
}
