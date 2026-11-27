import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LanguageToggle from "@/components/LanguageToggle";
import SoundMenu from "@/components/SoundMenu";
import CloseIcon from "@/components/CloseIcon";
import { lazy, Suspense } from "react";
const PrivacyNotice = lazy(() => import("@/pages/PrivacyNotice"));

const IS_DEV = import.meta.env.DEV;

// ─── Solo lo que se ve en la primera pantalla ──────────────────────────────
// El resto se carga por ruta (code-splitting + <img> de cada página).
const FIRST_SCREEN_ASSETS = [
  "/img/fondoHome.webp",
  "/iconos/home.png",
  "/iconos/Logotipo_Xafari_Positivo.png",
  "/iconos/Pictograma_Xafari_Positivo.png",
  "/iconos/menuIdioma.png",
  "/iconos/menuSonido.png",
];
const SPLASH_MAX_MS = 4000; // nunca bloquear más de 4 s aunque la red sea lenta
const SPLASH_MIN_MS = 1200; // lo justo para que el logo se vea

// Assets de las siguientes pantallas: se piden cuando el navegador está libre.
const NEXT_ASSETS = ["/img/fondoPrincipal.webp", "/intro/caverna-1.webp", "/iconos/Textfield.png"];

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = resolve; // continuar a pesar de errores
    img.src = src;
  });
}

