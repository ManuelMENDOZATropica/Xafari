import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

// Componentes originales importados
import XecretoRegister from "@/components/XecretoRegister";
import XperienciasXtop from "@/components/XperienciasXtop";
import ChecklistGastro from "@/components/ChecklistGastro";
import PodiumModal from "@/components/PodiumModal";
import TreeCanvasIndividual from "@/components/TreeCanvasIndividual";
import TreeCanvasFamilia from "@/components/TreeCanvasFamilia";
import ModalMapa from "@/components/ModalMapa";
import Xelfies from "@/components/xelfies";

const FamilyIcon = (props) => (
  <svg
    viewBox="0 0 42 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...props}
  >
    {/* Persona más a la izquierda */}
    <circle cx="2.5" cy="8.5" r="2" fill="currentColor" />
    <path
      d="M2.5 18v-1c0-1.9-1.3-3.5-3-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    {/* Persona izquierda */}
    <circle cx="8" cy="8.5" r="2" fill="currentColor" />
    <path
      d="M8 18v-1c0-1.9-1.3-3.5-3-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    {/* Persona central */}
    <path
      d="M13 5.5a2.5 2.5 0 1 1 5 0 2.5 2.5 0 0 1-5 0Z"
      fill="currentColor"
    />
    <path
      d="M9.5 18v-1.2A4.8 4.8 0 0 1 14.3 12h2.4a4.8 4.8 0 0 1 4.8 4.8V18"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    {/* Persona derecha */}
    <circle cx="22.5" cy="8.5" r="2" fill="currentColor" />
    <path
      d="M22.5 18v-1c0-1.9-1.3-3.5-3-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    {/* Persona más a la derecha */}
    <circle cx="28.5" cy="8.5" r="2" fill="currentColor" />
    <path
      d="M28.5 18v-1c0-1.9-1.3-3.5-3-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const IndividualIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...props}
  >
    <circle cx="12" cy="6.5" r="3" fill="currentColor" />
    <path
      d="M6 18v-1a5.5 5.5 0 0 1 5.5-5.5h1a5.5 5.5 0 0 1 5.5 5.5v1"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export default function TreeOfLife() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [modoFamilia, setModoFamilia] = useState(false);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [showPodiumModal, setShowPodiumModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showXecretoModal, setShowXecretoModal] = useState(false);
  const [showXperienciasModal, setShowXperienciasModal] = useState(false);
  const [showXelfiesModal, setShowXelfiesModal] = useState(false);
  const [showMapaModal, setShowMapaModal] = useState(false);
  const [showArbolMenu, setShowArbolMenu] = useState(false);

  const [xecretos, setXecretos] = useState({});
  const [respuestasCorrectas, setRespuestasCorrectas] = useState({});
  const [checklistProgreso, setChecklistProgreso] = useState({});
  const [insigniaReciente, setInsigniaReciente] = useState(null);
  const [checklistReciente, setChecklistReciente] = useState(null);
  const [guardianReciente, setGuardianReciente] = useState(null);

  useEffect(() => {
    setXecretos(JSON.parse(localStorage.getItem("xecretos") || "{}"));
    setRespuestasCorrectas(
      JSON.parse(localStorage.getItem("progresoXperiencias") || "{}")
    );
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

  const progreso =
    JSON.parse(localStorage.getItem("progresoXperiencias") || "{}");

  const xtopProgreso = {};
  const xperienciasProgreso = {};

  const xtopNombres = [
    "camion",
    "caracola",
    "conejo",
    "drink",
    "estrella",
    "kayak",
    "mascarajaguar",
    "patin",
    "piscina",
    "poolpo",
    "salvavidas",
    "teatro",
    "tobogan",
    "tv",
    "vinil",
    "xpiral",
    "xorbeteria",
  ];

  Object.entries(progreso).forEach(([k, v]) => {
    if (xtopNombres.includes(k)) {
      xtopProgreso[k] = true;
    } else if (k.startsWith("x")) {
      xperienciasProgreso[k] = true;
    }
  });

  const handleOpenXperiencias = () => {
    setShowXperienciasModal(true);
    setShowArbolMenu(false);
  };

  const handleOpenXecretos = () => {
    setShowXecretoModal(true);
    setShowArbolMenu(false);
  };

  const handleOpenXelfies = () => {
    setShowXelfiesModal(true);
    setShowArbolMenu(false);
  };

  const handleOpenMapa = () => {
    setShowMapaModal(true);
    setShowArbolMenu(false);
  };

  const handleOpenPodio = () => {
    setShowPodiumModal(true);
    setShowArbolMenu(false);
  };

  const handleOpenSettings = () => {
    setShowArbolMenu(false);
    window.dispatchEvent(new Event("open-settings-menu"));
  };

  useEffect(() => {
    if (showXperienciasModal || showXecretoModal || showXelfiesModal) {
      setShowArbolMenu(false);
    }
  }, [showXperienciasModal, showXecretoModal, showXelfiesModal]);

  return (
    // CORRECCIÓN 1: Se usa 'h-screen' y 'bg-contain bg-no-repeat bg-center' para asegurar que la imagen de fondo se muestre completa y los menús no se salgan.
    <div className="relative h-screen w-screen overflow-hidden font-apercu bg-[url('/img/fondoArbolDeLaVida.png')] bg-contain bg-no-repeat bg-center flex flex-col">
      <img
        src="/img/flores.png"
        alt="flores"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
      />

      {/* CORRECCIÓN 2: Se ajusta el padding-top (pt-20) y padding-bottom (pb-[160px] / sm:pb-[140px]) para
          dejar espacio al menú fijo inferior y los botones superiores. Esto asegura que el Canvas
          ocupe el espacio restante sin solaparse con el footer fijo. */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pt-20 pb-[160px] sm:pb-[140px]">
        <div className="w-full max-w-5xl h-full flex items-center justify-center">
          {modoFamilia ? (
            <TreeCanvasFamilia
              key="canvas-familia"
              insigniaReciente={insigniaReciente}
            />
          ) : (
            <TreeCanvasIndividual
              key="canvas-individual"
              xecretos={xecretos}
              respuestasCorrectas={respuestasCorrectas}
              checklistProgreso={checklistProgreso}
              xperienciasProgreso={xperienciasProgreso}
              xtopProgreso={xtopProgreso}
              insigniaReciente={insigniaReciente}
            />
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowProfileMenu(!showProfileMenu)}
        title="Perfil"
        className="absolute top-4 left-4 w-14 h-14 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-gray-300 flex items-center justify-center z-40"
      >
        <img
          src="/iconos/perfil.png"
          alt="perfil"
          className="w-10 h-10 object-contain pointer-events-none"
        />
      </button>

      <button
        type="button"
        onClick={() => setModoFamilia((prev) => !prev)}
        aria-pressed={modoFamilia}
        className="absolute top-4 right-4 z-40 flex flex-col items-center gap-0 text-gray-700 bg-transparent border-0 p-0 appearance-none shadow-none"
      >
        <div className="flex flex-col items-center gap-1 bg-white/80 backdrop-blur-md rounded-2xl px-4 py-3 shadow-lg">
          <div className="flex items-center gap-3">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ${
                modoFamilia
                  ? "bg-amber-200 text-amber-700 shadow-inner"
                  : "bg-white text-gray-400"
              }`}
            >
              <FamilyIcon className="h-8 w-8 ml-2" />
            </span>

            <span className="relative flex h-6 w-12 items-center rounded-full bg-gray-200">
              <span
                className={`absolute h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ease-out ${
                  modoFamilia ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </span>

            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ${
                modoFamilia
                  ? "bg-white text-gray-400"
                  : "bg-sky-200 text-sky-700 shadow-inner"
              }`}
            >
              <IndividualIcon className="h-5 w-5" />
            </span>
          </div>

          <span className="text-xs font-semibold text-gray-700 mt-1">
            {modoFamilia ? "Modo Familia" : "Modo Individual"}
          </span>
        </div>
      </button>

      {showProfileMenu && (
        <div className="absolute top-20 left-4 w-48 bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-300 p-4 z-40">
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

      {/* CORRECCIÓN 3: El menú inferior se hace 'fixed' en la parte inferior de la pantalla */}
      <div className="fixed bottom-0 left-0 right-0 z-30 pb-5 pt-3 bg-transparent pointer-events-none">
        <div className="flex flex-col items-center gap-3 px-4 pointer-events-auto">
          <AnimatePresence>
            {showArbolMenu && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                className="w-full flex justify-center"
              >
                <div className="flex items-stretch gap-3 rounded-2xl bg-[#7b5226] text-white px-4 py-3 shadow-xl max-w-3xl w-full justify-center">
                  {[
                    {
                      key: "xperiencias",
                      label: "Xperiencias",
                      icon: "/iconos/xperiencias.png",
                      onClick: handleOpenXperiencias,
                    },
                    {
                      key: "xelfies",
                      label: "Xelfies",
                      icon: "/iconos/xelfies.png",
                      onClick: handleOpenXelfies,
                    },
                    {
                      key: "xecretos",
                      label: "Xecretos",
                      icon: "/iconos/xecretos.png",
                      onClick: handleOpenXecretos,
                    },
                  ].map(({ key, label, icon, onClick }) => (
                    <button
                      type="button"
                      key={key}
                      onClick={onClick}
                      className="flex flex-col items-center justify-center gap-2 px-6 py-2 text-white"
                    >
                      <img
                        src={icon}
                        alt={label}
                        className="w-12 h-12 object-contain"
                      />
                      <span
                        style={{ fontFamily: "'Volume TC Sans', sans-serif" }}
                        className="text-sm tracking-wide"
                      >
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-4 gap-3 w-full max-w-4xl">
            {[
              {
                key: "arbol",
                label: "Árbol",
                icon: "/iconos/menuArbol.png",
                color: "#f36c12",
                onClick: () => setShowArbolMenu((prev) => !prev),
              },
              {
                key: "mapa",
                label: "Mapa",
                icon: "/iconos/menuMapa.png",
                color: "#0b932b",
                onClick: handleOpenMapa,
              },
              {
                key: "podio",
                label: "Podio",
                icon: "/iconos/menuPodio.png",
                color: "#f5a300",
                onClick: handleOpenPodio,
              },
              {
                key: "ajustes",
                label: "Ajustes",
                icon: "/iconos/menuAjuste.png",
                color: "#00b6e9",
                onClick: handleOpenSettings,
              },
            ].map(({ key, label, icon, color, onClick }) => (
              <button
                type="button"
                key={key}
                onClick={onClick}
                className="flex flex-col items-center justify-center gap-2 py-3 rounded-2xl shadow-lg text-white transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: color }}
              >
                <img
                  src={icon}
                  alt={label}
                  className="w-10 h-10 object-contain"
                />
                <span className="text-sm font-semibold">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

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
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

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
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

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
                const nueva = Object.keys(nueuos).find(
                  (k) => nuevos[k] && !prev[k]
                );
                setChecklistProgreso(nuevos);
                setChecklistReciente(nueva || null);
                setShowChecklistModal(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

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

      <AnimatePresence>
        {showMapaModal && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalMapa onClose={() => setShowMapaModal(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showXelfiesModal && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Xelfies onClose={() => setShowXelfiesModal(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}