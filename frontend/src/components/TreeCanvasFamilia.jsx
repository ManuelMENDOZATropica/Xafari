import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import AvatarRender from "@/components/AvatarRender";
import { motion } from "framer-motion";
import { useRef, useEffect, useCallback, useMemo, useContext } from "react";
import XafariContext from "@/components/XafariContext";
import {
  TREE_CANVAS_WIDTH as CANVAS_WIDTH,
  TREE_CANVAS_HEIGHT as CANVAS_HEIGHT,
  guardianPositions,
  xtopPositions,
  checklistPositions,
  centerOf,
} from "@/data/arbol";

// ─── constantes del canvas ────────────────────────────────────────────────────
const INITIAL_SCALE = 0.17;
const MIN_SCALE     = 0.15;
const MAX_SCALE     = 0.40;
const FOCUS_SCALE   = 0.38;

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

// Posición (px del canvas) de cada familiar, por orden de llegada (máx. 6)
const positionsById = {
  1: { x: 1450, y: 3000 },
  2: { x: 1100, y: 3000 },
  3: { x: 1400, y: 3050 },
  4: { x: 1150, y: 3050 },
  5: { x: 1350, y: 3100 },
  6: { x: 1200, y: 3100 },
};

// Tipos de insignia → posiciones. Las llaves son activity.name en la BD
// (xecreto1…10, camion…xpiral, acai…tostada), igual que el progreso.
const TIPOS = [
  { tipo: "xecretos", positions: guardianPositions },
  { tipo: "xperiencias", positions: xtopPositions },
  { tipo: "checklist", positions: checklistPositions },
];

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

const getBadgeOpacity = (porcentaje) => {
  if (porcentaje <= 0) return 0;
  if (porcentaje >= 1) return 1.0;
  // p = 0.2 → 0.7 · p = 1.0 → 1.0
  return Number((0.375 * porcentaje + 0.625).toFixed(3));
};

// insigniaReciente puede llegar como "camion" o como { clave, tipo }
const recienteKey = (r) => (typeof r === "string" ? r : r?.clave ?? null);

export default function TreeCanvasFamilia({ insigniaReciente }) {
  const initialPos = useRef(null);
  if (initialPos.current === null) initialPos.current = calcInitialPos();
  const transformRef = useRef(null);

  const {
    user: jugador,
    familyTree,
    xecretos: jugadorXecretos,
    progresoXperiencias: jugadorXperiencias,
    progresoChecklist: jugadorChecklist,
  } = useContext(XafariContext);

  const reciente = recienteKey(insigniaReciente);

  // Zoom programático a la insignia recién ganada
  useEffect(() => {
    if (!reciente) return;
    const pos =
      guardianPositions[reciente] || xtopPositions[reciente] || checklistPositions[reciente];
    if (!pos || !transformRef.current) return;

    const { x: targetX, y: targetY } = centerOf(pos);
    const posX = window.innerWidth / 2 - targetX * FOCUS_SCALE;
    const posY = window.innerHeight / 2 - targetY * FOCUS_SCALE;

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([150, 100, 150]);
    }

    transformRef.current.setTransform(posX, posY, FOCUS_SCALE, 1200, "easeOut");

    const timer = setTimeout(() => {
      if (transformRef.current) {
        const initial = calcInitialPos();
        transformRef.current.setTransform(initial.x, initial.y, INITIAL_SCALE, 1000, "easeOut");
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, [reciente]);

  // Progreso del jugador por tipo (llaves = activity.name)
  const progresoJugador = useMemo(
    () => ({
      xecretos: jugadorXecretos || {},
      xperiencias: jugadorXperiencias || {},
      checklist: jugadorChecklist || {},
    }),
    [jugadorXecretos, jugadorXperiencias, jugadorChecklist]
  );

  const familyMembers = useMemo(() => {
    if (!familyTree || !familyTree.users) return [];

    // Sin el jugador actual para no duplicarlo
    return familyTree.users
      .filter((u) => !u.esYo && (u.id == null || u.id !== jugador?.id))
      .slice(0, 6)
      .map((u, index) => ({
        id: String(u.id ?? `familiar-${index}`),
        nombre: u.name,
        avatarData: u.avatar || {},
        progreso: parseUserProgress(u),
        posId: index + 1,
      }));
  }, [familyTree, jugador?.id]);

  // Insignias visibles con su porcentaje de desbloqueo familiar
  const insignias = useMemo(() => {
    const total = familyMembers.length + 1;
    const out = [];
    for (const { tipo, positions } of TIPOS) {
      for (const [nombre, pos] of Object.entries(positions)) {
        const jugadorLaTiene = !!progresoJugador[tipo][nombre];
        const deFamilia = familyMembers.filter((m) => m.progreso?.[tipo]?.[nombre]).length;
        const porcentaje = (deFamilia + (jugadorLaTiene ? 1 : 0)) / total;
        if (porcentaje === 0) continue;
        out.push({ tipo, nombre, pos, jugadorLaTiene, opacity: getBadgeOpacity(porcentaje) });
      }
    }
    return out;
  }, [familyMembers, progresoJugador]);

  const checkAndReset = useCallback((ref) => {
    try {
      // En iOS Safari, ref.state puede llegar undefined
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
    } catch {
      // silenciar errores de iOS Safari en callbacks de touch
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
            src="/arbol/arbol.webp"
            alt=""
            decoding="async"
            draggable={false}
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
                <AvatarRender avatarData={m.avatarData} className="w-full h-full" />
              </div>
            );
          })}

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

          {insignias.map(({ tipo, nombre, pos, jugadorLaTiene, opacity }) => {
            const esReciente =
              reciente === nombre &&
              (typeof insigniaReciente === "string" || !insigniaReciente?.tipo || insigniaReciente.tipo === tipo);
            const debeAnimar = jugadorLaTiene && esReciente;
            const style = { left: pos.left, top: pos.top, width: pos.width, height: pos.height };

            if (tipo === "checklist") {
              return (
                <motion.img
                  key={`${esReciente ? "reciente-" : ""}${tipo}-${nombre}`}
                  src={pos.src}
                  alt=""
                  decoding="async"
                  draggable={false}
                  className="absolute object-contain pointer-events-none"
                  style={style}
                  initial={{ opacity: 0, scale: debeAnimar ? 1.5 : 1 }}
                  animate={{ opacity, scale: 1 }}
                  transition={{ duration: debeAnimar ? 1 : 0.6, ease: "easeOut" }}
                />
              );
            }

            return (
              <motion.img
                key={`${esReciente ? "reciente-" : ""}${tipo}-${nombre}`}
                src={pos.src}
                alt=""
                decoding="async"
                draggable={false}
                className="absolute object-contain pointer-events-none"
                style={style}
                initial={{ opacity: 0, scale: debeAnimar ? 0.8 : 1, rotate: 0 }}
                animate={{
                  opacity,
                  scale: debeAnimar ? [0.8, 1.3, 0.95, 1.05, 1] : 1,
                  rotate: debeAnimar ? [0, -8, 8, -6, 6, -3, 3, 0] : 0,
                }}
                transition={{ duration: debeAnimar ? 1.2 : 0.6, ease: "easeInOut", delay: debeAnimar ? 1.0 : 0 }}
              />
            );
          })}
        </div>
      </TransformComponent>
    </TransformWrapper>
  );
}
