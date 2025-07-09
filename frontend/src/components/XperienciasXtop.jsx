import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const xperiencias = [
  {
    actividad: "t_experiencia_caletas",
    lugar: "Paddle board",
    edad: "Familiar",
    amuleto: "Kayak verde o Paddle Board blanco",
    pregunta: "q_caletas",
    opciones: ["a", "b", "c"],
    respuestaCorrecta: "a",
    insignia: "kayak",
    copy: "copy_caletas",
  },  
  {
    actividad: "t_experiencia_cielo_flamingos",
    lugar: "Cielo",
    edad: "Familiar",
    amuleto: "Un Vinil con el centro rosa",
    pregunta: "q_cielo_flamingos",
    opciones: ["a", "b", "c"],
    respuestaCorrecta: "b",
    insignia: "vinil",
    copy: "copy_cielo_flamingos",
  },
  {
    actividad: "t_experiencia_agua_muluk",
    lugar: "Agua",
    edad: "Familiar",
    amuleto: "Una caracola",
    pregunta: "q_muluk",
    opciones: ["a", "b", "c"],
    respuestaCorrecta: "c",
    insignia: "caracola",
    copy: "copy_agua_muluk",
  },
  {
    actividad: "t_experiencia_vida_maquinitas",
    lugar: "Vida",
    edad: "Familiar",
    amuleto: "Una televisión antigua",
    pregunta: "q_vida_juegos",
    opciones: ["a", "b", "c"],
    respuestaCorrecta: "b",
    insignia: "tv",
    copy: "copy_vida_maquinitas",
  },
  {
    actividad: "t_experiencia_espiral_teatro",
    lugar: "Espiral",
    edad: "Familiar",
    amuleto: "Máscaras de teatro",
    pregunta: "q_espiral_lamparas",
    opciones: ["a", "b", "c"],
    respuestaCorrecta: "a",
    insignia: "teatro",
    copy: "copy_espiral_teatro",
  },
  {
    actividad: "t_experiencia_tierra_alberca",
    lugar: "Tierra",
    edad: "Familiar",
    amuleto: "Un salvavidas",
    pregunta: "q_tierra_logo",
    opciones: ["a", "b", "c"],
    respuestaCorrecta: "b",
    insignia: "salvavidas",
    copy: "copy_tierra_alberca",
  },
  {
    actividad: "t_experiencia_eclipse_luna",
    lugar: "Eclipse",
    edad: "0-5 años",
    amuleto: "La silueta de un conejo en una Luna",
    pregunta: "q_eclipse_luna",
    opciones: ["a", "b", "c"],
    respuestaCorrecta: "a",
    insignia: "conejo",
    copy: "copy_eclipse_luna",
  },
  {
    actividad: "t_experiencia_eclipse_xiquit",
    lugar: "Eclipse",
    edad: "5-9 años",
    amuleto: "El camión de Xiquit Inn",
    pregunta: "q_eclipse_xiquit",
    opciones: ["a", "b", "c"],
    respuestaCorrecta: "b",
    insignia: "camion",
    copy: "copy_eclipse_xiquit",
  },
  {
    actividad: "t_experiencia_sol_infinity",
    lugar: "Sol",
    edad: "13-17 años",
    amuleto: "Amuleto de una de las estrellas de infinity",
    pregunta: "q_sol_mensaje",
    opciones: ["a", "b", "c"],
    respuestaCorrecta: "a",
    insignia: "estrella",
    copy: "copy_sol_infinity",
  },
  {
    actividad: "t_experiencia_sol_jaguar",
    lugar: "Sol",
    edad: "13-17 años",
    amuleto: "La máscara del guardián jaguar que está colgada sobre la pared",
    pregunta: "q_sol_jaguar",
    opciones: ["a", "b", "c"],
    respuestaCorrecta: "b",
    insignia: "mascarajaguar",
    copy: "copy_sol_jaguar",
  },
  {
    actividad: "t_experiencia_fuego_piscina",
    lugar: "Fuego",
    edad: "+18 años",
    amuleto:
      "Amuleto de la famosa alberca transparente con una personita nadando",
    pregunta: "q_fuego_piscina",
    opciones: ["a", "b", "c"],
    respuestaCorrecta: "b",
    insignia: "piscina",
    copy: "copy_fuego_piscina",
  },
  {
    actividad: "t_experiencia_canal_patin",
    lugar: "Canal",
    edad: "Familiar",
    amuleto: "El Patín",
    pregunta: "q_canal_patin",
    opciones: ["a", "b", "c"],
    respuestaCorrecta: "a",
    insignia: "patin",
    copy: "copy_canal_patin",
  },
  {
    actividad: "t_experiencia_vida_tobogan",
    lugar: "Vida",
    edad: "Familiar",
    amuleto: "Representación de un tobogán",
    pregunta: "q_vida_tobogan",
    opciones: ["a", "b", "c"],
    respuestaCorrecta: "a",
    insignia: "tobogan",
    copy: "copy_vida_tobogan",
  },
  {
    actividad: "t_experiencia_ixla_xpiral",
    lugar: "Ixla Xpiral",
    edad: "Familiar",
    amuleto: "Una representación de la Xpiral",
    pregunta: "q_ixla_xpiral",
    opciones: ["a", "b", "c"],
    respuestaCorrecta: "a",
    insignia: "xpiral",
    copy: "copy_ixla_xpiral",
  },
  {
    actividad: "t_experiencia_viento_poolpo",
    lugar: "Viento",
    edad: "0-9 años",
    amuleto: "Amuleto de un Pool'po",
    pregunta: "q_viento_poolpo",
    opciones: ["a", "b", "c"],
    respuestaCorrecta: "a",
    insignia: "poolpo",
    copy: "copy_viento_poolpo",
  },
  {
    actividad: "t_experiencia_cielo_xupes",
    lugar: "Cielo",
    edad: "+18 años",
    amuleto:
      "Amuleto de un drinksito con un sticker de una máscara de luchador sobre el vaso",
    pregunta: "q_cielo_xupes",
    opciones: ["a", "b", "c"],
    respuestaCorrecta: "a",
    insignia: "drink",
    copy: "copy_cielo_xupes",
  },
];


