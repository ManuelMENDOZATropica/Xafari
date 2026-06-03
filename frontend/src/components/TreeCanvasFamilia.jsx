import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import AvatarRender from "@/components/AvatarRender";
import { motion } from "framer-motion";
import { useRef, useEffect, useState, useCallback, useMemo, useContext } from "react";
import XafariContext from "@/components/XafariContext";

// ─── constantes del canvas ────────────────────────────────────────────────────
const CANVAS_WIDTH  = 2450;
const CANVAS_HEIGHT = 4200;
const INITIAL_SCALE = 0.17;
const MIN_SCALE     = 0.15;
const MAX_SCALE     = 0.40;

function calcInitialPos() {
  // iOS Safari puede devolver 0 o valores raros antes del layout — usamos fallbacks seguros
  const vw = (typeof window !== "undefined" && window.innerWidth)  || 390;
  const vh = (typeof window !== "undefined" && window.innerHeight) || 844;
  const topOffset    = 56;
  const bottomOffset = vh * 0.02 + 210;
  const availableH   = vh - topOffset - bottomOffset;
  return {
    x: (vw - CANVAS_WIDTH  * INITIAL_SCALE) / 2,
    y: topOffset + (availableH - CANVAS_HEIGHT * INITIAL_SCALE) / 2,
  };
}

const positionsById = {
  1: { x: 1450, y: 3000 },
  2: { x: 1100, y: 3000 },
  3: { x: 1400, y: 3050 },
  4: { x: 1150, y: 3050 },
  5: { x: 1350, y: 3100 },
  6: { x: 1200, y: 3100 },
};

function parseUserProgress(userObj) {
  const dbActivities = userObj?.activities || [];
  const xecretos = {};
  const checklist = {};
  const xperiencias = {};

  dbActivities.forEach((act) => {
    const completed = act.userActivity?.completedAt || act.UserActivity?.completedAt;
    if (!completed) return;

    if (act.type === "Xecreto") {
      xecretos[act.name] = true;
    } else if (act.type === "Event") {
      checklist[act.name] = true;
    } else if (act.type === "Xperiencia") {
      xperiencias[act.name] = true;
    }
  });

  return { xecretos, checklist, xperiencias };
}
const mapa = {
  xecreto1: "mono",
  xecreto2: "rana",
  xecreto3: "jaguar",
  xecreto4: "guacamaya",
  xecreto5: "serpiente",
  xecreto6: "venado",
  xecreto7: "buho",
  xecreto8: "mariposa",
  xecreto9: "flamenco",
  xecreto10: "coati",
};

const mapaXperiencias = {
  x1: "acai",
  x2: "carne",
  x3: "ceviche",
  x4: "coctel",
  x5: "corunda",
  x6: "espada",
  x7: "mezcal",
  x8: "mimosa",
  x9: "nogada",
  x10: "ostion",
  x11: "paleta",
  x12: "palomitas",
  x13: "panucho",
  x14: "quesadillas",
  x15: "quesos",
  x16: "ramen",
  x17: "ravioli",
  x18: "sushi",
  x19: "torta",
  x20: "tostada",
};

const mapaXtop = {
  xtop1: "camion",
  xtop2: "caracola",
  xtop3: "conejo",
  xtop4: "drink",
  xtop5: "estrella",
  xtop6: "kayak",
  xtop7: "mascarajaguar",
  xtop8: "patin",
  xtop9: "piscina",
  xtop10: "poolpo",
  xtop11: "salvavidas",
  xtop12: "teatro",
  xtop13: "tobogan",
  xtop14: "tv",
  xtop15: "vinil",
  xtop16: "xpiral",
  xtop17: "xorbeteria",
};

