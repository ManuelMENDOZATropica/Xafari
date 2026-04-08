import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import TreeOfLife from "./TreeOfLife";

export default function TutorialArbol() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleContinuar = () => navigate("/treeoflife");

  return (
    <div style={{ position: "relative", width: "100vw", height: "100dvh", overflow: "hidden" }}>

      {/* ── TreeOfLife real, no interactivo (fondo) ─────────────── */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <TreeOfLife />
      </div>

      {/* ── Opaco full-screen encima de TreeOfLife ───────────────── */}
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(0,0,0,0.78)",
        zIndex: 50,
        pointerEvents: "none",
      }} />

      {/* ── Árbol estático — visible POR ENCIMA del opaco ─────────── */}
      <img
        src="/arbol/Arbol de la vida 1.png"
        alt="Árbol de la vida"
        style={{
          position: "absolute",
          top: "5%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "92%",
          maxWidth: "420px",
          objectFit: "contain",
          zIndex: 60,
          pointerEvents: "none",
        }}
      />

      {/* ── Capa interactiva: texto + tuto1 + click ──────────────── */}
      <div
        style={{ position: "absolute", inset: 0, zIndex: 100, pointerEvents: "all" }}
        onClick={handleContinuar}
      >
        {/* Texto "Este es el árbol de la vida" — sobre el árbol */}
        <div style={{
          position: "absolute", top: "56%",
          left: 0, right: 0,
          display: "flex", justifyContent: "center",
        }}>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              color: "#F7F3EA",
              fontSize: "20px",
              fontFamily: "'Volume TC', sans-serif",
              fontWeight: 400,
              lineHeight: "1.3",
              textAlign: "center",
              margin: 0,
              padding: "0 24px",
            }}
          >
            {t("tutorial.arbol") || "¡Este es el árbol de la vida!"}
          </motion.p>
        </div>

        {/* Guacamaya tuto1 — centrada abajo */}
        <div style={{
          position: "absolute", bottom: "-2%",
          left: 0, right: 0,
          display: "flex", justifyContent: "center",
          pointerEvents: "none", zIndex: 110,
        }}>
          <motion.img
            src="/img/tuto1.png"
            alt="Guacamaya"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{ width: "80%", maxWidth: "340px", objectFit: "contain" }}
          />
        </div>

        {/* Toca para continuar */}
        <div style={{
          position: "absolute", bottom: "10px",
          left: 0, right: 0,
          display: "flex", justifyContent: "center",
          pointerEvents: "none", zIndex: 120,
        }}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: 0.8 }}
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: "14px",
              fontFamily: "'Volume TC', sans-serif",
              whiteSpace: "nowrap", margin: 0,
            }}
          >
            {t("tutorial.tap") || "Toca para continuar"}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
