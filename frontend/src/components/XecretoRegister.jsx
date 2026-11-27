import { useState, useContext, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import ModalInstruccionesXecretos from "@/components/ModalInstruccionesXecretos";
import XafariContext from "./XafariContext";
import useQrScanner from "@/hooks/useQrScanner";
import { GUARDIANES, parseActivityQr } from "@/data/guardianes";

const TOTAL = Object.keys(GUARDIANES).length;

/**
 * Escáner de xecretos dentro de la app. Lee el mismo QR que la cámara nativa
 * (`${PUBLIC_APP_URL}/q/<activityId>?k=<code>`) y registra con {activityId, code}.
 * Solo muestra el guardián si el servidor confirmó.
 */
export default function XecretoRegister({ onClose, previewOnly = false }) {
  const { t } = useTranslation();
  const { playSuccessSound, playErrorSound, registerActivityCompleted, activitiesById, xecretos } =
    useContext(XafariContext);

  const [result, setResult] = useState(null); // {kind:"ok"|"already"|"queued", key} | null
  const [feedback, setFeedback] = useState(null); // {kind:"invalid"|"error", text}
  const [processing, setProcessing] = useState(false);
  const [showInstrucciones, setShowInstrucciones] = useState(false);
  const timers = useRef([]);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, []);
  const later = useCallback((fn, ms) => timers.current.push(setTimeout(fn, ms)), []);

  const showFeedback = useCallback(
    (kind, text) => {
      setFeedback({ kind, text });
      later(() => setFeedback(null), 2200);
    },
    [later]
  );

  const handleDecode = useCallback(
    (text) => {
      const parsed = parseActivityQr(text);
      if (!parsed) {
        showFeedback("invalid", t("scanner.notXafari"));
        return false;
      }
      const activity = activitiesById[parsed.activityId];
      if (!activity || activity.type !== "Xecreto") {
        showFeedback("invalid", t("scanner.notXecreto"));
        return false;
      }

      setProcessing(true);
      (async () => {
        const already = Boolean(xecretos?.[activity.name]);
        const res = already ? { ok: true } : await registerActivityCompleted(null, { activityId: parsed.activityId, code: parsed.code });
        if (res.ok || res.queued) {
          if (!already && res.ok) playSuccessSound?.();
          setResult({ kind: already ? "already" : res.ok ? "ok" : "queued", key: activity.name });
          later(() => {
            setResult(null);
            setProcessing(false);
            onClose?.(res.ok && !already ? activity.name : undefined);
          }, 3000);
        } else {
          playErrorSound?.();
          showFeedback("error", res.status === 403 ? t("qr.invalidBody") : t("qr.errorBody"));
          later(() => setProcessing(false), 2200);
        }
      })();
      return true; // pausa la lectura mientras se procesa
    },
    [activitiesById, xecretos, registerActivityCompleted, playSuccessSound, playErrorSound, onClose, showFeedback, later, t]
  );

  const { videoRef, error: cameraError } = useQrScanner({
    active: !previewOnly,
    paused: processing,
    onDecode: handleDecode,
  });

  const scannedCount = Object.keys(GUARDIANES).filter((k) => xecretos?.[k]).length;
  const guardian = result ? GUARDIANES[result.key] : null;
  const frameColor =
    result ? "#34d399" : feedback ? "#ef4444" : "rgba(61,26,0,0.65)";

  return (
    <div
      className="relative h-full w-full flex flex-col overflow-hidden font-apercu"
      style={{ backgroundColor: "rgba(242, 232, 218, 1)", border: "6px solid #7b4a1a", borderRadius: "16px" }}
    >
      {/* ── Área cámara ─────────────────────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden">
        <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />

        {cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[rgba(242,232,218,0.95)] px-6 text-center">
            <svg aria-hidden="true" className="w-12 h-12 opacity-40" fill="none" viewBox="0 0 24 24" stroke="#7b4a1a" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
            <span className="text-sm font-semibold" style={{ color: "#5a3410" }}>{t("scanner.cameraUnavailable")}</span>
            <span className="text-xs" style={{ color: "#5a3410" }}>{t("scanner.cameraHint")}</span>
          </div>
        )}

        {/* Marco QR */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-44 h-44 transition-all duration-300">
            {[
              "top-0 left-0 border-t-4 border-l-4 rounded-tl-lg",
              "top-0 right-0 border-t-4 border-r-4 rounded-tr-lg",
              "bottom-0 left-0 border-b-4 border-l-4 rounded-bl-lg",
              "bottom-0 right-0 border-b-4 border-r-4 rounded-br-lg",
            ].map((cls) => (
              <div key={cls} className={`absolute w-9 h-9 ${cls}`} style={{ borderColor: frameColor }} />
            ))}
            <motion.div
              className="absolute left-3 right-3 h-0.5 rounded-full"
              style={{ backgroundColor: "rgba(61,26,0,0.45)" }}
              animate={{ top: ["12%", "88%", "12%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>

        {/* Contador */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5">
          <span className="text-white text-xs font-semibold">{scannedCount} / {TOTAL}</span>
        </div>

        {/* Aviso de QR no válido / error */}
        <AnimatePresence>
          {feedback && (
            <motion.p
              role="alert"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-4 left-4 right-4 z-20 rounded-xl px-4 py-2 text-center text-sm font-semibold text-white"
              style={{ backgroundColor: "rgba(156,62,50,0.92)" }}
            >
              {feedback.text}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Resultado confirmado por el servidor */}
        <AnimatePresence>
          {result && guardian && (
            <motion.div
              role="status"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#4a2e0e]/95 backdrop-blur-md p-6 text-center select-none"
            >
              <div className="absolute w-72 h-72 rounded-full bg-[#80A850]/20 blur-3xl" />
              <motion.div
                initial={{ scale: 0.3, rotate: -20, opacity: 0 }}
                animate={{ scale: [0.3, 1.1, 1], rotate: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center gap-6"
              >
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <motion.img
                    src="/iconos/elipseAvatar.png"
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain opacity-80"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                  />
                  <motion.img
                    src={guardian.img}
                    alt={guardian.guardian}
                    className="relative z-10 w-[75%] h-[75%] object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  />
                </div>
                <div className="space-y-2 max-w-xs">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#a7cd80]">
                    {result.kind === "queued" ? t("qr.queuedTitle") : t("scanner.revealed")}
                  </span>
                  <h2 className="text-2xl font-black text-[#f4ead9] leading-tight">
                    {t("qr.guardian", { name: guardian.guardian })}
                  </h2>
                  <p className="text-sm text-[#f4ead9] font-medium px-4">
                    {result.kind === "already" ? t("qr.already") : result.kind === "queued" ? t("qr.queuedBody") : t("scanner.newGuardian")}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Botones ─────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 flex items-center gap-3 px-5 py-4" style={{ backgroundColor: "rgba(242, 232, 218, 1)" }}>
        <button
          type="button"
          onClick={() => onClose?.()}
          aria-label={t("close")}
          className="flex-1 flex items-center justify-center py-3 rounded-full active:scale-95 transition-all"
          style={{ backgroundColor: "#b03030" }}
        >
          <svg aria-hidden="true" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => setShowInstrucciones(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-full active:scale-95 transition-all text-[11px] font-bold"
          style={{ backgroundColor: "#2d7a2d", color: "white" }}
        >
          <svg aria-hidden="true" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {t("scanner.how")}
        </button>
      </div>

      <ModalInstruccionesXecretos show={showInstrucciones} onClose={() => setShowInstrucciones(false)} />
    </div>
  );
}
