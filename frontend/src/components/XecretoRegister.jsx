import { useEffect, useRef, useState, useContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jsQR from "jsqr";
import ModalInstruccionesXecretos from "@/components/ModalInstruccionesXecretos";
import XafariContext from "./XafariContext";

// ─── URL base del QR ────────────────────────────────────────────────────────
const QR_BASE = "https://www.xafari.xcaret.com/xecreto/";

const GUARDIAN_DATA = {
  xecreto1:  { guardian: "Mono",      arbol: "/guardianes/Mono Casa Vida.png",         maya: "/maya/GuardianMono.png" },
  xecreto2:  { guardian: "Rana",      arbol: "/guardianes/Rana Casa Agua.png",         maya: "/maya/GuardianRana.png" },
  xecreto3:  { guardian: "Jaguar",    arbol: "/guardianes/Jaguar Casa Sol.png",         maya: "/maya/GuardianJaguar.png" },
  xecreto4:  { guardian: "Guacamaya", arbol: "/guardianes/Guacamaya Casa Fuego.png",   maya: "/maya/GuardianGuacamaya.png" },
  xecreto5:  { guardian: "Serpiente", arbol: "/guardianes/Serpiente Casa Espiral.png", maya: "/maya/GuardianSerpiente.png" },
  xecreto6:  { guardian: "Venado",    arbol: "/guardianes/Venado Casa Tierra.png",     maya: "/maya/GuardianVenado.png" },
  xecreto7:  { guardian: "Búho",      arbol: "/guardianes/Búho Casa Eclipse.png",      maya: "/maya/GuardianBuho.png" },
  xecreto8:  { guardian: "Mariposa",  arbol: "/guardianes/Mariposa Casa Viento.png",   maya: "/maya/GuardianMariposa.png" },
  xecreto9:  { guardian: "Flamenco",  arbol: "/guardianes/Flamenco Casa Sol.png",      maya: "/maya/GuardianFlamenco.png" },
  xecreto10: { guardian: "Coatí",     arbol: "/guardianes/Coati.png",                  maya: "/maya/GuardianCoati.png" },
};

export default function XecretoRegister({ onClose, previewOnly = false }) {
  const videoRef   = useRef(null);
  const canvasRef  = useRef(null);
  const rafRef     = useRef(null);
  const streamRef  = useRef(null);

  const { playSuccessSound, registerActivityCompleted, xecretos } = useContext(XafariContext);

  const [scannedCodes, setScannedCodes] = useState(() => {
    const def = Object.keys(GUARDIAN_DATA).reduce((a, k) => { a[k] = false; return a; }, {});
    return { ...def, ...xecretos };
  });
  useEffect(() => { setScannedCodes((p) => ({ ...p, ...xecretos })); }, [xecretos]);

  const [lastScanned,  setLastScanned]  = useState(null);
  const [insigniaKey,  setInsigniaKey]  = useState(0);
  const [showInsignia, setShowInsignia] = useState(false);
  const [cameraError,  setCameraError]  = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showInstrucciones, setShowInstrucciones] = useState(false);
  const [scanFeedback, setScanFeedback] = useState(null); // "ok" | "invalid"

  // ─── Camera ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (previewOnly) return;
    let mounted = true;

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } },
        });
        if (!mounted) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        if (mounted) setCameraError(err.message);
      }
    })();

    return () => {
      mounted = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ─── QR scan loop ────────────────────────────────────────────────────────
  const handleDetected = useCallback((xecretoKey) => {
    if (isProcessing) return;
    setIsProcessing(true);

    const isNew = !scannedCodes[xecretoKey];
    if (isNew) {
      setScannedCodes((p) => ({ ...p, [xecretoKey]: true }));
      if (typeof playSuccessSound === "function") playSuccessSound();
    }

    setLastScanned(xecretoKey);
    setInsigniaKey((p) => p + 1);
    setShowInsignia(false);
    setScanFeedback("ok");
    setTimeout(() => setShowInsignia(true), 50);
    setTimeout(() => {
      setShowInsignia(false);
      setScanFeedback(null);
      setIsProcessing(false);
      if (isNew) {
        registerActivityCompleted(xecretoKey);
      }
      onClose(xecretoKey);
    }, 3000);
  }, [isProcessing, scannedCodes, playSuccessSound, registerActivityCompleted, onClose]);

  useEffect(() => {
    if (previewOnly || isProcessing) return;
    const canvas = canvasRef.current;
    const video  = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    const tick = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width  = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        if (code?.data) {
          const url = code.data.trim();
          // Parsear: https://www.xafari.xcaret.com/xecreto/xecreto1
          if (url.startsWith(QR_BASE)) {
            const key = url.slice(QR_BASE.length).replace(/\/$/, "");
            if (GUARDIAN_DATA[key]) {
              handleDetected(key);
              return; // stop loop
            }
          }
          // QR válido pero no es de Xafari
          setScanFeedback("invalid");
          setTimeout(() => setScanFeedback(null), 1500);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [previewOnly, isProcessing, handleDetected]);

  const scannedCount = Object.values(scannedCodes).filter(Boolean).length;

  return (
    <div
      className="relative h-full w-full flex flex-col overflow-hidden font-apercu"
      style={{ backgroundColor: "rgba(242, 232, 218, 1)", border: "6px solid #7b4a1a", borderRadius: "16px" }}
    >
      {/* Canvas oculto para jsQR */}
      <canvas ref={canvasRef} className="hidden" />

      {/* ── Área cámara ─────────────────────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden">
        <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />

        {cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[rgba(242,232,218,0.95)]">
            <svg className="w-12 h-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="#7b4a1a" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
            <span className="text-xs opacity-40" style={{ color: "#7b4a1a" }}>Cámara no disponible</span>
          </div>
        )}

        {/* Marco QR */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="relative w-44 h-44 transition-all duration-300"
            style={{ filter: scanFeedback === "ok" ? "drop-shadow(0 0 16px rgba(52,211,153,0.8))" : scanFeedback === "invalid" ? "drop-shadow(0 0 16px rgba(239,68,68,0.8))" : "none" }}
          >
            {[
              "top-0 left-0 border-t-4 border-l-4 rounded-tl-lg",
              "top-0 right-0 border-t-4 border-r-4 rounded-tr-lg",
              "bottom-0 left-0 border-b-4 border-l-4 rounded-bl-lg",
              "bottom-0 right-0 border-b-4 border-r-4 rounded-br-lg",
            ].map((cls, i) => (
              <div key={i} className={`absolute w-9 h-9 ${cls}`}
                style={{ borderColor: scanFeedback === "ok" ? "#34d399" : scanFeedback === "invalid" ? "#ef4444" : "rgba(61,26,0,0.65)" }} />
            ))}
            <motion.div
              className="absolute left-3 right-3 h-0.5 rounded-full"
              style={{ backgroundColor: scanFeedback === "ok" ? "rgba(52,211,153,0.7)" : "rgba(61,26,0,0.45)" }}
              animate={{ top: ["12%", "88%", "12%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>

        {/* Contador */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5">
          <span className="text-white text-xs font-semibold">{scannedCount} / {Object.keys(GUARDIAN_DATA).length}</span>
        </div>

        {/* Pantalla intermedia de éxito (cubre todo con animación) */}
        <AnimatePresence>
          {showInsignia && lastScanned && GUARDIAN_DATA[lastScanned] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#4a2e0e]/95 backdrop-blur-md p-6 text-center select-none"
            >
              {/* Glow effect behind the badge */}
              <div className="absolute w-72 h-72 rounded-full bg-[#80A850]/20 blur-3xl" />

              <motion.div
                initial={{ scale: 0.3, rotate: -20, opacity: 0 }}
                animate={{ scale: [0.3, 1.1, 1], rotate: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center gap-6"
              >
                {/* Badge Frame */}
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <motion.img
                    src="/iconos/elipseAvatar.png"
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain opacity-80"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                  />
                  <motion.img
                    src={GUARDIAN_DATA[lastScanned].arbol}
                    alt={GUARDIAN_DATA[lastScanned].guardian}
                    className="relative z-10 w-[75%] h-[75%] object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  />
                </div>

                {/* Title & Description */}
                <div className="space-y-2 max-w-xs">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#a7cd80]">
                    ¡Xecreto Revelado!
                  </span>
                  <h2 className="text-2xl font-black text-[#f4ead9] leading-tight">
                    Guardián {GUARDIAN_DATA[lastScanned].guardian}
                  </h2>
                  <p className="text-sm text-[#f4ead9]/75 font-medium px-4">
                    Has descubierto un nuevo guardián en tu Árbol de la Vida.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Botones ─────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 flex items-center gap-3 px-5 py-4" style={{ backgroundColor: "rgba(242, 232, 218, 1)" }}>
        {/* X */}
        <button onClick={onClose} className="flex-1 flex items-center justify-center py-3 rounded-full active:scale-95 transition-all" style={{ backgroundColor: "#b03030" }}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {/* Info */}
        <button onClick={() => setShowInstrucciones(true)} className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-full active:scale-95 transition-all text-[11px] font-bold" style={{ backgroundColor: "#2d7a2d", color: "white" }}>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          ¿Cómo?
        </button>
      </div>

      <ModalInstruccionesXecretos show={showInstrucciones} onClose={() => setShowInstrucciones(false)} />
    </div>
  );
}
