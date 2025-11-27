// components/ModalMapa.jsx

import React from "react";

export default function ModalMapa({ onClose }) {
  return (
    <div className="relative w-full h-full bg-white rounded-3xl overflow-hidden shadow-2xl">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-gray-200/90 text-gray-800 rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold z-10 hover:bg-gray-300"
        aria-label="Cerrar mapa"
      >
        ✕
      </button>

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
  );
}