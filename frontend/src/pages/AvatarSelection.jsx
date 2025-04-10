import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const skinColors = ["#F3D5B5", "#E3B582", "#C78E6C", "#8B5A2B"];
const skinTones = ["/avatares/base-1.png", "/avatares/base-2.png", "/avatares/base-3.png", "/avatares/base-4.png"];
const hairOptions = ["/avatares/cabello-1.png", "/avatares/cabello-2.png", "/avatares/cabello-3.png", "/avatares/cabello-4.png"];
const clothingOptions = ["/avatares/ropa-1.png", "/avatares/ropa-2.png", "/avatares/ropa-3.png", "/avatares/ropa-4.png"];

export default function AvatarSelection() {
  const { t, i18n } = useTranslation();
  const [skinIndex, setSkinIndex] = useState(0);
  const [hairIndex, setHairIndex] = useState(0);
  const [clothingIndex, setClothingIndex] = useState(0);
  const navigate = useNavigate();

  const handleSaveAvatar = () => {
    const avatarData = {
      skinIndex,
      hairIndex,
      clothingIndex
    };

    localStorage.setItem("avatarData", JSON.stringify(avatarData));
    navigate("/treeoflife");
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden font-lufga">
      {/* Fondo */}
      <img
        src="/img/fondo-bienvenida.png"
        alt="Fondo Avatar"
        className="absolute inset-0 w-full h-full object-cover object-bottom z-0"
      />

      <div className="relative z-10 flex flex-col items-center justify-between h-full px-6 py-4">
        {/* Botón idioma */}
        <div className="w-full flex justify-end">
          <button
            onClick={() => i18n.changeLanguage(i18n.language === "es" ? "en" : "es")}
            className="bg-white/80 backdrop-blur-sm text-black px-4 py-2 rounded-full shadow border border-gray-300 hover:bg-white"
          >
            {t("language")}
          </button>
        </div>

        {/* Título */}
        <div className="bg-white/70 backdrop-blur-sm px-6 py-3 rounded-xl shadow-md">
          <h1 className="text-xl md:text-2xl font-bold text-center text-gray-800">
            {t("chooseYourStyle")}
          </h1>
        </div>

        {/* Avatar */}
        <div className="relative w-40 h-72 flex items-center justify-center">
          <img src={skinTones[skinIndex]} alt="Cuerpo Base" className="absolute w-40 h-72" />
          <img src={hairOptions[hairIndex]} alt="Cabello" className="absolute w-40 h-72" />
          <img src={clothingOptions[clothingIndex]} alt="Ropa" className="absolute w-40 h-72" />
        </div>

        {/* Controles */}
        <div className="w-full max-w-md bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-md flex flex-col gap-6 overflow-y-auto">
          {/* Piel */}
          <div>
            <h2 className="text-center text-black mb-2">{t("skinTone")}</h2>
            <div className="flex justify-center gap-3">
              {skinColors.map((color, index) => (
                <button
                  key={color}
                  className={`w-10 h-10 rounded-full border-2 ${
                    skinIndex === index ? "border-black" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSkinIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* Cabello */}
          <div>
            <h2 className="text-center text-black mb-2">{t("hair")}</h2>
            <div className="grid grid-cols-4 gap-3 justify-center">
              {hairOptions.map((hair, index) => (
                <button
                  key={index}
                  onClick={() => setHairIndex(index)}
                  className={`p-1 border rounded-lg bg-white ${
                    hairIndex === index ? "border-black" : "border-gray-300"
                  }`}
                >
                  <img src={hair} alt={`Cabello ${index + 1}`} className="w-10 h-10 object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Ropa */}
          <div>
            <h2 className="text-center text-black mb-2">{t("clothing")}</h2>
            <div className="grid grid-cols-4 gap-3 justify-center">
              {clothingOptions.map((clothes, index) => (
                <button
                  key={index}
                  onClick={() => setClothingIndex(index)}
                  className={`p-1 border rounded-lg bg-white ${
                    clothingIndex === index ? "border-black" : "border-gray-300"
                  }`}
                >
                  <img src={clothes} alt={`Ropa ${index + 1}`} className="w-10 h-16 object-contain" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Botón guardar */}
        <button
          onClick={handleSaveAvatar}
          className="bg-green-600 text-white font-bold py-2 px-6 rounded-xl shadow hover:bg-green-700 w-full max-w-md mt-4"
        >
          {t("saveAvatarAndContinue")}
        </button>
      </div>
    </div>
  );
}
