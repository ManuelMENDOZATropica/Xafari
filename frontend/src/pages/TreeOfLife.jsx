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

  const progreso = JSON.parse(
    localStorage.getItem("progresoXperiencias") || "{}"
  );

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

  const closePrimaryModals = () => {
    setShowXecretoModal(false);
    setShowXperienciasModal(false);
    setShowXelfiesModal(false);
    setShowMapaModal(false);
    setShowPodiumModal(false);
  };

  const handleToggleArbolMenu = () => {
    closePrimaryModals();
    setShowArbolMenu((prev) => !prev);
  };

  const handleOpenXperiencias = () => {
    closePrimaryModals();
    setShowXperienciasModal(true);
    setShowArbolMenu(false);
  };

  const handleOpenXecretos = () => {
    closePrimaryModals();
    setShowXecretoModal(true);
    setShowArbolMenu(false);
  };

  const handleOpenXelfies = () => {
    closePrimaryModals();
    setShowXelfiesModal(true);
    setShowArbolMenu(false);
  };

  const handleOpenMapa = () => {
    closePrimaryModals();
    setShowMapaModal(true);
    setShowArbolMenu(false);
  };

  const handleOpenPodio = () => {
    closePrimaryModals();
    setShowPodiumModal(true);
    setShowArbolMenu(false);
  };

  const handleOpenSettings = () => {
    closePrimaryModals();
    setShowArbolMenu(false);
    window.dispatchEvent(new Event("open-settings-menu"));
  };

  useEffect(() => {
    if (showXperienciasModal || showXecretoModal || showXelfiesModal) {
      setShowArbolMenu(false);
    }
  }, [showXperienciasModal, showXecretoModal, showXelfiesModal]);

  return (
    <div className="relative h-screen w-screen overflow-hidden font-apercu bg-[url('/img/fondoArbolDeLaVida.png')] bg-contain bg-no-repeat bg-center flex flex-col">
   
      <div className="absolute top-[65%] left-1/2 -translate-x-1/2 translate-y-[-700px] w-full max-w-5xl h-[55vh] flex items-center justify-center z-10 pointer-events-none">
        <div className="w-full h-full pointer-events-auto">
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
        onClick={() => setModoFamilia((prev) => !prev)}
        aria-pressed={modoFamilia}
        className="absolute top-4 left-4 z-40 flex flex-col items-center gap-0 text-gray-700 bg-transparent border-0 p-0 appearance-none shadow-none"
      >
        <div className="flex flex-col items-center gap-1 bg-[#C8C5C5] backdrop-blur-md rounded-2xl px-4 py-2 shadow-lg">
          <div className="flex items-center gap-3">
            {/* Opción FAMILIA */}
            <span
              className={`flex h-10 w-16 items-center justify-center rounded-[6px] transition-all duration-200 text-sm font-semibold
        ${
          modoFamilia
            ? "bg-[#939393] text-black shadow-inner"
            : "bg-[#C8C5C5] text-black"
        }`}
            >
              Familia
            </span>

            {/* Opción SOLO */}
            <span
              className={`flex h-10 w-16 items-center justify-center rounded-[6px] transition-all duration-200 text-sm font-semibold
        ${
          modoFamilia
            ? "bg-[#C8C5C5] text-black"
            : "bg-[#939393] text-black shadow-inner"
        }`}
            >
              Solo
            </span>
          </div>
        </div>
      </button>

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
                onClick: handleToggleArbolMenu,
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
            className="fixed inset-0 z-50 "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute top-[13%] left-[5%] right-[5%] bottom-[20%]">
              <div className="relative h-full w-full rounded-3xl overflow-hidden">
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
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showXperienciasModal && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute top-[13%] left-[5%] right-[5%] bottom-[20%]">
              <div className="relative h-full w-full rounded-3xl overflow-hidden ">
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
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showChecklistModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
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
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute top-[13%] left-[5%] right-[5%] bottom-[20%]">
              <div className="relative h-full w-full rounded-3xl overflow-hidden">
                <PodiumModal onClose={() => setShowPodiumModal(false)} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMapaModal && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute top-[13%] left-[5%] right-[5%] bottom-[20%]">
              <div className="relative h-full w-full rounded-3xl overflow-hidden">
                <ModalMapa onClose={() => setShowMapaModal(false)} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showXelfiesModal && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute top-[13%] left-[5%] right-[5%] bottom-[20%]">
              <div className="relative h-full w-full rounded-3xl overflow-hidden">
                <Xelfies onClose={() => setShowXelfiesModal(false)} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
