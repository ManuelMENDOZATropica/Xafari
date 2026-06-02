import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import AvatarRender from "@/components/AvatarRender";
import { useRef, useCallback, useEffect } from "react";
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

const xtopPositions = {
  camion: {
    src: "/arbol/xtop/Insignia Xiquit inn.png",
    left: "48.768%",
    top: "19.333%",
    width: "7.798%",
    height: "5.167%",
  },
  caracola: {
    src: "/arbol/xtop/Insignia Muluk spa.png",
    left: "35.152%",
    top: "39.167%",
    width: "5.859%",
    height: "2.905%",
  },
  conejo: {
    src: "/arbol/xtop/Insignia Lunateca.png",
    left: "48.444%",
    top: "46.476%",
    width: "7.677%",
    height: "4.571%",
  },
  drink: {
    src: "/arbol/xtop/Insignia Pava Jarla.png",
    left: "57.293%",
    top: "57.762%",
    width: "5.455%",
    height: "4.429%",
  },
  estrella: {
    src: "/arbol/xtop/Insignias Dixtrito 1317.png",
    left: "73.293%",
    top: "71.238%",
    width: "5.293%",
    height: "3.095%",
  },
  kayak: {
    src: "/arbol/xtop/Insignia Kayak.png",
    left: "72.485%",
    top: "58.881%",
    width: "6.424%",
    height: "5.595%",
  },
  mascarajaguar: {
    src: "/arbol/xtop/Insignia Paxanguería.png",
    left: "47.677%",
    top: "59.524%",
    width: "8.808%",
    height: "4.976%",
  },
  patin: {
    src: "/arbol/xtop/Insignia Patín.png",
    left: "41.616%",
    top: "30.429%",
    width: "5.535%",
    height: "4.810%",
  },
  piscina: {
    src: "/arbol/xtop/Insignia Rooftop Fuego.png",
    left: "29.737%",
    top: "51.190%",
    width: "7.071%",
    height: "3.929%",
  },
  poolpo: {
    src: "/arbol/xtop/Insignia pool poh.png",
    left: "57.737%",
    top: "33.762%",
    width: "8.000%",
    height: "3.667%",
  },
  salvavidas: {
    src: "/arbol/xtop/Insignia infinity pool.png",
    left: "74.303%",
    top: "66.738%",
    width: "6.343%",
    height: "3.762%",
  },
  teatro: {
    src: "/arbol/xtop/Insignia Teatro del Río.png",
    left: "24.848%",
    top: "59.071%",
    width: "5.818%",
    height: "3.024%",
  },
  tobogan: {
    src: "/arbol/xtop/Insignia Tobogan Arboloco.png",
    left: "45.778%",
    top: "51.833%",
    width: "12.808%",
    height: "5.333%",
  },
  tv: {
    src: "/arbol/xtop/Insignia Bar las maquinitas.png",
    left: "21.616%",
    top: "65.714%",
    width: "6.707%",
    height: "4.071%",
  },
  vinil: {
    src: "/arbol/xtop/Insignia Vinil.png",
    left: "17.737%",
    top: "62.238%",
    width: "6.101%",
    height: "3.595%",
  },
  xorbeteria: {
    src: "/arbol/xtop/Insignias Xoberte.png",
    left: "40.162%",
    top: "63.262%",
    width: "4.040%",
    height: "3.762%",
  },
  xpiral: {
    src: "/arbol/xtop/Insignia Xpiral.png",
    left: "79.838%",
    top: "53.143%",
    width: "12.566%",
    height: "4.262%",
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
  const transformRef = useRef(null);

  // Programmatic Zoom on new insignia
  useEffect(() => {
    if (!insigniaReciente) return;

    let pos = null;
    if (guardianPositions[insigniaReciente]) {
      pos = guardianPositions[insigniaReciente];
    } else if (xtopPositions[insigniaReciente]) {
      pos = xtopPositions[insigniaReciente];
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

      const zoomScale = 0.38; // Nivel de zoom destacado

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const posX = vw / 2 - targetX * zoomScale;
      const posY = vh / 2 - targetY * zoomScale;

      // Vibrar el teléfono física si la API está disponible (patrón doble premium)
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([150, 100, 150]);
      }

      // Hacer zoom centrado en la insignia (duración 1.2s)
      transformRef.current.setTransform(posX, posY, zoomScale, 1200, "easeOut");

      // Regresar al home (posición y escala iniciales) tras 2.8 segundos
      const timer = setTimeout(() => {
        if (transformRef.current) {
          const initial = calcInitialPos();
          transformRef.current.setTransform(initial.x, initial.y, INITIAL_SCALE, 1000, "easeOut");
        }
      }, 2800);

      return () => clearTimeout(timer);
    }
  }, [insigniaReciente]);

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
                initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                animate={
                  insigniaReciente === k
                    ? {
                        opacity: [0, 1, 1, 1, 1],
                        scale: [0.8, 1.3, 0.95, 1.05, 1],
                        rotate: [0, -8, 8, -6, 6, -3, 3, 0],
                      }
                    : { opacity: 1, scale: 1, rotate: 0 }
                }
                transition={{ duration: 1.2, ease: "easeInOut", delay: insigniaReciente === k ? 1.0 : 0 }}
              />
            );
          })}

          {/* Xtop */}
          {Object.entries(xtopProgreso || {}).map(([k, v]) => {
            if (!v || !xtopPositions[k]) return null;
            const pos = xtopPositions[k];
            return (
              <motion.img
                key={`xtop-${k}`}
                src={pos.src}
                className="absolute object-contain pointer-events-none"
                style={{
                  left: pos.left,
                  top: pos.top,
                  width: pos.width,
                  height: pos.height,
                }}
                initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                animate={
                  insigniaReciente === k
                    ? {
                        opacity: [0, 1, 1, 1, 1],
                        scale: [0.8, 1.3, 0.95, 1.05, 1],
                        rotate: [0, -8, 8, -6, 6, -3, 3, 0],
                      }
                    : { opacity: 1, scale: 1, rotate: 0 }
                }
                transition={{ duration: 1.2, ease: "easeInOut", delay: insigniaReciente === k ? 1.0 : 0 }}
              />
            );
          })}

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
