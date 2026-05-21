import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ModalMapa({ onClose, initialFilter = "xperiencias", fromXelfies = false }) {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState(initialFilter);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden rounded-3xl">

      {/* Mapa — ocupa todo el espacio disponible */}
      <div className="flex-1 relative overflow-hidden p-3">
        <img
          src="/mapa/placeholderMapa.png"
          alt="Mapa del lugar"
          className="w-full h-full object-cover rounded-2xl"
        />
        {/* Botón volver — solo cuando venimos desde Xelfies */}
        {fromXelfies && (
          <button
            onClick={onClose}
            className="absolute top-5 left-5 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 active:scale-95 transition-all shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
      </div>


      {/* Barra inferior con filtros */}
      <div
        className="flex-shrink-0 flex items-center gap-2 px-3 py-2"
        style={{ backgroundColor: "#7b5226" }}
      >
        <button
          type="button"
          onClick={() => setActiveFilter("xperiencias")}
          className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{
            backgroundColor: activeFilter === "xperiencias" ? "#4a2e0e" : "rgba(242,232,218,1)",
            color: activeFilter === "xperiencias" ? "rgba(242,232,218,1)" : "#3D1A00",
            border: "none",
          }}
        >
          {t("xperiencias") || "Xperiencias"}
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter("xelfies")}
          className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all"
          style={{
            backgroundColor: activeFilter === "xelfies" ? "#4a2e0e" : "rgba(242,232,218,1)",
            color: activeFilter === "xelfies" ? "rgba(242,232,218,1)" : "#3D1A00",
            border: "none",
          }}
        >
          {t("xelfies") || "Xelfies"}
        </button>
      </div>
    </div>
  );
}