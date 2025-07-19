/* ─────────────────────────────────────────────
 * TREE OF LIFE
 * Visualización interactiva de progreso en el árbol místico
 * ───────────────────────────────────────────── */

/* ─────────────────────────────────────────────
 * IMPORTACIONES
 * ───────────────────────────────────────────── */
// React y hooks
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// Componentes internos
import AvatarRender from "@/components/AvatarRender";
import XecretoRegister from "@/components/XecretoRegister";
import XperienciasXtop from "@/components/XperienciasXtop";
import ChecklistGastro from "@/components/ChecklistGastro";
import PodiumModal from "@/components/PodiumModal";

// Librerías externas
import { motion, AnimatePresence } from "framer-motion";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { User } from "lucide-react";

export default function TreeOfLife() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  /* ─────────────────────────────────────────────
   * ESTADO PRINCIPAL
   * ───────────────────────────────────────────── */

  // Control de visibilidad de modales
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [showPodiumModal, setShowPodiumModal] = useState(false);

  /* ────────── constantes ────────── */
  const CANVAS_SIZE = 1200;
  const INITIAL_SCALE = 0.6;
  const TREE_CENTER_RATIO_X = 0.5;
  const TREE_CENTER_RATIO_Y = 0.5;

  /* ────────── refs / estado ────────── */
  const wrapperRef = useRef(null);
  const transformRef = useRef(null);
  const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });

  // Datos cargados desde localStorage
  const [xecretos, setXecretos] = useState({});
  const [respuestasCorrectas, setRespuestasCorrectas] = useState({});
  const [checklistProgreso, setChecklistProgreso] = useState({});

  // Estado para mostrar menú y modales
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showXecretoModal, setShowXecretoModal] = useState(false);
  const [showXperienciasModal, setShowXperienciasModal] = useState(false);

  // Identificadores de nuevas insignias o desbloqueos
  const [insigniaReciente, setInsigniaReciente] = useState(null);
  const [checklistReciente, setChecklistReciente] = useState(null);
  const [guardianReciente, setGuardianReciente] = useState(null);

  /* ─────────────────────────────────────────────
   * EFECTOS: CARGA DE DATOS Y TEMPORIZADORES
   * ───────────────────────────────────────────── */

  useEffect(() => {
    setXecretos(JSON.parse(localStorage.getItem("xecretos") || "{}"));
    setRespuestasCorrectas(
      JSON.parse(localStorage.getItem("progresoXperiencias") || "{}")
    );
  }, []);

  useEffect(() => {
    setChecklistProgreso(
      JSON.parse(localStorage.getItem("progresoChecklistGastro") || "{}")
    );
  }, []);

  useEffect(() => {
    if (insigniaReciente || checklistReciente || guardianReciente) {
      const timeout = setTimeout(() => {
        setInsigniaReciente(null);
        setChecklistReciente(null);
        setGuardianReciente(null);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [insigniaReciente, checklistReciente, guardianReciente]);

  /* ─────────────────────────────────────────────
   * CENTRADO RESPONSIVO
   * ───────────────────────────────────────────── */

  const recalcInitialPos = () => {
    const vp = wrapperRef.current?.getBoundingClientRect();
    if (!vp) return;
    setInitialPos({
      x: vp.width / 2 - CANVAS_SIZE * TREE_CENTER_RATIO_X * INITIAL_SCALE,
      y: vp.height / 2 - CANVAS_SIZE * TREE_CENTER_RATIO_Y * INITIAL_SCALE,
    });
  };

  useLayoutEffect(() => {
    recalcInitialPos();
    window.addEventListener("resize", recalcInitialPos);
    return () => window.removeEventListener("resize", recalcInitialPos);
  }, []);

  /* ─────────────────────────────────────────────
   * FUNCIONES AUXILIARES
   * ───────────────────────────────────────────── */

  const smoothReset = () => {
    recalcInitialPos();
    transformRef.current?.setTransform(
      initialPos.x,
      initialPos.y,
      INITIAL_SCALE,
      400,
      "easeOutQuad"
    );
  };

  const bounceIfOut = (wrapper) => {
    if (!wrapperRef.current || !wrapper?.state) return;

    const { positionX: x, positionY: y, scale } = wrapper.state;
    const vp = wrapperRef.current.getBoundingClientRect();
    const scaledW = CANVAS_SIZE * scale;
    const scaledH = CANVAS_SIZE * scale;

    const minX = vp.width - scaledW;
    const maxX = 0;
    const minY = vp.height - scaledH;
    const maxY = 0;

    const centerX = (vp.width - scaledW) / 2;
    const centerY = (vp.height - scaledH) / 2;

    const targetX = Math.min(maxX, Math.max(minX, centerX));
    const targetY = Math.min(maxY, Math.max(minY, centerY));

    if (targetX !== x || targetY !== y) {
      wrapper.setTransform(targetX, targetY, scale, 300, "easeOutQuad");
    }
  };

  /* ─────────────────────────────────────────────
   * MAPA DE GUARDIANES (key → nombre gráfico)
   * ───────────────────────────────────────────── */
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

  /* ─────────────────────────────────────────────
   * RENDER PRINCIPAL
   * ───────────────────────────────────────────── */

  return (
    <div className="relative w-screen h-screen overflow-hidden font-lufga bg-[url('/img/fondoArbolDeLaVida.png')] bg-cover bg-center">
      {/* Fondo de flores en capa superior */}
      <img
        src="/img/flores.png"
        alt="flores"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
      />

      {/* CONTENEDOR DE TRANSFORMACIONES */}
      <div ref={wrapperRef} className="w-full h-full overflow-hidden">
        <TransformWrapper
          ref={transformRef}
          key={`${initialPos.x}-${initialPos.y}`}
          initialScale={INITIAL_SCALE}
          initialPositionX={initialPos.x}
          initialPositionY={initialPos.y}
          minScale={0.5}
          maxScale={2}
          limitToBounds={false}
          wheel={{ step: 50 }}
          doubleClick={{ disabled: true }}
          onPanningStop={bounceIfOut}
          onZoomStop={bounceIfOut}
        >
          <TransformComponent>
            <div
              style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
              className="relative"
            >
              {/* Imagen base del árbol */}
              <img
                src="/arbol/baseArbolv3.png"
                alt=""
                className="w-full h-full object-contain"
              />

              {/* Guardianes desbloqueados */}
              {Object.entries(xecretos).map(([k, v]) =>
                v && mapa[k] ? (
                  <motion.img
                    key={k}
                    src={`/arbol/guardianesÁrbol/${mapa[k]}.png`}
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={
                      insigniaReciente === k
                        ? { opacity: 1, scale: [1.5, 0.95, 1] }
                        : { opacity: 1, scale: 1 }
                    }
                    transition={{ duration: 0.8 }}
                  />
                ) : null
              )}

              {/* Insignias por respuestas correctas */}
              {Object.entries(respuestasCorrectas).map(([k, v]) =>
                v ? (
                  <motion.img
                    key={k}
                    src={`/arbol/xtopÁrbol/${k}.png`}
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={
                      insigniaReciente === k
                        ? { opacity: 1, scale: [1.5, 0.95, 1] }
                        : { opacity: 1, scale: 1 }
                    }
                    transition={{ duration: 0.6 }}
                  />
                ) : null
              )}

              {/* Avance en checklist */}
              {Object.entries(checklistProgreso).map(([k, v]) =>
                v ? (
                  <motion.img
                    key={k}
                    src={`/arbol/checklist/${k}.png`}
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={
                      insigniaReciente === k
                        ? { opacity: 1, scale: [1.5, 0.95, 1] }
                        : { opacity: 1, scale: 1 }
                    }
                    transition={{ duration: 0.6 }}
                  />
                ) : null
              )}

              {/* Avatar del usuario */}
              <div
                className="absolute z-40"
                style={{
                  left: `${(615 / CANVAS_SIZE) * 100}%`,
                  top: `${(910 / CANVAS_SIZE) * 100}%`,
                  width: `${(90 / CANVAS_SIZE) * 100}%`,
                  height: `${(130 / CANVAS_SIZE) * 100}%`,
                  transform: "translate(-50%, -100%)",
                }}
              >
                <AvatarRender className="w-full h-full" />
              </div>
            </div>
          </TransformComponent>
        </TransformWrapper>
      </div>

      {/* ─────────────────────────────────────────────
       * INTERFAZ FLOTANTE
       * ───────────────────────────────────────────── */}

      {/* Botón de perfil */}
      <button
        onClick={() => setShowProfileMenu(!showProfileMenu)}
        title="Perfil"
        className="fixed top-4 left-4 w-14 h-14 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-gray-300 flex items-center justify-center z-50"
      >
        <img
          src="/iconos/perfil.png"
          alt="perfil"
          className="w-10 h-10 object-contain pointer-events-none"
        />
      </button>

      {/* Menú de perfil */}
      {showProfileMenu && (
        <div className="fixed top-20 left-4 w-48 bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-300 p-4 z-30">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            {t("profile") || "Mi perfil"}
          </h3>
          <button
            onClick={() => navigate("/edit-avatar")}
            className="block w-full text-left px-3 py-2 rounded-lg text-sm text-gray-800 bg-white/70 backdrop-blur-sm hover:bg-white/90 transition"
          >
            {t("editAvatar") || "Editar avatar"}
          </button>
        </div>
      )}

      {/* Barra inferior */}
      <div className="fixed bottom-0 left-0 w-full z-30 bg-white/0 backdrop-blur-md border-t border-gray-200">
        <div className="grid grid-cols-4 divide-x divide-gray-0">
          {[
            {
              key: "xperiencias",
              label: t("xperiencias") || "xperiencias",
              icon: "/iconos/experiencias.png",
              onClick: () => setShowXperienciasModal(true),
            },
            {
              key: "xecretos",
              label: t("xecretos") || "xecretos",
              icon: "/iconos/xecretos.png",
              onClick: () => setShowXecretoModal(true),
            },
            {
              key: "checklist",
              label: t("checklist") || "checklist",
              icon: "/iconos/checklist.png",
              onClick: () => setShowChecklistModal(true),
            },
            {
              key: "podium",
              label: t("podium") || "podium",
              icon: "/iconos/podium.png",
              onClick: () => setShowPodiumModal(true),
            },
          ].map(({ key, label, icon, onClick }) => (
            <button
              key={key}
              onClick={onClick}
              className="py-2 flex flex-col items-center justify-center w-full text-xs font-medium text-gray-800 bg-white/60 backdrop-blur-sm transition rounded-none"
            >
              <img
                src={icon}
                alt={label}
                className="w-10 h-10 mb-0.5 pointer-events-none"
              />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ─────────────────────────────────────────────
       * MODALES
       * ───────────────────────────────────────────── */}

      {/* Modal Xecreto */}
      <AnimatePresence>
        {showXecretoModal && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <XecretoRegister
              onClose={() => {
                const prev = xecretos;
                const nuevos = JSON.parse(
                  localStorage.getItem("xecretos") || "{}"
                );
                const nueva = Object.keys(nuevos).find(
                  (k) => nuevos[k] && !prev[k]
                );
                setXecretos(nuevos);
                setGuardianReciente(nueva || null);
                setShowXecretoModal(false);
                smoothReset();
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Xperiencias */}
      <AnimatePresence>
        {showXperienciasModal && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <XperienciasXtop
              onClose={() => {
                const prev = respuestasCorrectas;
                const nuevos = JSON.parse(
                  localStorage.getItem("progresoXperiencias") || "{}"
                );
                const nueva = Object.keys(nuevos).find(
                  (k) => nuevos[k] && !prev[k]
                );
                setRespuestasCorrectas(nuevos);
                setInsigniaReciente(nueva || null);
                setShowXperienciasModal(false);
                smoothReset();
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Checklist */}
      <AnimatePresence>
        {showChecklistModal && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ChecklistGastro
              onClose={() => {
                const prev = checklistProgreso;
                const nuevos = JSON.parse(
                  localStorage.getItem("progresoChecklistGastro") || "{}"
                );
                const nueva = Object.keys(nuevos).find(
                  (k) => nuevos[k] && !prev[k]
                );
                setChecklistProgreso(nuevos);
                setChecklistReciente(nueva || null);
                setShowChecklistModal(false);
                smoothReset();
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Podium */}
      <AnimatePresence>
        {showPodiumModal && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PodiumModal onClose={() => setShowPodiumModal(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
