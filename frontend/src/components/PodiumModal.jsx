import { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import XafariContext from "./XafariContext";
import { api } from "@/lib/api";

// Casas del juego
const CASAS = ["todos", "viento", "tierra", "espiral", "agua", "fuego", "cielo", "eclipse", "luna", "sol", "vida"];
// La UI dice "siempre"; el contrato usa "total".
const PERIODO_API = { hoy: "hoy", mes: "mes", siempre: "total" };

function Stat({ valor, etiqueta }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-[#e7d6ba] px-1 py-2">
      <span className="text-2xl font-extrabold leading-none text-[#3d1a00]">{valor ?? 0}</span>
      <span className="mt-1 text-[10px] font-medium text-[#5a3a18]">{etiqueta}</span>
    </div>
  );
}

// Icono real de cada Casa desde /iconos/
function CasaGlyph({ casaKey, className = "h-5 w-5" }) {
  const src = casaKey === "todos"
    ? "/iconos/icon_casas.svg"
    : `/iconos/icon_casa${casaKey}.svg`;
  return (
    <img
      src={src}
      alt=""
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

export default function PodiumModal({ periodo = "siempre" }) {
  const { t } = useTranslation();
  const { token, xecretos, progresoXperiencias, progresoXelfies } = useContext(XafariContext);

  const [jugadores, setJugadores] = useState([]);
  const [filtro,    setFiltro]    = useState("todos");
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  // ── Leaderboard (sin ids: la fila propia viene con esYo) ───────────────────
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    api
      .get(`/leaderboard?periodo=${PERIODO_API[periodo] || "total"}`, { signal: controller.signal })
      .then((data) => setJugadores(Array.isArray(data) ? data : []))
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.error("[PodiumModal] fetch error:", err);
        setError(t("leaderboard.error"));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [periodo, token, xecretos, progresoXperiencias, progresoXelfies, t]);

  // ── Filtro por casa ──────────────────────────────────────────────────────────
  const listaFiltrada = useMemo(() => {
    const base = filtro === "todos"
      ? jugadores
      : jugadores.filter((j) => j.casa === filtro);
    return base.map((j, i) => ({ ...j, rank: i + 1 }));
  }, [jugadores, filtro]);

  return (
    <motion.div className="flex h-full w-full flex-col overflow-hidden bg-[#7b5226] font-apercu">

      {/* Estado de carga / error */}
      {loading && (
        <div className="flex flex-1 items-center justify-center">
          <span role="status" className="text-[#f4ead9] text-sm animate-pulse">{t("leaderboard.loading")}</span>
        </div>
      )}
      {!loading && error && (
        <div className="flex flex-1 items-center justify-center px-4">
          <span role="alert" className="text-[#f4ead9] text-sm text-center">{error}</span>
        </div>
      )}

      {/* Lista de ranking */}
      {!loading && !error && (
        <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
          {listaFiltrada.map((j, idx) => (
            <div
              key={idx}
              className={`relative flex items-center gap-3 rounded-2xl bg-[#f4ead9] px-4 py-3 shadow-md ${
                j.esYo ? "ring-2 ring-[#c9982f]" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                {/* Nombre + glifo de casa */}
                <div className="mb-2 flex items-center gap-2">
                  <span className="truncate text-base font-bold text-[#3d1a00]">
                    {j.nombre}
                    {j.esYo && <span className="ml-1 text-xs font-semibold">({t("youLabel")})</span>}
                  </span>
                  <CasaGlyph casaKey={j.casa} />
                </div>
                {/* Cajas de stats */}
                <div className="flex items-stretch gap-2 pr-12">
                  <Stat valor={j.xperiencias} etiqueta={t("xperiencesLabel")} />
                  <Stat valor={j.xelfies} etiqueta={t("xelfies")} />
                  <Stat valor={j.xecretos} etiqueta={t("secretsLabel")} />
                </div>
              </div>

              {/* Círculo de rango */}
              <div className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#c9982f] shadow">
                <span className="text-lg font-extrabold text-white">{j.rank}°</span>
              </div>
            </div>
          ))}

          {listaFiltrada.length === 0 && (
            <p className="mt-8 text-center text-sm text-[#f4ead9]">
              {t("leaderboard.empty")}
            </p>
          )}
        </div>
      )}

      {/* Barra inferior de filtros por Casa */}
      <div className="flex-shrink-0 overflow-x-auto bg-[#7b5226] px-3 py-2">
        <div className="flex w-max items-center gap-2">
          {CASAS.map((casa) => {
            const activo = filtro === casa;
            return (
              <button
                key={casa}
                type="button"
                aria-pressed={activo}
                onClick={() => setFiltro(casa)}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition-all"
                style={{
                  backgroundColor: activo ? "rgba(242,232,218,1)" : "#5e3d1c",
                  color: activo ? "#3D1A00" : "rgba(242,232,218,1)",
                  border: "none",
                }}
              >
                {casa === "todos" ? t("leaderboard.all") : t("registerFlow.casaLabel", { name: casa.charAt(0).toUpperCase() + casa.slice(1) })}
                {casa !== "todos" && <CasaGlyph casaKey={casa} className="h-4 w-4" />}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
