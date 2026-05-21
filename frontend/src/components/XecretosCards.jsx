import { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import XafariContext from "./XafariContext";
import XecretoRegister from "./XecretoRegister";

// Mapa de nombre de actividad → nombre visible del guardián
const GUARDIAN_NAMES = {
  xecreto1:  "Mono",
  xecreto2:  "Rana",
  xecreto3:  "Jaguar",
  xecreto4:  "Guacamaya",
  xecreto5:  "Serpiente",
  xecreto6:  "Venado",
  xecreto7:  "Búho",
  xecreto8:  "Mariposa",
  xecreto9:  "Flamenco",
  xecreto10: "Coatí",
};

// Imagen del árbol por guardián
const GUARDIAN_IMG = {
  xecreto1:  "/guardianes/Mono Casa Vida.png",
  xecreto2:  "/guardianes/Rana Casa Agua.png",
  xecreto3:  "/guardianes/Jaguar Casa Sol.png",
  xecreto4:  "/guardianes/Guacamaya Casa Fuego.png",
  xecreto5:  "/guardianes/Serpiente Casa Espiral.png",
  xecreto6:  "/guardianes/Venado Casa Tierra.png",
  xecreto7:  "/guardianes/Búho Casa Eclipse.png",
  xecreto8:  "/guardianes/Mariposa Casa Viento.png",
  xecreto9:  "/guardianes/Flamenco Casa Sol.png",
  xecreto10: "/guardianes/Coati.png",
};

export default function XecretosCards({ onClose }) {
  const { xecretos, registerActivityCompleted } = useContext(XafariContext);
  const [xecretosList, setXecretosList] = useState([]);
  const [loadingList, setLoadingList]   = useState(true);
  const [showScanner, setShowScanner]   = useState(false);

  // Fetch xecretos desde la BD
  useEffect(() => {
    fetch("/api/xecretos")
      .then((r) => r.json())
      .then((data) => {
        // data es array de { id, activity: { name, description, location } }
        const ordenados = Object.keys(GUARDIAN_NAMES).map((key) => {
          const found = data.find((x) => x.activity?.name === key);
          return {
            key,
            name: GUARDIAN_NAMES[key],
            description: found?.activity?.description || "",
            location: found?.activity?.location || "",
          };
        });
        setXecretosList(ordenados);
      })
      .catch(() => {
        // Fallback con datos hardcoded si la API falla
        setXecretosList(
          Object.entries(GUARDIAN_NAMES).map(([key, name]) => ({ key, name, description: "", location: "" }))
        );
      })
      .finally(() => setLoadingList(false));
  }, []);

  return (
    <div className="w-full h-full">
      <div className="relative w-full h-full font-apercu bg-[#7b5226] rounded-[10px]">
        <div className="absolute inset-0 w-full h-full overflow-hidden flex flex-col z-10">

          {/* Lista de tarjetas */}
          <div className="flex-1 overflow-y-auto px-3 pb-[75px] pt-3">
            {loadingList ? (
              <div className="flex items-center justify-center h-32 opacity-50">
                <span className="text-white text-sm">Cargando guardianes…</span>
              </div>
            ) : (
              <div className="grid gap-3">
                {xecretosList.map((xecreto, idx) => {
                  const completado = !!xecretos[xecreto.key];

                  return (
                    <div key={xecreto.key} className="relative">
                      {/* Card — mismo estilo que Xperiencias */}
                      <div
                        className="relative rounded-2xl overflow-hidden shadow-md"
                        style={{ backgroundColor: "rgba(242, 232, 218, 1)" }}
                      >
                        {/* Header: imagen + título + checkbox */}
                        <div className="flex items-start justify-between px-4 pt-4 pb-1">
                          {/* Imagen del guardián */}
                          <div className="flex items-start gap-3 flex-1 pr-3">
                            <img
                              src={GUARDIAN_IMG[xecreto.key]}
                              alt={xecreto.name}
                              className="w-10 h-10 object-contain flex-shrink-0"
                              style={{ opacity: completado ? 1 : 0.35 }}
                            />
                            <h2
                              className="text-sm font-bold leading-tight pt-1"
                              style={{ color: "#3D1A00" }}
                            >
                              Guardián {xecreto.name}
                            </h2>
                          </div>

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
                        {xecreto.description ? (
                          <p
                            className="text-xs px-4 pb-3 leading-relaxed"
                            style={{ color: "#3D1A00" }}
                          >
                            {xecreto.description}
                          </p>
                        ) : (
                          <p
                            className="text-xs px-4 pb-3 leading-relaxed opacity-50 italic"
                            style={{ color: "#3D1A00" }}
                          >
                            Encuéntralo escondido en el resort…
                          </p>
                        )}

                        {/* Botón escanear */}
                        {!completado && (
                          <div className="px-4 pb-4">
                            <button
                              onClick={() => setShowScanner(true)}
                              className="flex items-center gap-1.5 px-3 py-[7px] rounded-xl text-[11px] font-bold transition-all active:scale-95"
                              style={{
                                backgroundColor: "rgba(61,26,0,0.85)",
                                color: "#f5ddb0",
                                border: "1.5px solid rgba(61,26,0,0.15)",
                              }}
                            >
                              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <rect x="3" y="3" width="7" height="7" rx="1" />
                                <rect x="14" y="3" width="7" height="7" rx="1" />
                                <rect x="3" y="14" width="7" height="7" rx="1" />
                                <path strokeLinecap="round" d="M14 14h3M17 14v3M14 17h3M17 17v3" />
                              </svg>
                              Escanear guardián
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Scanner — se superpone en la misma área */}
        <AnimatePresence>
          {showScanner && (
            <motion.div
              className="absolute inset-0 z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <XecretoRegister
                onClose={() => setShowScanner(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
