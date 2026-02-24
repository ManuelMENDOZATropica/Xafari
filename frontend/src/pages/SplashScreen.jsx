import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ALL_ASSETS = [
  // Iconos
  "/iconos/Logotipo_Xafari_Positivo.png",
  "/iconos/Pictograma_Xafari_Positivo.png",
  "/iconos/cambioIdioma.png",
  "/iconos/checklist.png",
  "/iconos/experiencias.png",
  "/iconos/menuAjuste.png",
  "/iconos/menuArbol.png",
  "/iconos/menuMapa.png",
  "/iconos/menuPodio.png",
  "/iconos/perfil.png",
  "/iconos/podium.png",
  "/iconos/xecretos.png",
  "/iconos/xelfies.png",
  "/iconos/xperiencias.png",
  // Img
  "/img/V03-CERRITOS.jpg",
  "/img/fondoArbolDeLaVida.png",
  "/img/fondoPrincipal.jpg",
  // Guardianes
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
  // Arbol
  "/arbol/baseArbol.png",
  "/arbol/baseArbolv2.png",
  "/arbol/baseArbolv3.png",
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
  "/arbol/guardianesÁrbol/buho.png",
  "/arbol/guardianesÁrbol/coati.png",
  "/arbol/guardianesÁrbol/flamenco.png",
  "/arbol/guardianesÁrbol/guacamaya.png",
  "/arbol/guardianesÁrbol/jaguar.png",
  "/arbol/guardianesÁrbol/mariposa.png",
  "/arbol/guardianesÁrbol/mono.png",
  "/arbol/guardianesÁrbol/rana.png",
  "/arbol/guardianesÁrbol/serpiente.png",
  "/arbol/guardianesÁrbol/venado.png",
  // Tutorial
  "/maya/tutorial/1.png",
  "/maya/tutorial/2.png",
  // Intro
  "/intro/001 ARBOL.jpg",
  "/intro/002 GUARDIANES.jpg",
  "/intro/003 CELEBRACION.jpg",
  "/intro/004 ELEMENTOS.jpg",
  "/intro/005 RAMA.jpg",
  "/intro/006 VIAJE.jpg",
  "/intro/007 FIN.jpg",
  "/intro/alaMaya.png",
  // Mapa
  "/mapa/mapa.png",
  // Xecretos
  "/xecretos/XecretoVenado.jpg",
];

export default function SplashScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    let mounted = true;
    const startTime = Date.now();
    const minDelay = 2500; // Garantizar que se vea la pantalla al menos 2.5s

    const preloadAssets = async () => {
      // 1. Assets
      const assetPromises = ALL_ASSETS.map((src) => {
        return new Promise((resolve) => {
          if (src.match(/\.(png|jpg|jpeg|svg|webp|gif)$/i)) {
            const img = new Image();
            img.src = src;
            img.onload = resolve;
            img.onerror = resolve;
          } else if (src.match(/\.(mp3|wav|ogg)$/i)) {
            const audio = new Audio();
            audio.src = src;
            audio.oncanplaythrough = resolve;
            audio.onerror = resolve;
          } else {
            resolve();
          }
        });
      });

      // 2. Preload Fonts
      const fontPromises = [];
      if (document.fonts) {
        fontPromises.push(document.fonts.ready);
      }

      // Track progress
      let loadedCount = 0;
      assetPromises.forEach((promise) => {
        promise.then(() => {
          loadedCount++;
          if (mounted) {
            setLoadingProgress(Math.round((loadedCount / ALL_ASSETS.length) * 100));
          }
        });
      });

      await Promise.all([...assetPromises, ...fontPromises]);

      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minDelay - elapsedTime);

      setTimeout(() => {
        if (mounted) {
          navigate("/welcome", { replace: true });
        }
      }, remainingTime);
    };

    preloadAssets();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 py-10 text-white">
      <div className="flex flex-col items-center justify-center gap-8 mb-20">
        <img
          src="/iconos/Pictograma_Xafari_Positivo.png"
          alt={t("xafariPictogramAlt")}
          className="h-48 w-auto"
        />
        <img
          src="/iconos/Logotipo_Xafari_Positivo.png"
          alt={t("xafariLogoAlt")}
          className="h-20 w-auto"
        />
      </div>

      {/* Progress bar at the bottom */}
      <div className="absolute bottom-12 left-0 right-0 px-10 flex flex-col items-center gap-4">
        <div className="w-full max-w-xs h-1.5 bg-white/10 overflow-hidden rounded-full">
          <div
            className="h-full bg-white transition-all duration-300 ease-out"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
        <span className="text-sm font-medium tracking-widest text-white/80">
          {loadingProgress}%
        </span>
      </div>

      <p className="absolute bottom-4 text-center text-[10px] uppercase tracking-tighter text-white/40">
        {t("footerRights")}
      </p>
    </div>
  );
}
