import { useState, useEffect, useRef, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import XafariContext from "../components/XafariContext";

const bodyOptions = ["/avatares/cuerpoNiño.png", "/avatares/cuerpoAdulto.png"];
const faceOptions = Array.from({ length: 23 }, (_, i) => `/avatares/cara (${i + 1}).png`);

// ─── Calcula edad en años completos ──────────────────────────────────────────
function calcularEdad(birthdateStr) {
  if (!birthdateStr) return null;
  const hoy = new Date();
  const nac = new Date(birthdateStr);
  if (isNaN(nac)) return null;
  let edad = hoy.getFullYear() - nac.getFullYear();
  const m = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
  return edad;
}

function useSelection(options, initialIndex = 0) {
  const [index, setIndex] = useState(initialIndex);
  return [index, options[index], setIndex, options];
}

export default function AvatarSelection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { playWardrobeSound } = useContext(XafariContext);

  let user = null;
  try {
    const stored = localStorage.getItem("user");
    user = stored ? JSON.parse(stored) : null;
  } catch (e) {
    user = null;
  }

  const token = localStorage.getItem("token");
  const avatar = user?.avatar || {};

  // ── Determinar tipo de cuerpo por edad ─────────────────────────────────────
  const edad = calcularEdad(user?.birthdate);
  // >= 16 → adulto (índice 1), < 16 o desconocida → niño (índice 0)
  const bodyForzado = (edad !== null && edad >= 16) ? 1 : 0;

  const [faceIndex, faceImg, setFace, faceList] = useSelection(faceOptions, avatar.faceOptions ?? 0);
  const [activeTab, setActiveTab] = useState("face");

  // Imagen de cuerpo siempre bloqueada por edad
  const bodyImg = bodyOptions[bodyForzado];

  const handleSaveAvatar = async () => {
    const newAvatar = {
      bodyOptions: bodyForzado,   // siempre el determinado por edad
      faceOptions: faceIndex,
    };

    const rawUser = localStorage.getItem("user");
    const rawToken = localStorage.getItem("token");

    let currentUser = null;
    try {
      currentUser = rawUser ? JSON.parse(rawUser) : null;
    } catch (e) {
      currentUser = null;
    }

    if (!currentUser) {
      localStorage.setItem("user", JSON.stringify({ name: "Invitado", avatar: newAvatar }));
      navigate("/treeoflife");
      return;
    }

    if (currentUser.name === "Invitado" || !rawToken) {
      localStorage.setItem("user", JSON.stringify({ ...currentUser, avatar: newAvatar }));
      navigate("/treeoflife");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "/api"}/user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${rawToken}`,
        },
        body: JSON.stringify({ ...currentUser, avatar: newAvatar }),
      });

      if (!response.ok) throw new Error("Fallo al guardar el avatar");

      const updatedUser = await response.json();
      localStorage.setItem("user", JSON.stringify(updatedUser));
      navigate("/treeoflife");
    } catch (err) {
      alert("Error al guardar el avatar.");
      console.error("❌ Error al guardar en backend:", err);
    }
  };

  // Solo tab de cara — cuerpo está bloqueado por edad
  const tabs = [
    { key: "face", label: t("face"), set: setFace, list: faceList, current: faceIndex },
  ];

  return (
    <div className="relative min-h-screen w-screen overflow-hidden font-apercu">
      <img src="/img/fondoPrincipal.jpg" alt="Fondo Avatar" className="absolute inset-0 w-full h-full object-cover object-bottom z-0" />

      <div className="absolute top-0 left-0 w-full z-20 px-4 pt-[env(safe-area-inset-top)] mt-4 pb-2 flex justify-start items-center">
        <button
          onClick={() => navigate(-1)}
          className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow border border-gray-300 hover:bg-white transition-all active:scale-95"
          aria-label={t("back")}
        >
          <img src="/iconos/icon_regresar.svg" alt={t("back")} className="w-6 h-6" />
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center w-full px-4 pt-24 pb-[env(safe-area-inset-bottom)] overflow-y-auto">
        <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-xl shadow-md mb-2 w-full max-w-sm">
          <h1 className="text-xl md:text-2xl font-bold text-center text-gray-800">
            {t("chooseYourStyle")}
          </h1>
          {/* Indicador de tipo de avatar por edad */}
          <p className="text-center text-xs text-gray-500 mt-1">
            {bodyForzado === 1 ? "Avatar adulto (≥16 años)" : "Avatar niño (<16 años)"}
          </p>
        </div>

        {/* Preview del avatar */}
        <div className="relative w-[60vw] max-w-[200px] h-[80vw] max-h-[320px] flex items-center justify-center mb-6">
          <img
            src={bodyImg}
            alt="body"
            className={`absolute w-full h-full object-contain transition-all duration-300 ${
              bodyForzado === 0 ? "scale-[0.85] translate-y-[5%]" : "scale-100"
            }`}
          />
          <img
            src={faceImg}
            alt="face"
            className={`absolute w-full h-full object-contain transition-all duration-300 ${
              bodyForzado === 0
                ? "scale-[0.5] -translate-y-[5%]"
                : "scale-[0.7] -translate-y-[20%] -translate-x-[-5%]"
            }`}
          />
        </div>

        {/* Solo tab de cara — sin selector de cuerpo */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeTab === tab.key
                  ? "bg-emerald-600/90 text-white shadow-lg scale-105 border border-emerald-500/50"
                  : "bg-white/50 text-black border border-white/40 backdrop-blur-md hover:bg-white/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full max-w-sm bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md mb-2 max-h-[40vh] overflow-y-auto">
          {tabs
            .filter((tab) => tab.key === activeTab)
            .map((tab) => {
              const scrollRef = useRef();
              const [showArrow, setShowArrow] = useState(false);
              const zoom = { scale: "scale-[2.5]", translateY: "-translate-y-[0%]" };

              useEffect(() => {
                const el = scrollRef.current;
                const checkScroll = () => {
                  if (!el) return;
                  setShowArrow(
                    el.scrollWidth > el.clientWidth &&
                    el.scrollLeft + el.clientWidth < el.scrollWidth - 10
                  );
                };
                checkScroll();
                el?.addEventListener("scroll", checkScroll);
                return () => el?.removeEventListener("scroll", checkScroll);
              }, [tab.list]);

              return (
                <div key={tab.key} className="relative w-full px-2">
                  <div
                    ref={scrollRef}
                    className={`flex items-center gap-4 pr-6 scroll-smooth ${
                      tab.list.length <= 3 ? "justify-center overflow-x-hidden" : "overflow-x-auto"
                    }`}
                  >
                    {tab.list.map((opt, i) => {
                      const isCurrent = i === tab.current;
                      const handleSelect = () => {
                        if (typeof playWardrobeSound === "function") playWardrobeSound();
                        tab.set(i);
                      };

                      return (
                        <div key={i} className="flex-shrink-0">
                          <div
                            role="button"
                            tabIndex={0}
                            onClick={handleSelect}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                handleSelect();
                              }
                            }}
                            data-skip-sound-click="true"
                            aria-pressed={isCurrent}
                            className={`w-16 h-16 flex items-center justify-center border-2 rounded cursor-pointer ${
                              isCurrent ? "border-green-600" : "border-transparent"
                            } bg-white overflow-hidden`}
                          >
                            {opt ? (
                              <img
                                src={opt}
                                alt={`face_${i}`}
                                className={`w-full h-full object-contain transform ${zoom.scale} ${zoom.translateY}`}
                              />
                            ) : (
                              <span className="text-xl font-bold text-gray-400">×</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {showArrow && (
                    <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-green-600 text-2xl animate-bounce-right">
                      →
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        <button
          onClick={handleSaveAvatar}
          className="bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-[0.2em] py-3.5 px-8 rounded-full shadow-lg hover:bg-emerald-700 transition-all active:scale-95 w-full max-w-sm border border-emerald-500/30"
        >
          {t("saveAvatarAndContinue")}
        </button>
      </div>
    </div>
  );
}
