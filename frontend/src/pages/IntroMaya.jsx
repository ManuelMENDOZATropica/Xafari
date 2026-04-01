import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

export default function IntroMaya() {
  const { t, i18n } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const steps = useMemo(
    () => [
      {
        image: "/maya/saltando.png",
        alt: t("introMaya.slide1Alt"),
        text: t("introMaya.slide1Text"),
      },
      {
        image: "/maya/curiosa.png",
        alt: t("introMaya.slide2Alt"),
        text: t("introMaya.slide2Text"),
      },
    ],
    [t, i18n.language]
  );

  // Auto-avance: slide 0 → slide 1 a los 4 segundos
  useEffect(() => {
    if (currentStep !== 0) return;
    const timer = setTimeout(() => setCurrentStep(1), 4000);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const isLast = currentStep === steps.length - 1;

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen w-screen overflow-hidden font-apercu"
      style={{ backgroundColor: "rgba(53, 36, 22, 1)" }}
    >
      <div className="flex flex-col items-center justify-center gap-8 px-6 w-full max-w-md">

        {/* Contenedor FIJO de imagen — evita layout shift al cargar nueva imagen */}
        <div style={{
          position: "relative",
          width: "100%",
          height: "50vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <AnimatePresence mode="wait">
            <motion.img
              key={`img-${currentStep}`}
              src={steps[currentStep].image}
              alt={steps[currentStep].alt}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              style={{
                position: "absolute",
                maxHeight: "100%",
                maxWidth: "100%",
                objectFit: "contain",
              }}
            />
          </AnimatePresence>
        </div>

        {/* Contenedor de texto con imagen de fondo */}
        <div
          style={{
            position: "relative",
            width: "313px",
            height: "140px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <img
            src="/intro/contenedorTextoIntro.png"
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "fill",
            }}
            draggable={false}
          />
          <AnimatePresence mode="wait">
            <motion.p
              key={`text-${currentStep}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: "relative",
                zIndex: 1,
                color: "#F7F3EA",
                fontSize: "20px",
                fontFamily: "'Volume TC', sans-serif",
                fontWeight: 400,
                lineHeight: "1",
                letterSpacing: "0",
                textAlign: "center",
                margin: 0,
                padding: "16px 24px",
              }}
            >
              {steps[currentStep].text}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Botón solo en la última slide */}
        <AnimatePresence>
          {isLast && (
            <motion.button
              type="button"
              onClick={() => navigate("/register")}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              whileTap={{ scale: 0.97 }}
              style={{
                width: "200px",
                height: "60px",
                borderRadius: "30px",
                backgroundColor: "#80A850",
                color: "#F7F3EA",
                fontSize: "24px",
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                boxShadow: "3.2px 3.2px 3.2px 0px rgba(0,0,0,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {t("intro.continue") || "Continuar"}
            </motion.button>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