export default function XperienciasXtop({ onClose }) {
  const { t, i18n } = useTranslation();

  const [respuestas, setRespuestas] = useState(() => {
    const saved = localStorage.getItem("progresoXperiencias");
    return saved ? JSON.parse(saved) : {};
  });

  const [bloqueados, setBloqueados] = useState(() => {
    const saved = localStorage.getItem("tiemposBloqueoXperiencias");
    return saved ? JSON.parse(saved) : {};
  });

  const [tiempos, setTiempos] = useState(() => {
    const initial = {};
    const now = new Date();
    const saved = localStorage.getItem("tiemposBloqueoXperiencias");
    if (saved) {
      const bloqueos = JSON.parse(saved);
      for (const key in bloqueos) {
        const unlockTime = new Date(bloqueos[key]);
        const diff = Math.floor((unlockTime - now) / 1000);
        if (diff > 0) initial[key] = diff;
      }
    }
    return initial;
  });

  const [showCopy, setShowCopy] = useState(null);

 

  useEffect(() => {
    const interval = setInterval(() => {
      setTiempos((prev) => {
        const updated = { ...prev };
        for (const key in updated) {
          if (updated[key] > 0) updated[key] -= 1;
          else delete updated[key];
        }
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRespuesta = (idx, opcion) => {
    const clave = xperiencias[idx].insignia;
    const yaCorrecta = respuestas[clave];
    const estaBloqueado = tiempos[clave] > 0;
    if (yaCorrecta || estaBloqueado) return;

    const esCorrecta = opcion === xperiencias[idx].respuestaCorrecta;

    if (esCorrecta) {
      const nuevo = { ...respuestas, [clave]: true };
      setRespuestas(nuevo);
      localStorage.setItem("progresoXperiencias", JSON.stringify(nuevo));
      setShowCopy(idx);
      setTimeout(() => {
        setShowCopy(null);  
        onClose();
      }, 3000);
    } else {
      const now = new Date();
      const unlockTime = new Date(now.getTime() + 180000);
      const actualizado = { ...bloqueados, [clave]: unlockTime.toISOString() };
      const tiemposActuales = { ...tiempos, [clave]: 180 };
      setBloqueados(actualizado);
      setTiempos(tiemposActuales);
      localStorage.setItem("tiemposBloqueoXperiencias", JSON.stringify(actualizado));
      // Modal no se cierra al fallar
    }
  };

  const total = xperiencias.length;
  const respondidas = Object.values(respuestas).filter((r) => r === true).length;
  const progreso = Math.round((respondidas / total) * 100);

  return (
    <div className="fixed inset-0 z-50">
      <div className="relative w-screen h-screen font-lufga text-black">
        <img
          src="/img/V03-CERRITOS.jpg"
          alt="Fondo"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        <div className="absolute inset-0 w-full h-full bg-white/0 overflow-hidden flex flex-col z-10">
          <div className="flex justify-between items-center px-4 py-3 border-b z-10">
            <button
              onClick={onClose}
              className="bg-white/80 backdrop-blur-sm text-black px-4 py-2 rounded-full shadow border border-gray-300 hover:bg-white"
            >
              ← {t("back")}
            </button>
            <button
              onClick={() => i18n.changeLanguage(i18n.language === "es" ? "en" : "es")}
              className="bg-white/80 backdrop-blur-sm text-black px-4 py-2 rounded-full shadow border border-gray-300 hover:bg-white"
            >
              {t("language")}
            </button>
          </div>

          <div className="px-6 pt-3 pb-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow mx-auto w-fit">
              <h1 className="text-xl md:text-2xl font-bold text-emerald-800 text-center">
                Xperiencias Xtop
              </h1>
            </div>

            <div className="w-full max-w-md mx-auto mt-3 bg-white/80 rounded-full overflow-hidden shadow border border-gray-300">
              <div
                className="bg-green-500 text-white text-xs font-semibold text-center py-1 transition-all"
                style={{ width: `${progreso}%` }}
              >
                {progreso}%
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-6 pt-4">
            <div className="grid gap-6">
              {xperiencias.map((xp, idx) => {
                const clave = xp.insignia;
                const yaRespondida = respuestas[clave] === true;
                const estaBloqueado = tiempos[clave] > 0;
                const minutos = Math.floor((tiempos[clave] || 0) / 60);
                const segundos = (tiempos[clave] || 0) % 60;

                return (
                  <div key={idx} className="relative">
                    {estaBloqueado && (
                      <div className="absolute inset-0 z-20 bg-white/70 backdrop-blur-sm flex items-center justify-center text-red-600 text-lg font-bold rounded-2xl">
                        ⏳ {minutos}:{segundos.toString().padStart(2, "0")}
                      </div>
                    )}
                    {yaRespondida && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 bg-green-100 px-4 py-1 rounded-full text-green-800 text-sm font-semibold shadow">
                        ✅ {t("logrado")}
                      </div>
                    )}

                    <div
                      className={`relative bg-white/90 backdrop-blur-md p-4 md:p-6 rounded-2xl shadow-md border transition-all ${
                        yaRespondida
                          ? "border-green-500"
                          : estaBloqueado
                          ? "border-red-400"
                          : "border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-800 mb-1">{xp.lugar}</h2>
                        <motion.img
                          src={`/insigniasXtop/${xp.insignia}.png`}
                          alt="insignia"
                          className="w-10 h-10 object-contain"
                          initial={{ opacity: 0.2, scale: 0.8 }}
                          animate={
                            showCopy === idx
                              ? {
                                  opacity: 1,
                                  scale: 2,
                                  transition: { duration: 2.5, ease: "easeOut" }
                                }
                              : yaRespondida
                              ? { opacity: 1, scale: 1 }
                              : { opacity: 0.2, scale: 0.8 }
                          }
                        />
                      </div>
                      <p className="text-sm text-gray-700 leading-snug">{t(xp.actividad)}</p>
                      <div className="mt-4">
                        <p className="font-medium text-gray-800 mb-2">{t(xp.pregunta)}</p>
                        <div className="flex flex-col gap-2">
                          {xp.opciones.map((op, i) => (
                            <button
                              key={i}
                              onClick={() => handleRespuesta(idx, op)}
                              disabled={yaRespondida || estaBloqueado}
                              className="px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all border bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                            >
                              {t(`options.${xp.pregunta}.${op.toUpperCase()}`)}
                            </button>
                          ))}
                        </div>
                        {yaRespondida && (
                          <>
                            <div className="mt-3 text-sm text-green-700 font-semibold">
                              ✔ {t("correct")} {t("next_unlocked")}
                            </div>
                            <AnimatePresence>
                              {showCopy === idx && (
                                <motion.div
                                  className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white shadow-lg border border-green-400 px-4 py-2 rounded-xl text-green-800 text-center text-sm w-[90%] max-w-md"
                                  initial={{ opacity: 0, y: -20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  transition={{ duration: 0.5 }}
                                >
                                  {t(`copy.${xp.insignia}`)}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}