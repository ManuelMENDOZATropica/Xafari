import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import AvatarRender from "@/components/AvatarRender";
import { motion } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";

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

const familia = [
  {
    id: "1",
    nombre: "Ana",
    avatarData: {
      bodyOptions: 1,
      eyesOptions: 2,
      hairOptions: 3,
      clothingOptions: 4,
      glassesAccessoryOptions: 2,
      headAccessoryOptions: 1,
      bodyAccessoryOptions: 1,
      shoeOptions: 3,
    },
    progreso: {
      xecretos: {
        xecreto1: true,
        xecreto2: true,
        xecreto3: true,
        xecreto4: true,
        xecreto5: true,
        xecreto6: true,
        xecreto7: true,
        xecreto8: true,
        xecreto9: false,
        xecreto10: true,
      },
      checklist: {
        checklist1: true,
        checklist2: false,
        checklist3: true,
        checklist4: true,
        checklist5: false,
        checklist6: true,
        checklist7: true,
        checklist8: false,
        checklist9: true,
        checklist10: true,
      },
      xperiencias: {
        x1: true,
        x2: true,
        x3: false,
        x4: false,
        x5: true,
        x6: true,
        x7: false,
        x8: true,
        x9: false,
        x10: false,
        x11: true,
        x12: false,
      },
    },
  },
  {
    id: "2",
    nombre: "Luis",
    avatarData: {
      bodyOptions: 2,
      eyesOptions: 0,
      hairOptions: 5,
      clothingOptions: 2,
      glassesAccessoryOptions: 1,
      headAccessoryOptions: 0,
      bodyAccessoryOptions: 0,
      shoeOptions: 4,
    },
    progreso: {
      xecretos: {
        xecreto1: true,
        xecreto2: false,
        xecreto3: true,
        xecreto4: true,
        xecreto5: false,
        xecreto6: false,
        xecreto7: false,
        xecreto8: false,
        xecreto9: false,
        xecreto10: true,
      },
      checklist: {
        checklist1: true,
        checklist2: true,
        checklist3: false,
        checklist4: false,
        checklist5: true,
        checklist6: false,
        checklist7: false,
        checklist8: false,
        checklist9: false,
        checklist10: true,
      },
      xperiencias: {
        x1: false,
        x2: true,
        x3: true,
        x4: true,
        x5: false,
        x6: false,
        x7: false,
        x8: true,
        x9: false,
        x10: true,
        x11: false,
        x12: false,
      },
    },
  },
  {
    id: "3",
    nombre: "Carlos",
    avatarData: {
      bodyOptions: 3,
      eyesOptions: 3,
      hairOptions: 10,
      clothingOptions: 7,
      glassesAccessoryOptions: 0,
      headAccessoryOptions: 3,
      bodyAccessoryOptions: 1,
      shoeOptions: 6,
    },
    progreso: {
      xecretos: {
        xecreto1: false,
        xecreto2: true,
        xecreto3: false,
        xecreto4: false,
        xecreto5: false,
        xecreto6: false,
        xecreto7: true,
        xecreto8: true,
        xecreto9: false,
        xecreto10: false,
      },
      checklist: {
        checklist1: true,
        checklist2: false,
        checklist3: false,
        checklist4: true,
        checklist5: false,
        checklist6: true,
        checklist7: false,
        checklist8: false,
        checklist9: true,
        checklist10: false,
      },
      xperiencias: {
        x1: false,
        x2: false,
        x3: true,
        x4: true,
        x5: true,
        x6: false,
        x7: true,
        x8: false,
        x9: true,
        x10: true,
        x11: false,
        x12: false,
      },
    },
  },
  {
    id: "4",
    nombre: "María",
    avatarData: {
      bodyOptions: 4,
      eyesOptions: 1,
      hairOptions: 14,
      clothingOptions: 10,
      glassesAccessoryOptions: 3,
      headAccessoryOptions: 2,
      bodyAccessoryOptions: 1,
      shoeOptions: 8,
    },
    progreso: {
      xecretos: {
        xecreto1: false,
        xecreto2: false,
        xecreto3: false,
        xecreto4: false,
        xecreto5: false,
        xecreto6: false,
        xecreto7: false,
        xecreto8: false,
        xecreto9: false,
        xecreto10: false,
      },
      checklist: {
        checklist1: false,
        checklist2: false,
        checklist3: false,
        checklist4: false,
        checklist5: false,
        checklist6: false,
        checklist7: false,
        checklist8: false,
        checklist9: false,
        checklist10: false,
      },
      xperiencias: {
        x1: false,
        x2: false,
        x3: false,
        x4: false,
        x5: false,
        x6: false,
        x7: false,
        x8: false,
        x9: false,
        x10: false,
        x11: false,
        x12: false,
      },
    },
  },
  {
    id: "5",
    nombre: "Valeria",
    avatarData: {
      bodyOptions: 5,
      eyesOptions: 4,
      hairOptions: 17,
      clothingOptions: 12,
      glassesAccessoryOptions: 0,
      headAccessoryOptions: 6,
      bodyAccessoryOptions: 0,
      shoeOptions: 5,
    },
    progreso: {
      xecretos: {
        xecreto1: true,
        xecreto2: false,
        xecreto3: true,
        xecreto4: false,
        xecreto5: false,
        xecreto6: false,
        xecreto7: true,
        xecreto8: false,
        xecreto9: true,
        xecreto10: false,
      },
      checklist: {
        checklist1: true,
        checklist2: true,
        checklist3: true,
        checklist4: true,
        checklist5: false,
        checklist6: false,
        checklist7: true,
        checklist8: false,
        checklist9: false,
        checklist10: false,
      },
      xperiencias: {
        x1: true,
        x2: true,
        x3: true,
        x4: true,
        x5: true,
        x6: false,
        x7: false,
        x8: false,
        x9: true,
        x10: false,
        x11: false,
        x12: false,
      },
    },
  },
  {
    id: "6",
    nombre: "Tomás",
    avatarData: {
      bodyOptions: 0,
      eyesOptions: 0,
      hairOptions: 1,
      clothingOptions: 0,
      glassesAccessoryOptions: 0,
      headAccessoryOptions: 0,
      bodyAccessoryOptions: 0,
      shoeOptions: 0,
    },
    progreso: {
      xecretos: {
        xecreto1: false,
        xecreto2: true,
        xecreto3: false,
        xecreto4: false,
        xecreto5: false,
        xecreto6: false,
        xecreto7: false,
        xecreto8: true,
        xecreto9: false,
        xecreto10: true,
      },
      checklist: {
        checklist1: false,
        checklist2: false,
        checklist3: false,
        checklist4: false,
        checklist5: true,
        checklist6: true,
        checklist7: false,
        checklist8: false,
        checklist9: false,
        checklist10: false,
      },
      xperiencias: {
        x1: false,
        x2: false,
        x3: false,
        x4: true,
        x5: false,
        x6: false,
        x7: false,
        x8: true,
        x9: false,
        x10: true,
        x11: true,
        x12: false,
      },
    },
  },
];
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
    left: "48.177%",
    top: "19.298%",
    width: "8.980%",
    height: "5.238%",
  },
  caracola: {
    src: "/arbol/xtop/Insignia Muluk spa.png",
    left: "33.591%",
    top: "38.000%",
    width: "8.980%",
    height: "5.238%",
  },
  conejo: {
    src: "/arbol/xtop/Insignia Lunateca.png",
    left: "47.793%",
    top: "46.143%",
    width: "8.980%",
    height: "5.238%",
  },
  drink: {
    src: "/arbol/xtop/Insignia Pava Jarla.png",
    left: "55.530%",
    top: "57.357%",
    width: "8.980%",
    height: "5.238%",
  },
  estrella: {
    src: "/arbol/xtop/Insignias Dixtrito 1317.png",
    left: "71.450%",
    top: "70.167%",
    width: "8.980%",
    height: "5.238%",
  },
  kayak: {
    src: "/arbol/xtop/Insignia Kayak.png",
    left: "71.207%",
    top: "59.060%",
    width: "8.980%",
    height: "5.238%",
  },
  mascarajaguar: {
    src: "/arbol/xtop/Insignia Paxanguería.png",
    left: "47.591%",
    top: "59.393%",
    width: "8.980%",
    height: "5.238%",
  },
  patin: {
    src: "/arbol/xtop/Insignia Patín.png",
    left: "39.894%",
    top: "30.214%",
    width: "8.980%",
    height: "5.238%",
  },
  piscina: {
    src: "/arbol/xtop/Insignia Rooftop Fuego.png",
    left: "28.783%",
    top: "50.536%",
    width: "8.980%",
    height: "5.238%",
  },
  poolpo: {
    src: "/arbol/xtop/Insignia pool poh.png",
    left: "57.248%",
    top: "32.976%",
    width: "8.980%",
    height: "5.238%",
  },
  salvavidas: {
    src: "/arbol/xtop/Insignia infinity pool.png",
    left: "72.985%",
    top: "66.000%",
    width: "8.980%",
    height: "5.238%",
  },
  teatro: {
    src: "/arbol/xtop/Insignia Teatro del Río.png",
    left: "23.268%",
    top: "57.964%",
    width: "8.980%",
    height: "5.238%",
  },
  tobogan: {
    src: "/arbol/xtop/Insignia Tobogan Arboloco.png",
    left: "47.692%",
    top: "51.881%",
    width: "8.980%",
    height: "5.238%",
  },
  tv: {
    src: "/arbol/xtop/Insignia Bar las maquinitas.png",
    left: "20.480%",
    top: "65.131%",
    width: "8.980%",
    height: "5.238%",
  },
  vinil: {
    src: "/arbol/xtop/Insignia Vinil.png",
    left: "16.298%",
    top: "61.417%",
    width: "8.980%",
    height: "5.238%",
  },
  xorbeteria: {
    src: "/arbol/xtop/Insignias Xoberte.png",
    left: "37.692%",
    top: "62.524%",
    width: "8.980%",
    height: "5.238%",
  },
  xpiral: {
    src: "/arbol/xtop/Insignia Xpiral.png",
    left: "81.631%",
    top: "52.655%",
    width: "8.980%",
    height: "5.238%",
  },
};

