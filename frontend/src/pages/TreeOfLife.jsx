import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import LanguageToggle from "@/components/LanguageToggle";
import XafariContext from "@/components/XafariContext";

import XecretoRegister from "@/components/XecretoRegister";
import XperienciasXtop from "@/components/XperienciasXtop";
import ChecklistGastro from "@/components/ChecklistGastro";
import PodiumModal from "@/components/PodiumModal";
import TreeCanvasIndividual from "@/components/TreeCanvasIndividual";
import TreeCanvasFamilia from "@/components/TreeCanvasFamilia";
import ModalMapa from "@/components/ModalMapa";
import Xelfies from "@/components/xelfies";
import SoundMenu from "@/components/SoundMenu";

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

const SUPPORTED_LANGUAGES = ["es", "en", "pt"];

const LANGUAGE_FLAGS = {
  es: "🇲🇽",
  en: "🇺🇸",
  pt: "🇧🇷",
};

const SOUND_OPTIONS = [
  { value: "full", labelKey: "soundFull" },
  { value: "medium", labelKey: "soundMedium" },
  { value: "vibrate", labelKey: "soundVibrate" },
  { value: "off", labelKey: "soundOff" },
];

const SOUND_ICONS = {
  full: (
    <img src="/iconos/icon_volumen3.svg" alt="Full Volume" className="h-6 w-6 object-contain" />
  ),
  medium: (
    <img src="/iconos/icon_volumen2.svg" alt="Medium Volume" className="h-6 w-6 object-contain" />
  ),
  vibrate: (
    <img src="/iconos/icon_volumen1.svg" alt="Vibrate" className="h-6 w-6 object-contain" />
  ),
  off: (
    <img src="/iconos/icon_volumen0.png" alt="Muted" className="h-6 w-6 object-contain" />
  ),
};

