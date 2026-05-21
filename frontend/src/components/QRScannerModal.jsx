import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        if (active) setCameraError(true);
      }
    }

    startCamera();

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handleConfirm = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    onConfirm();
  };

  const handleClose = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 pointer-events-auto"
        onClick={handleClose}
      />

      {/* Modal */}
      <motion.div
        className="relative pointer-events-auto mx-6 w-full max-w-xs flex flex-col"
        style={{
          backgroundColor: "rgba(242, 232, 218, 1)",
          border: "6px solid #7b4a1a",
          borderRadius: "22px",
          overflow: "hidden",
        }}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ duration: 0.25, ease: "backOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Viewfinder — cámara */}
        <div
          className="relative overflow-hidden"
          style={{
            backgroundColor: "rgba(242, 232, 218, 1)",
            aspectRatio: "3 / 4",
          }}
        >
          {!cameraError ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            /* Placeholder si no hay cámara */
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-40">
              <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="#7b4a1a" strokeWidth={1.5}>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <path strokeLinecap="round" d="M14 14h3M17 14v3M14 17h3M17 17v3" />
              </svg>
              <span className="text-xs font-medium" style={{ color: "#7b4a1a" }}>
                Cámara no disponible
              </span>
            </div>
          )}

          {/* Marco guía QR */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-44 h-44">
              {/* Esquinas del marco */}
              {[
                "top-0 left-0 border-t-4 border-l-4 rounded-tl-lg",
                "top-0 right-0 border-t-4 border-r-4 rounded-tr-lg",
                "bottom-0 left-0 border-b-4 border-l-4 rounded-bl-lg",
                "bottom-0 right-0 border-b-4 border-r-4 rounded-br-lg",
              ].map((cls, i) => (
                <div
                  key={i}
                  className={`absolute w-8 h-8 ${cls}`}
                  style={{ borderColor: "rgba(61,26,0,0.7)" }}
                />
              ))}
              {/* Línea de escaneo animada */}
              <motion.div
                className="absolute left-2 right-2 h-0.5 rounded-full"
                style={{ backgroundColor: "rgba(61,26,0,0.5)" }}
                animate={{ top: ["10%", "90%", "10%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>
        </div>

        {/* Botones */}
        <div
          className="flex items-center gap-3 px-5 py-4"
          style={{ backgroundColor: "rgba(242, 232, 218, 1)" }}
        >
          {/* X — Cancelar */}
          <button
            onClick={handleClose}
            className="flex-1 flex items-center justify-center py-3 rounded-full active:scale-95 transition-all"
            style={{ backgroundColor: "#b03030" }}
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Cámara — Confirmar */}
          <button
            onClick={handleConfirm}
            className="flex-1 flex items-center justify-center py-3 rounded-full active:scale-95 transition-all"
            style={{ backgroundColor: "#2d7a2d" }}
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
