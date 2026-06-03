import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LanguageToggle from "@/components/LanguageToggle";
import SoundMenu from "@/components/SoundMenu";
import CloseIcon from "@/components/CloseIcon";
import PrivacyNotice from "@/pages/PrivacyNotice";
import { preloadGlyphModel } from "@/hooks/useGlyphRecognizer";

const IS_DEV =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.port === "5173" ||
  window.location.port === "5174" ||
  /^192\.168\.|^10\.|^172\.(1[6-9]|2\d|3[01])\./.test(window.location.hostname);

// ─── Inventario completo de assets gráficos ─────────────────────────────────
const ALL_ASSETS = [
  // Iconografía UI
  "/iconos/Logotipo_Xafari_Positivo.png",
  "/iconos/Logotipo_Xafari_Positivo.svg",
  "/iconos/Pictograma_Xafari_Positivo.png",
  "/iconos/Pictograma_Xafari_Positivo.svg",
  "/iconos/cambioIdioma.png",
  "/iconos/checklist.png",
  "/iconos/experiencias.png",
  "/iconos/home.png",
  "/iconos/menuIdioma.png",
  "/iconos/menuSonido.png",
  "/iconos/icon_ajustes.svg",
  "/iconos/icon_regresar.svg",
  "/iconos/icon_toque.png",
  "/iconos/icon_toqueBlanco.png",
  "/iconos/icon_volumen0.png",
  "/iconos/icon_volumen1.svg",
  "/iconos/icon_volumen2.svg",
  "/iconos/icon_volumen3.svg",
  "/iconos/menuAjuste.png",
  "/iconos/menuArbol.png",
  "/iconos/menuMapa.png",
  "/iconos/menuPodio.png",
  "/iconos/perfil.png",
  "/iconos/podium.png",
  "/iconos/xecretos.png",
  "/iconos/xelfies.png",
  "/iconos/xperiencias.png",

  // Imágenes de fondo y escenarios
  "/img/fondoPrincipal.jpg",
  "/img/fondoHome.png",
  "/img/Fondo_Inicio_.jpg",
  "/img/Fondo_Paisaje_Ríos_Xcaret.jpg",
  "/img/Fondo_Selva_Con_Flores.jpg",
  "/img/xcaret.jpg",
  "/img/Flores.png",

  // Árbol de la vida — bases
  "/arbol/baseArbol.png",
  "/arbol/baseArbolv2.png",
  "/arbol/baseArbolv3.png",

  // Árbol — flores
  "/arbol/floresÁrbol/FLORES_1.png",
  "/arbol/floresÁrbol/FLORES_2.png",
  "/arbol/floresÁrbol/FLORES_3.png",
  "/arbol/floresÁrbol/FLORES_4.png",
  "/arbol/floresÁrbol/FLORES_5.png",
  "/arbol/floresÁrbol/FLORES_6.png",
  "/arbol/floresÁrbol/FLORES_7.png",
  "/arbol/floresÁrbol/FLORES_8.png",
  "/arbol/floresÁrbol/FLORES_9.png",
  "/arbol/floresÁrbol/FLORES_10.png",

  // Árbol — guardianes
  "/arbol/guardianes/Mono Casa Vida.png",
  "/arbol/guardianes/Rana Casa Agua.png",
  "/arbol/guardianes/Jaguar Casa Sol.png",
  "/arbol/guardianes/Guacamaya Casa Fuego.png",
  "/arbol/guardianes/Serpiente Casa Espiral.png",
  "/arbol/guardianes/Venado Casa Tierra.png",
  "/arbol/guardianes/Búho Casa Eclipse.png",
  "/arbol/guardianes/Mariposa Casa Viento.png",
  "/arbol/guardianes/Flamenco Casa Sol.png",
  "/arbol/guardianes/Coatí Casa Luna.png.png",

  // Árbol — insignias Xtop
  "/arbol/xtop/Insignia Xiquit inn.png",
  "/arbol/xtop/Insignia Muluk spa.png",
  "/arbol/xtop/Insignia Lunateca.png",
  "/arbol/xtop/Insignia Pava Jarla.png",
  "/arbol/xtop/Insignias Dixtrito 1317.png",
  "/arbol/xtop/Insignia Kayak.png",
  "/arbol/xtop/Insignia Paxanguería.png",
  "/arbol/xtop/Insignia Patín.png",
  "/arbol/xtop/Insignia Rooftop Fuego.png",
  "/arbol/xtop/Insignia pool poh.png",
  "/arbol/xtop/Insignia infinity pool.png",
  "/arbol/xtop/Insignia Teatro del Río.png",
  "/arbol/xtop/Insignia Tobogan Arboloco.png",
  "/arbol/xtop/Insignia Bar las maquinitas.png",
  "/arbol/xtop/Insignia Vinil.png",
  "/arbol/xtop/Insignias Xoberte.png",
  "/arbol/xtop/Insignia Xpiral.png",

  // Árbol — checklist gastro
  "/arbol/checklist/acai.png",
  "/arbol/checklist/carne.png",
  "/arbol/checklist/ceviche.png",
  "/arbol/checklist/coctel.png",
  "/arbol/checklist/corunda.png",
  "/arbol/checklist/espada.png",
  "/arbol/checklist/mezcal.png",
  "/arbol/checklist/mimosa.png",
  "/arbol/checklist/nogada.png",
  "/arbol/checklist/ostion.png",
  "/arbol/checklist/paleta.png",
  "/arbol/checklist/palomitas.png",
  "/arbol/checklist/panucho.png",
  "/arbol/checklist/quesadillas.png",
  "/arbol/checklist/quesos.png",
  "/arbol/checklist/ramen.png",
  "/arbol/checklist/ravioli.png",
  "/arbol/checklist/sushi.png",
  "/arbol/checklist/torta.png",
  "/arbol/checklist/tostada.png",

  // Guardianes — cards principales
  "/guardianes/GuardianBuho.png",
  "/guardianes/GuardianCoati.png",
  "/guardianes/GuardianFlamenco.png",
  "/guardianes/GuardianGuacamaya.png",
  "/guardianes/GuardianJaguar.png",
  "/guardianes/GuardianMariposa.png",
  "/guardianes/GuardianMono.png",
  "/guardianes/GuardianRana.png",
  "/guardianes/GuardianSerpiente.png",
  "/guardianes/GuardianVenado.png",

  // Maya — guardianes
  "/maya/GuardianBuho.png",
  "/maya/GuardianCoati.png",
  "/maya/GuardianFlamenco.png",
  "/maya/GuardianGuacamaya.png",
  "/maya/GuardianJaguar.png",
  "/maya/GuardianMariposa.png",
  "/maya/GuardianMono.png",
  "/maya/GuardianRana.png",
  "/maya/GuardianSerpiente.png",
  "/maya/GuardianVenado.png",

  // Maya — nahuales con nombre completo
  "/maya/Búho Casa Eclipse.png",
  "/maya/Coati.png",
  "/maya/Flamenco Casa Sol.png",
  "/maya/Guacamaya Casa Fuego.png",
  "/maya/Jaguar Casa Sol.png",
  "/maya/Mariposa Casa Viento.png",
  "/maya/Mono Casa Vida.png",
  "/maya/Rana Casa Agua.png",
  "/maya/Serpiente Casa Espiral.png",
  "/maya/Venado Casa Tierra.png",

  // Maya — tutorial
  "/maya/1.png",
  "/maya/2.png",
  "/maya/3.png",
  "/maya/4.png",
  "/maya/5.png",
  "/maya/6.png",
  "/maya/7.png",
  "/maya/8.png",
  "/maya/9.png",
  "/maya/10.png",

  // Avatares — caras
  "/avatares/cara (1).png",
  "/avatares/cara (2).png",
  "/avatares/cara (3).png",
  "/avatares/cara (4).png",
  "/avatares/cara (5).png",
  "/avatares/cara (6).png",
  "/avatares/cara (7).png",
  "/avatares/cara (8).png",
  "/avatares/cara (9).png",
  "/avatares/cara (10).png",
  "/avatares/cara (11).png",
  "/avatares/cara (12).png",
  "/avatares/cara (13).png",
  "/avatares/cara (14).png",
  "/avatares/cara (15).png",
  "/avatares/cara (16).png",
  "/avatares/cara (17).png",
  "/avatares/cara (18).png",
  "/avatares/cara (19).png",
  "/avatares/cara (20).png",
  "/avatares/cara (21).png",
  "/avatares/cara (22).png",
  "/avatares/cara (23).png",

  // Avatares — expresiones
  "/avatares/expresiones/expresion (1).png",
  "/avatares/expresiones/expresion (2).png",
  "/avatares/expresiones/expresion (3).png",
  "/avatares/expresiones/expresion (4).png",
  "/avatares/expresiones/expresion (5).png",
  "/avatares/expresiones/expresion (6).png",
  "/avatares/expresiones/expresion (7).png",
  "/avatares/expresiones/expresion (8).png",
  "/avatares/expresiones/expresion (9).png",
  "/avatares/expresiones/expresion (10).png",
  "/avatares/expresiones/expresion (11).png",
  "/avatares/expresiones/expresion (12).png",
  "/avatares/expresiones/expresion (13).png",
  "/avatares/expresiones/expresion (14).png",

  // Avatares — cuerpos
  "/avatares/cuerpoAdulto.png",
  "/avatares/cuerpoAdultoIcono.png",
  "/avatares/cuerpoNiño.png",
  "/avatares/cuerpoNiñoIcono.png",

  // Insignias Checklist
  "/insigniasChecklist/acai.png",
  "/insigniasChecklist/carne.png",
  "/insigniasChecklist/ceviche.png",
  "/insigniasChecklist/coctel.png",
  "/insigniasChecklist/corunda.png",
  "/insigniasChecklist/espada.png",
  "/insigniasChecklist/mezcal.png",
  "/insigniasChecklist/mimosa.png",
  "/insigniasChecklist/nogada.png",
  "/insigniasChecklist/ostion.png",
  "/insigniasChecklist/paleta.png",
  "/insigniasChecklist/palomitas.png",
  "/insigniasChecklist/panucho.png",
  "/insigniasChecklist/quesadillas.png",
  "/insigniasChecklist/quesos.png",
  "/insigniasChecklist/ramen.png",
  "/insigniasChecklist/ravioli.png",
  "/insigniasChecklist/sushi.png",
  "/insigniasChecklist/torta.png",
  "/insigniasChecklist/tostada.png",

  // Insignias Xtop (pantalla grande)
  "/insigniasXtop/camion.png",
  "/insigniasXtop/caracola.png",
  "/insigniasXtop/conejo.png",
  "/insigniasXtop/drink.png",
  "/insigniasXtop/estrella.png",
  "/insigniasXtop/kayak.png",
  "/insigniasXtop/mascarajaguar.png",
  "/insigniasXtop/patin.png",
  "/insigniasXtop/piscina.png",
  "/insigniasXtop/poolpo.png",
  "/insigniasXtop/salvavidas.png",
  "/insigniasXtop/teatro.png",
  "/insigniasXtop/tobogan.png",
  "/insigniasXtop/tv.png",
  "/insigniasXtop/vinil.png",
  "/insigniasXtop/xorbeteria.png",
  "/insigniasXtop/xpiral.png",

  // Instrucciones Xecretos
  "/instruccionesXecretos/descubre.png",
  "/instruccionesXecretos/escanea.png",
  "/instruccionesXecretos/pista.png",

  // Intro — caverna
  "/intro/caverna (1).jpg",
  "/intro/caverna (2).jpg",
  "/intro/caverna (3).jpg",
  "/intro/caverna (4).jpg",
  "/intro/caverna (5).jpg",
  "/intro/caverna (6).jpg",

  // Mapa
  "/mapa/mapa.png",

  // Xecretos
  "/xecretos/XecretoVenado.jpg",

  // Sonidos
  "/sounds/Button1.mp3",
  "/sounds/Button2.mp3",
  "/sounds/chimes.ogg",
  "/sounds/click_2.ogg",
  "/sounds/click_3.ogg",
  "/sounds/forest.mp3",
  "/sounds/negative_sound.ogg",
];

