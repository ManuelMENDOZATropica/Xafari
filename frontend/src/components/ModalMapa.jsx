import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ModalMapa({ onClose, initialFilter = "xperiencias" }) {
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