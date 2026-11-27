import { Component, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import i18next from "@/i18n";
import XafariContext from "@/components/XafariContext";

import XecretosCards from "@/components/XecretosCards";
import XperienciasXtop from "@/components/XperienciasXtop";
import PodiumModal from "@/components/PodiumModal";
import TreeCanvasIndividual from "@/components/TreeCanvasIndividual";
import TreeCanvasFamilia from "@/components/TreeCanvasFamilia";
import ModalMapa from "@/components/ModalMapa";
import Xelfies from "@/components/xelfies";
import SoundMenu from "@/components/SoundMenu";
import ModalFamilia from "@/components/ModalFamilia";
import ModalAjustes from "@/components/ModalAjustes";

// Error Boundary — captura crashes de iOS Safari en TreeCanvasFamilia
class FamiliaErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.error("[FamiliaErrorBoundary] crash capturado:", error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", height: "100%", gap: 12, opacity: 0.6,
        }}>
          <span aria-hidden="true" style={{ fontSize: 32 }}>🌳</span>
          <p style={{ fontSize: 13, color: "#3D1A00", fontFamily: "sans-serif" }}>
            {i18next.t("tree.familyError")}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{ fontSize: 12, color: "#3D1A00", textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}
          >
            {i18next.t("qr.retry")}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const FamilyIcon = (props) => (
  <svg
    viewBox="0 0 42 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    {...props}
  >
    <circle cx="2.5" cy="8.5" r="2" fill="currentColor" />
    <path
      d="M2.5 18v-1c0-1.9-1.3-3.5-3-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    <circle cx="8" cy="8.5" r="2" fill="currentColor" />
    <path
      d="M8 18v-1c0-1.9-1.3-3.5-3-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

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

    <circle cx="22.5" cy="8.5" r="2" fill="currentColor" />
    <path
      d="M22.5 18v-1c0-1.9-1.3-3.5-3-4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

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
  const location = useLocation();
  const navigate = useNavigate();
  const { xecretos, progresoXperiencias: respuestasCorrectas, progresoChecklist: checklistProgreso } =
    useContext(XafariContext);

  const [modoFamilia, setModoFamilia] = useState(false);
  const [showFamiliaModal, setShowFamiliaModal] = useState(false);
  const [showPodiumModal, setShowPodiumModal] = useState(false);
  const [showXecretoModal, setShowXecretoModal] = useState(false);
  const [showXperienciasModal, setShowXperienciasModal] = useState(false);
  const [showXelfiesModal, setShowXelfiesModal] = useState(false);
  const [showMapaModal, setShowMapaModal] = useState(false);
  const [mapaFilter, setMapaFilter] = useState("xperiencias");
  const [mapaFromXelfies, setMapaFromXelfies] = useState(false);
  const [showArbolMenu, setShowArbolMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [podioPerido, setPodioPerido] = useState("siempre");

  // Ocultar botón Solo/Familia cuando cualquier modal está abierto
  const anyModalOpen = showPodiumModal || showXecretoModal || showXperienciasModal ||
    showXelfiesModal || showMapaModal || showSettingsModal;

  // Insignia recién ganada (p. ej. al volver de /q/...) o modal a abrir al llegar.
  const [insigniaReciente, setInsigniaReciente] = useState(() => location.state?.insigniaReciente || null);
  const [showXperienciasFromState] = useState(() => location.state?.open === "xperiencias");

  useEffect(() => {
    if (showXperienciasFromState) setShowXperienciasModal(true);
    // Limpia el state del historial para que recargar no repita la animación.
    if (location.state) navigate(location.pathname, { replace: true, state: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al montar
  }, []);

  useEffect(() => {
    if (!insigniaReciente) return undefined;
    const timeout = setTimeout(() => setInsigniaReciente(null), 4000); // 4 s para que la animación sea visible
    return () => clearTimeout(timeout);
  }, [insigniaReciente]);


  const xtopNombres = [
    "camion", "caracola", "conejo", "drink", "estrella", "kayak",
    "mascarajaguar", "patin", "piscina", "poolpo", "salvavidas",
    "teatro", "tobogan", "tv", "vinil", "xpiral", "xorbeteria",
  ];

  // Derived from context (BD) — reactive
  const xtopProgreso = {};
  Object.keys(respuestasCorrectas).forEach((k) => {
    if (xtopNombres.includes(k)) xtopProgreso[k] = true;
  });


  const closePrimaryModals = () => {
    setShowXecretoModal(false);
    setShowXperienciasModal(false);
    setShowXelfiesModal(false);
    setShowMapaModal(false);
    setShowPodiumModal(false);
    setShowSettingsModal(false);
  };

  const handleToggleArbolMenu = () => {
    closePrimaryModals();
    setShowArbolMenu((prev) => !prev);
  };

  // Clave activa derivada del estado de modales (sin estado extra)
  const activeSubmenuKey = showXperienciasModal
    ? "xperiencias"
    : showXelfiesModal
      ? "xelfies"
      : showXecretoModal
        ? "xecretos"
        : null;

  const handleOpenXperiencias = () => {
    closePrimaryModals();
    setShowXperienciasModal(true);
    // No cerramos el submenu: setShowArbolMenu(false) removido
  };

  const handleOpenXecretos = () => {
    closePrimaryModals();
    setShowXecretoModal(true);
  };

  const handleOpenXelfies = () => {
    closePrimaryModals();
    setShowXelfiesModal(true);
  };

  const handleOpenMapa = (filter = "xperiencias") => {
    const fromXelfies = filter === "xelfies";
    if (!fromXelfies) {
      closePrimaryModals();
      setShowArbolMenu(false);
    }
    setMapaFilter(filter);
    setMapaFromXelfies(fromXelfies);
    setShowMapaModal(true);
  };

  const handleOpenPodio = () => {
    closePrimaryModals();
    setShowPodiumModal(true);
    setShowArbolMenu(false);
  };

  const handleOpenSettings = () => {
    closePrimaryModals();
    setShowArbolMenu(false);
    setShowSettingsModal(true);
  };

  const handleCloseSettingsModal = () => {
    setShowSettingsModal(false);
  };

  // El submenu (Xperiencias/Xelfies/Xecretos) ya NO se cierra al abrir sus modales.

  return (
    <div className="relative h-screen w-screen overflow-hidden font-apercu bg-[url('/arbol/fondoArbol.webp')] bg-cover bg-center flex flex-col">

      <div className="absolute inset-0 pb-[calc(2vh+210px)] pt-14 w-full flex items-center justify-center z-10 pointer-events-none">
        <div className="w-full h-full pointer-events-auto">
          {modoFamilia ? (
            <FamiliaErrorBoundary key={`familia-${modoFamilia}`}>
              <TreeCanvasFamilia
                key="canvas-familia"
                insigniaReciente={insigniaReciente}
              />
            </FamiliaErrorBoundary>
          ) : (
            <TreeCanvasIndividual
              key="canvas-individual"
              xecretos={xecretos}
              checklistProgreso={checklistProgreso}
              xtopProgreso={xtopProgreso}
              insigniaReciente={insigniaReciente}
            />
          )}
        </div>
      </div>

      {/* Botón de sonido — esquina superior derecha */}
      <div className="absolute top-4 right-4 z-40 flex flex-col items-end gap-2">
        <SoundMenu />
        {/* Botón familia — aparece cuando modoFamilia está activo */}
        <AnimatePresence>
          {modoFamilia && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowFamiliaModal(true)}
              aria-label={t("family.title")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full shadow-md active:scale-95 transition-all"
              style={{ backgroundColor: "#3D1A00" }}
            >
              {/* QR icon */}
              <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="#F2E8DA" strokeWidth={2}>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <path strokeLinecap="round" d="M14 14h3M17 14v3M14 17h3M17 17v3" />
              </svg>
              {/* + icon */}
              <svg aria-hidden="true" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="#F2E8DA" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Botón Solo/Familia — se oculta cuando hay un modal abierto */}
      {!anyModalOpen && (
        <button
          type="button"
          onClick={() => setModoFamilia((prev) => !prev)}
          aria-pressed={modoFamilia}
          className="absolute top-4 left-4 z-40 flex items-center bg-[#80A850] rounded-full px-1.5 py-1.5 shadow-md gap-0 font-volume"
        >
          <span className={`flex items-center justify-center px-5 py-1.5 rounded-full text-sm font-volume transition-all duration-200 ${!modoFamilia ? "bg-[#C9DCB5] text-[#233C15] shadow-sm" : "bg-transparent text-white"}`}>
            {t("tree.solo")}
          </span>
          <span className={`flex items-center justify-center px-5 py-1.5 rounded-full text-sm font-volume transition-all duration-200 ${modoFamilia ? "bg-[#C9DCB5] text-[#233C15] shadow-sm" : "bg-transparent text-white"}`}>
            {t("tree.family")}
          </span>
        </button>
      )}

      {/* Pill Hoy/Mes/Siempre — aparece cuando el podio está abierto */}
      {showPodiumModal && (
        <div className="absolute top-4 left-4 z-40 flex items-center bg-[#80A850] rounded-full px-1.5 py-1.5 shadow-md gap-0 font-volume">
          {["hoy", "mes", "siempre"].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPodioPerido(p)}
              className={`flex items-center justify-center px-4 py-1.5 rounded-full text-sm font-volume transition-all duration-200 ${
                podioPerido === p ? "bg-[#C9DCB5] text-[#233C15] shadow-sm" : "bg-transparent text-white"
              }`}
            >
              {t(`leaderboard.period.${p}`)}
            </button>
          ))}
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-30 pb-[2vh] pt-3 bg-transparent pointer-events-none">
        <div className="flex flex-col items-center gap-3 px-3 pointer-events-auto w-full">
          <AnimatePresence>
            {showArbolMenu && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                className="w-full flex justify-center"
              >
                <div className="flex items-stretch gap-0 rounded-2xl bg-[#7b5226] text-white shadow-xl max-w-3xl w-full justify-center overflow-hidden">
                  {[
                    {
                      key: "xperiencias",
                      label: t("xperiencesLabel"),
                      icon: "/iconos/xperiencias.png",
                      onClick: handleOpenXperiencias,
                    },
                    {
                      key: "xelfies",
                      label: t("xelfies"),
                      icon: "/iconos/xelfies.png",
                      onClick: handleOpenXelfies,
                    },
                    {
                      key: "xecretos",
                      label: t("secretsLabel"),
                      icon: "/iconos/xecretos.png",
                      onClick: handleOpenXecretos,
                    },
                  ].map(({ key, label, icon, onClick }) => (
                    <button
                      type="button"
                      key={key}
                      onClick={onClick}
                      className="flex flex-1 flex-col items-center justify-center gap-1 px-4 py-2 text-white transition-colors duration-200"
                      style={{
                        backgroundColor: activeSubmenuKey === key
                          ? "rgba(0,0,0,0.30)"
                          : "transparent",
                      }}
                    >
                      <img
                        src={icon}
                        alt=""
                        className="object-contain"
                        style={{ width: "34px", height: "34px" }}
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

          <div className="grid grid-cols-4 gap-2 w-full">
            {[
              {
                key: "arbol",
                label: t("nav.tree"),
                icon: "/iconos/icono arbol.png",
                active: showArbolMenu,
                onClick: handleToggleArbolMenu,
              },
              {
                key: "mapa",
                label: t("nav.map"),
                icon: "/iconos/icono Mapa.png",
                active: showMapaModal,
                onClick: handleOpenMapa,
              },
              {
                key: "podio",
                label: t("nav.podium"),
                icon: "/iconos/icono Podio.png",
                active: showPodiumModal,
                onClick: handleOpenPodio,
              },
              {
                key: "ajustes",
                label: t("nav.settings"),
                icon: "/iconos/icono Ajustes.png",
                active: showSettingsModal,
                onClick: handleOpenSettings,
              },
            ].map(({ key, label, icon, active, onClick }) => (
              <button
                type="button"
                key={key}
                onClick={onClick}
                className="flex flex-col items-center shadow-lg text-white transition-all duration-200 w-full"
                style={{ backgroundColor: active ? "rgba(35, 60, 21, 1)" : "#80A850", aspectRatio: "1 / 1.38", borderRadius: "10px", paddingTop: "6px", paddingLeft: "6px", paddingRight: "6px" }}
              >
                <div className="flex flex-1 items-center justify-center w-full">
                  <img
                    src={icon}
                    alt=""
                    className="w-full object-contain"
                    style={{ maxHeight: "85%" }}
                  />
                </div>
                <span style={{ fontFamily: "'Volume TC Sans', sans-serif", fontSize: "14px", lineHeight: "1", paddingBottom: "4px" }} className="w-full text-center">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSettingsModal && (
          <motion.div
            className="fixed inset-0 z-20 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="pointer-events-auto absolute top-[8%] left-[12px] right-[12px]" style={{ bottom: "calc(2vh + 160px)" }}>
              <div className="relative h-full w-full rounded-3xl overflow-hidden bg-[#7b5226]">


                <ModalAjustes onClose={handleCloseSettingsModal} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFamiliaModal && (
          <motion.div
            className="fixed inset-0 z-40 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="pointer-events-auto absolute top-[8%] left-[12px] right-[12px]" style={{ bottom: "calc(2vh + 221px)" }}>
              <div className="relative h-full w-full rounded-3xl overflow-hidden">
                <ModalFamilia onClose={() => setShowFamiliaModal(false)} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showXecretoModal && (
          <motion.div
            className="fixed inset-0 z-20 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="pointer-events-auto absolute top-[8%] left-[12px] right-[12px]" style={{ bottom: "calc(2vh + 221px)" }}>
              <div className="relative h-full w-full overflow-hidden">
                <XecretosCards
                  onClose={(nuevaInsignia) => {
                    if (nuevaInsignia && typeof nuevaInsignia === "string") {
                      setInsigniaReciente(nuevaInsignia);
                    }
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
            className="fixed inset-0 z-20 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="pointer-events-auto absolute top-[8%] left-[12px] right-[12px]" style={{ bottom: "calc(2vh + 160px)" }}>
              <div className="relative h-full w-full rounded-t-3xl overflow-hidden bg-[#7b5226]">
                <XperienciasXtop
                  onClose={(nuevaInsignia) => {
                    // nuevaInsignia viene de XperienciasXtop al completar
                    setInsigniaReciente(nuevaInsignia || null);
                    setShowXperienciasModal(false);
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPodiumModal && (
          <motion.div
            className="fixed inset-0 z-20 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="pointer-events-auto absolute top-[8%] left-[12px] right-[12px]" style={{ bottom: "calc(2vh + 160px)" }}>
              <div className="relative h-full w-full rounded-3xl overflow-hidden bg-[#7b5226]">
                <PodiumModal onClose={() => setShowPodiumModal(false)} periodo={podioPerido} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMapaModal && (
          <motion.div
            className={`fixed inset-0 pointer-events-none ${mapaFromXelfies ? "z-30" : "z-20"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="pointer-events-auto absolute top-[8%] left-[12px] right-[12px]" style={{ bottom: mapaFromXelfies ? "calc(2vh + 221px)" : "calc(2vh + 160px)" }}>
              <div className="relative h-full w-full rounded-3xl overflow-hidden bg-[#7b5226]">
                <ModalMapa
                  initialFilter={mapaFilter}
                  fromXelfies={mapaFromXelfies}
                  onClose={() => {
                    setShowMapaModal(false);
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showXelfiesModal && (
          <motion.div
            className="fixed inset-0 z-20 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="pointer-events-auto absolute top-[8%] left-[12px] right-[12px]" style={{ bottom: "calc(2vh + 160px)" }}>
              <div className="relative h-full w-full rounded-t-3xl overflow-hidden bg-[#7b5226]">
                <Xelfies onClose={() => setShowXelfiesModal(false)} onOpenMapa={() => handleOpenMapa("xelfies")} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
