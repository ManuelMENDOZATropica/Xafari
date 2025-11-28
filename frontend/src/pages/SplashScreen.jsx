import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function SplashScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
      <p className="text-center text-sm text-white/80">
        {t("footerRights")}
      </p>
    </div>
  );
}