const guardianPositions = {
  xecreto1: {
    src: "/arbol/guardianes/Mono Casa Vida.png",
    left: "29.175%",
    top: "32.726%",
    width: "11.429%",
    height: "6.667%",
  },
  xecreto10: {
    src: "/arbol/guardianes/Coatí Casa Luna.png.png",
    left: "47.659%",
    top: "39.774%",
    width: "11.429%",
    height: "6.667%",
  },
  xecreto2: {
    src: "/arbol/guardianes/Rana Casa Agua.png",
    left: "32.912%",
    top: "66.250%",
    width: "11.429%",
    height: "6.667%",
  },
  xecreto3: {
    src: "/arbol/guardianes/Jaguar Casa Sol.png",
    left: "65.720%",
    top: "44.476%",
    width: "11.429%",
    height: "6.667%",
  },
  xecreto4: {
    src: "/arbol/guardianes/Guacamaya Casa Fuego.png",
    left: "47.013%",
    top: "27.833%",
    width: "11.429%",
    height: "6.667%",
  },
  xecreto5: {
    src: "/arbol/guardianes/Serpiente Casa Espiral.png",
    left: "29.498%",
    top: "54.286%",
    width: "11.429%",
    height: "6.667%",
  },
  xecreto6: {
    src: "/arbol/guardianes/Venado Casa Tierra.png",
    left: "63.377%",
    top: "53.012%",
    width: "11.429%",
    height: "6.667%",
  },
  xecreto7: {
    src: "/arbol/guardianes/Búho Casa Eclipse.png",
    left: "60.427%",
    top: "66.262%",
    width: "11.429%",
    height: "6.667%",
  },
  xecreto8: {
    src: "/arbol/guardianes/Mariposa Casa Viento.png",
    left: "65.720%",
    top: "32.321%",
    width: "11.429%",
    height: "6.667%",
  },
  xecreto9: {
    src: "/arbol/guardianes/Flamenco Casa Sol.png",
    left: "27.882%",
    top: "43.179%",
    width: "11.429%",
    height: "6.667%",
  },
};

const xtopPositions = {
  camion: {
    src: "/arbol/xtop/Insignia Xiquit inn.png",
    left: "48.093%",
    top: "19.242%",
    width: "9.143%",
    height: "5.333%",
  },
  caracola: {
    src: "/arbol/xtop/Insignia Muluk spa.png",
    left: "39.392%",
    top: "46.450%",
    width: "9.143%",
    height: "5.333%",
  },
  conejo: {
    src: "/arbol/xtop/Insignia Lunateca.png",
    left: "48.633%",
    top: "47.008%",
    width: "9.143%",
    height: "5.333%",
  },
  drink: {
    src: "/arbol/xtop/Insignia Pava Jarla.png",
    left: "54.170%",
    top: "56.015%",
    width: "9.143%",
    height: "5.333%",
  },
  estrella: {
    src: "/arbol/xtop/Insignias Dixtrito 1317.png",
    left: "71.862%",
    top: "63.754%",
    width: "9.143%",
    height: "5.333%",
  },
  kayak: {
    src: "/arbol/xtop/Insignia Kayak.png",
    left: "74.846%",
    top: "55.319%",
    width: "9.143%",
    height: "5.333%",
  },
  mascarajaguar: {
    src: "/arbol/xtop/Insignia Paxanguería.png",
    left: "45.428%",
    top: "61.447%",
    width: "9.143%",
    height: "5.333%",
  },
  patin: {
    src: "/arbol/xtop/Insignia Patín.png",
    left: "36.994%",
    top: "27.381%",
    width: "9.143%",
    height: "5.333%",
  },
  piscina: {
    src: "/arbol/xtop/Insignia Rooftop Fuego.png",
    left: "20.276%",
    top: "58.901%",
    width: "9.143%",
    height: "5.333%",
  },
  poolpo: {
    src: "/arbol/xtop/Insignia pool poh.png",
    left: "58.460%",
    top: "26.929%",
    width: "9.143%",
    height: "5.333%",
  },
  salvavidas: {
    src: "/arbol/xtop/Insignia infinity pool.png",
    left: "81.087%",
    top: "60.651%",
    width: "9.143%",
    height: "5.333%",
  },
  teatro: {
    src: "/arbol/xtop/Insignia Teatro del Río.png",
    left: "18.794%",
    top: "53.513%",
    width: "9.143%",
    height: "5.333%",
  },
  tobogan: {
    src: "/arbol/xtop/Insignia Tobogan Arboloco.png",
    left: "44.931%",
    top: "54.546%",
    width: "9.143%",
    height: "5.333%",
  },
  tv: {
    src: "/arbol/xtop/Insignia Bar las maquinitas.png",
    left: "20.377%",
    top: "65.085%",
    width: "9.143%",
    height: "5.333%",
  },
  vinil: {
    src: "/arbol/xtop/Insignia Vinil.png",
    left: "11.227%",
    top: "64.279%",
    width: "9.143%",
    height: "5.333%",
  },
  xorbeteria: {
    src: "/arbol/xtop/Insignias Xoberte.png",
    left: "44.391%",
    top: "69.284%",
    width: "9.143%",
    height: "5.333%",
  },
  xpiral: {
    src: "/arbol/xtop/Insignia Xpiral.png",
    left: "84.045%",
    top: "50.691%",
    width: "9.143%",
    height: "5.333%",
  },
};

