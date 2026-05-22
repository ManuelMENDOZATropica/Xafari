import { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import XafariContext from "./XafariContext";

// Casas del juego
const CASAS = [
  { key: "todos", label: "Todos" },
  { key: "viento",  label: "Casa Viento" },
  { key: "tierra",  label: "Casa Tierra" },
  { key: "espiral", label: "Casa Espiral" },
  { key: "agua",    label: "Casa Agua" },
  { key: "fuego",   label: "Casa Fuego" },
  { key: "cielo",   label: "Casa Cielo" },
  { key: "eclipse", label: "Casa Eclipse" },
  { key: "luna",    label: "Casa Luna" },
  { key: "sol",     label: "Casa Sol" },
  { key: "vida",    label: "Casa Vida" },
];

// Icono real de cada Casa desde /iconos/
function CasaGlyph({ casaKey, className = "h-5 w-5" }) {
  const src = casaKey === "todos"
    ? "/iconos/icon_casas.svg"
    : `/iconos/icon_casa${casaKey}.svg`;
  return (
    <img
      src={src}
      alt={casaKey}
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}

export default function PodiumModal({ periodo = "siempre" }) {
  const { t } = useTranslation();
  const { user, token, progresoXperiencias, xecretos } = useContext(XafariContext);

  const [jugadores, setJugadores] = useState([]);
  const [filtro,    setFiltro]    = useState("todos");
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  // ── Fetch leaderboard desde el backend ──────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const base = import.meta.env.VITE_API_URL || "/api";
        const res  = await fetch(`${base}/leaderboard?periodo=${periodo}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // Marcar al usuario actual
        const enriched = data.map((j) => ({
          ...j,
          esUsuario: user?.id && j.id === user.id,
        }));

        if (!cancelled) setJugadores(enriched);
      } catch (err) {
        console.error("[PodiumModal] fetch error:", err);
        if (!cancelled) setError("No se pudo cargar el podio.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, [periodo, token, user?.id]);

  // ── Filtro por casa ──────────────────────────────────────────────────────────
  const listaFiltrada = useMemo(() => {
    const base = filtro === "todos"
      ? jugadores
      : jugadores.filter((j) => j.casa === filtro);
    return base.map((j, i) => ({ ...j, rank: i + 1 }));
  }, [jugadores, filtro]);

  const Stat = ({ valor, etiqueta }) => (
    <div className="flex flex-1 flex-col items-center justify-center rounded-xl bg-[#e7d6ba] px-1 py-2">
      <span className="text-2xl font-extrabold leading-none text-[#3d1a00]">{valor}</span>
      <span className="mt-1 text-[10px] font-medium text-[#6b4a25]">{etiqueta}</span>
    </div>
  );

  return (
    <motion.div className="flex h-full w-full flex-col overflow-hidden bg-[#7b5226] font-apercu">

      {/* Estado de carga / error */}
      {loading && (
        <div className="flex flex-1 items-center justify-center">
          <span className="text-[#f4ead9]/70 text-sm animate-pulse">Cargando podio…</span>
        </div>
      )}
      {!loading && error && (
        <div className="flex flex-1 items-center justify-center px-4">
          <span className="text-[#f4ead9]/70 text-sm text-center">{error}</span>
        </div>
      )}

      {/* Lista de ranking */}
      {!loading && !error && (
        <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
          {listaFiltrada.map((j, idx) => (
            <div
              key={idx}
              className={`relative flex items-center gap-3 rounded-2xl bg-[#f4ead9] px-4 py-3 shadow-md ${
                j.esUsuario ? "ring-2 ring-[#c9982f]" : ""
              }`}
            >
              <div className="min-w-0 flex-1">
                {/* Nombre + glifo de casa */}
                <div className="mb-2 flex items-center gap-2">
                  <span className="truncate text-base font-bold text-[#3d1a00]">{j.nombre}</span>
                  <CasaGlyph casaKey={j.casa} />
                </div>
                {/* Cajas de stats */}
                <div className="flex items-stretch gap-2 pr-12">
                  <Stat valor={j.xperiencias} etiqueta={t("xperiencesLabel") || "Xperiencias"} />
                  <Stat valor={j.xelfies}     etiqueta={t("xelfies")        || "Xelfies"}      />
                  <Stat valor={j.xecretos}    etiqueta={t("secretsLabel")   || "Xecretos"}     />
                </div>
              </div>

              {/* Círculo de rango */}
              <div className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#c9982f] shadow">
                <span className="text-lg font-extrabold text-white">{j.rank}°</span>
              </div>
            </div>
          ))}

          {listaFiltrada.length === 0 && (
            <p className="mt-8 text-center text-sm text-[#f4ead9]/80">
              Sin resultados para este período
            </p>
          )}
        </div>
      )}

      {/* Barra inferior de filtros por Casa */}
      <div className="flex-shrink-0 overflow-x-auto bg-[#7b5226] px-3 py-2">
        <div className="flex w-max items-center gap-2">
          {CASAS.map((casa) => {
            const activo = filtro === casa.key;
            return (
              <button
                key={casa.key}
                type="button"
                onClick={() => setFiltro(casa.key)}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition-all"
                style={{
                  backgroundColor: activo ? "rgba(242,232,218,1)" : "#5e3d1c",
                  color: activo ? "#3D1A00" : "rgba(242,232,218,1)",
                  border: "none",
                }}
              >
                {casa.label}
                {casa.key !== "todos" && (
                  <CasaGlyph
                    casaKey={casa.key}
                    className="h-4 w-4"
                    color={activo ? "#3D1A00" : "#f4ead9"}
                    bg={activo ? "#f2e8da" : "#5e3d1c"}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
