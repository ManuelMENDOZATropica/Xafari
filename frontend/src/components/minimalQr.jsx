import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";

export default function MinimalQR() {
  const videoRef = useRef(null);
  const [lastCode, setLastCode] = useState(null);
  const [error, setError] = useState(null);
  const [scannerReady, setScannerReady] = useState(false);

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
          undefined, // sin restricciones
          videoRef.current,
          (result) => {
            if (!isMounted || !result) return;
            setLastCode(result.getText());
          }
        );
      } catch (err) {
        console.error("Error al acceder a la cámara:", err);
        setError(`${err.name}: ${err.message}`);
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
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-100">
      <h1 className="text-xl font-bold mb-4">Lector QR Simple</h1>

      {error && (
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full max-w-md aspect-video border rounded shadow"
      />

      <div className="mt-4 text-center">
        {lastCode ? (
          <p className="text-green-700 font-semibold">
            QR Detqqqectado: {lastCode}
          </p>
        ) : scannerReady ? (
          <p className="text-gray-500">Escaneando...</p>
        ) : (
          <p className="text-gray-500">Inicializando cámara...</p>
        )}
      </div>
    </div>
  );
}
