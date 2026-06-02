import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { preloadGlyphModel } from "@/hooks/useGlyphRecognizer";

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
  "/arbol/xtopÁrbol/camion.png",
  "/arbol/xtopÁrbol/caracola.png",
  "/arbol/xtopÁrbol/conejo.png",
  "/arbol/xtopÁrbol/drink.png",
  "/arbol/xtopÁrbol/estrella.png",
  "/arbol/xtopÁrbol/kayak.png",
  "/arbol/xtopÁrbol/mascarajaguar.png",
  "/arbol/xtopÁrbol/patin.png",
  "/arbol/xtopÁrbol/piscina.png",
  "/arbol/xtopÁrbol/poolpo.png",
  "/arbol/xtopÁrbol/salvavidas.png",
  "/arbol/xtopÁrbol/teatro.png",
  "/arbol/xtopÁrbol/tobogan.png",
  "/arbol/xtopÁrbol/tv.png",
  "/arbol/xtopÁrbol/vinil.png",
  "/arbol/xtopÁrbol/xorbeteria.png",
  "/arbol/xtopÁrbol/xpiral.png",

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
    img.onerror = resolve; // nunca rechazar, solo continuar
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
    // Fallback por si el evento nunca dispara
    setTimeout(resolve, 3000);
  });
}

export default function SplashScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);
  const [logoVisible, setLogoVisible] = useState(false);

  useEffect(() => {
    // Fade in del logo al montar
    const fadeTimer = setTimeout(() => setLogoVisible(true), 100);
    return () => clearTimeout(fadeTimer);
  }, []);

  useEffect(() => {
    let mounted = true;
    const startTime = Date.now();
    const MIN_DISPLAY = 2800; // ms mínimos que se muestra el splash

    const run = async () => {
      const total = ALL_ASSETS.length;
      let loaded = 0;

      // Preload de fuentes
      const fontReady = document.fonts?.ready ?? Promise.resolve();

      // Preload del modelo de reconocimiento de glifos (en paralelo)
      const glyphModelReady = preloadGlyphModel().catch((err) => {
        console.warn("⚠️ Glyph model preload failed (will retry later):", err.message);
      });

      // Lanzar todos los preloads en paralelo, actualizando el progreso
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
        if (mounted) navigate("/welcome", { replace: true });
      }, remaining);
    };

    run();
    return () => { mounted = false; };
  }, [navigate]);

  return (
    <div
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#233C15" }} // bg-primary
    >
      {/* ── Logotipo centrado ─────────────────────────────────────────── */}
      <div
        className="flex flex-col items-center gap-8 transition-opacity duration-700"
        style={{ opacity: logoVisible ? 1 : 0 }}
      >
        <img
          src="/iconos/Pictograma_Xafari_Positivo.png"
          alt={t("xafariPictogramAlt")}
          className="h-52 w-auto drop-shadow-lg"
          draggable={false}
        />
        <img
          src="/iconos/Logotipo_Xafari_Positivo.png"
          alt={t("xafariLogoAlt")}
          className="h-16 w-auto drop-shadow-md"
          draggable={false}
        />
      </div>

      {/* ── Barra de progreso (sutil, en la parte inferior) ──────────── */}
      <div className="absolute bottom-16 left-0 right-0 flex flex-col items-center gap-3 px-12">
        <div className="w-full max-w-[200px] h-[2px] overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-white/60 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ── Copyright ─────────────────────────────────────────────────── */}
      <p className="absolute bottom-6 text-center text-[10px] tracking-wide text-white/40 font-apercu px-6">
        {t("footerRights")}
      </p>
    </div>
  );
}
