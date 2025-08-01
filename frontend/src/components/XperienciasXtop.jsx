import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const xperiencias = [
  {
    actividad: "t_experiencia_caletas",
    lugar: "Caletas del hotel en kayak o paddle board",
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
    lugar: "Salón Flamingo",
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
    lugar: "Muluk Family Spa",
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
    lugar: "Bar Las Maquinitas",
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
    lugar: "Teatro del Río",
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
    lugar: "Alberca infinita",
    edad: "Familiar",
    amuleto: "Un salvavidas",
    pregunta: "q_tierra_logo",
    opciones: ["a", "b", "c"],
    respuestaCorrecta: "c",
    insignia: "salvavidas",
    copy: "copy_tierra_alberca",
  },
  {
    actividad: "t_experiencia_eclipse_luna",
    lugar: "Lunateca",
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
    lugar: "Xiquit Inn",
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
    lugar: "Infinity Room",
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
    lugar: "Paxanguería",
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
    lugar: "Rooftop Fuego",
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
    lugar: "Patín",
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
    lugar: "Kamikaze , el tobogán más alto",
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
    lugar: "Xpiral",
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
    lugar: "Pool’po",
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
    lugar: "Xupes y Pava Jarla",
    edad: "+18 años",
    amuleto:
      "Amuleto de un drinksito con un sticker de una máscara de luchador sobre el vaso",
    pregunta: "q_cielo_xupes",
    opciones: ["a", "b", "c"],
    respuestaCorrecta: "a",
    insignia: "drink",
    copy: "copy_cielo_xupes",
  },{
    actividad: "t_experiencia_cielo_xorbeteria",
    lugar: "La Xorbeteria",
    edad: "+18 años",
    amuleto:
      "Un cono de helado",
    pregunta: "q_cielo_xorbeteria",
    opciones: ["a", "b", "c"],
    respuestaCorrecta: "a",
    insignia: "xorbeteria",
    copy: "copy_cielo_xorbeteria",
  },
];

