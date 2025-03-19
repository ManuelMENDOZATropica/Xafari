import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function WelcomeAnimation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // Recibir el nombre del usuario correctamente
  const userData = location.state || { firstName: "Explorador", lastName: "" };
  const fullName = `${userData.firstName} ${userData.lastName}`.trim();

  console.log("Datos recibidos en WelcomeAnimation:", userData); // 👀 Debug para verificar datos

  useEffect(() => {
    // Espera 4 segundos y redirige a la pantalla de creación de avatar
    const timer = setTimeout(() => {
      navigate("/create-avatar", { state: userData });
    }, 6000);

    return () => clearTimeout(timer);
  }, [navigate, userData]);

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-white">
      {/* Animación de la Guacamaya */}
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        exit={{ opacity: 0, y: 100 }}
      >
        <motion.img
          src="/guacamaya.webp" // Asegúrate de que el archivo está en /public/
          alt="Guacamaya en vuelo"
          className="w-40 h-40"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Texto de Bienvenida */}
      <p className="mt-6 text-gray-700 text-sm">{t("welcomeApprentice")}</p>
      <h1 className="text-xl font-bold text-black">{fullName}</h1>
    </div>
  );
}