export default function TreeOfLife() {
  const { t, i18n } = useTranslation();
  const { soundSetting, setSoundSetting, triggerClickFeedback } =
    useContext(XafariContext);

  const [modoFamilia, setModoFamilia] = useState(false);
  const [showChecklistModal, setShowChecklistModal] = useState(false);
  const [showPodiumModal, setShowPodiumModal] = useState(false);
  const [showXecretoModal, setShowXecretoModal] = useState(false);
  const [showXperienciasModal, setShowXperienciasModal] = useState(false);
  const [showXelfiesModal, setShowXelfiesModal] = useState(false);
  const [showMapaModal, setShowMapaModal] = useState(false);
  const [showArbolMenu, setShowArbolMenu] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const [xecretos, setXecretos] = useState({});
  const [respuestasCorrectas, setRespuestasCorrectas] = useState({});
  const [checklistProgreso, setChecklistProgreso] = useState({});
  const [insigniaReciente, setInsigniaReciente] = useState(null);
  const [checklistReciente, setChecklistReciente] = useState(null);
  const [guardianReciente, setGuardianReciente] = useState(null);

  const currentLanguage = i18n.language?.split("-")[0] ?? "es";

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

  Object.entries(progreso).forEach(([k]) => {
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
    setShowSettingsModal(true);
  };

  const handleSoundSelect = (value) => {
    setSoundSetting(value);
    if (typeof triggerClickFeedback === "function") {
      triggerClickFeedback(value);
    }
  };

  const handleLanguageSelect = (lang) => {
    i18n.changeLanguage(lang);
  };

  const handleCloseSettingsModal = () => {
    setShowSettingsModal(false);
  };

  // El submenu (Xperiencias/Xelfies/Xecretos) ya NO se cierra al abrir sus modales.

  return (
    <div className="relative h-screen w-screen overflow-hidden font-apercu bg-[url('/arbol/fondoArbol.png')] bg-cover bg-center flex flex-col">

      <div className="absolute inset-0 pb-[calc(2vh+210px)] pt-14 w-full flex items-center justify-center z-10 pointer-events-none">
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

      {/* Botón de sonido — esquina superior derecha */}
      <div className="absolute top-4 right-4 z-40">
        <SoundMenu />
      </div>

      <button
        type="button"
        onClick={() => setModoFamilia((prev) => !prev)}
        aria-pressed={modoFamilia}
        className="absolute top-4 left-4 z-40 flex items-center bg-[#80A850] rounded-full px-1.5 py-1.5 shadow-md gap-0 font-volume"
      >
        {/* Solo tab */}
        <span
          className={`flex items-center justify-center px-5 py-1.5 rounded-full text-sm font-volume transition-all duration-200
            ${!modoFamilia
              ? "bg-[#C9DCB5] text-[#233C15] shadow-sm"
              : "bg-transparent text-white"
            }`}
        >
          Solo
        </span>
        {/* Familia tab */}
        <span
          className={`flex items-center justify-center px-5 py-1.5 rounded-full text-sm font-volume transition-all duration-200
            ${modoFamilia
              ? "bg-[#C9DCB5] text-[#233C15] shadow-sm"
              : "bg-transparent text-white"
            }`}
        >
          Familia
        </span>
      </button>

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
                      className="flex flex-1 flex-col items-center justify-center gap-1 px-4 py-2 text-white transition-colors duration-200"
                      style={{
                        backgroundColor: activeSubmenuKey === key
                          ? "rgba(0,0,0,0.30)"
                          : "transparent",
                      }}
                    >
                      <img
                        src={icon}
                        alt={label}
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
                label: "Árbol",
                icon: "/iconos/icono arbol.png",
                active: showArbolMenu,
                onClick: handleToggleArbolMenu,
              },
              {
                key: "mapa",
                label: "Mapa",
                icon: "/iconos/icono Mapa.png",
                active: showMapaModal,
                onClick: handleOpenMapa,
              },
              {
                key: "podio",
                label: "Podio",
                icon: "/iconos/icono Podio.png",
                active: showPodiumModal,
                onClick: handleOpenPodio,
              },
              {
                key: "ajustes",
                label: "Ajustes",
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
                    alt={label}
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
            className="fixed inset-0 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute top-[8%] left-[12px] right-[12px]" style={{ bottom: "calc(2vh + 160px)" }}>
              <div className="relative h-full w-full rounded-3xl overflow-hidden bg-[#7b5226]">


                <div className="relative flex h-full flex-col overflow-hidden">
                  <div className="flex items-center justify-between px-6 pt-5 pb-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                        {t("settingsMenuTitle")}
                      </p>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {t("settingsMenuSubtitle")}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={handleCloseSettingsModal}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700 shadow hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-300"
                      aria-label={t("close")}
                    >
                      <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="m6 6 12 12M18 6 6 18" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex-1 space-y-6 overflow-y-auto px-6 pb-6">
                    <section className="space-y-3">
                      <h3 className="text-sm font-semibold text-gray-800">
                        {t("settingsLanguageTitle")}
                      </h3>
                      <div className="grid grid-cols-3 gap-3">
                        {SUPPORTED_LANGUAGES.map((lang) => {
                          const isActive = currentLanguage === lang;
                          return (
                            <button
                              key={lang}
                              type="button"
                              onClick={() => handleLanguageSelect(lang)}
                              className={`flex flex-col items-center justify-center gap-1 rounded-2xl border px-3 py-2 text-xs font-semibold uppercase transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${isActive
                                ? "border-sky-300 bg-sky-50 text-sky-700 shadow"
                                : "border-gray-200 bg-white/80 text-gray-700 shadow-sm hover:bg-white"
                                }`}
                              aria-pressed={isActive}
                            >
                              <span className="text-2xl" aria-hidden="true">
                                {LANGUAGE_FLAGS[lang]}
                              </span>
                              <span className="text-[0.65rem] leading-tight">
                                {t(`languages.${lang}`)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </section>

                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                    <section className="space-y-3">
                      <h3 className="text-sm font-semibold text-gray-800">
                        {t("settingsSoundTitle")}
                      </h3>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {SOUND_OPTIONS.map((option) => {
                          const isActive = soundSetting === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => handleSoundSelect(option.value)}
                              className={`flex flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-2 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${isActive
                                ? "border-sky-300 bg-sky-50 text-sky-700 shadow"
                                : "border-gray-200 bg-white/80 text-gray-700 shadow-sm hover:bg-white"
                                }`}
                              aria-pressed={isActive}
                            >
                              <span aria-hidden="true">{SOUND_ICONS[option.value]}</span>
                              <span className="text-xs font-semibold tracking-wide">
                                {t(option.labelKey)}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </section>

                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                    <section className="space-y-3">
                      <h3 className="text-sm font-semibold text-gray-800">
                        {t("settingsMenuLegalTitle") || "Privacidad"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {t("settingsLegalDescription") ||
                          "Consulta los avisos de privacidad y detalles legales del recorrido."}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        <Link
                          to="/privacy"
                          onClick={handleCloseSettingsModal}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#00b6e9] px-4 py-2 text-sm font-semibold text-white shadow hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-sky-300"
                        >
                          {t("settingsLegalButton") || "Aviso de Privacidad"}
                        </Link>
                        <LanguageToggle />
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showXecretoModal && (
          <motion.div
            className="fixed inset-0 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute top-[8%] left-[12px] right-[12px]" style={{ bottom: "calc(2vh + 160px)" }}>
              <div className="relative h-full w-full rounded-t-3xl overflow-hidden bg-[#7b5226]">
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
            className="fixed inset-0 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute top-[8%] left-[12px] right-[12px]" style={{ bottom: "calc(2vh + 160px)" }}>
              <div className="relative h-full w-full rounded-t-3xl overflow-hidden bg-[#7b5226]">
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
            className="fixed inset-0 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute top-[8%] left-[12px] right-[12px]" style={{ bottom: "calc(2vh + 160px)" }}>
              <div className="relative h-full w-full rounded-3xl overflow-hidden bg-[#7b5226]">
                <PodiumModal onClose={() => setShowPodiumModal(false)} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMapaModal && (
          <motion.div
            className="fixed inset-0 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute top-[8%] left-[12px] right-[12px]" style={{ bottom: "calc(2vh + 160px)" }}>
              <div className="relative h-full w-full rounded-3xl overflow-hidden bg-[#7b5226]">
                <ModalMapa onClose={() => setShowMapaModal(false)} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showXelfiesModal && (
          <motion.div
            className="fixed inset-0 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute top-[8%] left-[12px] right-[12px]" style={{ bottom: "calc(2vh + 160px)" }}>
              <div className="relative h-full w-full rounded-t-3xl overflow-hidden bg-[#7b5226]">
                <Xelfies onClose={() => setShowXelfiesModal(false)} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
