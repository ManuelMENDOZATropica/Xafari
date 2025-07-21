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
    setRespuestasCorrectas(JSON.parse(localStorage.getItem("progresoXperiencias") || "{}"));
    setChecklistProgreso(JSON.parse(localStorage.getItem("progresoChecklistGastro") || "{}"));
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

  return (
    <div className="relative w-screen h-screen overflow-hidden font-lufga bg-[url('/img/fondoArbolDeLaVida.png')] bg-cover bg-center">
      <img
        src="/img/flores.png"
        alt="flores"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
      />

      {modoFamilia ? (
        <TreeCanvasFamilia key="canvas-familia" />
      ) : (
        <TreeCanvasIndividual
          key="canvas-individual"
          xecretos={xecretos}
          respuestasCorrectas={respuestasCorrectas}
          checklistProgreso={checklistProgreso}
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
        onClick={() => setModoFamilia(!modoFamilia)}
        className="fixed top-4 right-4 z-50 bg-white/80 backdrop-blur-md border border-gray-300 rounded-full px-4 py-2 text-sm text-black shadow-lg hover:bg-white"
      >
        {modoFamilia ? "Modo Individual" : "Modo Familia"}
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
                const nuevos = JSON.parse(localStorage.getItem("xecretos") || "{}");
                const nueva = Object.keys(nuevos).find(k => nuevos[k] && !prev[k]);
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
                const nuevos = JSON.parse(localStorage.getItem("progresoXperiencias") || "{}");
                const nueva = Object.keys(nuevos).find(k => nuevos[k] && !prev[k]);
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
                const nuevos = JSON.parse(localStorage.getItem("progresoChecklistGastro") || "{}");
                const nueva = Object.keys(nuevos).find(k => nuevos[k] && !prev[k]);
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
