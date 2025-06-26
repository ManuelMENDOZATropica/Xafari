import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const xperiencias = [
  {
    actividad: "t_experiencia_caletas",
    lugar: "Caletas",
    edad: "Familiar",
    amuleto: "Kayak verde o Paddle Board blanco",
    pregunta: "q_caletas",
    opciones: ["a", "b", "c"],
    respuestaCorrecta: "a",
  },
  {
    actividad: "t_experiencia_cielo_flamingos",
    lugar: "Cielo",
    edad: "Familiar",
    amuleto: "Un Vinil con el centro rosa",
    pregunta: "q_cielo_flamingos",
    opciones: ["a", "b", "c"],
    respuestaCorrecta: "b",
  },
  {
    actividad: "t_experiencia_agua_muluk",
    lugar: "Agua",
    edad: "Familiar",
    amuleto: "Una caracola",
    pregunta: "q_muluk",
    opciones: ["a", "b", "c"],
    respuestaCorrecta: "c",
  },
  {
    actividad: "t_experiencia_vida_maquinitas",
    lugar: "Vida",
    edad: "Familiar",
    amuleto: "Una televisión antigua",
    pregunta: "q_vida_juegos",
    opciones: ["a", "b", "c"],
    respuestaCorrecta: "b",
  },
  {
    actividad: "t_experiencia_espiral_teatro",
    lugar: "Espiral",
    edad: "Familiar",
    amuleto: "Máscaras de teatro",
    pregunta: "q_espiral_lamparas",
    opciones: ["a", "b", "c"],
    respuestaCorrecta: "a",
  },
  {
    actividad: "t_experiencia_tierra_alberca",
    lugar: "Tierra",
    edad: "Familiar",
    amuleto: "Un salvavidas",
    pregunta: "q_tierra_logo",
    opciones: ["a", "b", "c"],
    respuestaCorrecta: "b",
  },
  {
    actividad: "t_experiencia_eclipse_luna",
    lugar: "Eclipse",
    edad: "0-5 años",
    amuleto: "La silueta de un conejo en una Luna",
    pregunta: "q_eclipse_luna",
    opciones: ["a", "b", "c"],
    respuestaCorrecta: "a",
  },
  {
    actividad: "t_experiencia_eclipse_xiquit",
    lugar: "Eclipse",
    edad: "5-9 años",
    amuleto: "El camión de Xiquit Inn",
    pregunta: "q_eclipse_xiquit",
    opciones: ["a", "b", "c"],
    respuestaCorrecta: "b",
  },
  {
    actividad: "t_experiencia_sol_infinity",
    lugar: "Sol",
    edad: "13-17 años",
    amuleto: "Amuleto de una de las estrellas de infinity",
    pregunta: "q_sol_mensaje",
    opciones: ["a", "b", "c"],
    respuestaCorrecta: "a",
  },
  {
    actividad: "t_experiencia_sol_jaguar",
    lugar: "Sol",
    edad: "13-17 años",
    amuleto: "La máscara del guardián jaguar que está colgada sobre la pared",
    pregunta: "q_sol_jaguar",
    opciones: ["a", "b", "c"],
    respuestaCorrecta: "b",
  },
  {
    actividad: "t_experiencia_fuego_piscina",
    lugar: "Fuego",
    edad: "+18 años",
    amuleto: "Amuleto de la famosa alberca transparente con una personita nadando",
    pregunta: "q_fuego_piscina",
    opciones: ["a", "b", "c"],
    respuestaCorrecta: "b",
  },
];

