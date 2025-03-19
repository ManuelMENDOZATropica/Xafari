import { useState } from "react";
import { useTranslation } from "react-i18next";

const skinTones = ["#F3D5B5", "#E3B582", "#C78E6C", "#8B5A2B"];
const hairOptions = ["/cabello1.png", "/cabello2.png", "/cabello3.png", "/cabello4.png"];
const clothingOptions = ["/ropa1.png", "/ropa2.png", "/ropa3.png", "/ropa4.png"];
const bodyBase = "/baseAvatar.png"; // Imagen del cuerpo base

export default function AvatarSelection() {
  const { t, i18n } = useTranslation();
  const [selectedSkin, setSelectedSkin] = useState(skinTones[0]);
  const [selectedHair, setSelectedHair] = useState(hairOptions[0]);
  const [selectedClothing, setSelectedClothing] = useState(clothingOptions[0]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-white px-6 relative">
      {/* Botón de idioma en la parte superior derecha */}
      <button
        onClick={() => i18n.changeLanguage(i18n.language === "es" ? "en" : "es")}
        className="absolute top-4 right-4 px-3 py-1 border border-gray-500 bg-white text-black rounded-lg shadow-md hover:bg-gray-200"
      >
        {t("language")}
      </button>

      <h1 className="text-xl font-bold text-black mb-4">{t("chooseYourStyle")}</h1>

      {/* Contenedor del avatar */}
      <div className="relative w-40 h-72 flex items-center justify-center">
        {/* Rectángulo de color (tono de piel) */}
        <div
          className="absolute w-40 h-72 rounded-lg"
          style={{ backgroundColor: selectedSkin }}
        />

        {/* Cuerpo base */}
        <img src={bodyBase} alt="Cuerpo Base" className="absolute w-40 h-72" />

        {/* Cabello */}
        <img src={selectedHair} alt="Cabello" className="absolute w-40 h-72" />

        {/* Ropa */}
        <img src={selectedClothing} alt="Ropa" className="absolute w-40 h-72" />
      </div>

      {/* Controles de personalización */}
      <div className="w-full max-w-md bg-white p-4 mt-6 rounded-lg shadow-md border border-gray-500">
        {/* Opciones de Piel */}
        <h2 className="text-center text-black mb-2">{t("skinTone")}</h2>
        <div className="flex justify-center gap-2">
          {skinTones.map((color) => (
            <button
              key={color}
              className="w-10 h-10 rounded-full border border-gray-500"
              style={{ backgroundColor: color }}
              onClick={() => setSelectedSkin(color)}
            />
          ))}
        </div>

        {/* Opciones de Cabello */}
        <h2 className="text-center text-black mt-4 mb-2">{t("hair")}</h2>
        <div className="grid grid-cols-4 gap-2 justify-center">
          {hairOptions.map((hair) => (
            <button
              key={hair}
              onClick={() => setSelectedHair(hair)}
              className="p-1 border border-gray-500 rounded-lg bg-white"
            >
              <img src={hair} alt="Cabello" className="w-12 h-12 object-contain" />
            </button>
          ))}
        </div>

        {/* Opciones de Ropa */}
        <h2 className="text-center text-black mt-4 mb-2">{t("clothing")}</h2>
        <div className="grid grid-cols-4 gap-2 justify-center">
          {clothingOptions.map((clothes) => (
            <button
              key={clothes}
              onClick={() => setSelectedClothing(clothes)}
              className="p-1 border border-gray-500 rounded-lg bg-white"
            >
              <img src={clothes} alt="Ropa" className="w-12 h-12 object-contain" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
