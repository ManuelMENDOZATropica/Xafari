import { useEffect, useRef, useState, useContext, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import ModalInstruccionesXecretos from "@/components/ModalInstruccionesXecretos";
import ModalPistaXecreto from "@/components/ModalPistaXecreto";
import XafariContext from "./XafariContext";
import useGlyphRecognizer from "@/hooks/useGlyphRecognizer";

// ─── Glyph label → xecreto key mapping ─────────────────────────────────────
const GLYPH_TO_XECRETO = {
  mono:      "xecreto1",
  rana:      "xecreto2",
  jaguar:    "xecreto3",
  serpiente: "xecreto5",
  venado:    "xecreto6",
  buho:      "xecreto7",
  mariposa:  "xecreto8",
  flamenco:  "xecreto9",
  coati:     "xecreto10",
};

export default function XecretoRegister({ onClose, previewOnly = false }) {
  const videoRef = useRef(null);
  const { t } = useTranslation();
  const { playSuccessSound, registerActivityCompleted, xecretos } = useContext(XafariContext);

  const qrData = {
    xecreto1:  { guardian: "Mono",       maya: "/maya/GuardianMono.png",       arbol: "/guardianes/Mono Casa Vida.png" },
    xecreto2:  { guardian: "Rana",       maya: "/maya/GuardianRana.png",       arbol: "/guardianes/Rana Casa Agua.png" },
    xecreto3:  { guardian: "Jaguar",     maya: "/maya/GuardianJaguar.png",     arbol: "/guardianes/Jaguar Casa Sol.png" },
    xecreto4:  { guardian: "Guacamaya", maya: "/maya/GuardianGuacamaya.png",  arbol: "/guardianes/Guacamaya Casa Fuego.png" },
    xecreto5:  { guardian: "Serpiente",  maya: "/maya/GuardianSerpiente.png",  arbol: "/guardianes/Serpiente Casa Espiral.png" },
    xecreto6:  { guardian: "Venado",     maya: "/maya/GuardianVenado.png",     arbol: "/guardianes/Venado Casa Tierra.png" },
    xecreto7:  { guardian: "Búho",       maya: "/maya/GuardianBuho.png",       arbol: "/guardianes/Búho Casa Eclipse.png" },
    xecreto8:  { guardian: "Mariposa",   maya: "/maya/GuardianMariposa.png",   arbol: "/guardianes/Mariposa Casa Viento.png" },
    xecreto9:  { guardian: "Flamenco",   maya: "/maya/GuardianFlamenco.png",   arbol: "/guardianes/Flamenco Casa Sol.png" },
    xecreto10: { guardian: "Coati",      maya: "/maya/GuardianCoati.png",      arbol: "/guardianes/Coati.png" },
  };

  const [scannedCodes, setScannedCodes] = useState(() => {
    const def = Object.keys(qrData).reduce((acc, k) => { acc[k] = false; return acc; }, {});
    return { ...def, ...xecretos };
  });
  useEffect(() => {
    setScannedCodes((prev) => ({ ...prev, ...xecretos }));
  }, [xecretos]);

  const [lastScanned, setLastScanned]   = useState(null);
  const [insigniaKey, setInsigniaKey]   = useState(0);
  const [showInsignia, setShowInsignia] = useState(false);
  const [cameraError, setCameraError]   = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showInstrucciones, setShowInstrucciones] = useState(false);
  const [showPista, setShowPista]       = useState(false);

  // ─── Glyph detection ────────────────────────────────────────────────────
  const handleGlyphDetection = useCallback((glyphLabel) => {
    if (isProcessing) return;
    const xecretoKey = GLYPH_TO_XECRETO[glyphLabel];
    if (!xecretoKey || !qrData[xecretoKey]) return;

    setIsProcessing(true);

    if (!scannedCodes[xecretoKey]) {
      setScannedCodes((prev) => ({ ...prev, [xecretoKey]: true }));
      registerActivityCompleted(xecretoKey);
      if (typeof playSuccessSound === "function") playSuccessSound();
    }

    setLastScanned(xecretoKey);
    setInsigniaKey((prev) => prev + 1);
    setShowInsignia(false);
    setTimeout(() => setShowInsignia(true), 50);
    setTimeout(() => {
      setShowInsignia(false);
      setIsProcessing(false);
      onClose();
    }, 6000);
  }, [isProcessing, scannedCodes, playSuccessSound, onClose]);

  // ─── Glyph recognizer hook ──────────────────────────────────────────────
  const { isModelLoaded, isScanning, allPredictions, edgeScore } = useGlyphRecognizer(videoRef, {
    active: !isProcessing && !previewOnly,
    onDetection: handleGlyphDetection,
  });

  // ─── Camera setup ───────────────────────────────────────────────────────
  useEffect(() => {
    if (previewOnly) return;
    let stream = null;
    let mounted = true;

    const startCamera = async () => {
      try {
        if (!videoRef.current) { setTimeout(startCamera, 200); return; }
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } },
        });
        if (mounted && videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        if (mounted) setCameraError(err.message);
      }
    };

    startCamera();
    return () => {
      mounted = false;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const topPrediction = allPredictions.find((p) => p.label !== "none" && p.confidence > 0.5);
  const scannedCount  = Object.values(scannedCodes).filter(Boolean).length;

  return (
    /* Misma estética que QRScannerModal — fondo crema, borde café */
    <div
      className="relative h-full w-full flex flex-col overflow-hidden font-apercu"
      style={{
        backgroundColor: "rgba(242, 232, 218, 1)",
        border: "6px solid #7b4a1a",
        borderRadius: "16px",
      }}
    >
      {/* ── Área de cámara ─────────────────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden">
        {/* Video */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />

        {cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[rgba(242,232,218,0.95)]">
            <svg className="w-12 h-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="#7b4a1a" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
            <span className="text-xs opacity-40" style={{ color: "#7b4a1a" }}>Cámara no disponible</span>
          </div>
        )}

        {/* Marco de escaneo — círculo pulsante */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className={`w-44 h-44 rounded-full border-4 transition-colors duration-300 ${
              topPrediction && topPrediction.confidence > 0.6
                ? "border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.4)]"
                : "border-white/50"
            }`}
            style={{ animation: isScanning ? "pulse-ring 2s ease-in-out infinite" : "none" }}
          />
        </div>

        {/* Contador de guardianes — top right */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5">
          <span className="text-white text-xs font-semibold">{scannedCount} / {Object.keys(qrData).length}</span>
          <svg className="w-3.5 h-3.5 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>

        {/* Estado del modelo */}
        {!isModelLoaded && (
          <div className="absolute top-3 left-3 z-10 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-white text-xs animate-pulse">Cargando…</span>
          </div>
        )}

        {/* Barras de confianza — real-time */}
        {allPredictions.length > 0 && (
          <div className="absolute bottom-2 left-2 right-2 flex flex-col gap-0.5 pointer-events-none">
            {allPredictions
              .filter((p) => p.label !== "none" && p.confidence > 0.15)
              .slice(0, 3)
              .map((p) => (
                <div key={p.label} className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-2 py-0.5">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.confidence > 0.70 ? "#34d399" : p.confidence > 0.40 ? "#fbbf24" : "#f87171" }} />
                  <span className="text-white text-xs capitalize flex-1">{p.label}</span>
                  <span className="text-white/70 text-xs font-mono">{Math.round(p.confidence * 100)}%</span>
                </div>
              ))}
          </div>
        )}

        {/* Animación de guardián al detectar */}
        {lastScanned && qrData[lastScanned] && (
          <>
            <AnimatePresence>
              {showInsignia && (
                <motion.img
                  key={insigniaKey}
                  src={qrData[lastScanned].arbol}
                  alt="Guardian"
                  initial={{ scale: 0, opacity: 0, x: "-50%", y: "-50%", rotate: -10 }}
                  animate={{
                    scale: [0, 1.2, 1, 1.1, 1],
                    y: ["-50%", "-52%", "-48%", "-50%", "-50%"],
                    rotate: [0, 5, -5, 3, 0],
                    opacity: [0, 1, 1, 1, 0],
                    x: ["-50%", "-50%", "-50%", "-70%", "-200%"],
                  }}
                  transition={{ duration: 6, times: [0, 0.2, 0.4, 0.7, 1] }}
                  exit={{ opacity: 0 }}
                  className="absolute z-50 top-[35%] left-1/2 w-48 aspect-square pointer-events-none"
                />
              )}
            </AnimatePresence>

            <motion.div
              className="absolute top-[60%] left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow text-center z-50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-sm font-bold" style={{ color: "#3D1A00" }}>
                ¡Guardián {qrData[lastScanned].guardian} descubierto!
              </p>
            </motion.div>
          </>
        )}
      </div>

      {/* ── Botones inferiores ──────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 flex items-center gap-3 px-5 py-4"
        style={{ backgroundColor: "rgba(242, 232, 218, 1)" }}
      >
        {/* X — Cerrar */}
        <button
          onClick={onClose}
          className="flex-1 flex items-center justify-center py-3 rounded-full active:scale-95 transition-all"
          style={{ backgroundColor: "#b03030" }}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Pista */}
        <button
          onClick={() => setShowPista(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-full active:scale-95 transition-all text-[11px] font-bold"
          style={{ backgroundColor: "rgba(61,26,0,0.85)", color: "#f5ddb0" }}
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Pista
        </button>

        {/* Info */}
        <button
          onClick={() => setShowInstrucciones(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-full active:scale-95 transition-all text-[11px] font-bold"
          style={{ backgroundColor: "#2d7a2d", color: "white" }}
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          ¿Cómo?
        </button>
      </div>

      {/* Modales auxiliares */}
      <ModalInstruccionesXecretos show={showInstrucciones} onClose={() => setShowInstrucciones(false)} />
      <ModalPistaXecreto show={showPista} onClose={() => setShowPista(false)} scannedCodes={scannedCodes} />

      <style>{`
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
