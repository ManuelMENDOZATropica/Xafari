import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function TreeOfLife() {
  const { t } = useTranslation();
  const [avatarData, setAvatarData] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("avatarData");
    if (saved) setAvatarData(JSON.parse(saved));
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden font-lufga text-black">
      {/* Fondo ilustrado */}
      <img
        src="/img/fondo-arbol.png"
        alt="Fondo"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Iconos superiores */}
      <div className="absolute top-[2vh] right-[4vw] z-10 flex items-center gap-4">
        <button
          className="w-8 h-8 bg-white rounded-full shadow border border-gray-300"
          title="Idioma"
        />
        <button
          className="w-8 h-8 bg-white rounded-full shadow border border-gray-300"
          title="Acción"
        />
      </div>

      {/* Árbol centrado */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center w-[80vw]">
        <img
          src="/img/arbol-xafari.png"
          alt="Árbol de la Vida"
          className="w-full max-h-[60vh] object-contain"
        />

        {/* Próximos logros */}
        <div className="mt-6 flex gap-6 items-center">
          <div className="flex flex-col items-center text-xs">
            <div className="w-8 h-8 rounded-full bg-blue-100 border border-black" />
            <span>0/1</span>
          </div>
          <div className="flex flex-col items-center text-xs">
            <div className="w-8 h-8 rounded-full bg-yellow-100 border border-black" />
            <span>0/1</span>
          </div>
          <div className="flex flex-col items-center text-xs">
            <div className="w-8 h-8 rounded-full border border-black" />
            <span>5/10</span>
          </div>
        </div>
      </div>

      {/* Barra inferior de navegación */}
      <div className="absolute bottom-0 left-0 w-full h-[10vh] bg-white border-t border-gray-300 z-20 flex justify-around items-center px-4">
        <button className="flex flex-col items-center text-xs">
          <div className="w-6 h-6 rounded bg-gray-400 mb-1" />
          Logros
        </button>
        <button className="flex flex-col items-center text-xs text-green-700 font-bold">
          <div className="w-6 h-6 rounded bg-green-500 mb-1" />
          Árbol
        </button>
        <button className="flex flex-col items-center text-xs">
          <div className="w-6 h-6 rounded bg-gray-400 mb-1" />
          Mapa
        </button>
        <button className="flex flex-col items-center text-xs">
          <div className="w-6 h-6 rounded bg-gray-400 mb-1" />
          Perfil
        </button>
      </div>
    </div>
  );
}
