import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import XafariContext from "../components/XafariContext";

const bodyOptions = ["/avatares/cuerpoNiño.png", "/avatares/cuerpoAdulto.png"];
const bodyIconOptions = ["/avatares/cuerpoNiñoIcono.png", "/avatares/cuerpoAdultoIcono.png"];
const faceOptions = Array.from({ length: 23 }, (_, i) => `/avatares/cara (${i + 1}).png`);

function useSelection(options, isObject = false, initialIndex = 0) {
  const [index, setIndex] = useState(initialIndex || 0);
  const set = (i) => setIndex(i);
  const value = options[index];

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex]);
  return [index, value, set, options];
}

export default function AvatarSelection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, setUser, token, playWardrobeSound } = useContext(XafariContext);

  const [bodyIndex, bodyImg, setBody, bodyList] = useSelection(bodyOptions, false, user?.avatar?.bodyOptions);
  const [faceIndex, faceImg, setFace, faceList] = useSelection(faceOptions, false, user?.avatar?.faceOptions);

  const [activeTab, setActiveTab] = useState("body");

  useEffect(() => {
    setUser((oldUser) => ({
      ...oldUser,
      avatar: {
        ...oldUser.avatar,
        bodyOptions: bodyIndex,
        faceOptions: faceIndex,
      },
    }));
  }, [setUser, bodyIndex, faceIndex]);

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
          setUser(JSON.stringify(data.user));
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
    { key: "body", label: t("body"), set: setBody, list: bodyList, icons: bodyIconOptions, current: bodyIndex },
    { key: "face", label: t("face"), set: setFace, list: faceList, current: faceIndex },
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
        <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-xl shadow-md mb-2 w-full max-w-sm">
          <h1 className="text-xl md:text-2xl font-bold text-center text-gray-800">
            {t("chooseYourStyle")}
          </h1>
        </div>

        <div className="relative w-[60vw] max-w-[200px] h-[80vw] max-h-[320px] flex items-center justify-center mb-6">
          <img
            src={bodyImg}
            alt="body"
            className={`absolute w-full h-full object-contain transition-all duration-300 ${bodyIndex === 0 ? "scale-[0.85] translate-y-[4%]" : "scale-100"
              }`}
          />
          <img
            src={faceImg}
            alt="face"
            className={`absolute w-full h-full object-contain transition-all duration-300 ${bodyIndex === 0
              ? "scale-[0.5] -translate-y-[5%]"
              : "scale-[0.7] -translate-y-[20%] -translate-x-[-5%]"
              }`}
          />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.key
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
              const zoom = tab.key === "face" ? { scale: "scale-[2.5]", translateY: "-translate-y-[0%]" } : { scale: "scale-[1.2]" };

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
                            className={`w-16 h-16 flex items-center justify-center border-2 rounded cursor-pointer ${isCurrent
                              ? "border-green-600"
                              : "border-transparent"
                              } bg-white overflow-hidden`}
                          >
                            {opt ? (
                              <img
                                src={tab.icons ? tab.icons[i] : opt}
                                alt={`${tab.key}_${i}`}
                                className={`w-full h-full object-contain transform ${tab.icons ? "" : (zoom.scale || "")} ${tab.icons ? "" : (zoom.translateY || "")}`}
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
