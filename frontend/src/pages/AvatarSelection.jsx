import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// Opciones
const bodyOptions = Array.from({ length: 10 }, (_, i) => `/avatares/CUERPO_${i + 1}.png`);
const eyesOptions = Array.from({ length: 5 }, (_, i) => `/avatares/OJOS_${i + 1}.png`);
const hairOptions = [null, ...Array.from({ length: 21 }, (_, i) => `/avatares/PELO_${i + 1}.png`)];
const clothingOptions = Array.from({ length: 16 }, (_, i) => `/avatares/VESTUARIO_${i + 1}.png`);
const glassesAccessoryOptions = [null, ...Array.from({ length: 10 }, (_, i) => `/avatares/LENTES_${i + 1}.png`)];
const headAccessoryOptions = [null, ...Array.from({ length: 4 }, (_, i) => `/avatares/ACCESORIOS_CABEZA_${i + 1}.png`)];
const bodyAccessoryOptions = [null, ...Array.from({ length: 2 }, (_, i) => `/avatares/ACCESORIOS_CUERPOS_${i + 1}.png`)];
const shoeOptions = [null, ...Array.from({ length: 15 }, (_, i) => `/avatares/ZAPATOS_${i + 1}.png`)];

function useSelection(options, isObject = false, initialIndex = 0) {
  const [index, setIndex] = useState(initialIndex);
  const set = (i) => setIndex(i);
  const value = isObject ? options[index] : options[index];
  return [index, value, set, options];
}

export default function AvatarSelection() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [bodyIndex, bodyImg, setBody, bodyList] = useSelection(bodyOptions);
  const [hairIndex, hairImg, setHair, hairList] = useSelection(hairOptions, false, Math.floor(Math.random() * hairOptions.length));
  const [clothingIndex, clothingImg, setClothing, clothingList] = useSelection(clothingOptions, false, Math.floor(Math.random() * clothingOptions.length));
  const [eyesIndex, eyesImg, setEyes, eyesList] = useSelection(eyesOptions, false, Math.floor(Math.random() * eyesOptions.length));
  const [shoeIndex, shoeImg, setShoe, shoeList] = useSelection(shoeOptions, false, Math.floor(Math.random() * shoeOptions.length));
  const [glassesIndex, glassesImg, setGlasses, glassesList] = useSelection(glassesAccessoryOptions);
  const [headAccessoryIndex, headAccImg, setHeadAcc, headAccList] = useSelection(headAccessoryOptions);
  const [bodyAccessoryIndex, bodyAccImg, setBodyAcc, bodyAccList] = useSelection(bodyAccessoryOptions);

  const [activeTab, setActiveTab] = useState("body");

  const handleSaveAvatar = () => {
    localStorage.setItem(
      "avatarData",
      JSON.stringify({
        bodyIndex,
        hairIndex,
        clothingIndex,
        shoeIndex,
        eyesIndex,
        glassesIndex,
        headAccessoryIndex,
        bodyAccessoryIndex,
      })
    );
    navigate("/treeoflife");
  };

  const handleRandomize = () => {
    setEyes(Math.floor(Math.random() * eyesList.length));
    setHair(Math.floor(Math.random() * hairList.length));
    setClothing(Math.floor(Math.random() * clothingList.length));
    setShoe(Math.floor(Math.random() * shoeList.length));
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
    clothing: { scale: "scale-[1.8]", translateY: "translate-y-[-18%]" }
  };

  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden font-lufga">
      <img
        src="/img/V03-CERRITOS.jpg"
        alt="Fondo Avatar"
        className="absolute inset-0 w-full h-full object-cover object-bottom z-0"
      />

     <div className="relative z-10 flex flex-col items-center h-full w-full overflow-y-auto px-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">

        <div className="w-full flex justify-end mb-2">
          <button
            onClick={() => i18n.changeLanguage(i18n.language === "es" ? "en" : "es")}
            className="bg-white/80 backdrop-blur-sm text-black px-4 py-2 rounded-full shadow border border-gray-300 hover:bg-white"
          >
            {t("language")}
          </button>
        </div>

        <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-xl shadow-md mb-2 w-full max-w-sm">
          <h1 className="text-xl md:text-2xl font-bold text-center text-gray-800">
            {t("chooseYourStyle")}
          </h1>
        </div>

        <div className="relative w-[50vw] max-w-[180px] h-[80vw] max-h-[320px] flex items-center justify-center mb-4">
          {bodyAccImg && <img src={bodyAccImg} alt="bodyAccessory" className="absolute w-full h-full object-contain" />}
          {bodyImg && <img src={bodyImg} alt="body" className="absolute w-full h-full object-contain" />}
          {eyesImg && <img src={eyesImg} alt="eyes" className="absolute w-full h-full object-contain" />}
          {hairImg && <img src={hairImg} alt="hair" className="absolute w-full h-full object-contain" />}
          {shoeImg && <img src={shoeImg} alt="shoes" className="absolute w-full h-full object-contain" />}
          {clothingImg && <img src={clothingImg} alt="clothing" className="absolute w-full h-full object-contain" />}
          {headAccImg && <img src={headAccImg} alt="headAccessory" className="absolute w-full h-full object-contain" />}
          {glassesImg && <img src={glassesImg} alt="glasses" className="absolute w-full h-full object-contain" />}
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
          {tabs.filter((tab) => tab.key === activeTab).map((tab) => (
            <div key={tab.key} className="flex flex-col items-center">
              <div className="flex overflow-x-auto gap-2 w-full px-2">
                {tab.list.map((opt, i) => {
                  const isCurrent = i === tab.current;
                  const zoom = zoomedKeys[tab.key] || {};

                  return (
                    <div key={i} className="flex-shrink-0">
                      <div
                        onClick={() => tab.set(i)}
                        className={`w-16 h-16 flex items-center justify-center border-2 rounded cursor-pointer ${
                          isCurrent ? "border-green-600" : "border-transparent"
                        } bg-white overflow-hidden`}
                      >
                        {opt && (
                          <img
                            src={opt}
                            alt={`${tab.key}_${i}`}
                            className={`w-full h-full object-contain transform ${zoom.scale || ""} ${zoom.translateY || ""}`}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
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
