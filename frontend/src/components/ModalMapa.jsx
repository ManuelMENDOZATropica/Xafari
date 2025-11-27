// components/ModalMapa.jsx

import React from "react";

export default function ModalMapa({ onClose }) {
  return (
    <div className="w-full h-full mt-[22px] ">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-[-10px] right-5 z-50 px-5 py-1.5 rounded-full bg-white text-gray-900 font-bold border-2 border-white/50 shadow-lg hover:scale-105 transition-transform mt-[10px]"
        aria-label="Cerrar mapa"
      >
        ✕
      </button>
      <div className="relative w-full h-full font-apercu text-black bg-[#FFBB00] rounded-[10px]">
        <div className="absolute inset-0 w-full h-full bg-white/0 overflow-hidden flex flex-col z-10">
          <div className="flex items-center justify-center h-full p-4">
            <div className="relative w-full max-w-lg aspect-square bg-white rounded-full overflow-hidden shadow-inner border border-gray-200">
              <div className="absolute inset-0 overflow-scroll rounded-full">
                <img
                  src="/mapa/mapa.png"
                  alt="Mapa del lugar"
                  className="w-full h-auto min-w-[300%] min-h-[300%] object-contain"
                  style={{ transformOrigin: "center center" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}