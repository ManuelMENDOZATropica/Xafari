import { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import XafariContext from "./XafariContext";
import CloseIcon from "./CloseIcon";

// Puntos de Xelfie con datos reales
const XELFIES = [
  {
    key: "xelfie_cascada_caletas",
    nombre: "Xelfie cascada Caletas",
    descripcion: "Posa frente a la impresionante cascada natural de Caletas, rodeado de la jungla tropical.",
    location: "cascada Caletas",
    activityName: "Xelfie cascada Caletas",
  },
  {
    key: "xelfie_puente1",
    nombre: "Puente 1",
    descripcion: "Captura el momento en el primer puente colgante con vistas al río y la vegetación.",
    location: "Puente 1",
    activityName: "Puente 1",
  },
  {
    key: "xelfie_puente2",
    nombre: "Puente 2",
    descripcion: "El segundo puente te ofrece una perspectiva única sobre el corazón del resort.",
    location: "Puente 2",
    activityName: "Puente 2",
  },
  {
    key: "xelfie_puente3",
    nombre: "Puente 3",
    descripcion: "Desde el tercer puente podrás ver el paisaje completo del parque acuático.",
    location: "Puente 3",
    activityName: "Puente 3",
  },
  {
    key: "xelfie_islote_cascada",
    nombre: "Islote cascada",
    descripcion: "Un rincón secreto rodeado de agua donde la naturaleza te da el escenario perfecto.",
    location: "Islote cascada",
    activityName: "Islote cascada",
  },
  {
    key: "xelfie_diamante_xerro",
    nombre: "Diamante Xerro",
    descripcion: "El punto más exclusivo del resort. Una vista que pocas personas logran capturar.",
    location: "Diamante Xerro",
    activityName: "Diamante Xerro",
  },
  {
    key: "xelfie_super_zoom",
    nombre: "Super zoom",
    descripcion: "El lugar ideal para capturar fotos de largo alcance con los mejores encuadres naturales.",
    location: "Super zoom",
    activityName: "Super zoom",
  },
  {
    key: "xelfie_alberca_diamante2",
    nombre: "Alberca diamante 2",
    descripcion: "Junto a la segunda alberca diamante, el agua cristalina y el sol crean la foto perfecta.",
    location: "Alberca diamante 2",
    activityName: "Alberca diamante 2",
  },
];

export default function Xelfies({ onClose }) {
  const { activitiesMap, registerActivityCompleted, progresoXelfies } = useContext(XafariContext);

  // Estado local optimista — se inicializa desde context y se sincroniza
  const [completados, setCompletados] = useState(() => ({ ...progresoXelfies }));

  useEffect(() => {
    setCompletados({ ...progresoXelfies });
  }, [progresoXelfies]);

  const handleCompletar = (xelfie) => {
    if (completados[xelfie.activityName]) return; // ya completado
    setCompletados((prev) => ({ ...prev, [xelfie.activityName]: true }));
    registerActivityCompleted(xelfie.activityName);
  };


  const handleVerMapa = (xelfie) => {
    // Abre mapa con la ubicación
    window.open(
      `https://maps.google.com/?q=${encodeURIComponent(xelfie.location + " Grand Palladium")}`,
      "_blank"
    );
  };

  return (
    <div className="w-full h-full mt-[22px]">
      <div className="relative w-full h-full font-apercu bg-[#7b5226] rounded-[10px] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📸</span>
            <h2 className="text-white font-bold text-lg tracking-wide">Xelfies</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-white/70 text-xs font-medium">
              {Object.keys(completados).length}/{XELFIES.length} completados
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="flex-shrink-0 h-px bg-white/20 mx-4 mb-2" />

        {/* Lista de tarjetas */}
        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-3">
          {XELFIES.map((xelfie, idx) => {
            const completado = !!completados[xelfie.activityName];
            return (
              <motion.div
                key={xelfie.key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                className={`relative rounded-2xl p-4 transition-all duration-300 ${
                  completado
                    ? "bg-[#3d7a3a]/80 border border-[#5db858]/60"
                    : "bg-[#5a3a18]/80 border border-white/10"
                }`}
              >
                {/* Check de completado */}
                <button
                  onClick={() => !completado && handleCompletar(xelfie)}
                  className={`absolute top-3 right-3 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    completado
                      ? "bg-[#5db858] border-[#5db858]"
                      : "bg-transparent border-white/40 hover:border-white/80"
                  }`}
                >
                  {completado && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </motion.svg>
                  )}
                </button>

                {/* Contenido */}
                <div className="pr-10">
                  <h3 className={`font-bold text-base leading-tight mb-1 ${completado ? "text-[#c8f0c6]" : "text-[#f5ddb0]"}`}>
                    {xelfie.nombre}
                  </h3>
                  <p className={`text-xs leading-relaxed mb-3 ${completado ? "text-white/70" : "text-white/60"}`}>
                    {xelfie.descripcion}
                  </p>

                  {/* Botones */}
                  <div className="flex gap-2">
                    {/* Ver en mapa */}
                    <button
                      onClick={() => handleVerMapa(xelfie)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white text-xs font-medium"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Ver en mapa
                    </button>

                    {/* Botón cámara */}
                    <button
                      onClick={() => handleCompletar(xelfie)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full active:scale-95 transition-all text-xs font-bold ${
                        completado
                          ? "bg-[#5db858]/30 text-[#c8f0c6] cursor-default"
                          : "bg-[#e8a020] hover:bg-[#d4911a] text-white"
                      }`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {completado ? "¡Tomada!" : "Xelfie aquí"}
                    </button>
                  </div>
                </div>

                {/* Banda completado */}
                {completado && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute left-0 top-0 bottom-0 w-1 bg-[#5db858] rounded-l-2xl"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}