export default function TreeCanvasFamilia({ insigniaReciente }) {
  const initialPos = useRef(calcInitialPos());
  const transformRef = useRef(null);

  // Programmatic Zoom on new insignia
  useEffect(() => {
    if (!insigniaReciente) return;

    let key = null;
    if (typeof insigniaReciente === "string") {
      key = insigniaReciente;
    } else if (insigniaReciente.clave) {
      key = insigniaReciente.clave;
    }

    if (!key) return;

    let resolvedKey = key;
    if (mapaXtop[key]) {
      resolvedKey = mapaXtop[key];
    }

    let pos = null;
    if (guardianPositions[resolvedKey]) {
      pos = guardianPositions[resolvedKey];
    } else if (xtopPositions[resolvedKey]) {
      pos = xtopPositions[resolvedKey];
    }

    if (pos && transformRef.current) {
      const leftVal = parseFloat(pos.left);
      const topVal = parseFloat(pos.top);
      const wVal = parseFloat(pos.width);
      const hVal = parseFloat(pos.height);

      const cx_pct = leftVal + wVal / 2;
      const cy_pct = topVal + hVal / 2;

      const targetX = (cx_pct / 100) * CANVAS_WIDTH;
      const targetY = (cy_pct / 100) * CANVAS_HEIGHT;

      const zoomScale = 0.38;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const posX = vw / 2 - targetX * zoomScale;
      const posY = vh / 2 - targetY * zoomScale;

      // Vibrar el teléfono física si la API está disponible (patrón doble premium)
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([150, 100, 150]);
      }

      transformRef.current.setTransform(posX, posY, zoomScale, 1200, "easeOut");

      const timer = setTimeout(() => {
        if (transformRef.current) {
          const initial = calcInitialPos();
          transformRef.current.setTransform(initial.x, initial.y, INITIAL_SCALE, 1000, "easeOut");
        }
      }, 2800);

      return () => clearTimeout(timer);
    }
  }, [insigniaReciente]);

  const [jugador, setJugador] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch (_) {
      return {};
    }
  });

  useEffect(() => {
    const handleStorage = () => {
      try {
        const updated = JSON.parse(localStorage.getItem("user") || "{}");
        setJugador(updated);
      } catch (_) {}
    };

    window.addEventListener("storage", handleStorage);
    handleStorage();

    return () => window.removeEventListener("storage", handleStorage);
  }, []);


  const {
    familyTree,
    xecretos: jugadorXecretos,
    progresoXperiencias: jugadorRespuestasCorrectas,
    progresoChecklist: jugadorChecklist,
  } = useContext(XafariContext);

  const xtopNombres = [
    "camion", "caracola", "conejo", "drink", "estrella", "kayak",
    "mascarajaguar", "patin", "piscina", "poolpo", "salvavidas",
    "teatro", "tobogan", "tv", "vinil", "xpiral", "xorbeteria",
  ];

  const xtopProgreso = useMemo(() => {
    const map = {};
    Object.entries(jugadorRespuestasCorrectas || {}).forEach(([k]) => {
      if (xtopNombres.includes(k)) map[k] = true;
    });
    return map;
  }, [jugadorRespuestasCorrectas]);

  const familyMembers = useMemo(() => {
    if (!familyTree || !familyTree.users) return [];
    
    // Filtrar al jugador actual para no duplicarlo
    const otherUsers = familyTree.users.filter((u) => u.id !== jugador?.id);
    
    return otherUsers.map((u, index) => {
      return {
        id: String(u.id),
        nombre: u.name,
        avatarData: u.avatar || {},
        progreso: parseUserProgress(u),
        posId: index + 1 // Asigna posición (1 a 6) en positionsById
      };
    });
  }, [familyTree, jugador?.id]);

  const calcularNivelDesbloqueo = (clave, tipo, asset) => {
    const total = familyMembers.length + 1;
    let desbloqueosFamilia = 0;

    familyMembers.forEach((m) => {
      if (tipo === "xecretos" && m.progreso?.xecretos?.[clave]) {
        desbloqueosFamilia++;
      } else if (tipo === "xperiencias" && m.progreso?.xperiencias?.[clave]) {
        desbloqueosFamilia++;
      } else if (tipo === "checklist" && m.progreso?.checklist?.[clave]) {
        desbloqueosFamilia++;
      }
    });

    let jugadorTiene = false;
    if (tipo === "xecretos") {
      jugadorTiene = !!jugadorXecretos?.[clave];
    } else if (tipo === "xperiencias") {
      jugadorTiene = !!xtopProgreso?.[asset];
    } else if (tipo === "checklist") {
      jugadorTiene = !!jugadorChecklist?.[asset];
    }

    const desbloqueoJugador = jugadorTiene ? 1 : 0;
    return (desbloqueosFamilia + desbloqueoJugador) / total;
  };

  const getBadgeOpacity = (porcentaje) => {
    if (porcentaje <= 0) return 0;
    if (porcentaje >= 1) return 1.0;
    // p = 0.2 -> opacity = 0.7
    // p = 1.0 -> opacity = 1.0
    // formula: opacity = 0.375 * p + 0.625
    return Number((0.375 * porcentaje + 0.625).toFixed(3));
  };

  const checkAndReset = useCallback((ref) => {
    try {
      // En iOS Safari, ref.state puede llegar undefined — guardamos con optional chaining
      const scale = ref?.state?.scale ?? INITIAL_SCALE;
      const posX  = ref?.state?.positionX ?? 0;
      const posY  = ref?.state?.positionY ?? 0;
      const vw = window.innerWidth  || 390;
      const vh = window.innerHeight || 844;
      const scaledW = CANVAS_WIDTH  * scale;
      const scaledH = CANVAS_HEIGHT * scale;
      const visibleX =
        Math.max(0, Math.min(vw, scaledW + posX)) - Math.max(0, Math.min(vw, posX));
      const visibleY =
        Math.max(0, Math.min(vh, scaledH + posY)) - Math.max(0, Math.min(vh, posY));
      if (visibleX / vw < 0.4 || visibleY / vh < 0.4) {
        const { x, y } = initialPos.current;
        ref?.setTransform?.(x, y, INITIAL_SCALE, 380, "easeOut");
      }
    } catch (_) {
      // silenciar errores de iOS Safari en callbacks de touch
    }
  }, []);

  const renderInsignias = (mapaTipo, tipo) => {
    return Object.entries(mapaTipo).map(([clave, asset]) => {
      const porcentaje = calcularNivelDesbloqueo(clave, tipo, asset);
      if (porcentaje === 0) return null;

      let jugadorLaTiene = false;
      if (tipo === "xecretos") {
        jugadorLaTiene = !!jugadorXecretos?.[clave];
      } else if (tipo === "xperiencias") {
        jugadorLaTiene = !!xtopProgreso?.[asset];
      } else if (tipo === "checklist") {
        jugadorLaTiene = !!jugadorChecklist?.[asset];
      }

      const esReciente =
        typeof insigniaReciente === "string"
          ? (tipo === "xecretos" ? insigniaReciente === clave : insigniaReciente === asset)
          : (insigniaReciente?.tipo === tipo && insigniaReciente.clave === clave);
      const debeAnimar = jugadorLaTiene && esReciente;
      const key = esReciente ? `reciente-${tipo}-${clave}` : `${tipo}-${clave}`;
      const opacityVal = getBadgeOpacity(porcentaje);

      if (tipo === "xecretos") {
        const pos = guardianPositions[clave];
        if (!pos) return null;
        return (
          <motion.img
            key={key}
            src={pos.src}
            className="absolute object-contain pointer-events-none"
            style={{
              left: pos.left,
              top: pos.top,
              width: pos.width,
              height: pos.height,
            }}
            initial={{ opacity: 0, scale: debeAnimar ? 0.8 : 1, rotate: 0 }}
            animate={{
              opacity: opacityVal,
              scale: debeAnimar ? [0.8, 1.3, 0.95, 1.05, 1] : 1,
              rotate: debeAnimar ? [0, -8, 8, -6, 6, -3, 3, 0] : 0,
            }}
            transition={{ duration: debeAnimar ? 1.2 : 0.6, ease: "easeInOut", delay: debeAnimar ? 1.0 : 0 }}
          />
        );
      }

      if (tipo === "xperiencias") {
        const pos = xtopPositions[asset];
        if (!pos) return null;
        return (
          <motion.img
            key={key}
            src={pos.src}
            className="absolute object-contain pointer-events-none"
            style={{
              left: pos.left,
              top: pos.top,
              width: pos.width,
              height: pos.height,
            }}
            initial={{ opacity: 0, scale: debeAnimar ? 0.8 : 1, rotate: 0 }}
            animate={{
              opacity: opacityVal,
              scale: debeAnimar ? [0.8, 1.3, 0.95, 1.05, 1] : 1,
              rotate: debeAnimar ? [0, -8, 8, -6, 6, -3, 3, 0] : 0,
            }}
            transition={{ duration: debeAnimar ? 1.2 : 0.6, ease: "easeInOut", delay: debeAnimar ? 1.0 : 0 }}
          />
        );
      }

      const basePath = "/arbol/checklist/";

      return (
        <motion.img
          key={key}
          src={`${basePath}${asset}.png`}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          initial={{ opacity: 0, scale: debeAnimar ? 1.5 : 1 }}
          animate={{ opacity: opacityVal, scale: 1 }}
          transition={{ duration: debeAnimar ? 1 : 0.6, ease: "easeOut" }}
        />
      );
    });
  };

  return (
    <TransformWrapper
      ref={transformRef}
      initialScale={INITIAL_SCALE}
      initialPositionX={initialPos.current.x}
      initialPositionY={initialPos.current.y}
      minScale={MIN_SCALE}
      maxScale={MAX_SCALE}
      limitToBounds={false}
      wheel={{ step: 40 }}
      doubleClick={{ disabled: true }}
      panning={{
        velocityDisabled: false,
        velocityAlignmentTime: 180,
      }}
      alignmentAnimation={{
        sizeX: 80,
        sizeY: 80,
        velocityAlignmentTime: 380,
      }}
      onPanningStop={checkAndReset}
      onPinchingStop={checkAndReset}
      onZoomStop={checkAndReset}
    >
      <TransformComponent>
        <div
          style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
          className="relative"
        >
          <img
            src="/arbol/Arbol de la vida 1.png"
            alt=""
            className="w-full h-full object-contain"
          />

          {familyMembers.map((m) => {
            const pos = positionsById[m.posId];
            if (!pos) return null;
            return (
              <div
                key={m.id}
                className="absolute"
                style={{
                  left: `${(pos.x / CANVAS_WIDTH) * 100}%`,
                  top: `${(pos.y / CANVAS_HEIGHT) * 100}%`,
                  width: `${(90 / CANVAS_WIDTH) * 200}%`,
                  height: `${(130 / CANVAS_HEIGHT) * 200}%`,
                  transform: "translate(-50%, -100%)",
                  zIndex: pos.y,
                }}
              >
                <AvatarRender
                  avatarData={m.avatarData}
                  className="w-full h-full"
                />
              </div>
            );
          })}

          {typeof window !== "undefined" && (
            <div
              className="absolute"
              style={{
                left: `${(1270 / CANVAS_WIDTH) * 100}%`,
                top: `${(3110 / CANVAS_HEIGHT) * 100}%`,
                width: `${(90 / CANVAS_WIDTH) * 200}%`,
                height: `${(130 / CANVAS_HEIGHT) * 200}%`,
                transform: "translate(-50%, -100%) scale(1.1)",
                zIndex: 3200,
              }}
            >
              <AvatarRender
                avatarData={jugador?.avatar || jugador?.avatarData}
                className="w-full h-full"
              />
            </div>
          )}

          {renderInsignias(mapa, "xecretos")}
          {renderInsignias(mapaXtop, "xperiencias")}
          {renderInsignias(mapaXperiencias, "checklist")}
        </div>
      </TransformComponent>
    </TransformWrapper>
  );
}
