import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import XafariContext from "@/components/XafariContext";

const GUARDIAN_DATA = {
  xecreto1:  { guardian: "Mono",      arbol: "/guardianes/Mono Casa Vida.png" },
  xecreto2:  { guardian: "Rana",      arbol: "/guardianes/Rana Casa Agua.png" },
  xecreto3:  { guardian: "Jaguar",    arbol: "/guardianes/Jaguar Casa Sol.png" },
  xecreto4:  { guardian: "Guacamaya", arbol: "/guardianes/Guacamaya Casa Fuego.png" },
  xecreto5:  { guardian: "Serpiente", arbol: "/guardianes/Serpiente Casa Espiral.png" },
  xecreto6:  { guardian: "Venado",    arbol: "/guardianes/Venado Casa Tierra.png" },
  xecreto7:  { guardian: "Búho",      arbol: "/guardianes/Búho Casa Eclipse.png" },
  xecreto8:  { guardian: "Mariposa",  arbol: "/guardianes/Mariposa Casa Viento.png" },
  xecreto9:  { guardian: "Flamenco",  arbol: "/guardianes/Flamenco Casa Sol.png" },
  xecreto10: { guardian: "Coatí",     arbol: "/guardianes/Coati.png" },
};

export default function XecretoDeepLink() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { registerActivityCompleted, playSuccessSound, xecretos } = useContext(XafariContext);

  const [phase, setPhase] = useState("validating"); // "validating" | "success" | "already" | "invalid"
  const [showGuardian, setShowGuardian] = useState(false);

  const guardian = GUARDIAN_DATA[id];
  const isNew = guardian && !xecretos?.[id];

  useEffect(() => {
    if (!guardian) {
      setPhase("invalid");
      setTimeout(() => navigate("/treeoflife"), 3000);
      return;
    }

    // Pequeño delay para que el usuario vea la pantalla de validación
    const t = setTimeout(() => {
      if (isNew) {
        registerActivityCompleted(id);
        if (typeof playSuccessSound === "function") playSuccessSound();
      }
      setPhase(isNew ? "success" : "already");
      setShowGuardian(true);

      // Redirige a treeoflife después de 5 segundos
      setTimeout(() => navigate("/treeoflife"), 5000);
    }, 800);

    return () => clearTimeout(t);
  }, []); // solo al montar

  return (
    <div
      style={{
        minHeight: "100dvh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(ellipse at center, #2d1a00 0%, #1a0a00 100%)",
        fontFamily: "'Apercu Pro', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Fondo animado */}
      <div style={{
        position: "absolute", inset: 0,
        background: "url('/img/fondoPrincipal.jpg') center/cover no-repeat",
        opacity: 0.15,
      }} />

      <AnimatePresence>
        {phase === "validating" && (
          <motion.div
            key="validating"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ textAlign: "center", color: "#f2e8da", zIndex: 10 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              style={{
                width: 56, height: 56, borderRadius: "50%",
                border: "3px solid rgba(242,232,218,0.2)",
                borderTop: "3px solid #f2e8da",
                margin: "0 auto 24px",
              }}
            />
            <p style={{ fontSize: 16, opacity: 0.7 }}>Validando xecreto…</p>
          </motion.div>
        )}

        {(phase === "success" || phase === "already") && guardian && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: "center", zIndex: 10, padding: "0 32px" }}
          >
            {/* Guardián */}
            <AnimatePresence>
              {showGuardian && (
                <motion.img
                  src={guardian.arbol}
                  alt={guardian.guardian}
                  initial={{ scale: 0, opacity: 0, rotate: -10 }}
                  animate={{ scale: [0, 1.2, 1], rotate: [0, 5, -3, 0], opacity: 1 }}
                  transition={{ duration: 0.8, times: [0, 0.6, 1] }}
                  style={{ width: 200, height: 200, objectFit: "contain", margin: "0 auto 24px", display: "block" }}
                />
              )}
            </AnimatePresence>

            {phase === "success" ? (
              <>
                <motion.p
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
                  style={{ fontSize: 22, fontWeight: 700, color: "#f2e8da", marginBottom: 8 }}
                >
                  ¡Guardián {guardian.guardian} descubierto!
                </motion.p>
                <motion.p
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}
                  style={{ fontSize: 14, color: "rgba(242,232,218,0.65)" }}
                >
                  Xecreto registrado ✓
                </motion.p>
              </>
            ) : (
              <>
                <p style={{ fontSize: 20, fontWeight: 700, color: "#f2e8da", marginBottom: 8 }}>
                  Guardián {guardian.guardian}
                </p>
                <p style={{ fontSize: 14, color: "rgba(242,232,218,0.55)" }}>
                  Ya habías descubierto este xecreto
                </p>
              </>
            )}

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
              style={{ fontSize: 12, color: "rgba(242,232,218,0.35)", marginTop: 32 }}
            >
              Regresando al árbol…
            </motion.p>
          </motion.div>
        )}

        {phase === "invalid" && (
          <motion.div
            key="invalid"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: "center", color: "#f2e8da", zIndex: 10, padding: "0 32px" }}
          >
            <p style={{ fontSize: 48, marginBottom: 16 }}>🔮</p>
            <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Xecreto no reconocido</p>
            <p style={{ fontSize: 13, opacity: 0.5 }}>Regresando…</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
