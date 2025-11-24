import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/welcome", { replace: true });
    }, 2000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-black px-6 py-10 text-white">
      <div className="flex flex-1 flex-col items-center justify-center gap-8">
        <img
          src="/iconos/Pictograma_Xafari_Positivo.svg"
          alt="Pictograma Xafari"
          className="h-48 w-auto"
        />
        <img
          src="/iconos/Logotipo_Xafari_Positivo.svg"
          alt="Logotipo Xafari"
          className="h-20 w-auto"
        />
      </div>
      <p className="text-center text-sm text-white/80">
        Grupo Xcaret 2025 – Todos los derechos reservados
      </p>
    </div>
  );
}
