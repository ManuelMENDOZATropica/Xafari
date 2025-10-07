import { useState, useEffect, useRef, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import XafariContext from "../components/XafariContext";

// Opciones de avatar
const bodyOptions = Array.from({ length: 10 }, (_, i) => `/avatares/CUERPO_${i + 1}.png`);
const eyesOptions = Array.from({ length: 5 }, (_, i) => `/avatares/OJOS_${i + 1}.png`);
const hairOptions = [null, ...Array.from({ length: 18 }, (_, i) => `/avatares/PELO_${i + 1}.png`)];
const clothingOptions = Array.from({ length: 16 }, (_, i) => `/avatares/VESTUARIO_${i + 1}.png`);
const glassesOptions = [null, ...Array.from({ length: 10 }, (_, i) => `/avatares/LENTES_${i + 1}.png`)];
const headOptions = Array.from({ length: 10 }, (_, i) => `/avatares/SOMBREROS_${i + 1}.png`);
const bodyAccOptions = [null, ...Array.from({ length: 2 }, (_, i) => `/avatares/ACCESORIOS_CUERPOS_${i + 1}.png`)];
const shoeOptions = [null, ...Array.from({ length: 15 }, (_, i) => `/avatares/ZAPATOS_${i + 1}.png`)];

function useSelection(options, initialIndex = 0) {
  const [index, setIndex] = useState(initialIndex);
  return [index, options[index], setIndex, options];
}

export default function AvatarSelection() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { playWardrobeSound } = useContext(XafariContext);

let user = null;
try {
  const stored = localStorage.getItem("user");
  user = stored ? JSON.parse(stored) : null;
} catch (e) {
  console.warn("❌ Error al parsear usuario:", e);
  user = null;
}

  const token = localStorage.getItem("token");
  const avatar = user?.avatar || {};

  const [bodyIndex, bodyImg, setBody, bodyList] = useSelection(bodyOptions, avatar.bodyOptions ?? 0);
  const [eyesIndex, eyesImg, setEyes, eyesList] = useSelection(eyesOptions, avatar.eyesOptions ?? 0);
  const [hairIndex, hairImg, setHair, hairList] = useSelection(hairOptions, avatar.hairOptions ?? 0);
  const [clothingIndex, clothingImg, setClothing, clothingList] = useSelection(clothingOptions, avatar.clothingOptions ?? 0);
  const [shoeIndex, shoeImg, setShoe, shoeList] = useSelection(shoeOptions, avatar.shoeOptions ?? 0);
  const [glassesIndex, glassesImg, setGlasses, glassesList] = useSelection(glassesOptions, avatar.glassesAccessoryOptions ?? 0);
  const [headAccessoryIndex, headAccImg, setHeadAcc, headAccList] = useSelection(headOptions, avatar.headAccessoryOptions ?? 0);
  const [bodyAccessoryIndex, bodyAccImg, setBodyAcc, bodyAccList] = useSelection(bodyAccOptions, avatar.bodyAccessoryOptions ?? 0);

  const [activeTab, setActiveTab] = useState("body");

 const handleSaveAvatar = async () => {
  const newAvatar = {
    bodyOptions: bodyIndex,
    eyesOptions: eyesIndex,
    hairOptions: hairIndex,
    clothingOptions: clothingIndex,
    shoeOptions: shoeIndex,
    glassesAccessoryOptions: glassesIndex,
    headAccessoryOptions: headAccessoryIndex,
    bodyAccessoryOptions: bodyAccessoryIndex,
  };

  // ✅ RE-VALIDAR justo aquí
  const rawUser = localStorage.getItem("user");
  const rawToken = localStorage.getItem("token");

  let currentUser = null;
  try {
    currentUser = rawUser ? JSON.parse(rawUser) : null;
  } catch (e) {
    console.warn("⚠️ Usuario inválido en localStorage");
    currentUser = null;
  }

  if (!currentUser) {
    const guestUser = {
      name: "Invitado",
      lastname: "",
      email: "",
      avatar: newAvatar,
    };
    localStorage.setItem("user", JSON.stringify(guestUser));
    console.warn("👤 Avatar guardado como invitado:", guestUser.avatar);
    navigate("/treeoflife");
    return;
  }

if (!currentUser || currentUser.name === "Invitado" || !rawToken || rawToken === "null" || rawToken === "") {
  const updatedUser = { ...currentUser, avatar: newAvatar };
  localStorage.setItem("user", JSON.stringify(updatedUser));
  console.warn("👤 Avatar actualizado localmente como invitado:", updatedUser.avatar);
  navigate("/treeoflife");
  return;
}


  // Si hay token, intenta guardar en backend
  try {
    const response = await fetch("https://xafari.rexmalebka.com/user", {
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
    console.log("✅ Avatar guardado correctamente en backend");
    navigate("/treeoflife");
  } catch (err) {
    alert("Error al guardar el avatar.");
    console.error("❌ Error al guardar en backend:", err);
  }
};


  const handleRandomize = () => {
    setEyes(Math.floor(Math.random() * eyesList.length));
    setHair(Math.floor(Math.random() * hairList.length));
    setClothing(Math.floor(Math.random() * clothingList.length));
    setShoe(Math.floor(Math.random() * shoeList.length));
    setBody(Math.floor(Math.random() * bodyList.length));
    
    setHeadAcc(Math.floor(Math.random()* headAccList.length));
  };

  const handleReset = () => {
    setBody(0);
    setHair(0);
    setClothing(0);
    setShoe(0);
    setEyes(0);
    setGlasses(0);
    setHeadAcc(0);
    setBodyAcc(0);
  };

  const tabs = [
    { key: "body", label: t("body"), set: setBody, list: bodyList, current: bodyIndex },
    { key: "eyes", label: t("eyes"), set: setEyes, list: eyesList, current: eyesIndex },
    { key: "hair", label: t("hair"), set: setHair, list: hairList, current: hairIndex },
    { key: "clothing", label: t("clothing"), set: setClothing, list: clothingList, current: clothingIndex },
    { key: "shoes", label: t("shoes"), set: setShoe, list: shoeList, current: shoeIndex },
    { key: "glasses", label: t("glasses"), set: setGlasses, list: glassesList, current: glassesIndex },
    { key: "headAccessory", label: t("headAccessory"), set: setHeadAcc, list: headAccList, current: headAccessoryIndex },
    { key: "bodyAccessory", label: t("bodyAccessory"), set: setBodyAcc, list: bodyAccList, current: bodyAccessoryIndex },
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
    <div className="relative min-h-screen w-screen overflow-hidden font-lufga">
      <img src="/img/V03-CERRITOS.jpg" alt="Fondo Avatar" className="absolute inset-0 w-full h-full object-cover object-bottom z-0" />

      <div className="absolute top-0 left-0 w-full z-20 px-4 pt-[env(safe-area-inset-top)] mt-4 pb-2 flex justify-between items-center">
        <button
          onClick={() => navigate("/treeoflife")}
          className="bg-white/80 backdrop-blur-sm text-black px-4 py-2 rounded-full shadow border border-gray-300 hover:bg-white"
        >
          ← {t("back")}
        </button>
        <button
          onClick={() => i18n.changeLanguage(i18n.language === "es" ? "en" : "es")}
          className="bg-white/80 backdrop-blur-sm text-black px-4 py-2 rounded-full shadow border border-gray-300 hover:bg-white"
        >
          {t("language")}
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center w-full px-4 pt-24 pb-[env(safe-area-inset-bottom)] overflow-y-auto">
        <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-xl shadow-md mb-2 w-full max-w-sm">
          <h1 className="text-xl md:text-2xl font-bold text-center text-gray-800">
            {t("chooseYourStyle")}
          </h1>
        </div>

        <div className="relative w-[50vw] max-w-[180px] h-[80vw] max-h-[320px] flex items-center justify-center mb-4">
          {[
            bodyAccImg,
            bodyImg,
            eyesImg,
            ...(clothingIndex === 4 || clothingIndex === 5 ? [] : [hairImg]),
            shoeImg,
            clothingImg,
            headAccImg,
            glassesImg,
          ].map(
            (img, idx) =>
              img && (
                <img
                  key={idx}
                  src={img}
                  alt={`layer-${idx}`}
                  className="absolute w-full h-full object-contain"
                />
              )
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                activeTab === tab.key
                  ? "bg-green-600 text-white"
                  : "bg-white/80 text-black border border-gray-300"
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
              const zoom = zoomedKeys[tab.key] || {};

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
                  <div ref={scrollRef} className="flex overflow-x-auto gap-2 pr-6 scroll-smooth">
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
                            className={`w-16 h-16 flex items-center justify-center border-2 rounded cursor-pointer ${
                              isCurrent ? "border-green-600" : "border-transparent"
                            } bg-white overflow-hidden`}
                          >
                            {opt ? (
                              <img
                                src={opt}
                                alt={`${tab.key}_${i}`}
                                className={`w-full h-full object-contain transform ${zoom.scale || ""} ${zoom.translateY || ""}`}
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

        <div className="flex gap-3 justify-center mb-4 w-full max-w-sm flex-nowrap">
          <button
            onClick={handleRandomize}
            className="bg-white text-black px-4 py-2 rounded-full shadow border border-gray-300 hover:bg-gray-100 whitespace-nowrap"
          >
            {t("randomize")}
          </button>
          <button
            onClick={handleReset}
            className="bg-white text-black px-4 py-2 rounded-full shadow border border-gray-300 hover:bg-gray-100 whitespace-nowrap"
          >
            {t("reset")}
          </button>
        </div>

        <button
          onClick={handleSaveAvatar}
          className="bg-green-600 text-white font-bold py-2 px-6 rounded-xl shadow hover:bg-green-700 w-full max-w-sm"
        >
          {t("saveAvatarAndContinue")}
        </button>
      </div>
    </div>
  );
}
