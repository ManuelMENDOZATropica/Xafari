import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";

export default function XecretoQRScanner() {
  const videoRef = useRef(null);
  const [scannedCodes, setScannedCodes] = useState(() => {
    const saved = localStorage.getItem("xecretos");
    return saved ? JSON.parse(saved) : {};
  });
  const [lastScanned, setLastScanned] = useState(null);

  useEffect(() => {
    const codeReader = new BrowserQRCodeReader();
    let stop = false;

    async function startScan() {
      try {
        await codeReader.decodeFromVideoDevice(
          undefined,
          videoRef.current,
          (result) => {
            if (result && !stop) {
              const code = result.getText();
              if (!scannedCodes[code]) {
                const updated = { ...scannedCodes, [code]: true };
                setScannedCodes(updated);
                setLastScanned(code);
                localStorage.setItem("xecretos", JSON.stringify(updated));
              }
            }
          }
        );
      } catch (err) {
        console.error("Error al escanear QR:", err);
      }

      return () => {
        stop = true;
        codeReader.reset();
      };
    }

    const cleanup = startScan();
    return () => cleanup && cleanup();
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden font-lufga">
      <img
        src="/img/V03-CERRITOS.jpg"
        alt="Fondo"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4">
        <div className="relative w-full max-w-md aspect-video bg-white/80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden">
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

        {lastScanned && (
          <p className="mt-4 text-green-600 font-bold">
            Último escaneado: {lastScanned}
          </p>
        )}

        <div className="mt-6 w-full max-w-md bg-white/80 rounded-xl p-4 shadow">
          <h2 className="font-semibold mb-2">Xecretos escaneados:</h2>
          <ul className="list-disc list-inside">
            {Object.entries(scannedCodes)
              .filter(([_, v]) => v)
              .map(([code]) => (
                <li key={code}>{code}</li>
              ))}
          </ul>
        </div>
      </div>

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