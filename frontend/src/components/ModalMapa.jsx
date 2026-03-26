import React from "react";
import { useTranslation } from "react-i18next";
import CloseIcon from "./CloseIcon";

export default function ModalMapa({ onClose }) {
  const { t } = useTranslation();
  return (
    <div className="w-full h-full min-h-screen mt-[22px] overflow-y-auto px-4">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-[-10px] right-5 z-50 mt-[10px] rounded-full border-2 border-white/50 bg-white px-5 py-1.5 font-bold text-gray-900 shadow-lg transition-transform hover:scale-105"
        aria-label={t("close")}
      >
        <CloseIcon size={20} color="#111827" />
      </button>
      <div className="relative h-full w-full rounded-[10px] bg-[#FFBB00] font-apercu text-black">
        <div className="absolute inset-0 z-10 flex h-full w-full flex-col overflow-hidden bg-white/0">
          <div className="flex h-full items-center justify-center p-4">
            <div className="relative aspect-square w-full max-w-lg overflow-hidden rounded-full border border-gray-200 bg-white shadow-inner">
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