// ─── Preload de una imagen individual ───────────────────────────────────────
function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = resolve;
    img.onerror = resolve; // continuar a pesar de errores
  });
}

// ─── Preload de audio individual ────────────────────────────────────────────
function preloadAudio(src) {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.preload = "auto";
    audio.src = src;
    audio.oncanplaythrough = resolve;
    audio.onerror = resolve;
    setTimeout(resolve, 3000); // Fallback timeout
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
    if (!isSplashing) return;

    let mounted = true;
    const startTime = Date.now();
    const MIN_DISPLAY = 2800; // ms mínimos que se muestra el splash

    const run = async () => {
      const total = ALL_ASSETS.length;
      let loaded = 0;

      // Preload de fuentes
      const fontReady = document.fonts?.ready ?? Promise.resolve();

      // Preload del modelo de reconocimiento de glifos
      const glyphModelReady = preloadGlyphModel().catch((err) => {
        console.warn("⚠️ Glyph model preload failed:", err.message);
      });

      // Lanzar todos los preloads de assets en paralelo
      const assetPromises = ALL_ASSETS.map((src) => {
        const isAudio = /\.(mp3|wav|ogg|aac)$/i.test(src);
        const promise = isAudio ? preloadAudio(src) : preloadImage(src);
        return promise.then(() => {
          loaded += 1;
          if (mounted) {
            setProgress(Math.round((loaded / total) * 100));
          }
        });
      });

      await Promise.all([fontReady, glyphModelReady, ...assetPromises]);

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_DISPLAY - elapsed);

      setTimeout(() => {
        if (mounted) {
          setIsSplashing(false);
        }
      }, remaining);
    };

    run();
    return () => {
      mounted = false;
    };
  }, [isSplashing]);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden font-apercu">
      {/* ── Fondo ────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <img
          src="/img/fondoHome.png"
          alt={t("welcomeBackgroundAlt")}
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
            alt="Inicio"
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
          Aviso de privacidad
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
          ¿Qué es Xafari?
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
          <span style={{ fontSize: "10px" }}>📷</span>
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
            <PrivacyNotice onClose={() => setPrivacyOpen(false)} />
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
                alt={t("xafariPictogramAlt")}
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