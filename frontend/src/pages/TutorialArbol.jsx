import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import TreeOfLife from "./TreeOfLife";
import XperienciasXtop from "@/components/XperienciasXtop";
import Xelfies from "@/components/xelfies";

export default function TutorialArbol() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const handleTap = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      navigate("/treeoflife");
    }
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100dvh", overflow: "hidden" }}>

      {/* ── TreeOfLife real, no interactivo (fondo) ─────────────── */}
      <div className="tutorial-tree-bg" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <style>{`
          .tutorial-tree-bg .z-10,
          .tutorial-tree-bg .z-30,
          .tutorial-tree-bg .z-40 { display: none !important; }
        `}</style>
        <TreeOfLife />
      </div>

      {/* ── Overlay oscuro ──────────────────────────────────────── */}
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(0,0,0,0.78)",
        zIndex: 50,
        pointerEvents: "none",
      }} />

      {/* ════════════════════════════════════════════════════════════
          PASO 0 — Árbol destacado + texto
          ════════════════════════════════════════════════════════════ */}
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ position: "absolute", inset: 0, zIndex: 55, pointerEvents: "none" }}
          >
            <img
              src="/arbol/Arbol de la vida 1.png"
              alt="Árbol de la vida"
              style={{
                position: "absolute",
                top: "10%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "92%",
                maxWidth: "420px",
                objectFit: "contain",
              }}
            />
            <div style={{
              position: "absolute", top: "12%",
              left: 0, right: 0,
              display: "flex", justifyContent: "center",
            }}>
              <p style={{
                color: "#F7F3EA",
                fontSize: "20px",
                fontFamily: "'Volume TC', sans-serif",
                fontWeight: 400,
                lineHeight: "1.3",
                textAlign: "center",
                margin: 0,
                padding: "0 24px",
              }}>
                {t("tutorial.arbol") || "¡Este es el árbol de la vida!"}
              </p>
            </div>
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════════════
            PASO 1 — Modal Xperiencias + submenú + nav (réplica exacta)
            ════════════════════════════════════════════════════════════ */}
        {step === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ position: "absolute", inset: 0, zIndex: 60, pointerEvents: "none" }}
          >
            {/* ── Panel modal Xperiencias (réplica de TreeOfLife) ── */}
            <div
              className="absolute top-[8%] left-[12px] right-[12px]"
              style={{ bottom: "calc(2vh + 160px)" }}
            >
              <div className="relative h-full w-full rounded-t-3xl overflow-hidden bg-[#7b5226]">
                <XperienciasXtop onClose={() => {}} />
              </div>
            </div>

            {/* ── Barra inferior: submenú + nav (réplica de TreeOfLife) ── */}
            <div
              className="fixed bottom-0 left-0 right-0 pb-[2vh] pt-3 bg-transparent"
              style={{ zIndex: 62 }}
            >
              <div className="flex flex-col items-center gap-3 px-3 w-full">

                {/* Submenú: Xperiencias / Xelfies / Xecretos */}
                <div className="w-full flex justify-center">
                  <div className="flex items-stretch gap-0 rounded-2xl bg-[#7b5226] text-white shadow-xl max-w-3xl w-full justify-center overflow-hidden">
                    {[
                      { key: "xperiencias", label: "Xperiencias", icon: "/iconos/xperiencias.png", selected: true },
                      { key: "xelfies",     label: "Xelfies",     icon: "/iconos/xelfies.png",     selected: false },
                      { key: "xecretos",    label: "Xecretos",    icon: "/iconos/xecretos.png",    selected: false },
                    ].map(({ key, label, icon, selected }) => (
                      <div
                        key={key}
                        className="flex flex-1 flex-col items-center justify-center gap-1 px-4 py-2 text-white"
                        style={{ backgroundColor: selected ? "rgba(0,0,0,0.30)" : "transparent" }}
                      >
                        <img src={icon} alt={label} className="object-contain" style={{ width: "34px", height: "34px" }} />
                        <span style={{ fontFamily: "'Volume TC Sans', sans-serif" }} className="text-sm tracking-wide">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nav: Árbol / Mapa / Podio / Ajustes */}
                <div className="grid grid-cols-4 gap-2 w-full" style={{ opacity: 0.5 }}>
                  {[
                    { key: "arbol",   label: "Árbol",   icon: "/iconos/icono arbol.png",   active: true },
                    { key: "mapa",    label: "Mapa",    icon: "/iconos/icono Mapa.png",    active: false },
                    { key: "podio",   label: "Podio",   icon: "/iconos/icono Podio.png",   active: false },
                    { key: "ajustes", label: "Ajustes", icon: "/iconos/icono Ajustes.png", active: false },
                  ].map(({ key, label, icon, active }) => (
                    <div
                      key={key}
                      className="flex flex-col items-center shadow-lg text-white w-full"
                      style={{
                        backgroundColor: active ? "rgba(35, 60, 21, 1)" : "#80A850",
                        aspectRatio: "1 / 1.38",
                        borderRadius: "10px",
                        paddingTop: "6px",
                        paddingLeft: "6px",
                        paddingRight: "6px",
                      }}
                    >
                      <div className="flex flex-1 items-center justify-center w-full">
                        <img src={icon} alt={label} className="w-full object-contain" style={{ maxHeight: "85%" }} />
                      </div>
                      <span
                        style={{ fontFamily: "'Volume TC Sans', sans-serif", fontSize: "14px", lineHeight: "1", paddingBottom: "4px" }}
                        className="w-full text-center"
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* ── Rectángulo descriptivo centrado sobre el modal ── */}
            <div style={{
              position: "absolute",
              top: "8%",
              left: "12px",
              right: "12px",
              bottom: "calc(2vh + 160px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 65,
            }}>
              <div style={{
                backgroundColor: "rgba(0,0,0,0.92)",
                borderRadius: 0,
                padding: "28px 24px",
                width: "100%",
              }}>
                <p style={{
                  color: "#F7F3EA",
                  fontSize: "16px",
                  fontFamily: "'Volume TC', sans-serif",
                  fontWeight: 400,
                  lineHeight: "1.5",
                  margin: 0,
                  marginBottom: "16px",
                }}>
                  Texto descriptivo sobre las actividades que se encuentran aquí y la mecánica para obtenerlos.
                </p>
                <p style={{
                  color: "#F7F3EA",
                  fontSize: "16px",
                  fontFamily: "'Volume TC', sans-serif",
                  fontWeight: 600,
                  lineHeight: "1.5",
                  margin: 0,
                }}>
                  Call to Action.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════════════
            PASO 2 — Modal Xelfies + submenú + nav
            ════════════════════════════════════════════════════════════ */}
        {step === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ position: "absolute", inset: 0, zIndex: 60, pointerEvents: "none" }}
          >
            {/* ── Panel modal Xelfies ── */}
            <div
              className="absolute top-[8%] left-[12px] right-[12px]"
              style={{ bottom: "calc(2vh + 160px)" }}
            >
              <div className="relative h-full w-full rounded-t-3xl overflow-hidden bg-[#7b5226]">
                <Xelfies onClose={() => {}} />
              </div>
            </div>

            {/* ── Barra inferior: submenú + nav ── */}
            <div
              className="fixed bottom-0 left-0 right-0 pb-[2vh] pt-3 bg-transparent"
              style={{ zIndex: 62 }}
            >
              <div className="flex flex-col items-center gap-3 px-3 w-full">

                {/* Submenú: Xelfies seleccionado */}
                <div className="w-full flex justify-center">
                  <div className="flex items-stretch gap-0 rounded-2xl bg-[#7b5226] text-white shadow-xl max-w-3xl w-full justify-center overflow-hidden">
                    {[
                      { key: "xperiencias", label: "Xperiencias", icon: "/iconos/xperiencias.png", selected: false },
                      { key: "xelfies",     label: "Xelfies",     icon: "/iconos/xelfies.png",     selected: true },
                      { key: "xecretos",    label: "Xecretos",    icon: "/iconos/xecretos.png",    selected: false },
                    ].map(({ key, label, icon, selected }) => (
                      <div
                        key={key}
                        className="flex flex-1 flex-col items-center justify-center gap-1 px-4 py-2 text-white"
                        style={{ backgroundColor: selected ? "rgba(0,0,0,0.30)" : "transparent" }}
                      >
                        <img src={icon} alt={label} className="object-contain" style={{ width: "34px", height: "34px" }} />
                        <span style={{ fontFamily: "'Volume TC Sans', sans-serif" }} className="text-sm tracking-wide">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nav con opacidad */}
                <div className="grid grid-cols-4 gap-2 w-full" style={{ opacity: 0.5 }}>
                  {[
                    { key: "arbol",   label: "Árbol",   icon: "/iconos/icono arbol.png",   active: true },
                    { key: "mapa",    label: "Mapa",    icon: "/iconos/icono Mapa.png",    active: false },
                    { key: "podio",   label: "Podio",   icon: "/iconos/icono Podio.png",   active: false },
                    { key: "ajustes", label: "Ajustes", icon: "/iconos/icono Ajustes.png", active: false },
                  ].map(({ key, label, icon, active }) => (
                    <div
                      key={key}
                      className="flex flex-col items-center shadow-lg text-white w-full"
                      style={{
                        backgroundColor: active ? "rgba(35, 60, 21, 1)" : "#80A850",
                        aspectRatio: "1 / 1.38",
                        borderRadius: "10px",
                        paddingTop: "6px",
                        paddingLeft: "6px",
                        paddingRight: "6px",
                      }}
                    >
                      <div className="flex flex-1 items-center justify-center w-full">
                        <img src={icon} alt={label} className="w-full object-contain" style={{ maxHeight: "85%" }} />
                      </div>
                      <span
                        style={{ fontFamily: "'Volume TC Sans', sans-serif", fontSize: "14px", lineHeight: "1", paddingBottom: "4px" }}
                        className="w-full text-center"
                      >
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* ── Rectángulo descriptivo centrado ── */}
            <div style={{
              position: "absolute",
              top: "8%",
              left: "12px",
              right: "12px",
              bottom: "calc(2vh + 160px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 65,
            }}>
              <div style={{
                backgroundColor: "rgba(0,0,0,0.92)",
                borderRadius: 0,
                padding: "28px 24px",
                width: "100%",
              }}>
                <p style={{
                  color: "#F7F3EA",
                  fontSize: "16px",
                  fontFamily: "'Volume TC', sans-serif",
                  fontWeight: 400,
                  lineHeight: "1.5",
                  margin: 0,
                  marginBottom: "16px",
                }}>
                  Texto descriptivo sobre las actividades que se encuentran aquí y la mecánica para obtenerlos.
                </p>
                <p style={{
                  color: "#F7F3EA",
                  fontSize: "16px",
                  fontFamily: "'Volume TC', sans-serif",
                  fontWeight: 600,
                  lineHeight: "1.5",
                  margin: 0,
                }}>
                  Call to Action.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Capa interactiva: tuto + tap ───────────────────────── */}
      <div
        style={{ position: "absolute", inset: 0, zIndex: 100, pointerEvents: "all" }}
        onClick={handleTap}
      >
        {/* Guacamaya */}
        <div style={{
          position: "absolute", bottom: step === 1 ? "-18%" : "-2%",
          left: 0, right: 0,
          display: "flex", justifyContent: step === 2 ? "flex-end" : "center",
          pointerEvents: "none", zIndex: 110,
        }}>
          <AnimatePresence mode="wait">
            <motion.img
              key={`tuto${step + 1}`}
              src={`/img/tuto${step + 1}.png`}
              alt="Guacamaya"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              style={{
                width: step === 2 ? "59%" : "80%",
                maxWidth: step === 2 ? "252px" : "340px",
                objectFit: "contain",
                marginRight: step === 2 ? "-15%" : undefined,
              }}
            />
          </AnimatePresence>
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
