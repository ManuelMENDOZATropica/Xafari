import { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import XafariContext from "./XafariContext";

const NOMBRES = [
  "Rodrigo", "Rodrigo", "Rodrigo", "Rodrigo", "Rodrigo",
  "Rodrigo", "Rodrigo", "Rodrigo", "Rodrigo", "Rodrigo",
];

// Casas del juego (coinciden con los guardianes del Árbol de la Vida)
const CASAS = [
  { key: "todos", label: "Todos" },
  { key: "viento", label: "Casa Viento" },
  { key: "tierra", label: "Casa Tierra" },
  { key: "espiral", label: "Casa Espiral" },
  { key: "agua", label: "Casa Agua" },
  { key: "fuego", label: "Casa Fuego" },
  { key: "cielo", label: "Casa Cielo" },
  { key: "eclipse", label: "Casa Eclipse" },
  { key: "luna", label: "Casa Luna" },
  { key: "sol", label: "Casa Sol" },
  { key: "vida", label: "Casa Vida" },
];

const totalExperiencias = 12;
const totalXelfies = 10;
const totalXecretos = 10;

// Genera un avance simulado (cantidades completadas)
const generarAvance = () => ({
  xperiencias: Math.floor(Math.random() * (totalExperiencias + 1)),
  xelfies: Math.floor(Math.random() * (totalXelfies + 1)),
  xecretos: Math.floor(Math.random() * (totalXecretos + 1)),
});

const contar = (obj) => Object.values(obj || {}).filter(Boolean).length;

// Pequeño glifo monocromo para cada Casa
function CasaGlyph({ casaKey, className = "h-4 w-4", color = "#5b3a1a", bg = "#f4ead9" }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (casaKey) {
    case "tierra": // barril / montaña
      return (
        <svg {...common}>
          <ellipse cx="12" cy="5" rx="6" ry="2.2" fill={color} stroke="none" />
          <path d="M6 5v14c0 1.2 2.7 2 6 2s6-.8 6-2V5" fill={color} opacity="0.85" stroke="none" />
          <path d="M6 12c0 1.2 2.7 2 6 2s6-.8 6-2" stroke={bg} />
        </svg>
      );
    case "viento": // remolino / abeja
      return (
        <svg {...common}>
          <path d="M4 8c4-3 9-3 12 0M4 14c5 3 11 3 16 0M7 19c3 2 7 2 10 0" />
        </svg>
      );
    case "agua": // gota
      return (
        <svg {...common}>
          <path d="M12 3c4 5 6 8 6 11a6 6 0 1 1-12 0c0-3 2-6 6-11Z" fill={color} stroke="none" />
        </svg>
      );
    case "fuego": // llama
      return (
        <svg {...common}>
          <path d="M12 3c1 4 5 5 5 9a5 5 0 1 1-10 0c0-2 1-3 2-4 1 1 0 3 1 3 1-3 1-5 2-8Z" fill={color} stroke="none" />
        </svg>
      );
    case "sol": // sol
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" fill={color} stroke="none" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
        </svg>
      );
    case "eclipse": // luna / eclipse
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" fill={color} stroke="none" />
          <circle cx="15" cy="11" r="6" fill={bg} stroke="none" />
        </svg>
      );
    case "espiral": // espiral
      return (
        <svg {...common}>
          <path d="M12 12a3 3 0 1 1-1-2.2 5 5 0 1 1-3 4.2 7 7 0 1 1 7-7" />
        </svg>
      );
    case "vida": // hoja / árbol
      return (
        <svg {...common}>
          <path d="M12 21V9M12 9C12 5 9 3 5 3c0 4 3 6 7 6ZM12 11c0-3 3-5 7-5 0 4-4 5-7 5Z" fill={color} stroke="none" />
        </svg>
      );
    default: // todos / genérico
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="3" fill={color} stroke="none" />
          <path d="M8 12h8M12 8v8" stroke={bg} />
        </svg>
      );
  }
}

export default function PodiumModal() {
  const { t } = useTranslation();
  const [jugadores, setJugadores] = useState([]);
  const [filtro, setFiltro] = useState("todos");

  const { user, progresoXperiencias, xecretos } = useContext(XafariContext);

  useEffect(() => {
    const casasJugables = CASAS.filter((c) => c.key !== "todos");

    const simulacion = NOMBRES.map((nombre, index) => {
      const avance = generarAvance();
      return {
        nombre,
        casa: casasJugables[index % casasJugables.length].key,
        ...avance,
        total: avance.xperiencias + avance.xelfies + avance.xecretos,
      };
    });

    // Progreso real del usuario desde context (BD)
    const real = {
      xperiencias: contar(progresoXperiencias),
      xelfies: 0,
      xecretos: contar(xecretos),
    };
    if (user?.name) {
      simulacion.push({
        nombre: user.name,
        casa: user.casa || casasJugables[0].key,
        esUsuario: true,
        ...real,
        total: real.xperiencias + real.xelfies + real.xecretos,
      });
    }

    simulacion.sort((a, b) => b.total - a.total);
    setJugadores(simulacion);
  }, [user, progresoXperiencias, xecretos]);


  const listaFiltrada = useMemo(() => {
    const base = filtro === "todos" ? jugadores : jugadores.filter((j) => j.casa === filtro);
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
      {/* Lista de ranking */}
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
                <Stat valor={j.xelfies} etiqueta={t("xelfies") || "Xelfies"} />
                <Stat valor={j.xecretos} etiqueta={t("secretsLabel") || "Xecretos"} />
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
            {t("podium") || "Podio"}
          </p>
        )}
      </div>

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
