import { useEffect, useRef, useState, useContext } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

import ModalInstruccionesXecretos from "@/components/ModalInstruccionesXecretos";
import ModalPistaXecreto from "@/components/ModalPistaXecreto";
import ModalMapa from "@/components/ModalMapa";
import XafariContext from "./XafariContext";

export default function XecretoRegister({ onClose }) {
  const videoRef = useRef(null);
  const { t } = useTranslation();
  const { playSuccessSound } = useContext(XafariContext);
  const qrData = {
    xecreto1: { guardian: "Mono", maya: "/maya/GuardianMono.png", arbol: "/guardianes/Mono Casa Vida.png" },
    xecreto2: { guardian: "Rana", maya: "/maya/GuardianRana.png", arbol: "/guardianes/Rana Casa Agua.png" },
    xecreto3: { guardian: "Jaguar", maya: "/maya/GuardianJaguar.png", arbol: "/guardianes/Jaguar Casa Sol.png" },
    xecreto4: { guardian: "Guacamaya", maya: "/maya/GuardianGuacamaya.png", arbol: "/guardianes/Guacamaya Casa Fuego.png" },
    xecreto5: { guardian: "Serpiente", maya: "/maya/GuardianSerpiente.png", arbol: "/guardianes/Serpiente Casa Espiral.png" },
    xecreto6: { guardian: "Venado", maya: "/maya/GuardianVenado.png", arbol: "/guardianes/Venado Casa Tierra.png" },
    xecreto7: { guardian: "Búho", maya: "/maya/GuardianBuho.png", arbol: "/guardianes/Búho Casa Eclipse.png" },
    xecreto8: { guardian: "Mariposa", maya: "/maya/GuardianMariposa.png", arbol: "/guardianes/Mariposa Casa Viento.png" },
    xecreto9: { guardian: "Flamenco", maya: "/maya/GuardianFlamenco.png", arbol: "/guardianes/Flamenco Casa Sol.png" },
    xecreto10: { guardian: "Coati", maya: "/maya/GuardianCoati.png", arbol: "/guardianes/Coati.png" },
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
  const [cameraError, setCameraError] = useState(null);
  const [scannerReady, setScannerReady] = useState(false);
  const [showInstrucciones, setShowInstrucciones] = useState(false);
  const [showPista, setShowPista] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  useEffect(() => {
    const codeReader = new BrowserQRCodeReader();
    let isMounted = true;

    const startScan = async () => {
      try {
        if (!videoRef.current) {
          setTimeout(startScan, 200);
          return;
        }

        setScannerReady(true);

        await codeReader.decodeFromVideoDevice(
          undefined,
          videoRef.current,
          (result) => {
            if (!isMounted || !result) return;
            const code = result.getText();
            if (!qrData[code]) return;

            if (!scannedCodes[code]) {
              const updated = { ...scannedCodes, [code]: true };
              setScannedCodes(updated);
              localStorage.setItem("xecretos", JSON.stringify(updated));
              if (typeof playSuccessSound === "function") {
                playSuccessSound();
              }
            }

            setLastScanned(code);
            setInsigniaKey((prev) => prev + 1);
            setShowInsignia(false);
            setTimeout(() => setShowInsignia(true), 50);

            setTimeout(() => {
              setShowInsignia(false);
              onClose();
            }, 6000);
          }
        );
      } catch (err) {
        console.error("Error al acceder a la cámara:", err);
        setCameraError(`${err.name}: ${err.message}`);
      }
    };

    startScan();

    return () => {
      isMounted = false;
      try {
        codeReader.reset();
      } catch (e) {
        console.warn("No se pudo resetear el lector:", e.message);
      }
    };
  }, []);

  return (
    <div className="w-full h-full min-h-screen mt-[22px] overflow-y-auto px-4">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-[-10px] right-5 z-50 mt-[10px] rounded-full border-2 border-white/50 bg-white px-5 py-1.5 font-bold text-gray-900 shadow-lg transition-transform hover:scale-105"
        aria-label={t("close")}
      >
        ✕
      </button>
      <div className="relative h-full w-full rounded-[10px] bg-[#FFBB00] font-apercu text-black">
        <img
          src="/img/V03-CERRITOS.jpg"
          alt={t("genericBackgroundAlt")}
          className="absolute inset-0 z-0 h-full w-full rounded-[10px] object-cover"
        />

        <div className="absolute inset-0 z-10 flex h-full w-full flex-col overflow-hidden bg-white/0">
          <div className="absolute left-0 top-0 z-20 mt-4 flex w-full items-center justify-between px-4 pt-[env(safe-area-inset-top)]">
            <button
              onClick={onClose}
              className="rounded-full border border-gray-300 bg-white/80 px-4 py-2 text-black shadow backdrop-blur-sm hover:bg-white"
            >
              ← {t("back")}
            </button>
            <div className="flex items-center gap-3 rounded-full border border-gray-300 bg-white/80 px-4 py-2 shadow">
              <div className="text-xs text-gray-700">
                <div className="text-sm font-semibold">{t("guardians")}</div>
                <div className="text-xs text-gray-600">
                  {Object.values(scannedCodes).filter(Boolean).length} / {Object.keys(qrData).length}
                </div>
              </div>
              <div className="flex -space-x-2">
                {Object.entries(scannedCodes)
                  .filter(([, val]) => val)
                  .slice(0, 5)
                  .map(([key]) => (
                    <div key={key} className="h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-white shadow">
                      <img src={qrData[key].arbol} alt={t("discover_guardian")} className="h-full w-full object-cover" />
                    </div>
                  ))}
              </div>
            </div>
          </div>

      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow px-6 py-3 w-[300px] text-center">
          <h1 className="text-xl font-bold text-emerald-800 drop-shadow">
            {t("scan_title")}
          </h1>
        </div>
      </div>

      {cameraError && (
        <div className="absolute top-[60%] left-1/2 -translate-x-1/2 bg-red-100 text-red-800 px-4 py-2 rounded shadow z-50">
          {cameraError}
        </div>
      )}
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

      <div className="absolute bottom-[10vh] right-4 z-30 flex flex-col gap-2 items-end">
        <button
          onClick={() => setShowInstrucciones(true)}
          className="bg-white/80 backdrop-blur-sm text-black px-4 py-2 rounded-full shadow border border-gray-300 hover:bg-white"
        >
          {t("how_scan")}
        </button>

        <button
          onClick={() => setShowPista(true)}
          className="bg-white/90 backdrop-blur-sm text-black px-4 py-2 rounded-full shadow border border-gray-300 hover:bg-white"
        >
          {t("see_clues")}
        </button>

        <button
          onClick={() => setShowMapModal(true)}
          className="bg-white/80 backdrop-blur-sm text-black px-4 py-2 rounded-full shadow border border-gray-300 hover:bg-white"
        >
          {t("open_map")}
        </button>
      </div>



      

      <ModalInstruccionesXecretos show={showInstrucciones} onClose={() => setShowInstrucciones(false)} />
      <ModalPistaXecreto
        show={showPista}
        onClose={() => setShowPista(false)}
        scannedCodes={scannedCodes}
      />
      {showMapModal && <ModalMapa onClose={() => setShowMapModal(false)} />}

      {lastScanned && qrData[lastScanned] && (
        <>
          <AnimatePresence>
            {showInsignia && (
              <motion.img
                key={insigniaKey}
                src={qrData[lastScanned].arbol}
                alt={t("badgeAlt")}
                initial={{ scale: 0, opacity: 0, x: "-50%", y: "-50%", rotate: -10 }}
                animate={{
                  scale: [0, 1.2, 1, 1.1, 1],
                  y: ["-50%", "-52%", "-48%", "-50%", "-50%"],
                  rotate: [0, 5, -5, 3, 0],
                  opacity: [0, 1, 1, 1, 0],
                  x: ["-50%", "-50%", "-50%", "-70%", "-200%"],
                }}
                transition={{ duration: 6, times: [0, 0.2, 0.4, 0.7, 1], ease: "easeInOut" }}
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
              {t("found_guardian", { guardian: qrData[lastScanned].guardian })}
            </p>
          </motion.div>

          <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 z-[9998]">
            <img
              src={qrData[lastScanned].maya}
              alt={t("mayaGuardianAlt", { guardian: qrData[lastScanned].guardian })}
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
      </div>
    </div>
  );
}
