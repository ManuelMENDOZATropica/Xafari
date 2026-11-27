import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import AvatarRender from "@/components/AvatarRender";
import { useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TREE_CANVAS_WIDTH as CANVAS_WIDTH,
  TREE_CANVAS_HEIGHT as CANVAS_HEIGHT,
  guardianPositions,
  xtopPositions,
  checklistPositions,
  centerOf,
} from "@/data/arbol";

// ─── constantes del canvas ───────────────────────────────────────────────────
const INITIAL_SCALE = 0.17;
const MIN_SCALE     = 0.15;   // límite mínimo de zoom — coherente con el boundary check
const MAX_SCALE     = 0.40;
const FOCUS_SCALE   = 0.38;   // zoom al resaltar una insignia nueva

// Calcula la posición inicial centrada en el área disponible (sincrono, sin flicker)
function calcInitialPos() {
  const vw          = window.innerWidth  || 390;
  const vh          = window.innerHeight || 844;
  const topOffset   = 56;                   // pt-14 del header
  const bottomOffset = vh * 0.02 + 210;   // 2vh margen + botones(~118px) + gap(12px) + submenu(~68px) + pt-3(12px)
  const availableH  = vh - topOffset - bottomOffset;
  return {
    x: (vw - CANVAS_WIDTH  * INITIAL_SCALE) / 2,
    y: topOffset + (availableH - CANVAS_HEIGHT * INITIAL_SCALE) / 2,
  };
}

const BADGE_POP = {
  opacity: [0, 1, 1, 1, 1],
  scale: [0.8, 1.3, 0.95, 1.05, 1],
  rotate: [0, -8, 8, -6, 6, -3, 3, 0],
};

function Badge({ pos, reciente }) {
  return (
    <motion.img
      src={pos.src}
      alt=""
      decoding="async"
      draggable={false}
      className="absolute object-contain pointer-events-none"
      style={{ left: pos.left, top: pos.top, width: pos.width, height: pos.height }}
      initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
      animate={reciente ? BADGE_POP : { opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 1.2, ease: "easeInOut", delay: reciente ? 1.0 : 0 }}
    />
  );
}

export default function TreeCanvasIndividual({
  xecretos,
  checklistProgreso,
  xtopProgreso,
  insigniaReciente,
}) {
  // Posición inicial calculada UNA vez (síncrono → sin flicker)
  const initialPos = useRef(null);
  if (initialPos.current === null) initialPos.current = calcInitialPos();
  const transformRef = useRef(null);

  // Zoom programático a la insignia recién ganada
  useEffect(() => {
    if (!insigniaReciente) return;

    const pos =
      guardianPositions[insigniaReciente] ||
      xtopPositions[insigniaReciente] ||
      checklistPositions[insigniaReciente];
    if (!pos || !transformRef.current) return;

    const { x: targetX, y: targetY } = centerOf(pos);
    const posX = window.innerWidth / 2 - targetX * FOCUS_SCALE;
    const posY = window.innerHeight / 2 - targetY * FOCUS_SCALE;

    // Vibración (patrón doble) si la API está disponible
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([150, 100, 150]);
    }

    transformRef.current.setTransform(posX, posY, FOCUS_SCALE, 1200, "easeOut");

    // Regresar a la vista inicial tras 2.8 s
    const timer = setTimeout(() => {
      if (transformRef.current) {
        const initial = calcInitialPos();
        transformRef.current.setTransform(initial.x, initial.y, INITIAL_SCALE, 1000, "easeOut");
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, [insigniaReciente]);

  // ── helper: comprueba si el árbol salió demasiado de pantalla y lo devuelve ──
  const checkAndReset = useCallback((ref) => {
    const scale = ref?.state?.scale ?? INITIAL_SCALE;
    const posX = ref?.state?.positionX ?? 0;
    const posY = ref?.state?.positionY ?? 0;
    const vw = window.innerWidth || 390;
    const vh = window.innerHeight || 844;

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
      ref?.setTransform?.(x, y, INITIAL_SCALE, 380, "easeOut");
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
            src="/arbol/arbol.webp"
            alt=""
            decoding="async"
            draggable={false}
            className="w-full h-full object-contain"
          />

          {/* Xecretos (guardianes) */}
          {Object.entries(xecretos || {}).map(([k, v]) =>
            v && guardianPositions[k] ? (
              <Badge key={`xecreto-${k}`} pos={guardianPositions[k]} reciente={insigniaReciente === k} />
            ) : null
          )}

          {/* Xperiencias (Xtop) */}
          {Object.entries(xtopProgreso || {}).map(([k, v]) =>
            v && xtopPositions[k] ? (
              <Badge key={`xtop-${k}`} pos={xtopPositions[k]} reciente={insigniaReciente === k} />
            ) : null
          )}

          {/* Checklist gastro — capas recortadas a su bounding box */}
          {Object.entries(checklistProgreso || {}).map(([k, v]) => {
            const pos = checklistPositions[k];
            if (!v || !pos) return null;
            return (
              <motion.img
                key={`checklist-${k}`}
                src={pos.src}
                alt=""
                decoding="async"
                draggable={false}
                className="absolute object-contain pointer-events-none"
                style={{ left: pos.left, top: pos.top, width: pos.width, height: pos.height }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={
                  insigniaReciente === k
                    ? { opacity: 1, scale: [1.5, 0.95, 1] }
                    : { opacity: 1, scale: 1 }
                }
                transition={{ duration: 0.6 }}
              />
            );
          })}

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