export default function TreeCanvasFamilia({ insigniaReciente }) {
  const initialPos = useRef(calcInitialPos());

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


  const calcularNivelDesbloqueo = (clave, tipo) => {
    const total = familia.length + 1;
    const desbloqueosFamilia = familia.filter(
      (m) => m.progreso?.[tipo]?.[clave]
    ).length;
    const desbloqueoJugador = jugador?.progreso?.[tipo]?.[clave] ? 1 : 0;
    const porcentaje = (desbloqueosFamilia + desbloqueoJugador) / total;
    if (porcentaje === 1) return 1;
    if (porcentaje >= 0.5) return 0.5;
    return 0.25;
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
      const nivel = calcularNivelDesbloqueo(clave, tipo);
      const jugadorLaTiene = jugador?.progreso?.[tipo]?.[clave] === true;
      const esReciente =
        insigniaReciente?.tipo === tipo && insigniaReciente.clave === clave;
      const debeAnimar = jugadorLaTiene && esReciente;
      const key = esReciente ? `reciente-${tipo}-${clave}` : `${tipo}-${clave}`;

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
            initial={{ opacity: 0, scale: debeAnimar ? 1.5 : 1 }}
            animate={{ opacity: { 1: 1, 0.5: 0.8, 0.25: 0.6 }[nivel], scale: 1 }}
            transition={{ duration: debeAnimar ? 1 : 0.6, ease: "easeOut" }}
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
            initial={{ opacity: 0, scale: debeAnimar ? 1.5 : 1 }}
            animate={{ opacity: { 1: 1, 0.5: 0.8, 0.25: 0.6 }[nivel], scale: 1 }}
            transition={{ duration: debeAnimar ? 1 : 0.6, ease: "easeOut" }}
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
          animate={{ opacity: { 1: 1, 0.5: 0.8, 0.25: 0.6 }[nivel], scale: 1 }}
          transition={{ duration: debeAnimar ? 1 : 0.6, ease: "easeOut" }}
        />
      );
    });
  };

  return (
    <TransformWrapper
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

          {familia.map((m) => {
            const pos = positionsById[m.id];
            if (!pos) return null;
            return (
              <div
                key={m.id}
                className="absolute z-40"
                style={{
                  left: `${(pos.x / CANVAS_WIDTH) * 100}%`,
                  top: `${(pos.y / CANVAS_HEIGHT) * 100}%`,
                  width: `${(90 / CANVAS_WIDTH) * 200}%`,
                  height: `${(130 / CANVAS_HEIGHT) * 200}%`,
                  transform: "translate(-50%, -100%)",
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
              className="absolute z-[999]"
              style={{
                left: `${(1270 / CANVAS_WIDTH) * 100}%`,
                top: `${(3110 / CANVAS_HEIGHT) * 100}%`,
                width: `${(90 / CANVAS_WIDTH) * 200}%`,
                height: `${(130 / CANVAS_HEIGHT) * 200}%`,
                transform: "translate(-50%, -100%) scale(1.1)",
              }}
            >
              <AvatarRender
                avatarData={jugador?.avatarData}
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
