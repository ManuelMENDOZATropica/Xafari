import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import AvatarRender from "@/components/AvatarRender";
import { useRef, useCallback } from "react";
import { motion } from "framer-motion";

// ─── constantes del canvas ───────────────────────────────────────────────────
const CANVAS_WIDTH  = 2450;
const CANVAS_HEIGHT = 4200;
const INITIAL_SCALE = 0.17;
const MIN_SCALE     = 0.15;   // límite mínimo de zoom — coherente con el boundary check
const MAX_SCALE     = 0.40;

// Calcula la posición inicial centrada en el área disponible (sincrono, sin flicker)
function calcInitialPos() {
  const vw          = window.innerWidth;
  const vh          = window.innerHeight;
  const topOffset   = 56;                   // pt-14 del header
  const bottomOffset = vh * 0.02 + 210;   // 2vh margen + botones(~118px) + gap(12px) + submenu(~68px) + pt-3(12px)
  const availableH  = vh - topOffset - bottomOffset;
  return {
    x: (vw - CANVAS_WIDTH  * INITIAL_SCALE) / 2,
    y: topOffset + (availableH - CANVAS_HEIGHT * INITIAL_SCALE) / 2,
  };
}

// ─── mapas de progreso ────────────────────────────────────────────────────────
const mapa = {
  xecreto1:  "mono",
  xecreto2:  "rana",
  xecreto3:  "jaguar",
  xecreto4:  "guacamaya",
  xecreto5:  "serpiente",
  xecreto6:  "venado",
  xecreto7:  "buho",
  xecreto8:  "mariposa",
  xecreto9:  "flamenco",
  xecreto10: "coati",
};

const mapaXtop = {
  xtop1:  "camion",
  xtop2:  "caracola",
  xtop3:  "conejo",
  xtop4:  "drink",
  xtop5:  "estrella",
  xtop6:  "kayak",
  xtop7:  "mascarajaguar",
  xtop8:  "patin",
  xtop9:  "piscina",
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

export default function TreeCanvasIndividual({
  xecretos,
  respuestasCorrectas,
  checklistProgreso,
  xperienciasProgreso,
  xtopProgreso,
  insigniaReciente,
}) {
  // Posición inicial calculada UNA vez (síncrono → sin flicker)
  const initialPos = useRef(calcInitialPos());

  // ── helper: comprueba si el árbol salió demasiado de pantalla y lo devuelve ──
  const checkAndReset = useCallback((ref) => {
    const { scale, positionX: posX, positionY: posY } = ref.state;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const scaledW = CANVAS_WIDTH  * scale;
    const scaledH = CANVAS_HEIGHT * scale;

    // Área visible del canvas dentro del viewport
    const visibleX =
      Math.max(0, Math.min(vw, scaledW + posX)) - Math.max(0, Math.min(vw, posX));
    const visibleY =
      Math.max(0, Math.min(vh, scaledH + posY)) - Math.max(0, Math.min(vh, posY));

    // Si menos del 40% del viewport está cubierto por el árbol → reset animado
    if (visibleX / vw < 0.4 || visibleY / vh < 0.4) {
      const { x, y } = initialPos.current;
      ref.setTransform(x, y, INITIAL_SCALE, 380, "easeOut");
    }
  }, []);

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
        velocityAlignmentTime: 180,   // inercia suave al soltar el pan
      }}
      alignmentAnimation={{
        sizeX: 80,                    // px que puede salir antes de volver solo
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
            alt="árbol"
            className="w-full h-full object-contain"
          />

          {/* Xecretos (guardianes) */}
          {Object.entries(xecretos).map(([k, v]) => {
            if (!v || !guardianPositions[k]) return null;
            const pos = guardianPositions[k];
            return (
              <motion.img
                key={`xecreto-${k}`}
                src={pos.src}
                className="absolute object-contain pointer-events-none"
                style={{
                  left: pos.left,
                  top: pos.top,
                  width: pos.width,
                  height: pos.height,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={
                  insigniaReciente === k
                    ? { opacity: 1, scale: [1.5, 0.95, 1] }
                    : { opacity: 1, scale: 1 }
                }
                transition={{ duration: 0.8, delay: insigniaReciente === k ? 1.0 : 0 }}
              />
            );
          })}

          {/* Xtop */}
          {Object.entries(xtopProgreso || {}).map(([k, v]) =>
            v && Object.values(mapaXtop).includes(k) ? (
              <motion.img
                key={`xtop-${k}`}
                src={`/arbol/xtopÁrbol/${k}.png`}
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={
                  insigniaReciente === k
                    ? { opacity: 1, scale: [1.5, 0.95, 1] }
                    : { opacity: 1, scale: 1 }
                }
                transition={{ duration: 0.8 }}
              />
            ) : null
          )}

          {/* Checklist gastro */}
          {Object.entries(checklistProgreso || {}).map(([k, v]) =>
            v ? (
              <motion.img
                key={`checklist-${k}`}
                src={`/arbol/checklist/${k}.png`}
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={
                  insigniaReciente === k
                    ? { opacity: 1, scale: [1.5, 0.95, 1] }
                    : { opacity: 1, scale: 1 }
                }
                transition={{ duration: 0.6 }}
              />
            ) : null
          )}

          {/* Avatar del jugador */}
          <div
            className="absolute z-40"
            style={{
              left: `${(615 / CANVAS_WIDTH) * 100}%`,
              top:  `${(910 / CANVAS_HEIGHT) * 100}%`,
              width:  `${(90  / CANVAS_WIDTH)  * 100}%`,
              height: `${(130 / CANVAS_HEIGHT) * 100}%`,
              transform: "translate(680%, 1525%) scale(3)",
            }}
          >
            <AvatarRender className="w-full h-full" />
          </div>
        </div>
      </TransformComponent>
    </TransformWrapper>
  );
}
