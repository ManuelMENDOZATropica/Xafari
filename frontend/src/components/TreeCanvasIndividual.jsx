import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import AvatarRender from "@/components/AvatarRender";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function TreeCanvasIndividual({
  xecretos,
  respuestasCorrectas,
  checklistProgreso,
  insigniaReciente,
}) {
  const CANVAS_WIDTH = 2450;
  const CANVAS_HEIGHT = 4200;
  const transformUtilsRef = useRef(null);
  const initialScale = 0.22;
  const initialOffset = useRef({ x: 0, y: 0 });

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (transformUtilsRef.current) {
        const { setTransform } = transformUtilsRef.current;
        const { x, y } = initialOffset.current;
        setTransform(x, y, initialScale);
      }
    }, 100); // Delay para asegurar montaje

    return () => clearTimeout(timeout);
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
        // Aquí ya no aplicamos el setTransform directamente
      }}
    >
      <TransformComponent>
        <div
          style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
          className="relative"
        >
          <img
            src="/arbol/baseArbolv3.png"
            alt=""
            className="w-full h-full object-contain"
          />

          {/* Xecretos */}
          {Object.entries(xecretos).map(([k, v]) =>
            v && mapa[k] ? (
              <motion.img
                key={k}
                src={`/arbol/guardianesÁrbol/${mapa[k]}.png`}
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

          {/* Xperiencias */}
          {Object.entries(respuestasCorrectas).map(([k, v]) =>
            v ? (
              <motion.img
                key={k}
                src={`/arbol/xtopÁrbol/${k}.png`}
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

          {/* Checklist */}
          {Object.entries(checklistProgreso).map(([k, v]) =>
            v ? (
              <motion.img
                key={k}
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

          {/* Avatar */}
          <div
            className="absolute z-40"
            style={{
              left: `${(615 / CANVAS_WIDTH) * 100}%`,
              top: `${(910 / CANVAS_HEIGHT) * 100}%`,
              width: `${(90 / CANVAS_WIDTH) * 100}%`,
              height: `${(130 / CANVAS_HEIGHT) * 100}%`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <AvatarRender className="w-full h-full" />
          </div>
        </div>
      </TransformComponent>
    </TransformWrapper>
  );
}
