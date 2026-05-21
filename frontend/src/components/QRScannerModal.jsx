import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function QRScannerModal({ onClose, onConfirm }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraError, setCameraError] = useState(false);

  useEffect(() => {
    let active = true;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (!active) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch {
        if (active) setCameraError(true);
      }
    }

    startCamera();
    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const stopAndCall = (fn) => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    fn();
  };

  return (
    /* fixed con z-40 — por encima del nav (z-30) y en la misma área del modal de Xelfies */
    <motion.div
      className="fixed left-[12px] right-[12px] z-40 flex flex-col overflow-hidden"
      style={{
        top: "8%",
        bottom: "calc(2vh + 160px)",
        backgroundColor: "rgba(242, 232, 218, 1)",
        borderRadius: "16px",
        border: "6px solid #7b4a1a",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >

      {/* Área de cámara — ocupa todo el espacio disponible menos los botones */}
      <div className="flex-1 relative overflow-hidden">
        {!cameraError ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" style={{ backgroundColor: "rgba(242,232,218,1)" }}>
            <svg className="w-16 h-16 opacity-30" fill="none" viewBox="0 0 24 24" stroke="#7b4a1a" strokeWidth={1.5}>
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <path strokeLinecap="round" d="M14 14h3M17 14v3M14 17h3M17 17v3" />
            </svg>
            <span className="text-xs font-medium opacity-40" style={{ color: "#7b4a1a" }}>
              Cámara no disponible
            </span>
          </div>
        )}

        {/* Marco guía QR */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-48 h-48">
            {[
              "top-0 left-0 border-t-4 border-l-4 rounded-tl-lg",
              "top-0 right-0 border-t-4 border-r-4 rounded-tr-lg",
              "bottom-0 left-0 border-b-4 border-l-4 rounded-bl-lg",
              "bottom-0 right-0 border-b-4 border-r-4 rounded-br-lg",
            ].map((cls, i) => (
              <div
                key={i}
                className={`absolute w-9 h-9 ${cls}`}
                style={{ borderColor: "rgba(61,26,0,0.65)" }}
              />
            ))}
            {/* Línea de escaneo animada */}
            <motion.div
              className="absolute left-3 right-3 h-0.5 rounded-full"
              style={{ backgroundColor: "rgba(61,26,0,0.45)" }}
              animate={{ top: ["12%", "88%", "12%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>
      </div>

      {/* Botones */}
      <div
        className="flex-shrink-0 flex items-center gap-3 px-5 py-4"
        style={{ backgroundColor: "rgba(242, 232, 218, 1)" }}
      >
        {/* X — Cancelar */}
        <button
          onClick={() => stopAndCall(onClose)}
          className="flex-1 flex items-center justify-center py-3 rounded-full active:scale-95 transition-all"
          style={{ backgroundColor: "#b03030" }}
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Cámara — Confirmar */}
        <button
          onClick={() => stopAndCall(onConfirm)}
          className="flex-1 flex items-center justify-center py-3 rounded-full active:scale-95 transition-all"
          style={{ backgroundColor: "#2d7a2d" }}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
