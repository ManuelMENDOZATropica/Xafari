import { useState, useEffect, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import XafariContext from "./XafariContext";
import CloseIcon from "./CloseIcon";

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
  },
  {
    actividad: "t_experiencia_cielo_xorbeteria",
    lugar: "La Xorbeteria",
    edad: "+18 años",
    amuleto: "Un cono de helado",
    pregunta: "q_cielo_xorbeteria",
    opciones: ["a", "b", "c"],
    respuestaCorrecta: "a",
    insignia: "xorbeteria",
    copy: "copy_cielo_xorbeteria",
  },
];

const xtopInsigniaPaths = {
  camion: "/arbol/xtop/camion.webp",
  caracola: "/arbol/xtop/caracola.webp",
  conejo: "/arbol/xtop/conejo.webp",
  drink: "/arbol/xtop/drink.webp",
  estrella: "/arbol/xtop/estrella.webp",
  kayak: "/arbol/xtop/kayak.webp",
  mascarajaguar: "/arbol/xtop/mascarajaguar.webp",
  patin: "/arbol/xtop/patin.webp",
  piscina: "/arbol/xtop/piscina.webp",
  poolpo: "/arbol/xtop/poolpo.webp",
  salvavidas: "/arbol/xtop/salvavidas.webp",
  teatro: "/arbol/xtop/teatro.webp",
  tobogan: "/arbol/xtop/tobogan.webp",
  tv: "/arbol/xtop/tv.webp",
  vinil: "/arbol/xtop/vinil.webp",
  xorbeteria: "/arbol/xtop/xorbeteria.webp",
  xpiral: "/arbol/xtop/xpiral.webp",
};

