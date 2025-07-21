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
  const wrapperRef = useRef(null);
  const transformUtilsRef = useRef(null);

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

      if (visibleXRatio < 0.8 || visibleYRatio < 0.8) {
        // Recentrar
        const resetScale = 0.2;
        const offsetX = (vw - CANVAS_WIDTH * resetScale) / 2;
        const offsetY = (vh - CANVAS_HEIGHT * resetScale) / 2;
        setTransform(offsetX, offsetY, resetScale);
      }
    };

    const interval = setInterval(checkBoundaries, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <TransformWrapper
      ref={wrapperRef}
      initialScale={0.2}
      minScale={0.1}
      maxScale={0.4}
      wheel={{ step: 50 }}
      doubleClick={{ disabled: true }}
      limitToBounds={false}
      onInit={(utils) => {
        transformUtilsRef.current = utils;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const scale = 0.2;

        const offsetX = (vw - CANVAS_WIDTH * scale) / 2;
        const offsetY = (vh - CANVAS_HEIGHT * scale) / 2;

        utils.setTransform(offsetX, offsetY, scale);
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
