import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

export default function XecretoRegister({ onClose }) {
  const videoRef = useRef(null);
  const { t, i18n } = useTranslation();

  const qrData = {
    xecreto1: {
      guardian: "Mono",
      maya: "/maya/GuardianMono.png",
      arbol: "/guardianes/Mono Casa Vida.png",
    },
    xecreto2: {
      guardian: "Rana",
      maya: "/maya/GuardianRana.png",
      arbol: "/guardianes/Rana Casa Agua.png",
    },
    xecreto3: {
      guardian: "Jaguar",
      maya: "/maya/GuardianJaguar.png",
      arbol: "/guardianes/Jaguar Casa Sol.png",
    },
    xecreto4: {
      guardian: "Guacamaya",
      maya: "/maya/GuardianGuacamaya.png",
      arbol: "/guardianes/Guacamaya Casa Fuego.png",
    },
    xecreto5: {
      guardian: "Serpiente",
      maya: "/maya/GuardianSerpiente.png",
      arbol: "/guardianes/Serpiente Casa Espiral.png",
    },
    xecreto6: {
      guardian: "Venado",
      maya: "/maya/GuardianVenado.png",
      arbol: "/guardianes/Venado Casa Tierra.png",
    },
    xecreto7: {
      guardian: "Búho",
      maya: "/maya/GuardianBuho.png",
      arbol: "/guardianes/Búho Casa Eclipse.png",
    },
    xecreto8: {
      guardian: "Mariposa",
      maya: "/maya/GuardianMariposa.png",
      arbol: "/guardianes/Mariposa Casa Viento.png",
    },
    xecreto9: {
      guardian: "Flamenco",
      maya: "/maya/GuardianFlamenco.png",
      arbol: "/guardianes/Flamenco Casa Sol.png",
    },
    xecreto10: {
      guardian: "Coatí",
      maya: "/maya/GuardianCoati.png",
      arbol: "/guardianes/Coati.png",
    },
  };

  const [scannedCodes, setScannedCodes] = useState(() => {
    const saved = localStorage.getItem("xecretos");
    const defaultState = Object.keys(qrData).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});
    return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
  });

  const [lastScanned, setLastScanned] = useState(null);
  const [insigniaKey, setInsigniaKey] = useState(0);
  const [showInsignia, setShowInsignia] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [scannerActive, setScannerActive] = useState(true);

  useEffect(() => {
    if (!scannerActive) return;

    const codeReader = new BrowserQRCodeReader();
    let isMounted = true;

    codeReader
      .decodeFromVideoDevice(undefined, videoRef.current, (result) => {
        if (result && isMounted) {
          const code = result.getText();

          if (qrData[code]) {
            if (!scannedCodes[code]) {
              const updated = { ...scannedCodes, [code]: true };
              setScannedCodes(updated);
              localStorage.setItem("xecretos", JSON.stringify(updated));
            }

            setScannerActive(false);
            setLastScanned(code);
            setInsigniaKey((prev) => prev + 1);
            setShowInsignia(false);
            setTimeout(() => setShowInsignia(true), 50);
            setShowOverlay(true);
            setTimeout(() => setShowOverlay(false), 3000);
            setTimeout(() => {
              setShowInsignia(false);
              onClose();
            }, 6000);
          }
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
  }, [scannerActive]);

  return (
    <div className="relative w-screen h-screen font-lufga text-black">
      <img
        src="/img/V03-CERRITOS.jpg"
        alt="Fondo"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      <div className="absolute top-0 left-0 w-full flex justify-between items-center px-4 pt-[env(safe-area-inset-top)] mt-4 z-20">
        <button
          onClick={onClose}
          className="bg-white/80 backdrop-blur-sm text-black px-4 py-2 rounded-full shadow border border-gray-300 hover:bg-white"
        >
          ← {t("back")}
        </button>
        <button
          onClick={() =>
            i18n.changeLanguage(i18n.language === "es" ? "en" : "es")
          }
          className="bg-white/80 backdrop-blur-sm text-black px-4 py-2 rounded-full shadow border border-gray-300 hover:bg-white"
        >
          {t("language")}
        </button>
      </div>

      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow px-6 py-3 w-[300px] text-center">
          <h1 className="text-xl font-bold text-emerald-800 drop-shadow">
            {t("scan_title") || "Escanea un Xecreto"}
          </h1>
        </div>
      </div>

      <div className="absolute left-4 bottom-4 z-30">
        <button
          onClick={() => setShowHelpModal(true)}
          className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow flex items-center justify-center text-xl border border-gray-300 hover:bg-white"
          title="Ayuda"
        >
          ?
        </button>
      </div>

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
              <h2 className="text-lg font-bold mb-4 text-emerald-800">
                {t("how_scan") || "¿Cómo escanear Xecretos?"}
              </h2>
              <p className="text-gray-700 mb-4">
                Explora el espacio y escanea los códigos QR ocultos para
                desbloquear Xecretos. Cuando encuentres uno válido, se activará
                la insignia correspondiente en tu Árbol de la Vida.
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

      {lastScanned && qrData[lastScanned] && (
        <>
          <AnimatePresence>
            {showInsignia && (
              <motion.img
                key={insigniaKey}
                src={qrData[lastScanned].arbol}
                alt="Insignia"
                initial={{
                  scale: 0,
                  opacity: 0,
                  x: "-50%",
                  y: "-50%",
                  rotate: -10,
                }}
                animate={{
                  scale: [0, 1.2, 1, 1.1, 1],
                  y: ["-50%", "-52%", "-48%", "-50%", "-50%"],
                  rotate: [0, 5, -5, 3, 0],
                  opacity: [0, 1, 1, 1, 0],
                  x: ["-50%", "-50%", "-50%", "-70%", "-200%"],
                }}
                transition={{
                  duration: 6,
                  times: [0, 0.2, 0.4, 0.7, 1],
                  ease: "easeInOut",
                }}
                exit={{ opacity: 0 }}
                className="absolute z-[9999] top-[35%] left-1/2 w-64 aspect-square pointer-events-none"
              />
            )}
          </AnimatePresence>

          <motion.div
            className="absolute top-[65%] left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow text-center z-[9999]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg font-bold text-emerald-800">
              ¡Encontraste al guardián {qrData[lastScanned].guardian}!
            </p>
          </motion.div>

          <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 z-[9998]">
            <img
              src={qrData[lastScanned].maya}
              alt={`Maya ${qrData[lastScanned].guardian}`}
              className="max-w-[40vw] max-h-[40vh] drop-shadow-2xl"
            />
          </div>
        </>
      )}

      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 90%; }
          100% { top: 0%; }
        }
        .animate-scan {
          animation: scan 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
