import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import AvatarRender from "@/components/AvatarRender";
import XecretoRegister from "@/components/XecretoRegister";
import XperienciasXtop from "@/components/XperienciasXtop";
import ChecklistGastro from "@/components/ChecklistGastro";
import PodiumModal from "@/components/PodiumModal";
import TreeCanvasIndividual from "@/components/TreeCanvasIndividual";
import TreeCanvasFamilia from "@/components/TreeCanvasFamilia";

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
      d="M22.5 18v-1c0-1.9 1.3-3.5 3-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    {/* Persona más a la derecha */}
    <circle cx="28.5" cy="8.5" r="2" fill="currentColor" />
    <path
      d="M28.5 18v-1c0-1.9 1.3-3.5 3-4"
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
    JSON.parse(localStorage.getItem("progresoXperiencias")) || {};

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
    "xorbeteria"
  ];

  Object.entries(progreso).forEach(([k, v]) => {
    if (xtopNombres.includes(k)) {
      xtopProgreso[k] = true;
    } else if (k.startsWith("x")) {
      xperienciasProgreso[k] = true;
    }
  });

  return (
    <div className="relative w-screen h-screen overflow-hidden font-apercu bg-[url('/img/fondoArbolDeLaVida.png')] bg-cover bg-center">
      <img
        src="/img/flores.png"
        alt="flores"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
      />

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

  <button
  onClick={() => setModoFamilia((prev) => !prev)}
  aria-pressed={modoFamilia}
  className="fixed top-4 right-4 z-50 flex flex-col items-center gap-0 text-gray-700 bg-transparent border-0 p-0 appearance-none shadow-none"
>
  <div className="flex flex-col items-center gap-1 bg-white/80 backdrop-blur-md rounded-2xl px-4 py-3 shadow-lg">
    {/* Toggle principal */}
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

    {/* Texto dentro del botón */}
    <span className="text-xs font-semibold text-gray-700 mt-1">
      {modoFamilia ? "Modo Familia" : "Modo Individual"}
    </span>
  </div>
</button>



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
                const nueva = Object.keys(nuevos).find(
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
    </div>
  );
}
