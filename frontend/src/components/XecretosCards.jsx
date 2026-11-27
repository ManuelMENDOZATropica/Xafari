import { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import XafariContext from "./XafariContext";
import XecretoRegister from "./XecretoRegister";
import { GUARDIANES } from "@/data/guardianes";
import { api } from "@/lib/api";

const GUARDIAN_NAMES = Object.fromEntries(Object.entries(GUARDIANES).map(([k, v]) => [k, v.guardian]));
const GUARDIAN_IMG = Object.fromEntries(Object.entries(GUARDIANES).map(([k, v]) => [k, v.img]));

export default function XecretosCards({ onClose }) {
  const { t } = useTranslation();
  const { xecretos } = useContext(XafariContext);
  const [xecretosList, setXecretosList] = useState(() =>
    Object.entries(GUARDIAN_NAMES).map(([key, name]) => ({
      key,
      name,
      description: "",
      location: "",
    }))
  );
  const [loadingList, setLoadingList]   = useState(false);
  const [showScanner, setShowScanner]   = useState(false);

  // Fetch xecretos desde la BD
  useEffect(() => {
    const controller = new AbortController();
    api
      .get("/xecretos", { auth: false, signal: controller.signal })
      .then((data) => {
        if (!Array.isArray(data)) return;
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
        /* sin API se queda la lista base (nombres de guardianes) */
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingList(false);
      });
    return () => controller.abort();
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
                {xecretosList.map((xecreto) => {
                  const completado = !!xecretos[xecreto.key];

                  return (
                    <div key={xecreto.key} className="relative">
                      {/* Card — mismo estilo que Xperiencias */}
                      <div
                        className="relative rounded-2xl overflow-hidden shadow-md"
                        style={{ backgroundColor: "rgba(242, 232, 218, 1)" }}
                      >
                        {/* Card body: título/descripción a la izq, check+imagen a la der */}
                        <div className="flex items-start gap-3 px-4 pt-4 pb-0">
                          {/* Izquierda: título + descripción */}
                          <div className="flex-1">
                            <h2
                              className="text-sm font-bold leading-tight mb-1"
                              style={{ color: "#3D1A00" }}
                            >
                              {t("qr.guardian", { name: xecreto.name })}
                            </h2>
                            {xecreto.description ? (
                              <p className="text-xs leading-relaxed" style={{ color: "#3D1A00" }}>
                                {xecreto.description}
                              </p>
                            ) : (
                              <p className="text-xs leading-relaxed" style={{ color: "#5a3a18" }}>
                                {t("xecretoHidden")}
                              </p>
                            )}
                          </div>

                          {/* Derecha: check arriba + insignia abajo */}
                          <div className="flex flex-col items-center gap-2 flex-shrink-0">
                            {/* Checkbox */}
                            <div className="relative w-[34px] h-[34px]">
                              <img
                                src="/iconos/checkXperiencias.png"
                                alt=""
                                className="w-full h-full object-contain"
                              />
                              {completado && (
                                <div className="absolute" style={{ inset: "10%" }}>
                                  <motion.img
                                    src="/iconos/correctXperiencias.png"
                                    alt={t("completed")}
                                    className="w-full h-full object-contain"
                                    initial={{ opacity: 0, scale: 0.4 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, ease: "backOut" }}
                                  />
                                </div>
                              )}
                            </div>

                            {/* Insignia del guardián — doble tamaño */}
                            <img
                              src={GUARDIAN_IMG[xecreto.key]}
                              alt=""
                              className="w-24 h-24 object-contain"
                              style={{ opacity: completado ? 1 : 0.35 }}
                            />
                          </div>
                        </div>


                        {/* Botón escanear */}
                        {!completado && (
                          <div className="px-4 pb-4">
                            <button
                              type="button"
                              onClick={() => setShowScanner(true)}
                              className="flex items-center gap-1.5 px-3 py-[7px] rounded-xl text-[11px] font-bold transition-all active:scale-95"
                              style={{
                                backgroundColor: "rgba(61,26,0,0.85)",
                                color: "#f5ddb0",
                                border: "1.5px solid rgba(61,26,0,0.15)",
                              }}
                            >
                              <svg aria-hidden="true" className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <rect x="3" y="3" width="7" height="7" rx="1" />
                                <rect x="14" y="3" width="7" height="7" rx="1" />
                                <rect x="3" y="14" width="7" height="7" rx="1" />
                                <path strokeLinecap="round" d="M14 14h3M17 14v3M14 17h3M17 17v3" />
                              </svg>
                              {t("scanGuardian")}
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
                onClose={(scannedKey) => {
                  setShowScanner(false);
                  if (scannedKey) {
                    onClose(scannedKey);
                  }
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
