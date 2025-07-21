import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import AvatarRender from "@/components/AvatarRender";
import { motion } from "framer-motion";

export default function TreeCanvasFamilia() {
  const CANVAS_SIZE = 1200;
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

  const familia = [
    { id: "1", avatar: {}, progreso: { xecretos: { xecreto1: true, xecreto2: true } } },
    { id: "2", avatar: {}, progreso: { xecretos: { xecreto1: true } } },
    { id: "3", avatar: {}, progreso: { xecretos: { xecreto2: true } } },
    { id: "4", avatar: {}, progreso: { xecretos: {} } },
    { id: "5", avatar: {}, progreso: { xecretos: { xecreto1: true } } },
    { id: "6", avatar: {}, progreso: { xecretos: { xecreto2: true } } },
    { id: "7", avatar: {}, progreso: { xecretos: { xecreto2: true } } },
    { id: "8", avatar: {}, progreso: { xecretos: { xecreto1: true } } },
  ];

  const calcularNivelDesbloqueo = (clave, tipo) => {
    const total = familia.length;
    const desbloqueos = familia.filter((m) => m.progreso[tipo]?.[clave]).length;
    const porcentaje = desbloqueos / total;
    if (porcentaje === 1) return 1;
    if (porcentaje >= 0.5) return 0.5;
    return 0.25;
  };

  return (
    <TransformWrapper initialScale={0.6} minScale={0.5} maxScale={2} limitToBounds={false} wheel={{ step: 50 }} doubleClick={{ disabled: true }}>
      <TransformComponent>
        <div style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }} className="relative">
          <img src="/arbol/baseArbolv3.png" alt="" className="w-full h-full object-contain" />

          {familia.map((m, index) => (
            <div
              key={m.id}
              className="absolute z-40"
              style={{
                left: `${(615 / CANVAS_SIZE) * 100}%`,
                top: `${(910 / CANVAS_SIZE) * 100}%`,
                width: `${(90 / CANVAS_SIZE) * 100}%`,
                height: `${(130 / CANVAS_SIZE) * 100}%`,
                transform: `translate(-50%, -100%) scale(${1 - index * 0.05})`,
                opacity: 1 - index * 0.1,
              }}
            >
              <AvatarRender {...m.avatar} />
            </div>
          ))}

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
