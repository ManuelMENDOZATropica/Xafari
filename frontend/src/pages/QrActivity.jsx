import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import XafariContext from "@/components/XafariContext";
import { GUARDIANES, isUuid } from "@/data/guardianes";

const WAIT_LIMIT_MS = 15000; // si el backend no contesta, se muestra error en vez de girar para siempre
const REDIRECT_MS = 5000;

const TEXT = "#F7F3EA"; // contraste AA sobre el fondo oscuro

function isCompleted(ctx, activity) {
  const maps = {
    Xecreto: ctx.xecretos,
    Xperiencia: ctx.progresoXperiencias,
    Xelfie: ctx.progresoXelfies,
    Event: ctx.progresoChecklist,
  };
  return Boolean(maps[activity.type]?.[activity.name]);
}

/**
 * /q/:activityId?k=<code> — registra la actividad del QR.
 * Espera a que el catálogo y el progreso estén listos, llama una sola vez a la API
 * y muestra éxito SOLO si el servidor respondió OK.
 */
export default function QrActivity({ legacy = false }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { activityId } = useParams();
  const [params] = useSearchParams();
  const code = params.get("k") || "";
  const ctx = useContext(XafariContext);
  const { activitiesReady, progressReady, activitiesById, registerActivityCompleted } = ctx;

  const [phase, setPhase] = useState(legacy ? "legacy" : "validating");
  const [activity, setActivity] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const startedRef = useRef(false);

  // Último contexto en un ref: el efecto de registro no depende de closures viejas.
  const ctxRef = useRef(ctx);
  ctxRef.current = ctx;

  // Vivo mientras el componente esté montado (no por efecto: un re-render no debe
  // descartar la respuesta del servidor).
  const aliveRef = useRef(true);
  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  // Registro: corre cuando el contexto está listo, una sola vez por intento.
  useEffect(() => {
    if (legacy || startedRef.current) return;
    if (!isUuid(activityId)) {
      setPhase("unknown");
      return;
    }
    if (!activitiesReady || !progressReady) return;

    const act = activitiesById[activityId];
    if (!act) {
      setPhase("unknown");
      return;
    }
    setActivity(act);
    if (isCompleted(ctxRef.current, act)) {
      setPhase("already");
      return;
    }

    startedRef.current = true;
    (async () => {
      const result = await registerActivityCompleted(null, { activityId, code });
      if (!aliveRef.current) return;
      if (result.ok) {
        setPhase("success");
        ctxRef.current.playSuccessSound?.();
      } else if (result.queued) {
        setPhase("queued");
      } else if (result.status === 403) {
        setPhase("invalidCode");
        ctxRef.current.playErrorSound?.();
      } else if (result.status === 404 || result.error === "activity_not_found") {
        setPhase("unknown");
      } else if (result.status === 429) {
        setPhase("cooldown");
      } else if (result.error === "answer_required") {
        setPhase("needsAnswer");
      } else {
        setPhase("error");
        startedRef.current = false; // permite reintentar
      }
    })();
  }, [legacy, activityId, code, activitiesReady, progressReady, activitiesById, registerActivityCompleted, attempt]);

  // Si el catálogo/progreso no llegan (backend caído), no girar para siempre.
  useEffect(() => {
    if (phase !== "validating") return;
    const timer = setTimeout(() => setPhase((p) => (p === "validating" ? "error" : p)), WAIT_LIMIT_MS);
    return () => clearTimeout(timer);
  }, [phase, attempt]);

  // Regreso automático al árbol tras un resultado positivo.
  useEffect(() => {
    if (phase !== "success" && phase !== "already") return;
    const timer = setTimeout(
      () => navigate("/treeoflife", { replace: true, state: phase === "success" ? { insigniaReciente: activity?.name } : undefined }),
      REDIRECT_MS
    );
    return () => clearTimeout(timer);
  }, [phase, activity, navigate]);

  const guardian = activity ? GUARDIANES[activity.name] : null;
  const label = guardian ? t("qr.guardian", { name: guardian.guardian }) : activity?.name || "";

  const retry = () => {
    startedRef.current = false;
    setPhase("validating");
    setAttempt((n) => n + 1);
  };

  const goTree = (state) => navigate("/treeoflife", { replace: true, state });

  const messages = {
    success: { title: guardian ? t("qr.successGuardian", { name: guardian.guardian }) : t("qr.successTitle"), body: t("qr.successBody") },
    already: { title: label, body: t("qr.already") },
    queued: { title: t("qr.queuedTitle"), body: t("qr.queuedBody") },
    invalidCode: { title: t("qr.invalidTitle"), body: t("qr.invalidBody") },
    unknown: { title: t("qr.unknownTitle"), body: t("qr.unknownBody") },
    cooldown: { title: t("qr.cooldownTitle"), body: t("qr.cooldownBody") },
    needsAnswer: { title: t("qr.needsAnswerTitle"), body: t("qr.needsAnswerBody") },
    legacy: { title: t("qr.legacyTitle"), body: t("qr.legacyBody") },
    error: { title: t("qr.errorTitle"), body: t("qr.errorBody") },
  };

  const showGuardian = guardian && (phase === "success" || phase === "already" || phase === "queued");
  const msg = messages[phase];

  return (
    <main
      className="font-apercu"
      style={{
        minHeight: "100dvh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(ellipse at center, #2d1a00 0%, #1a0a00 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, background: "url('/img/fondoPrincipal.webp') center/cover no-repeat", opacity: 0.12 }}
      />

      <AnimatePresence mode="wait">
        {phase === "validating" ? (
          <motion.div
            key="validating"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ textAlign: "center", color: TEXT, zIndex: 10 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                border: "3px solid rgba(247,243,234,0.25)",
                borderTop: `3px solid ${TEXT}`,
                margin: "0 auto 24px",
              }}
            />
            <p style={{ fontSize: 16 }}>{t("qr.validating")}</p>
          </motion.div>
        ) : (
          <motion.div
            key={phase}
            role={phase === "success" ? "status" : "alert"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: "center", zIndex: 10, padding: "0 32px", maxWidth: 420, color: TEXT }}
          >
            {showGuardian && (
              <motion.img
                src={guardian.img}
                alt={guardian.guardian}
                initial={{ scale: 0, opacity: 0, rotate: -10 }}
                animate={{ scale: [0, 1.2, 1], rotate: [0, 5, -3, 0], opacity: 1 }}
                transition={{ duration: 0.8, times: [0, 0.6, 1] }}
                style={{ width: 200, height: 200, objectFit: "contain", margin: "0 auto 24px", display: "block" }}
              />
            )}
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{msg.title}</h1>
            <p style={{ fontSize: 16, lineHeight: 1.45 }}>{msg.body}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 28, alignItems: "center" }}>
              {phase === "error" && (
                <button type="button" onClick={retry} style={btnPrimary}>
                  {t("qr.retry")}
                </button>
              )}
              {phase === "needsAnswer" ? (
                <button type="button" onClick={() => goTree({ open: "xperiencias" })} style={btnPrimary}>
                  {t("qr.openXperiencias")}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => goTree(phase === "success" ? { insigniaReciente: activity?.name } : undefined)}
                  style={phase === "error" ? btnSecondary : btnPrimary}
                >
                  {t("qr.goTree")}
                </button>
              )}
              {(phase === "success" || phase === "already") && (
                <p style={{ fontSize: 13, opacity: 0.85 }}>{t("qr.returning")}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

const btnPrimary = {
  minWidth: 200,
  height: 52,
  borderRadius: 26,
  backgroundColor: "#80A850",
  color: "#F7F3EA",
  fontSize: 18,
  fontWeight: 700,
  border: "none",
  padding: "0 24px",
};

const btnSecondary = {
  ...btnPrimary,
  backgroundColor: "transparent",
  border: "2px solid #F7F3EA",
};