export default function XperienciasXtop({ onClose }) {
  const { t, i18n } = useTranslation();

  const [ratings, setRatings] = useState(() => {
    const saved = localStorage.getItem("calificacionesXperiencias");
    return saved ? JSON.parse(saved) : {};
  });

  const [respuestas, setRespuestas] = useState(() => {
    const saved = localStorage.getItem("progresoXperiencias");
    return saved ? JSON.parse(saved) : {};
  });

  const [bloqueados, setBloqueados] = useState(() => {
    const saved = localStorage.getItem("tiemposBloqueoXperiencias");
    return saved ? JSON.parse(saved) : {};
  });
  const [respuestaReciente, setRespuestaReciente] = useState(null);

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
      const nuevo = { ...respuestas, [clave]: opcion };
      localStorage.setItem("progresoXperiencias", JSON.stringify(nuevo));
      setShowCopy(idx);
      setRespuestaReciente(clave); // <- Añadido
      setTimeout(() => {
        setShowCopy(null);
        setRespuestaReciente(null); // <- Limpiar después de animar
        onClose();
      }, 2000);
    } else {
      const now = new Date();
      const unlockTime = new Date(now.getTime() + 180000);
      const actualizado = { ...bloqueados, [clave]: unlockTime.toISOString() };
      const tiemposActuales = { ...tiempos, [clave]: 180 };
      setBloqueados(actualizado);
      setTiempos(tiemposActuales);
      localStorage.setItem(
        "tiemposBloqueoXperiencias",
        JSON.stringify(actualizado)
      );
    }
  };

  const handleSetRating = (clave, valor) => {
    const actualizado = { ...ratings, [clave]: valor };
    setRatings(actualizado);
    localStorage.setItem(
      "calificacionesXperiencias",
      JSON.stringify(actualizado)
    );
  };

  const total = xperiencias.length;
  const respondidas = xperiencias.filter(
  (xp) => respuestas[xp.insignia] === xp.respuestaCorrecta
).length;

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
              onClick={() =>
                i18n.changeLanguage(i18n.language === "es" ? "en" : "es")
              }
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
                const yaRespondida = respuestas[clave] === xp.respuestaCorrecta;

                const estaBloqueado = tiempos[clave] > 0;
                const minutos = Math.floor((tiempos[clave] || 0) / 60);
                const segundos = (tiempos[clave] || 0) % 60;
                const anteriorRespondida =
                  idx === 0 || respuestas[xperiencias[idx - 1].insignia];
                const estaBloqueadaPorOrden = !anteriorRespondida;

                const deshabilitado =
                  yaRespondida || estaBloqueado || estaBloqueadaPorOrden;

                return (
                  <div key={idx} className="relative">
                    {(estaBloqueado || estaBloqueadaPorOrden) && (
                      <div className="absolute inset-0 z-20 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center text-red-600 font-semibold text-center rounded-2xl px-4">
                        <div className="text-2xl mb-1">{t("blocked")}</div>
                        {estaBloqueado && (
                          <div className="text-sm text-red-700">
                            {t("retry_in")} {minutos}:
                            {segundos.toString().padStart(2, "0")}
                          </div>
                        )}
                      </div>
                    )}

                    {yaRespondida && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 bg-green-100 px-4 py-1 rounded-full text-green-800 text-sm font-semibold shadow"
                      >
                        ✅ {t("logrado")}
                      </motion.div>
                    )}

                    <div
                      className={`relative p-4 md:p-6 rounded-2xl shadow-md border transition-all ${
                        yaRespondida
                          ? "border-green-500 bg-white/90 backdrop-blur-md"
                          : estaBloqueado || estaBloqueadaPorOrden
                          ? "border-gray-300 bg-gray-100/70 grayscale opacity-60"
                          : "border-gray-300 bg-white/90 backdrop-blur-md"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-800 mb-1">
                          {xp.lugar}
                        </h2>

                        <motion.img
                          src={`/insigniasXtop/${xp.insignia}.png`}
                          alt="insignia"
                          className="w-10 h-10 object-contain"
                          initial={{ opacity: 0.2, scale: 0.8 }}
                          animate={
                            showCopy === idx
                              ? {
                                  opacity: 1,
                                  scale: [1, 1.3, 1],
                                  transition: { duration: 0.6 },
                                }
                              : yaRespondida
                              ? {
                                  opacity: 1,
                                  scale: 1,
                                  transition: { duration: 0.4 },
                                }
                              : { opacity: 0.2, scale: 0.8 }
                          }
                        />
                      </div>

                      <p className="text-sm text-gray-700 leading-snug">
                        {t(xp.actividad)}
                      </p>

                      <div className="mt-4">
                        <p className="font-medium text-gray-800 mb-2">
                          {t(xp.pregunta)}
                        </p>
                        <div className="flex flex-col gap-2">
                          {xp.opciones.map((op, i) => {
                            const esCorrecta = op === xp.respuestaCorrecta;
                            const fueRespondida =
                              respuestas[clave] !== undefined;
                            const esLaElegida =
                              respuestas[clave] && op === respuestas[clave];

                            return (
                              <motion.button
                                key={i}
                                onClick={() => handleRespuesta(idx, op)}
                                disabled={deshabilitado}
                                initial={false}
                                animate={
                                  respuestaReciente === clave &&
                                  esCorrecta &&
                                  op === xp.respuestaCorrecta
                                    ? {
                                        scale: [1, 1.2, 1],
                                        boxShadow:
                                          "0 0 10px rgba(34,197,94,0.6)",
                                      }
                                    : {}
                                }
                                transition={{ duration: 0.5 }}
                                className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all border
    ${
      yaRespondida
        ? esCorrecta
          ? "bg-green-100 text-green-800 border-green-400"
          : "bg-white text-gray-500 border-gray-300"
        : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
    }
    ${
      respuestas[clave] === op && !esCorrecta
        ? "bg-red-100 text-red-800 border-red-400"
        : ""
    }
    disabled:opacity-50`}
                              >
                                {t(
                                  `options.${xp.pregunta}.${op.toUpperCase()}`
                                )}
                                {yaRespondida && esCorrecta && " ✅"}
                                {respuestas[clave] === op &&
                                  !esCorrecta &&
                                  " ✖️"}
                              </motion.button>
                            );
                          })}
                        </div>

                        {yaRespondida && (
                          <div className="mt-4">
                            <p className="text-sm text-green-700 font-semibold">
                              {t("correct")} {t("next_unlocked")}
                            </p>
                            <p className="text-sm font-medium text-gray-700 mt-3">
                              {t("rateExperience")}
                            </p>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  role="button"
                                  onClick={() =>
                                    handleSetRating(xp.insignia, star)
                                  }
                                  className={`text-xl cursor-pointer transition-transform ${
                                    ratings[xp.insignia] >= star
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
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
