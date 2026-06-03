import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import XafariContext from "../components/XafariContext";
import { getFaceStyle, getExpressionStyle } from "../components/AvatarRender";

const bodyOptions = ["/avatares/cuerpoNiño.png", "/avatares/cuerpoAdulto.png"];
const faceOptions = Array.from({ length: 23 }, (_, i) => `/avatares/cara (${i + 1}).png`);
const expressionOptions = [null, ...Array.from({ length: 14 }, (_, i) => `/avatares/expresiones/expresion (${i + 1}).png`)];

// ── Calcula edad completa ─────────────────────────────────────────────────────
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

function useSelection(options, _isObject = false, initialIndex = 0) {
  const [index, setIndex] = useState(initialIndex || 0);
  const set = (i) => setIndex(i);
  const value = options[index];
  return [index, value, set, options];
}

export default function AvatarSelection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, setUser, token, playWardrobeSound } = useContext(XafariContext);

  // ── Body forzado por edad ─────────────────────────────────────────────────
  const edad = calcularEdad(user?.birthdate);
  const bodyForzado = (edad !== null && edad >= 16) ? 1 : 0;
  const bodyImg = bodyOptions[bodyForzado];

  const [faceIndex, faceImg, setFace, faceList] = useSelection(faceOptions, false, user?.avatar?.faceOptions);
  const [expressionIndex, expressionImg, setExpression, expressionList] = useSelection(expressionOptions, false, user?.avatar?.expressionOptions);
  const [activeTab, setActiveTab] = useState("face");

  useEffect(() => {
    setUser((oldUser) => ({
      ...oldUser,
      avatar: {
        ...oldUser.avatar,
        bodyOptions: bodyForzado,
        faceOptions: faceIndex,
        expressionOptions: expressionIndex,
      },
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bodyForzado, faceIndex, expressionIndex]);

  const handleSaveAvatar = useCallback(() => {
    if (!token) return navigate("/bienvenida");

    (async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || "/api"}/user`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(user),
        });

        if (!response.ok) {
          console.error("❌ Error al actualizar en backend:", response.status);
          alert("No se pudo guardar el avatar.");
          return;
        }

        const data = await response.json().catch(() => ({}));
        if (data.user) {
          setUser((prev) => ({ ...prev, ...data.user }));
          console.log("✅ Avatar actualizado en backend:", data.user.avatar);
        }

        navigate("/bienvenida");
      } catch (err) {
        console.error("🔥 Error al guardar en backend:", err);
        alert("Error al guardar el avatar.");
      }
    })();
  }, [token, user, navigate, setUser]);

  const tabs = [
    // Cuerpo quitado — bloqueado por edad
    { key: "face", label: t("face"), set: setFace, list: faceList, current: faceIndex },
    { key: "expression", label: t("expression"), set: setExpression, list: expressionList, current: expressionIndex },
  ];

  const zoomedKeys = {
    eyes: { scale: "scale-[4]", translateY: "-translate-y-[-85%]" },
    hair: { scale: "scale-[1.5]", translateY: "-translate-y-[-35%]" },
    glasses: { scale: "scale-[2.5]", translateY: "-translate-y-[-60%]" },
    headAccessory: { scale: "scale-[2.3]", translateY: "-translate-y-[-80%]" },
    shoes: { scale: "scale-[2.5]", translateY: "translate-y-[-85%]" },
    clothing: { scale: "scale-[1.8]", translateY: "translate-y-[-18%]" },
  };

  return (
    <div className="relative min-h-screen w-screen overflow-hidden font-apercu">
      <img
        src="/img/fondoPrincipal.jpg"
        alt="Fondo"
        className="absolute inset-0 w-full h-full object-cover object-bottom z-0"
      />

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
        <div style={{ width: "237px", height: "32px", display: "flex", alignItems: "center", margin: "0 auto" }}>
          <h1 style={{
            fontFamily: "'Volume TC', sans-serif",
            fontSize: "25px",
            fontWeight: 400,
            color: "rgba(72, 39, 34, 1)",
            margin: 0,
            lineHeight: 1,
            whiteSpace: "nowrap",
          }}>
            {t("chooseYourStyle")}
          </h1>
        </div>

        <div className="relative w-[90vw] max-w-[300px] h-[120vw] max-h-[480px] flex items-center justify-center mb-6 mx-auto">
          <img
            src={bodyImg}
            alt="body"
            className={`absolute w-full h-full object-contain transition-all duration-300 ${bodyForzado === 0 ? "scale-[0.85] translate-y-[4%]" : "scale-100"
              }`}
          />
          <div
            className="absolute w-full h-full"
            style={getFaceStyle(faceIndex, bodyForzado === 0)}
          >
            <img
              src={faceImg}
              alt="face"
              className="w-full h-full object-contain"
            />
            {expressionImg && (
              <img
                src={expressionImg}
                alt="expression"
                className="absolute object-contain"
                style={getExpressionStyle(faceIndex)}
              />
            )}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.key
                ? "text-white shadow-lg scale-105"
                : "bg-white/50 text-black border border-white/40 backdrop-blur-md hover:bg-white/60"
                }`}
              style={activeTab === tab.key ? { backgroundColor: "rgba(72, 39, 34, 1)" } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full max-w-sm bg-white/80 backdrop-blur-sm p-1 shadow-md mb-2 max-h-[40vh] overflow-y-auto">
          {tabs
            .filter((tab) => tab.key === activeTab)
            .map((tab) => {
              const scrollRef = useRef();
              const [showArrow, setShowArrow] = useState(false);
              const zoom = (tab.key === "face" || tab.key === "expression") ? { scale: "", translateY: "" } : { scale: "scale-[1.2]" };

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
                    className={`flex items-center gap-4 pr-6 scroll-smooth ${tab.list.length <= 3 ? "justify-center overflow-x-hidden" : "overflow-x-auto"
                      }`}
                  >
                    {tab.list.map((opt, i) => {
                      const isCurrent = i === tab.current;
                      const handleSelect = () => {
                        if (typeof playWardrobeSound === "function") {
                          playWardrobeSound();
                        }
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
                            className={`flex items-center justify-center border-2 cursor-pointer overflow-hidden ${isCurrent
                              ? "border-green-600"
                              : "border-transparent"
                              }`}
                            style={{ width: "130px", height: "100px" }}
                          >
                            {opt ? (
                              <img
                                src={tab.icons ? tab.icons[i] : opt}
                                alt={`${tab.key}_${i}`}
                                style={{ width: "130px", height: "130px", objectFit: "contain", flexShrink: 0 }}
                                className={`transform ${tab.icons ? "" : (zoom.scale || "")} ${tab.icons ? "" : (zoom.translateY || "")}`}
                              />
                            ) : (
                              <span className="text-xl font-bold text-gray-400">
                                ×
                              </span>
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

        <div style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          paddingBottom: "calc(env(safe-area-inset-bottom) + 40px)",
          paddingTop: "16px",
          zIndex: 50,
        }}>
          <button
            onClick={handleSaveAvatar}
            style={{
              width: "200px",
              height: "60px",
              borderRadius: "30px",
              backgroundColor: "#80A850",
              color: "#F7F3EA",
              fontSize: "24px",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              boxShadow: "3.2px 3.2px 3.2px 0px rgba(0,0,0,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Apercu Pro', sans-serif",
            }}
          >
            {t("saveAvatarAndContinue")}
          </button>
        </div>
      </div>
    </div>
  );
}