export default function XperienciasXtop({ onClose }) {
  const { t } = useTranslation();
  const {
    playSuccessSound, playErrorSound,
    registerActivityCompleted, saveActivityRating,
    progresoXperiencias, calificacionesXperiencias,
  } = useContext(XafariContext);

  // Shuffled options for each question, generated once on mount
  const [shuffledOptions] = useState(() => {
    return xperiencias.map((xp) => {
      const optionsCopy = [...xp.opciones];
      for (let i = optionsCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [optionsCopy[i], optionsCopy[j]] = [optionsCopy[j], optionsCopy[i]];
      }
      return optionsCopy;
    });
  });

  // Ratings: copy from context into local state so user can update them optimistically
  const [ratings, setRatings] = useState(() => ({ ...calificacionesXperiencias }));
  const [respuestas, setRespuestas] = useState(() => ({ ...progresoXperiencias }));

  // Sync when context updates (e.g. after backend sync on login)
  useEffect(() => {
    setRespuestas({ ...progresoXperiencias });
  }, [progresoXperiencias]);

  useEffect(() => {
    setRatings({ ...calificacionesXperiencias });
  }, [calificacionesXperiencias]);

  const [respuestaReciente, setRespuestaReciente] = useState(null);

  const [tiempos, setTiempos] = useState(() => {
    const initial = {};
    const now = new Date();
    const saved = localStorage.getItem("tiemposBloqueoXperiencias");
    let bloqueos = null;
    try {
      bloqueos = saved ? JSON.parse(saved) : null;
    } catch {
      bloqueos = null;
    }
    if (bloqueos) {
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

  const timers = useRef([]);
  useEffect(() => {
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, []);
  const [enviando, setEnviando] = useState(null);
  const [aviso, setAviso] = useState(null); // {idx, text}

  const bloquear = (clave, segundos) => {
    const unlockTime = new Date(Date.now() + segundos * 1000);
    // Solo UX: el servidor aplica el cooldown real (429 / wrong_answer con retryAfter).
    let guardados = {};
    try {
      guardados = JSON.parse(localStorage.getItem("tiemposBloqueoXperiencias") || "{}");
    } catch {
      guardados = {};
    }
    localStorage.setItem(
      "tiemposBloqueoXperiencias",
      JSON.stringify({ ...guardados, [clave]: unlockTime.toISOString() })
    );
    setTiempos((prev) => ({ ...prev, [clave]: segundos }));
  };

  const handleRespuesta = async (idx, opcion) => {
    const clave = xperiencias[idx].insignia;
    const yaCorrecta = respuestas[clave];
    const estaBloqueado = tiempos[clave] > 0;
    if (yaCorrecta || estaBloqueado || enviando !== null) return;

    // Toda respuesta va al servidor: él valida y aplica el cooldown (CONTRATO-API §4).
    // Una respuesta que ya sabemos incorrecta no se encola si no hay red.
    const localCorrect = opcion === xperiencias[idx].respuestaCorrecta;
    setEnviando(idx);
    setAviso(null);
    const res = await registerActivityCompleted(clave, { answer: opcion, queue: localCorrect });
    setEnviando(null);

    if (res.ok || res.queued) {
      playSuccessSound?.();
      setRespuestas((prev) => ({ ...prev, [clave]: opcion }));
      setShowCopy(idx);
      setRespuestaReciente(clave);
      if (res.queued) setAviso({ idx, text: t("qr.queuedBody") });
      timers.current.push(
        setTimeout(() => {
          setShowCopy(null);
          setRespuestaReciente(null);
          onClose(clave); // pasa la clave para animar la insignia en el árbol
        }, 2000)
      );
    } else if (res.status === 429 || res.error === "wrong_answer" || (!localCorrect && res.network)) {
      playErrorSound?.();
      bloquear(clave, Number(res.retryAfter) || 180);
    } else {
      setAviso({ idx, text: t("qr.errorBody") });
    }
  };

  const handleSetRating = (clave, valor) => {
    const actualizado = { ...ratings, [clave]: valor };
    setRatings(actualizado);
    saveActivityRating(clave, valor);
  };

  return (
  <div className="w-full h-full">
    <div className="relative w-full h-full font-apercu bg-[#7b5226] rounded-[10px]">
      <div className="absolute inset-0 w-full h-full overflow-hidden flex flex-col z-10">

        <div className="flex-1 overflow-y-auto px-3 pb-[75px] pt-3">
          <div className="grid gap-3">
            {xperiencias.map((xp, idx) => {
              const clave = xp.insignia;
              const yaRespondida = respuestas[clave] === xp.respuestaCorrecta;
              const estaBloqueado = tiempos[clave] > 0;
              const minutos = Math.floor((tiempos[clave] || 0) / 60);
              const segundos = (tiempos[clave] || 0) % 60;
              const anteriorRespondida = idx === 0 || respuestas[xperiencias[idx - 1].insignia];
              const estaBloqueadaPorOrden = !anteriorRespondida;
              const deshabilitado = yaRespondida || estaBloqueado || estaBloqueadaPorOrden;

              return (
                <div key={idx} className="relative">
                  {/* Blocked overlay */}
                  {(estaBloqueado || estaBloqueadaPorOrden) && (
                    <div className="absolute inset-0 z-20 bg-[#5a3a18]/80 backdrop-blur-sm flex flex-col items-center justify-center text-white font-semibold text-center rounded-2xl px-4">
                      <div aria-hidden="true" className="text-xl mb-1">🔒</div>
                      {estaBloqueado && (
                        <div className="text-sm">{t("retry_in")} {minutos}:{segundos.toString().padStart(2, "00")}</div>
                      )}
                    </div>
                  )}

                  {/* Card */}
                  <div className="relative rounded-2xl overflow-hidden shadow-md" style={{ backgroundColor: "rgba(242, 232, 218, 1)" }}>
                    {/* Header row: title + checkbox */}
                    <div className="flex items-start justify-between px-4 pt-4 pb-1">
                      <h2 className="flex-1 pr-3 text-sm font-bold leading-tight" style={{ color: "#3D1A00" }}>
                        {t(`xpPlaces.${xp.insignia}`, { defaultValue: xp.lugar })}
                      </h2>
                      <div className="relative flex-shrink-0 w-[34px] h-[34px]">
                        {/* Checkbox base — siempre visible */}
                        <img
                          src="/iconos/checkXperiencias.png"
                          alt=""
                          className="w-full h-full object-contain"
                        />
                        {/* Palomita — aparece encima al contestar bien */}
                        {yaRespondida && (
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
                    </div>

                    {/* Description */}
                    <p className="text-xs px-4 pb-2 leading-relaxed" style={{ color: "#3D1A00" }}>
                      {t(xp.actividad)}
                    </p>

                    {/* Question + Options + Insignia inline */}
                    <div className="px-4 pb-3">
                      <p className="text-xs font-semibold mb-2" style={{ color: "#3D1A00" }}>
                        {t(xp.pregunta)}
                      </p>

                      <div className="flex items-start gap-2">
                        {/* Botones de opciones (-10%) */}
                        <div className="flex flex-row gap-1 flex-1">
                          {(shuffledOptions[idx] || xp.opciones).map((op, i) => {
                            const esCorrecta = op === xp.respuestaCorrecta;
                            return (
                              <motion.button
                                key={i}
                                onClick={() => handleRespuesta(idx, op)}
                                disabled={deshabilitado}
                                initial={false}
                                animate={
                                  respuestaReciente === clave && esCorrecta && op === xp.respuestaCorrecta
                                    ? { scale: [1, 1.08, 1] }
                                    : {}
                                }
                                transition={{ duration: 0.4 }}
                                className="flex-1 py-[7px] px-1 text-[11px] font-medium rounded-xl text-center transition-all disabled:opacity-100"
                                style={{
                                  backgroundColor:
                                    yaRespondida && esCorrecta ? "rgba(134,239,172,0.9)"
                                    : respuestas[clave] === op && !esCorrecta ? "rgba(252,165,165,0.9)"
                                    : "rgba(255,255,255,0.85)",
                                  color:
                                    yaRespondida && esCorrecta ? "#166534"
                                    : respuestas[clave] === op && !esCorrecta ? "#991b1b"
                                    : "#3D1A00",
                                  border: "1.5px solid rgba(61,26,0,0.15)",
                                }}
                              >
                                <span style={{ filter: yaRespondida ? "blur(4px)" : "none", transition: "filter 0.3s ease" }}>
                                  {t(`options.${xp.pregunta}.${op.toUpperCase()}`)}
                                </span>
                              </motion.button>
                            );
                          })}
                        </div>

                        {/* Insignia — inline, siempre a la misma altura que los botones, subida 5% */}
                        <motion.img
                          src={xtopInsigniaPaths[xp.insignia]}
                          alt=""
                          className="flex-shrink-0 w-14 h-14 object-contain pointer-events-none"
                          style={{ marginTop: "-5%" }}
                          initial={{ opacity: 0.25, scale: 0.85 }}
                          animate={
                            showCopy === idx
                              ? { opacity: 1, scale: [1, 1.25, 1], transition: { duration: 0.5 } }
                              : yaRespondida
                              ? { opacity: 1, scale: 1, transition: { duration: 0.4 } }
                              : { opacity: 0.25, scale: 0.85 }
                          }
                        />
                      </div>

                      {enviando === idx && (
                        <p role="status" className="mt-2 text-xs font-semibold" style={{ color: "#3D1A00" }}>{t("loading")}</p>
                      )}
                      {aviso?.idx === idx && (
                        <p role="alert" className="mt-2 text-xs font-semibold text-red-800">{aviso.text}</p>
                      )}

                      {/* Estrellas — debajo de los botones; insignia no se desplaza */}
                      {yaRespondida && (
                        <div className="mt-2 flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              aria-label={t("rateStars", { count: star })}
                              aria-pressed={ratings[xp.insignia] >= star}
                              onClick={() => handleSetRating(xp.insignia, star)}
                              className={`text-lg cursor-pointer transition-transform bg-transparent border-none p-0 ${ratings[xp.insignia] >= star ? "text-yellow-500" : "text-[#3D1A00]/40"}`}
                            >★</button>
                          ))}
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

