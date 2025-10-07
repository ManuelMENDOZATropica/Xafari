import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

import pistaImg from "/instruccionesXecretos/pista.png";
import escaneaImg from "/instruccionesXecretos/escanea.png";
import descubreImg from "/instruccionesXecretos/descubre.png";

const slides = [
  { src: pistaImg, labelKey: "lee_hint" },
  { src: escaneaImg, labelKey: "scan" },
  { src: descubreImg, labelKey: "discover_guardian" },
];

const INTERVAL_MS = 2000; // ⏲️ más rápido (2 s)

export default function ModalInstruccionesXecretos({ show, onClose }) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);

  // Reinicia al primer slide cada vez que se abre el modal
  useEffect(() => {
    if (show) setIndex(0);
  }, [show]);

  // Carrusel automático
  useEffect(() => {
    if (!show) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, INTERVAL_MS);
    return () => clearInterval(interval);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl w-[90%] max-w-lg p-6 relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* Botón cierre */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-600 hover:text-black bg-transparent border-none p-0 m-0"
              title={t("close")}
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-emerald-800 mb-6 text-center">
              {t("how_scan")}
            </h2>

            {/* Imagen */}
            <div className="w-40 h-40 mx-auto mb-4 overflow-hidden relative">
              <AnimatePresence initial={false} custom={index}>
                <motion.img
                  key={index}
                  src={slides[index].src}
                  alt={t(slides[index].labelKey)}
                  className="w-full h-full object-contain select-none"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  transition={{ type: "tween", duration: 0.25 }}
                  draggable="false"
                />
              </AnimatePresence>
            </div>

            {/* Indicadores por puntos */}
            <div className="flex justify-center mb-4">
              {slides.map((_, i) => (
                <span
                  key={i}
                  className={`mx-1 rounded-full bg-emerald-700 transition-all duration-300 ${
                    i === index ? "w-4 h-4" : "w-2 h-2 opacity-50"
                  }`}
                />
              ))}
            </div>

            <p className="text-center text-emerald-800 font-medium mb-6 min-h-[1.5rem]">
              {t(slides[index].labelKey)}
            </p>

            <div className="text-center">
              <button
                onClick={onClose}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2 rounded-full shadow transition"
              >
                {t("understood")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
