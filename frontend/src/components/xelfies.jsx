import { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import XafariContext from "./XafariContext";
import QRScannerModal from "./QRScannerModal";

const XELFIES = [
  {
    activityName: "Xelfie cascada Caletas",
    lugar: "Xelfie cascada Caletas",
    descripcion: "Posa frente a la impresionante cascada natural de Caletas, rodeado de la jungla tropical.",
    location: "cascada Caletas",
  },
  {
    activityName: "Puente 1",
    lugar: "Puente 1",
    descripcion: "Captura el momento en el primer puente colgante con vistas al río y la vegetación.",
    location: "Puente 1",
  },
  {
    activityName: "Puente 2",
    lugar: "Puente 2",
    descripcion: "El segundo puente te ofrece una perspectiva única sobre el corazón del resort.",
    location: "Puente 2",
  },
  {
    activityName: "Puente 3",
    lugar: "Puente 3",
    descripcion: "Desde el tercer puente podrás ver el paisaje completo del parque acuático.",
    location: "Puente 3",
  },
  {
    activityName: "Islote cascada",
    lugar: "Islote cascada",
    descripcion: "Un rincón secreto rodeado de agua donde la naturaleza te da el escenario perfecto.",
    location: "Islote cascada",
  },
  {
    activityName: "Diamante Xerro",
    lugar: "Diamante Xerro",
    descripcion: "El punto más exclusivo del resort. Una vista que pocas personas logran capturar.",
    location: "Diamante Xerro",
  },
  {
    activityName: "Super zoom",
    lugar: "Super zoom",
    descripcion: "El lugar ideal para capturar fotos de largo alcance con los mejores encuadres naturales.",
    location: "Super zoom",
  },
  {
    activityName: "Alberca diamante 2",
    lugar: "Alberca diamante 2",
    descripcion: "Junto a la segunda alberca diamante, el agua cristalina y el sol crean la foto perfecta.",
    location: "Alberca diamante 2",
  },
];

export default function Xelfies({ onClose, onOpenMapa }) {
  const { registerActivityCompleted, progresoXelfies } = useContext(XafariContext);

  const [completados, setCompletados] = useState(() => ({ ...progresoXelfies }));

  useEffect(() => {
    setCompletados({ ...progresoXelfies });
  }, [progresoXelfies]);

  const handleCompletar = (xelfie) => {
    if (completados[xelfie.activityName]) return;
    setCompletados((prev) => ({ ...prev, [xelfie.activityName]: true }));
    registerActivityCompleted(xelfie.activityName);
  };

  const [scannerXelfie, setScannerXelfie] = useState(null); // xelfie que se está escaneando

  const handleVerMapa = () => {
    if (onOpenMapa) onOpenMapa();
  };

  const handleEscanear = (xelfie) => {
    if (completados[xelfie.activityName]) return;
    setScannerXelfie(xelfie);
  };

  const handleScanConfirm = () => {
    if (scannerXelfie) handleCompletar(scannerXelfie);
    setScannerXelfie(null);
  };

  return (
    <div className="w-full h-full">
      <div className="relative w-full h-full font-apercu bg-[#7b5226] rounded-[10px]">
        <div className="absolute inset-0 w-full h-full overflow-hidden flex flex-col z-10">

          {/* Lista de tarjetas — igual padding que XperienciasXtop */}
          <div className="flex-1 overflow-y-auto px-3 pb-[75px] pt-3">
            <div className="grid gap-3">
              {XELFIES.map((xelfie, idx) => {
                const completado = !!completados[xelfie.activityName];

                return (
                  <div key={xelfie.activityName} className="relative">

                    {/* Card — mismo fondo y forma que Xperiencias */}
                    <div
                      className="relative rounded-2xl overflow-hidden shadow-md"
                      style={{ backgroundColor: "rgba(242, 232, 218, 1)" }}
                    >
                      {/* Header: título + checkbox */}
                      <div className="flex items-start justify-between px-4 pt-4 pb-1">
                        <h2
                          className="flex-1 pr-3 text-sm font-bold leading-tight"
                          style={{ color: "#3D1A00" }}
                        >
                          {xelfie.lugar}
                        </h2>

                        {/* Checkbox — mismo icono que Xperiencias */}
                        <div className="relative flex-shrink-0 w-[34px] h-[34px]">
                          <img
                            src="/iconos/checkXperiencias.png"
                            alt="Pendiente"
                            className="w-full h-full object-contain"
                          />
                          {completado && (
                            <div className="absolute" style={{ inset: "10%" }}>
                              <motion.img
                                src="/iconos/correctXperiencias.png"
                                alt="Completado"
                                className="w-full h-full object-contain"
                                initial={{ opacity: 0, scale: 0.4 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, ease: "backOut" }}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Descripción */}
                      <p
                        className="text-xs px-4 pb-3 leading-relaxed"
                        style={{ color: "#3D1A00" }}
                      >
                        {xelfie.descripcion}
                      </p>

                      {/* Botones */}
                      <div className="px-4 pb-4 flex gap-2">

                        {/* Ver en mapa */}
                        <button
                          onClick={() => handleVerMapa()}
                          className="flex items-center gap-1.5 px-3 py-[7px] rounded-xl text-[11px] font-medium transition-all active:scale-95"
                          style={{
                            backgroundColor: "rgba(255,255,255,0.85)",
                            color: "#3D1A00",
                            border: "1.5px solid rgba(61,26,0,0.15)",
                          }}
                        >
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Ver en mapa
                        </button>

                        {/* Tomar Xelfie */}
                        <button
                          onClick={() => handleEscanear(xelfie)}
                          disabled={completado}
                          className="flex items-center gap-1.5 px-3 py-[7px] rounded-xl text-[11px] font-bold transition-all active:scale-95 disabled:opacity-70"
                          style={{
                            backgroundColor: completado
                              ? "rgba(134,239,172,0.9)"
                              : "rgba(61,26,0,0.85)",
                            color: completado ? "#166534" : "#f5ddb0",
                            border: "1.5px solid rgba(61,26,0,0.15)",
                          }}
                        >
                          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <rect x="3" y="3" width="7" height="7" rx="1" />
                            <rect x="14" y="3" width="7" height="7" rx="1" />
                            <rect x="3" y="14" width="7" height="7" rx="1" />
                            <path strokeLinecap="round" d="M14 14h3M17 14v3M14 17h3M17 17v3" />
                          </svg>
                          {completado ? "¡Escaneado!" : "Escanear QR"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* Modal escanear QR */}
      <AnimatePresence>
        {scannerXelfie && (
          <QRScannerModal
            key={scannerXelfie.activityName}
            onClose={() => setScannerXelfie(null)}
            onConfirm={handleScanConfirm}
          />
        )}
      </AnimatePresence>
    </div>
  );
}