export default function Welcome({ showSplashInitial = false }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [infoOpen, setInfoOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  // Estados de Splash integrados
  const [isSplashing, setIsSplashing] = useState(showSplashInitial);
  const [progress, setProgress] = useState(0);
  const [logoVisible, setLogoVisible] = useState(false);

  useEffect(() => {
    if (!isSplashing) return;

    // Mostrar logo inicial con un leve delay
    const fadeTimer = setTimeout(() => setLogoVisible(true), 100);
    return () => clearTimeout(fadeTimer);
  }, [isSplashing]);

  useEffect(() => {
    if (!isSplashing) return undefined;

    let mounted = true;
    let finishTimer = null;
    const startTime = Date.now();
    let loaded = 0;
    const total = FIRST_SCREEN_ASSETS.length;

    const assets = FIRST_SCREEN_ASSETS.map((src) =>
      preloadImage(src).then(() => {
        loaded += 1;
        if (mounted) setProgress(Math.round((loaded / total) * 100));
      })
    );
    const fonts = document.fonts?.ready ?? Promise.resolve();
    const timeout = new Promise((resolve) => setTimeout(resolve, SPLASH_MAX_MS));

    Promise.race([Promise.all([fonts, ...assets]), timeout]).then(() => {
      const remaining = Math.max(0, SPLASH_MIN_MS - (Date.now() - startTime));
      finishTimer = setTimeout(() => {
        if (mounted) setIsSplashing(false);
      }, remaining);
    });

    return () => {
      mounted = false;
      clearTimeout(finishTimer);
    };
  }, [isSplashing]);

  // Precarga diferida de la siguiente pantalla cuando ya terminó el splash.
  useEffect(() => {
    if (isSplashing) return undefined;
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1500));
    const cancel = window.cancelIdleCallback || clearTimeout;
    const id = idle(() => NEXT_ASSETS.forEach((src) => preloadImage(src)));
    return () => cancel(id);
  }, [isSplashing]);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden font-apercu">
      {/* ── Fondo ────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <img
          src="/img/fondoHome.webp"
          alt=""
          className="h-full w-full object-cover object-center"
          draggable={false}
        />
      </div>

      {/* ── Barra superior (Entra con retraso después de cargar) ─────────── */}
      <motion.div
        initial={showSplashInitial ? { opacity: 0, y: -10 } : false}
        animate={!isSplashing ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="relative z-20 flex w-full items-center justify-between px-4 pt-safe mt-3"
      >
        {/* Ícono Home — Xcaret (izquierda) */}
        <div className="w-[52px] h-[52px]">
          <img
            src="/iconos/home.png"
            alt=""
            className="w-full h-full object-contain"
            draggable={false}
          />
        </div>

        {/* Idioma + Sonido (derecha) */}
        <div className="flex items-center gap-0.5">
          <LanguageToggle />
          <SoundMenu />
        </div>
      </motion.div>

      {/* ── Logotipo + tagline ───────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center pt-4 pb-2 px-6">
        {/* Espacio reservado para el logotipo cuando se renderiza en la cabecera */}
        <div className="flex items-center justify-center" style={{ width: "min(344px, 88vw)", aspectRatio: "86 / 25" }}>
          {!isSplashing && (
            <motion.img
              layoutId="xafari-logo-shared"
              src="/iconos/Logotipo_Xafari_Positivo.png"
              alt={t("xafariLogoAlt")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
              draggable={false}
              transition={{
                type: "spring",
                damping: 24,
                stiffness: 90,
              }}
            />
          )}
        </div>

        {/* Badge tagline — Figma: w=305px, h=28px, r=20px, p=4px, bg=#F7F3EA */}
        <motion.div
          initial={showSplashInitial ? { opacity: 0, scale: 0.95 } : false}
          animate={!isSplashing ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="flex flex-row items-center justify-center mt-3"
          style={{
            width: "305px",
            maxWidth: "90vw",
            height: "28px",
            borderRadius: "20px",
            padding: "4px",
            backgroundColor: "#F7F3EA",
          }}
        >
          <p
            className="text-center leading-none m-0"
            style={{
              color: "#4F351D",
              fontFamily: "'Volume TC', sans-serif",
              fontSize: "16px",
              fontWeight: 400,
            }}
          >
            {t("tagline")}
          </p>
        </motion.div>
      </div>

      {/* ── Spacer flexible (imagen de fondo visible) ────────────────────── */}
      <div className="flex-1" />

      {/* ── Botones principales ────────────────────────────────────────── */}
      <motion.div
        initial={showSplashInitial ? { opacity: 0, y: 15 } : false}
        animate={!isSplashing ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.55, duration: 0.6 }}
        className="relative z-10 flex w-full justify-center pb-24"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            width: "256px",
          }}
        >
          {/* Botón 1 — Nueva aventura */}
          <motion.button
            onClick={() => navigate("/intro")}
            whileTap={{ scale: 0.97 }}
            className="font-bold uppercase"
            style={{
              backgroundColor: "#80A850",
              color: "#F7F3EA",
              height: "60px",
              width: "100%",
              borderRadius: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              fontSize: "20px",
              boxShadow: "2px 2px 2px 0px rgba(0,0,0,0.25)",
              border: "none",
            }}
          >
            {t("newAdventure")}
          </motion.button>

          {/* Botón 2 — Ya soy usuario */}
          <motion.button
            onClick={() => navigate("/login")}
            whileTap={{ scale: 0.97 }}
            className="font-bold uppercase"
            style={{
              backgroundColor: "#F4E6C7",
              color: "#4B3621",
              height: "60px",
              width: "100%",
              borderRadius: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              fontSize: "20px",
              boxShadow: "2px 2px 2px 0px rgba(0,0,0,0.25)",
              border: "none",
            }}
          >
            {t("alreadyUser")}
          </motion.button>
        </div>
      </motion.div>

      {/* ── Botones cafés ─────────────────────────────────────────────────── */}
      <motion.div
        initial={showSplashInitial ? { opacity: 0 } : false}
        animate={!isSplashing ? { opacity: 1 } : {}}
        transition={{ delay: 0.65, duration: 0.5 }}
        className="relative z-10 flex w-full items-center justify-between px-6 pb-8"
        style={{ maxWidth: "393px", alignSelf: "center" }}
      >
        <button
          type="button"
          onClick={() => setPrivacyOpen(true)}
          className="flex items-center justify-center font-bold text-[12px] tracking-wide whitespace-nowrap cursor-pointer transition-opacity hover:opacity-90 active:scale-95"
          style={{
            width: "172px",
            height: "35px",
            borderRadius: "20px",
            backgroundColor: "#4B3621",
            color: "#F7F3EA",
            boxShadow: "2px 2px 2px 0px rgba(0,0,0,0.25)",
            border: "none",
          }}
        >
          {t("settingsLegalButton")}
        </button>
        <button
          type="button"
          onClick={() => setInfoOpen(true)}
          className="flex items-center justify-center font-bold text-[12px] tracking-wide whitespace-nowrap cursor-pointer transition-opacity hover:opacity-90 active:scale-95"
          style={{
            width: "155px",
            height: "36px",
            borderRadius: "20px",
            backgroundColor: "#4B3621",
            color: "#F7F3EA",
            boxShadow: "2px 2px 2px 0px rgba(0,0,0,0.25)",
            border: "none",
          }}
        >
          {t("whatIsXafari")}
        </button>
      </motion.div>

      {/* ── [DEV] Debug — acceso directo al escáner ─────────────────────── */}
      {IS_DEV && !isSplashing && (
        <button
          type="button"
          onClick={() => navigate("/debug-scan")}
          className="fixed bottom-4 left-4 z-[9999] flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
          style={{
            backgroundColor: "rgba(0,0,0,0.65)",
            color: "#00ff88",
            border: "1px solid rgba(0,255,136,0.4)",
            backdropFilter: "blur(6px)",
            boxShadow: "0 0 12px rgba(0,255,136,0.2)",
          }}
        >
          <span aria-hidden="true" style={{ fontSize: "10px" }}>📷</span>
          debug scan
        </button>
      )}

      {/* ── Overlay Aviso de Privacidad ── */}
      <AnimatePresence>
        {privacyOpen && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <Suspense fallback={null}>
              <PrivacyNotice onClose={() => setPrivacyOpen(false)} />
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modal "¿Qué es Xafari?" — pixel-perfect Figma ── */}
      <AnimatePresence>
        {infoOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)", padding: "10px" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setInfoOpen(false)}
          >
            <motion.div
              className="relative overflow-hidden"
              style={{
                width: "343px",
                height: "597px",
                backgroundColor: "#F7F3EA",
                borderRadius: "10px",
              }}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* X cerrar — top:16px, right:28px */}
              <button
                type="button"
                onClick={() => setInfoOpen(false)}
                className="absolute bg-transparent border-none cursor-pointer active:scale-90 transition-transform p-0"
                style={{ top: "16px", right: "28px", width: "27px", height: "27px" }}
                aria-label={t("close")}
              >
                <CloseIcon size={27} color="#233C15" />
              </button>

              {/* Título — top:93px, left:28px, width:287px, 40px bold */}
              <h2
                className="absolute text-center font-bold"
                style={{
                  top: "93px",
                  left: "28px",
                  width: "287px",
                  color: "#233C15",
                  fontSize: "40px",
                  fontWeight: 700,
                  lineHeight: "normal",
                }}
              >
                {t("whatIsXafari")}
              </h2>

              {/* Texto — top:166px, left:53px, width:238px, 16px */}
              <div
                className="absolute"
                style={{
                  top: "166px",
                  left: "53px",
                  width: "238px",
                  color: "#233C15",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "1.5",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <p style={{ margin: 0 }}>{t("xafariP1")}</p>
                <p style={{ margin: 0 }}>{t("xafariP2")}</p>
                <p style={{ margin: 0 }}>{t("xafariP3")}</p>
              </div>

              {/* Botón — top:504px, left:80px, 183×44px, radius:15px, #80A850 */}
              <motion.button
                onClick={() => setInfoOpen(false)}
                whileTap={{ scale: 0.97 }}
                className="absolute font-bold border-none cursor-pointer"
                style={{
                  top: "504px",
                  left: "80px",
                  width: "183px",
                  height: "44px",
                  borderRadius: "15px",
                  backgroundColor: "#80A850",
                  color: "#F7F3EA",
                  fontSize: "22px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.25))",
                }}
              >
                {t("readyButton")}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Overlay de Pantalla de Carga (Splash) ────────────────────────── */}
      <AnimatePresence>
        {isSplashing && (
          <motion.div
            key="splash-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
            style={{ backgroundColor: "#233C15" }}
          >
            {/* Contenedor central de Splash */}
            <div className="flex flex-col items-center gap-8">
              {/* Pictograma */}
              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: logoVisible ? 1 : 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6 }}
                src="/iconos/Pictograma_Xafari_Positivo.png"
                alt=""
                className="h-52 w-auto drop-shadow-lg"
                draggable={false}
              />
              
              {/* Logotipo compartido */}
              <motion.img
                layoutId="xafari-logo-shared"
                src="/iconos/Logotipo_Xafari_Positivo.png"
                alt={t("xafariLogoAlt")}
                className="h-16 w-auto drop-shadow-md"
                draggable={false}
                transition={{
                  type: "spring",
                  damping: 24,
                  stiffness: 90,
                }}
              />
            </div>

            {/* Barra de progreso */}
            <motion.div
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute bottom-16 left-0 right-0 flex flex-col items-center gap-3 px-12"
            >
              <div className="w-full max-w-[200px] h-[2px] overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-white/60 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </motion.div>

            {/* Copyright */}
            <motion.p
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute bottom-6 text-center text-[10px] tracking-wide text-white/40 font-apercu px-6"
            >
              {t("footerRights")}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}