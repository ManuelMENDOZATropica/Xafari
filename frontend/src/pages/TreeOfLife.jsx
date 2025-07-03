import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AvatarRender from "@/components/AvatarRender";
import XecretoRegister from "@/components/XecretoRegister";
import XperienciasXtop from "@/components/XperienciasXtop";
import { motion, AnimatePresence } from "framer-motion";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { User } from "lucide-react";

export default function TreeOfLife() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // ==========================
  // == ESTADO GENERAL ==
  // ==========================
  const [avatarData, setAvatarData] = useState(null);
  const [xecretos, setXecretos] = useState({});
  const [respuestasCorrectas, setRespuestasCorrectas] = useState({});
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showXecretoModal, setShowXecretoModal] = useState(false);
  const [showXperienciasModal, setShowXperienciasModal] = useState(false);
  const [initialX, setInitialX] = useState(null);
  const [initialY, setInitialY] = useState(null);
  const wrapperRef = useRef(null);

  // ==========================
  // == CARGA DE DATOS ==
  // ==========================
  useEffect(() => {
    const saved = localStorage.getItem("avatarData");
    if (saved) setAvatarData(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("progresoXperiencias");
    const parsed = saved ? JSON.parse(saved) : {};
    setRespuestasCorrectas(parsed);
    console.log("Xtop Respuestas correctas:", parsed);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("xecretos");
    const parsed = saved ? JSON.parse(saved) : {};
    setXecretos(parsed);
    console.log("Xecretos guardados en localStorage:", parsed);
  }, []);

  // ==========================
  // == POSICIÓN INICIAL AVATAR ==
  // ==========================
  useEffect(() => {
    const viewport = wrapperRef.current?.getBoundingClientRect();
    const canvasWidth = 1200;
    const canvasHeight = 1200;
    const scale = 1.2;
    const avatarX = 560 / canvasWidth;
    const avatarY = 750 / canvasHeight;

    if (viewport) {
      const offsetX = viewport.width / 2 - avatarX * canvasWidth * scale;
      const offsetY = viewport.height / 2 - avatarY * canvasHeight * scale;
      setInitialX(offsetX);
      setInitialY(offsetY);
    }
  }, []);

  // ==========================
  // == MAPA GUARDIANES ==
  // ==========================
  const mapa = {
    xecreto1: "mono",
    xecreto2: "rana",
    xecreto3: "jaguar",
    xecreto4: "guacamaya",
    xecreto5: "serpiente",
    xecreto6: "venado",
    xecreto7: "buho",
    xecreto8: "mariposa",
    xecreto9: "flamenco",
    xecreto10: "coati",
  };

  // ==========================
  // == RENDER ==
  // ==========================
  return (
    <div className="relative w-screen h-screen overflow-hidden font-lufga text-black">
      {/* == FONDO == */}
      <img
        src="/img/fondoArbolDeLaVida.png"
        alt="Fondo"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* == BOTÓN PERFIL == */}
      <div className="absolute top-4 left-4 z-30">
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-gray-300 hover:bg-white transition flex items-center justify-center"
            title="Perfil"
          >
            <User className="w-6 h-6 text-emerald-800" />
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

      {/* == BOTÓN XPERIENCIAS == */}
      <div className="absolute left-4 bottom-[15vh] z-30">
        <button
          onClick={() => setShowXperienciasModal(true)}
          className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow border border-gray-300 flex items-center justify-center hover:bg-white text-xl"
          title="Ir a Xecretos Xptop"
        >
          ✨
        </button>
      </div>

      {/* == BOTÓN ESCANEO == */}
      <div className="absolute right-4 bottom-[15vh] z-30">
        <button
          onClick={() => setShowXecretoModal(true)}
          className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow border border-gray-300 flex items-center justify-center hover:bg-white text-xl"
          title="Buscar Xecretos"
        >
          📷
        </button>
      </div>

      {/* == ÁRBOL Y AVATAR == */}
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
                  <img
                    src="/arbol/baseArbol.png"
                    alt="Base Árbol"
                    className="w-full h-full object-contain"
                  />

                  {/* == GUARDIANES == */}
                  {Object.entries(xecretos).map(([clave, valor]) => {
  if (!valor || !mapa[clave]) return null;
  return (
    <motion.img
      key={clave}
      src={`/arbol/guardianesÁrbol/${mapa[clave]}.png`}
      alt={mapa[clave]}
      className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
      initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
      animate={{ opacity: 1, scale: [1.2, 0.95, 1], rotate: [4, -4, 0] }}
      transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
    />
  );
})}


                  {Object.entries(respuestasCorrectas).map(([clave, valor]) => {
                    if (!valor) return null;
                    return (
                      <motion.img
                        key={clave}
                        src={`/arbol/xtopÁrbol/${clave}.png`}
                        alt={clave}
                        className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
                        initial={{ opacity: 0, scale: 0.8, rotate: -2 }}
                        animate={{
                          opacity: 1,
                          scale: [1.1, 0.95, 1],
                          rotate: [2, -2, 0],
                        }}
                        transition={{
                          duration: 0.6,
                          ease: "easeOut",
                          delay: 0.2,
                        }}
                      />
                    );
                  })}

                  {/* == AVATAR == */}
                  <div className="absolute top-[700px] left-[565px] z-50">
                    <AvatarRender className="w-[90px] h-[130px]" />
                  </div>
                </div>
              </TransformComponent>
            </TransformWrapper>
          )}
        </div>
      </div>

      {/* == MODAL ESCANEO == */}
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
              <XecretoRegister
                onClose={() => {
                  setShowXecretoModal(false);
                  const saved = localStorage.getItem("xecretos");
                  setXecretos(saved ? JSON.parse(saved) : {});
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* == MODAL XPERIENCIAS == */}
      <AnimatePresence>
        {showXperienciasModal && (
          <motion.div
            className="absolute inset-0 z-50 bg-black/70 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full h-full"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <XperienciasXtop
                onClose={() => {
                  setShowXperienciasModal(false);
                  const saved = localStorage.getItem("progresoXperiencias");
                  const parsed = saved ? JSON.parse(saved) : {};
                  setRespuestasCorrectas(parsed);
                  console.log("Actualizado tras cerrar modal:", parsed);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
