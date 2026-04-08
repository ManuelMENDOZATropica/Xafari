import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import SoundMenu from "@/components/SoundMenu";

export default function BienvenidaGuacamaya() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen w-screen overflow-hidden font-apercu"
      style={{ backgroundColor: "#1A3C15" }}
    >
      {/* Sonido — esquina superior derecha */}
      <div style={{ position: "absolute", top: "27px", right: "27px", zIndex: 30 }}>
        <SoundMenu />
      </div>

      <div className="flex flex-col items-center justify-center gap-8 px-6 w-full max-w-md">

        {/* Guacamaya — contenedor fijo de imagen */}
        <div style={{
          position: "relative",
          width: "100%",
          height: "50vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <motion.img
            src="/img/guacamaya.png"
            alt="Guacamaya"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
            style={{
              position: "absolute",
              maxHeight: "100%",
              maxWidth: "100%",
              objectFit: "contain",
            }}
          />
        </div>

        {/* Burbuja de texto */}
        <div style={{
          position: "relative",
          width: "313px",
          height: "140px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          <img
            src="/intro/contenedorTextoIntro.png"
            alt=""
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "fill" }}
            draggable={false}
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{
              position: "relative",
              zIndex: 1,
              color: "#F7F3EA",
              fontSize: "18px",
              fontFamily: "'Volume TC', sans-serif",
              fontWeight: 400,
              lineHeight: "1.4",
              textAlign: "center",
              margin: 0,
              padding: "16px 24px",
            }}
          >
            {t("bienvenida.mensaje") || "La guacamaya te felicita por tu registro y tu esfuerzo"}
          </motion.p>
        </div>

        {/* Botón Continuar */}
        <motion.button
          type="button"
          onClick={() => navigate("/tutorial")}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.4 }}
          whileTap={{ scale: 0.97 }}
          style={{
            width: "200px",
            height: "60px",
            borderRadius: "30px",
            backgroundColor: "#80A850",
            color: "#F7F3EA",
            fontSize: "24px",
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            boxShadow: "3.2px 3.2px 3.2px 0px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {t("intro.continue") || "Continuar"}
        </motion.button>

      </div>
    </div>
  );
}
