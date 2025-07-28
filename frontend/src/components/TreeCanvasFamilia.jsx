import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import AvatarRender from "@/components/AvatarRender";
import { motion } from "framer-motion";
import { useRef, useEffect } from "react";

// ================================
// == POSICIONES POR ID (px base) ==
// ================================
const positionsById = {
  "1": { x: 1450, y: 3000 },
  "2": { x: 1100, y: 3000 },
  "3": { x: 1400, y: 3050 },
  "4": { x: 1150, y: 3050 },
  "5": { x: 1350, y: 3100 },
  "6": { x: 1200, y: 3100 },
};

// ================================
// == AVATARES DE LA FAMILIA ==
// ================================
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
      xecretos: { xecreto1: true, xecreto2: true },
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
      xecretos: { xecreto1: true },
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
      xecretos: { xecreto2: true },
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
      xecretos: {},
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
      xecretos: { xecreto1: true },
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
      xecretos: { xecreto2: true },
    },
  },
];

// ==============================
// == MAPA DE XEcretos ==
// ==============================
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

export default function TreeCanvasFamilia() {
  const CANVAS_WIDTH = 2450;
  const CANVAS_HEIGHT = 4200;
  const initialScale = 0.22;
  const transformUtilsRef = useRef(null);
  const initialOffset = useRef({ x: 0, y: 0 });

  // ===========================
  // == Cálculo de insignias ==
  // ===========================
  const calcularNivelDesbloqueo = (clave, tipo) => {
    const total = familia.length;
    const desbloqueos = familia.filter((m) => m.progreso[tipo]?.[clave]).length;
    const porcentaje = desbloqueos / total;
    if (porcentaje === 1) return 1;
    if (porcentaje >= 0.5) return 0.5;
    return 0.25;
  };

  // ===========================
  // == Centrado inicial ==
  // ===========================
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (transformUtilsRef.current) {
        const { setTransform } = transformUtilsRef.current;
        const { x, y } = initialOffset.current;
        setTransform(x, y, initialScale);
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  // ================================
  // == Verifica que no se pierda ==
  // ================================
  useEffect(() => {
    const checkBoundaries = () => {
      if (!transformUtilsRef.current) return;

      const { state, setTransform } = transformUtilsRef.current;
      const scale = state.scale;
      const posX = state.positionX;
      const posY = state.positionY;

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      const scaledWidth = CANVAS_WIDTH * scale;
      const scaledHeight = CANVAS_HEIGHT * scale;

      const visibleX = Math.max(0, Math.min(vw, scaledWidth + posX)) - Math.max(0, Math.min(vw, posX));
      const visibleY = Math.max(0, Math.min(vh, scaledHeight + posY)) - Math.max(0, Math.min(vh, posY));

      const visibleXRatio = visibleX / vw;
      const visibleYRatio = visibleY / vh;

      if (
        scale < 0.15 || scale > 0.35 ||
        visibleXRatio < 0.8 ||
        visibleYRatio < 0.9
      ) {
        const { x, y } = initialOffset.current;
        setTransform(x, y, initialScale);
      }
    };

    const interval = setInterval(checkBoundaries, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <TransformWrapper
      initialScale={initialScale}
      minScale={0.1}
      maxScale={0.4}
      wheel={{ step: 50 }}
      doubleClick={{ disabled: true }}
      limitToBounds={false}
      onInit={(utils) => {
        transformUtilsRef.current = utils;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const offsetX = (vw - CANVAS_WIDTH * initialScale) / 2;
        const offsetY = (vh - CANVAS_HEIGHT * initialScale) / 2;
        initialOffset.current = { x: offsetX, y: offsetY };
      }}
    >
      <TransformComponent>
        <div style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }} className="relative">
          {/* Fondo del árbol */}
          <img src="/arbol/baseArbolv3.png" alt="" className="w-full h-full object-contain" />

          {/* Avatares familiares */}
          {familia.map((m, index) => {
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
                <AvatarRender avatarData={m.avatarData} className="w-full h-full" />
              </div>
            );
          })}
          {/* Avatar del jugador principal */}
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
      avatarData={JSON.parse(localStorage.getItem("user") || "{}").avatarData}
      className="w-full h-full"
    />
  </div>
)}


          {/* Guardianes */}
          {Object.keys(mapa).map((clave) => {
            const nivel = calcularNivelDesbloqueo(clave, "xecretos");
            const scaleMap = { 1: 1, 0.5: 0.6, 0.25: 0.4 };
            const opacityMap = { 1: 1, 0.5: 0.7, 0.25: 0.4 };
            return (
              <motion.img
                key={clave}
                src={`/arbol/guardianesÁrbol/${mapa[clave]}.png`}
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: opacityMap[nivel], scale: scaleMap[nivel] }}
                transition={{ duration: 0.6 }}
              />
            );
          })}
        </div>
      </TransformComponent>
    </TransformWrapper>
  );
}
