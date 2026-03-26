import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LanguageToggle from "@/components/LanguageToggle";
import SoundMenu from "@/components/SoundMenu";
import CloseIcon from "@/components/CloseIcon";
import PrivacyNotice from "@/pages/PrivacyNotice";

export default function Welcome() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [infoOpen, setInfoOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden font-apercu">

      {/* ── Fondo ────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <img
          src="/img/fondoHome.png"
          alt={t("welcomeBackgroundAlt")}
          className="h-full w-full object-cover object-center"
          draggable={false}
        />
        {/* Gradiente oscuro en la parte superior para iconos + logotipo */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-transparent" />
        {/* Gradiente oscuro en la parte inferior para los botones */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
      </div>

      {/* ── Barra superior ───────────────────────────────────────────────── */}
      <div className="relative z-20 flex w-full items-center justify-between px-4 pt-safe mt-3">
        {/* Ícono Home — Xcaret (izquierda) */}
        <div className="w-[52px] h-[52px]">
          <img
            src="/iconos/home.png"
            alt="Inicio"
            className="w-full h-full object-contain"
            draggable={false}
          />
        </div>

        {/* Idioma + Sonido (derecha) */}
        <div className="flex items-center gap-0.5">
          <LanguageToggle />
          <SoundMenu />
        </div>
      </div>

      {/* ── Logotipo + tagline ───────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center pt-4 pb-2 px-6">
        {/* Logotipo "xafari" — Figma: 344×100px, aspect-ratio 86/25 */}
        <img
          src="/iconos/Logotipo_Xafari_Positivo.png"
          alt={t("xafariLogoAlt")}
          style={{
            width: "min(344px, 88vw)",
            aspectRatio: "86 / 25",
            objectFit: "contain",
          }}
          draggable={false}
        />

        {/* Badge tagline — Figma: w=305px, h=28px, r=20px, p=4px, bg=#F7F3EA, Volume TC 16px #4F351D */}
        <div
          className="flex flex-row items-center justify-center mt-3"
          style={{
            width: "305px",
            maxWidth: "90vw",
            height: "28px",
            borderRadius: "20px",
            padding: "4px",
            backgroundColor: "#F7F3EA",
          }}
        >
          <p
            className="text-center leading-none m-0"
            style={{
              color: "#4F351D",
              fontFamily: "'Volume TC', sans-serif",
              fontSize: "16px",
              fontWeight: 400,
            }}
          >
            {t("tagline")}
          </p>
        </div>
      </div>

      {/* ── Spacer flexible (imagen de fondo visible) ────────────────────── */}
      <div className="flex-1" />

      {/* ── Botones principales ────────────────────────────────────────── */}
      <div className="relative z-10 flex w-full justify-center pb-24">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            width: "256px",
          }}
        >
          {/* Botón 1 — Nueva aventura */}
          <motion.button
            onClick={() => navigate("/intro")}
            whileTap={{ scale: 0.97 }}
            className="font-bold uppercase"
            style={{
              backgroundColor: "#80A850",
              color: "#F7F3EA",
              height: "60px",
              width: "100%",
              borderRadius: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              fontSize: "20px",
              boxShadow: "2px 2px 2px 0px rgba(0,0,0,0.25)",
              border: "none",
            }}
          >
            {t("newAdventure")}
          </motion.button>

          {/* Botón 2 — Ya soy usuario */}
          <motion.button
            onClick={() => navigate("/login")}
            whileTap={{ scale: 0.97 }}
            className="font-bold uppercase"
            style={{
              backgroundColor: "#F4E6C7",
              color: "#4B3621",
              height: "60px",
              width: "100%",
              borderRadius: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              fontSize: "20px",
              boxShadow: "2px 2px 2px 0px rgba(0,0,0,0.25)",
              border: "none",
            }}
          >
            {t("alreadyUser")}
          </motion.button>
        </div>
      </div>

      {/* ── Botones cafés ─────────────────────────────────────────────────── */}
      <div className="relative z-10 flex w-full items-center justify-between px-6 pb-8" style={{ maxWidth: "393px", alignSelf: "center" }}>
        <button
          type="button"
          onClick={() => setPrivacyOpen(true)}
          className="flex items-center justify-center font-bold text-[12px] uppercase tracking-wide cursor-pointer transition-opacity hover:opacity-90 active:scale-95"
          style={{
            width: "142px",
            height: "35px",
            borderRadius: "20px",
            backgroundColor: "#4B3621",
            color: "#F7F3EA",
            boxShadow: "2px 2px 2px 0px rgba(0,0,0,0.25)",
            border: "none",
          }}
        >
          {t("settingsLegalButton")}
        </button>
        <button
          type="button"
          onClick={() => setInfoOpen(true)}
          className="flex items-center justify-center font-bold text-[12px] uppercase tracking-wide cursor-pointer transition-opacity hover:opacity-90 active:scale-95"
          style={{
            width: "124px",
            height: "36px",
            borderRadius: "20px",
            backgroundColor: "#4B3621",
            color: "#F7F3EA",
            boxShadow: "2px 2px 2px 0px rgba(0,0,0,0.25)",
            border: "none",
          }}
        >
          {t("whatIsXafari")}
        </button>
      </div>

      {/* ── Overlay Aviso de Privacidad ── */}
      <AnimatePresence>
        {privacyOpen && (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <PrivacyNotice onClose={() => setPrivacyOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modal "¿Qué es Xafari?" — pixel-perfect Figma ── */}
      <AnimatePresence>
        {infoOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)", padding: "10px" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setInfoOpen(false)}
          >
            <motion.div
              className="relative overflow-hidden"
              style={{
                width: "343px",
                height: "597px",
                backgroundColor: "#F7F3EA",
                borderRadius: "10px",
              }}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* X cerrar — top:16px, right:28px */}
              <button
                type="button"
                onClick={() => setInfoOpen(false)}
                className="absolute bg-transparent border-none cursor-pointer active:scale-90 transition-transform p-0"
                style={{ top: "16px", right: "28px", width: "27px", height: "27px" }}
                aria-label={t("close")}
              >
                <CloseIcon size={27} color="#233C15" />
              </button>

              {/* Título — top:93px, left:28px, width:287px, 40px bold */}
              <h2
                className="absolute text-center font-bold"
                style={{
                  top: "93px",
                  left: "28px",
                  width: "287px",
                  color: "#233C15",
                  fontSize: "40px",
                  fontWeight: 700,
                  lineHeight: "normal",
                }}
              >
                {t("whatIsXafari")}
              </h2>

              {/* Texto — top:166px, left:53px, width:238px, 16px */}
              <div
                className="absolute"
                style={{
                  top: "166px",
                  left: "53px",
                  width: "238px",
                  color: "#233C15",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "1.5",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <p style={{ margin: 0 }}>{t("xafariP1")}</p>
                <p style={{ margin: 0 }}>{t("xafariP2")}</p>
                <p style={{ margin: 0 }}>{t("xafariP3")}</p>
              </div>

              {/* Botón — top:504px, left:80px, 183×44px, radius:15px, #80A850 */}
              <motion.button
                onClick={() => setInfoOpen(false)}
                whileTap={{ scale: 0.97 }}
                className="absolute font-bold border-none cursor-pointer"
                style={{
                  top: "504px",
                  left: "80px",
                  width: "183px",
                  height: "44px",
                  borderRadius: "15px",
                  backgroundColor: "#80A850",
                  color: "#F7F3EA",
                  fontSize: "22px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.25))",
                }}
              >
                {t("readyButton")}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}