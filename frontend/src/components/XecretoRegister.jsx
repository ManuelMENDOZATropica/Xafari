import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

export default function XecretoRegister({ onClose }) {
  const videoRef = useRef(null);
  const { t, i18n } = useTranslation();
  const [scannedCodes, setScannedCodes] = useState(() => {
    const saved = localStorage.getItem("xecretos");
    return saved ? JSON.parse(saved) : {};
  });
  const [lastScanned, setLastScanned] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const qrToImage = {
    xecreto7: "/maya/GuardianVenado.png",
  };

  useEffect(() => {
    const codeReader = new BrowserQRCodeReader();
    let isMounted = true;

    codeReader
      .decodeFromVideoDevice(undefined, videoRef.current, (result, err) => {
        if (result && isMounted) {
          const code = result.getText();
          if (!scannedCodes[code]) {
            const updated = { ...scannedCodes, [code]: true };
            setScannedCodes(updated);
            setLastScanned(code);
            localStorage.setItem("xecretos", JSON.stringify(updated));
          } else {
            setLastScanned(code);
          }
          setShowOverlay(true);
          setTimeout(() => setShowOverlay(false), 3000);
        }
      })
      .catch((err) => console.error("Error al escanear QR:", err));

    return () => {
      isMounted = false;
      try {
        if (typeof codeReader.reset === "function") {
          codeReader.reset();
        }
      } catch (e) {
        console.warn("No se pudo resetear el lector:", e.message);
      }
    };
  }, []);

  return (
    <div className="relative w-screen h-screen font-lufga text-black">
      <img
        src="/img/V03-CERRITOS.jpg"
        alt="Fondo"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

     {/* Encabezado fijo con botones laterales */}
<div className="absolute top-0 left-0 w-full flex justify-between items-center px-4 pt-[env(safe-area-inset-top)] mt-4 z-20">
  <button
    onClick={onClose}
    className="bg-white/80 backdrop-blur-sm text-black px-4 py-2 rounded-full shadow border border-gray-300 hover:bg-white"
  >
    ← {t("back")}
  </button>
  <button
    onClick={() => i18n.changeLanguage(i18n.language === "es" ? "en" : "es")}
    className="bg-white/80 backdrop-blur-sm text-black px-4 py-2 rounded-full shadow border border-gray-300 hover:bg-white"
  >
    {t("language")}
  </button>
</div>

{/* Título separado centrado */}
<div className="absolute top-20 left-1/2 -translate-x-1/2 z-10">
  
  <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow px-6 py-3 w-[300px] text-center">
  <h1 className="text-xl font-bold text-emerald-800 drop-shadow">
    {t("scan_title") || "Escanea un Xecreto"}
  </h1>
</div>


</div>


      {/* Botón de ayuda */}
      <div className="absolute left-4 bottom-4 z-30">
        <button
          onClick={() => setShowHelpModal(true)}
          className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow flex items-center justify-center text-xl border border-gray-300 hover:bg-white"
          title="Ayuda"
        >
          ?
        </button>
      </div>

      {/* Modal de ayuda */}
      <AnimatePresence>
        {showHelpModal && (
          <motion.div
            className="absolute inset-0 z-40 bg-black/60 flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-lg font-bold mb-4 text-emerald-800">{t("how_scan") || "¿Cómo escanear Xecretos?"}</h2>
              <p className="text-gray-700 mb-4">
                Explora el espacio y escanea los códigos QR ocultos para desbloquear Xecretos. Cuando encuentres uno válido, se activará la insignia correspondiente en tu Árbol de la Vida.
              </p>
              <button
                onClick={() => setShowHelpModal(false)}
                className="mt-2 bg-emerald-600 text-white px-4 py-2 rounded-full shadow hover:bg-emerald-700"
              >
                {t("understood") || "Entendido"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cámara */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md aspect-video bg-white/80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden z-10">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover rounded-2xl"
        />
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute w-full h-0.5 bg-green-500 animate-scan" />
        </div>
      </div>

      {/* Imagen flotante del Guardian */}
      {lastScanned && qrToImage[lastScanned] && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-100 z-20">
          <img
            src={qrToImage[lastScanned]}
            alt={lastScanned}
            className="max-w-[60vw] max-h-[60vh] drop-shadow-2xl"
          />
        </div>
      )}

      {/* Imagen animada sobre Guardian */}
      {showOverlay && (
        <img
          src="/guardianes/Venado Casa Tierra.png"
          alt="Venado Casa Tierra"
          className="absolute z-30 top-4/5 left-1/2 animate-zoomAndSlide -translate-x-1/2 -translate-y-1/2 w-40 h-40"
        />
      )}

      {/* Animaciones */}
      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 90%; }
          100% { top: 0%; }
        }
        .animate-scan {
          animation: scan 3s ease-in-out infinite;
        }
        @keyframes zoomAndSlide {
          0% {
            transform: scale(1) translate(-50%, -50%);
            opacity: 1;
          }
          30% {
            transform: scale(1.4) translate(-50%, -50%);
            opacity: 1;
          }
          100% {
            transform: scale(0.5) translate(-200%, -50%);
            opacity: 0;
          }
        }
        .animate-zoomAndSlide {
          animation: zoomAndSlide 6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
