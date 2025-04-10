import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import AvatarSelection from "./AvatarSelection";

export default function WelcomeToAvatarTransition() {
  const { t } = useTranslation();
  const location = useLocation();
  const userData = location.state || { firstName: "Explorador", lastName: "" };

  const fullName = `${userData.firstName} ${userData.lastName}`.trim();

  const [showAvatar, setShowAvatar] = useState(false);
  const [animateWing, setAnimateWing] = useState(false);

  useEffect(() => {
    const showWingTimeout = setTimeout(() => {
      setAnimateWing(true); // Inicia animación del ala a los 4s
    }, 4000);

    const showAvatarTimeout = setTimeout(() => {
      setShowAvatar(true); // Muestra avatar a los 6s
    }, 6000);

    return () => {
      clearTimeout(showWingTimeout);
      clearTimeout(showAvatarTimeout);
    };
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-white font-lufga">
      {/* Fondo de bienvenida */}
      {!showAvatar && (
        <img
          src="/img/fondo-bienvenida.png"
          alt="Fondo Bienvenida"
          className="absolute inset-0 w-full h-full object-cover object-bottom z-0"
        />
      )}

      {/* Texto de bienvenida */}
      {!showAvatar && (
        <div className="absolute z-10 inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div className="max-w-md space-y-2">
            <p className="text-lg md:text-xl text-gray-800 font-medium drop-shadow-sm">
              {t("welcomeApprentice")}
            </p>
            <p className="text-4xl md:text-5xl text-emerald-700 font-bold drop-shadow">
              {fullName}
            </p>
            <p className="text-base mt-2 text-gray-700 drop-shadow-sm">
              {t("welcomeToAdventure")}
            </p>
          </div>
        </div>
      )}

      {/* Ala animada */}
      {animateWing && (
        <img
          src="/img/ala-maya.png"
          alt="Ala Maya"
          className="absolute bottom-0 left-0 w-full h-full object-cover z-50 animate-slide-wing-up-exit"
        />
      )}

      {/* Pantalla de avatar */}
      {showAvatar && <AvatarSelection />}
    </div>
  );
}
