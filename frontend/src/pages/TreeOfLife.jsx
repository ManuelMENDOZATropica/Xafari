import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AvatarRender from "@/components/AvatarRender";
import XecretoRegister from "@/components/XecretoRegister";
import { motion, AnimatePresence } from "framer-motion";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const guardianes = [
  "buho",
  "flamenco",
  "guacamaya",
  "jaguar",
  "mariposa",
  "mono",
  "rana",
  "serpiente",
  "venado",
];

export default function TreeOfLife() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [avatarData, setAvatarData] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showXecretoModal, setShowXecretoModal] = useState(false);
  const [initialX, setInitialX] = useState(null);
  const [initialY, setInitialY] = useState(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("avatarData");
    if (saved) setAvatarData(JSON.parse(saved));
  }, []);

  // Calcular desplazamiento para centrar el avatar en pantalla
 useEffect(() => {
  const viewport = wrapperRef.current?.getBoundingClientRect();
  const canvasWidth = 1200;
  const canvasHeight = 1200;
  const scale = 1.2; // mismo valor que initialScale

  // Coordenadas relativas del avatar
  const avatarX = 560 / canvasWidth;
  const avatarY = 750 / canvasHeight;

  if (viewport) {
    const offsetX = viewport.width / 2 - avatarX * canvasWidth * scale;
    const offsetY = viewport.height / 2 - avatarY * canvasHeight * scale;
    setInitialX(offsetX);
    setInitialY(offsetY);
  }
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
      <div className="absolute top-4 left-4 z-30">
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
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Mi perfil
              </h3>
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
      <div className="absolute left-4 bottom-[15vh] z-30">
        <button
          onClick={() => navigate("/xecretosxptop")}
          className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow border border-gray-300 flex items-center justify-center hover:bg-white text-xl"
          title="Ir a Xecretos Xptop"
        >
          ✨
        </button>
      </div>

      {/* Botón para abrir modal de cámara */}
      <div className="absolute right-4 bottom-[15vh] z-30">
        <button
          onClick={() => setShowXecretoModal(true)}
          className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow border border-gray-300 flex items-center justify-center hover:bg-white text-xl"
          title="Buscar Xecretos"
        >
          📷
        </button>
      </div>

      {/* Árbol y avatar con zoom/pan */}
      <div className="absolute inset-0 flex items-center justify-center z-10 overflow-hidden">
        <div
          ref={wrapperRef}
          className="w-[90vw] h-[80vh] overflow-hidden touch-manipulation"
        >
          {initialX !== null && initialY !== null && (
            <TransformWrapper
              initialScale={1.2}
              initialPositionX={initialX}
              initialPositionY={initialY}
              minScale={0.5}
              maxScale={4}
              limitToBounds={false}
              panning={{ disabled: false, velocityDisabled: true }}
              pinch={{ disabled: false }}
              wheel={{ step: 50 }}
              doubleClick={{ disabled: true }}
            >
              <TransformComponent>
                <div className="relative w-[1200px] h-[1200px] flex items-center justify-center">
                  {/* Imagen base del árbol */}
                  <img
                    src="/arbol/baseArbol.png"
                    alt="Base Árbol"
                    className="w-full h-full object-contain"
                  />

                  {/* Guardianes */}
                  {guardianes.map((nombre) => (
                    <img
                      key={nombre}
                      src={`/arbol/guardianesÁrbol/${nombre}.png`}
                      alt={nombre}
                      className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
                    />
                  ))}

                  {/* Avatar en posición relativa al árbol */}
                  <div className="absolute top-[750px] left-[560px] z-50">
                    <AvatarRender className="w-[66px] h-[120px]" />
                  </div>
                </div>
              </TransformComponent>
            </TransformWrapper>
          )}
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
              <XecretoRegister onClose={() => setShowXecretoModal(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
