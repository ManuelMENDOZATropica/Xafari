import { useEffect, useRef } from "react";

export default function XecretoRegister() {
  const videoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.error("No se pudo acceder a la cámara:", err);
      });

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden font-lufga">
      {/* Fondo ilustrado */}
      <img
        src="/img/V03-CERRITOS.jpg"
        alt="Fondo"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Capa de contenido */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4">
        {/* Contenedor de cámara */}
        <div className="relative w-full max-w-md aspect-video bg-white/80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover rounded-2xl"
          />

          {/* Línea animada de escaneo */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute w-full h-0.5 bg-green-500 animate-scan" />
          </div>
        </div>
      </div>

      {/* Animación con Tailwind extendida */}
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