export default function XecretosXptop() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [respuestas, setRespuestas] = useState({});
  const [abiertos] = useState(Object.fromEntries(xperiencias.map((_, i) => [i, true])));
  const [bloqueados, setBloqueados] = useState({});
  const [tiempos, setTiempos] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      setTiempos((prev) => {
        const updated = { ...prev };
        for (const key in updated) {
          if (updated[key] > 0) updated[key] -= 1;
        }
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRespuesta = (idx, opcion) => {
    if (bloqueados[idx]) return;
    const esCorrecta = opcion === xperiencias[idx].respuestaCorrecta;
    setRespuestas((prev) => ({ ...prev, [idx]: opcion }));

    if (!esCorrecta) {
      setBloqueados((prev) => ({ ...prev, [idx]: true }));
      setTiempos((prev) => ({ ...prev, [idx]: 180 }));
      setTimeout(() => {
        setRespuestas((prev) => {
          const updated = { ...prev };
          delete updated[idx];
          return updated;
        });
        setBloqueados((prev) => {
          const updated = { ...prev };
          delete updated[idx];
          return updated;
        });
        setTiempos((prev) => {
          const updated = { ...prev };
          delete updated[idx];
          return updated;
        });
      }, 180000);
    }
  };

  const total = xperiencias.length;
  const respondidas = Object.keys(respuestas).filter(
    (k) => respuestas[k] === xperiencias[k].respuestaCorrecta
  ).length;
  const progreso = Math.round((respondidas / total) * 100);

  return (
    <div className="relative min-h-screen w-full font-lufga bg-white overflow-hidden">
      <img
        src="/img/V03-CERRITOS.jpg"
        alt="Fondo Xperiencias"
        className="absolute inset-0 w-full h-full object-cover object-bottom z-0"
      />

      <div className="z-20 relative flex flex-col items-center pb-4">
        <div className="w-full flex justify-between items-center px-4 pt-[env(safe-area-inset-top)] mt-4 pb-1">
          <button
            onClick={() => navigate("/treeoflife")}
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

        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow px-4 py-2 mt-2 text-center w-fit">
          <h1 className="text-xl md:text-2xl font-bold text-emerald-800 drop-shadow">
            Xecretos Xptop
          </h1>
        </div>

        {/* Progreso */}
        <div className="w-full max-w-md mt-4 bg-white/80 rounded-full overflow-hidden shadow border border-gray-300">
          <div
            className="bg-green-500 text-white text-xs font-semibold text-center py-1 transition-all"
            style={{ width: `${progreso}%` }}
          >
            {progreso}%
          </div>
        </div>
      </div>

      <div className="h-[calc(100vh-200px)] overflow-y-auto px-4 pb-16 pt-6 z-10 relative max-w-4xl mx-auto">
        <div className="grid gap-6">
          {xperiencias.map((xp, idx) => {
            const yaRespondida = respuestas[idx] === xp.respuestaCorrecta;
            const estaAbierta = abiertos[idx];
            const haRespondido = respuestas.hasOwnProperty(idx);
            const estaBloqueado = bloqueados[idx];
            const segundosRestantes = tiempos[idx] || 0;
            const minutos = Math.floor(segundosRestantes / 60);
            const segundos = segundosRestantes % 60;
            return (
              <div
                key={idx}
                className={`bg-white/90 backdrop-blur-md p-4 md:p-6 rounded-2xl shadow-md border ${
                  yaRespondida
                    ? "border-green-500"
                    : haRespondido
                    ? "border-red-400"
                    : "border-gray-300"
                } transition-all`}
              >
                <button
                  className="w-full text-left bg-white rounded-lg border border-gray-300 p-4 hover:bg-gray-50 transition"
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">
                    {xp.lugar}
                  </h2>
                  <p className="text-sm text-gray-700 leading-snug">
                    {t(xp.actividad)}
                  </p>
                </button>

                {estaAbierta && (
                  <div className="mt-4">
                    <p className="font-medium text-gray-800 mb-2">
                      {t(xp.pregunta)}
                    </p>

                    <div className="flex flex-col gap-2">
                      {xp.opciones.map((op, i) => {
                        const esSeleccionada = respuestas[idx] === op;
                        const esCorrecta = op === xp.respuestaCorrecta;
                        return (
                          <button
                            key={i}
                            onClick={() => handleRespuesta(idx, op)}
                            disabled={haRespondido || estaBloqueado}
                            className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all border ${
                              !haRespondido && !estaBloqueado
                                ? "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                                : esSeleccionada
                                ? esCorrecta
                                  ? "bg-green-600 text-white border-green-700"
                                  : "bg-red-200 text-white border-red-400"
                                : "bg-gray-100 text-gray-400 border-gray-200"
                            }`}
                          >
                            {t(`options.${xp.pregunta}.${op.toUpperCase()}`)}
                          </button>
                        );
                      })}
                    </div>

                    {yaRespondida && (
                      <div className="mt-3 text-sm text-green-700 font-semibold">
                        ✔ {t("correct")} {t("next_unlocked")}
                      </div>
                    )}
                    {!yaRespondida && haRespondido && (
                      <div className="mt-3 text-sm text-red-600 font-semibold">
                        ✘ {t("incorrect")} {t("retry_in")} {minutos}:
                        {segundos.toString().padStart(2, "0")}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
