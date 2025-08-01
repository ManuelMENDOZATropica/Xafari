// components/ModalMapa.jsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ModalMapa({ show, onClose }) {
  if (!show) {
    return null;
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }} // Este es el fondo oscuro, su animación de salida está bien así.
          onClick={onClose} // Cerrar al hacer clic fuera del modal
        >
          <motion.div
            className="relative w-full max-w-sm aspect-square bg-white rounded-full overflow-hidden shadow-2xl flex items-center justify-center p-2"
            initial={{ scale: 0.5, opacity: 0, rotate: -180 }} // Animación de entrada
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0, rotate: -180 }} // <-- ¡Cambiado! Ahora es igual a 'initial'
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={(e) => e.stopPropagation()} // Evitar que el clic en el contenido cierre el modal
          >
            {/* Botón de cierre dentro del modal */}
            <button
              onClick={onClose}
              className="absolute top-10 right-12 bg-gray-200 text-gray-800 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold z-10 hover:bg-gray-300"
              aria-label="Cerrar mapa"
            >
              &times;
            </button>

            {/* Contenedor de la imagen del mapa con scroll */}
            <div className="w-full overflow-scroll rounded-full">
              <img
                src="/mapa/mapa.png"
                alt="Mapa del lugar"
                className="w-full h-auto min-w-[300%] min-h-[300%] object-contain" // Ajusta el min-width/min-height para que la imagen sea "navegable"
                style={{ transformOrigin: 'center center' }} // Asegura que el centro de la imagen sea el origen para cualquier transformación futura si decides añadirla
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}