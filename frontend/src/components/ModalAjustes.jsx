import { useContext, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import XafariContext from "./XafariContext";
import { FACE_OFFSETS } from "@/data/avatar";

// ─── Idiomas ──────────────────────────────────────────────────────────────────
const LANGS = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
  { code: "pt", label: "Português" },
];

// ─── Niveles de volumen ───────────────────────────────────────────────────────
const NIVELES_VOLUMEN = ["off", "vibrate", "medium", "full"];

const leerBool = (clave, def) => {
  const v = localStorage.getItem(clave);
  return v === null ? def : v === "true";
};

// ─── Toggle genérico ──────────────────────────────────────────────────────────
function Toggle({ on, onClick, label }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-sm font-bold text-[#345230]">{label}</span>
      <button
        type="button"
        onClick={onClick}
        role="switch"
        aria-checked={on}
        aria-label={label}
        className="relative inline-flex h-8 w-16 items-center rounded-full px-1 shadow-md transition-colors"
        style={{ backgroundColor: on ? "#7faa55" : "#9e3b32" }}
      >
        <span
          className="inline-block h-6 w-6 transform rounded-full bg-[#f4ead9] shadow transition-transform"
          style={{ transform: on ? "translateX(32px)" : "translateX(0px)" }}
        />
      </button>
    </div>
  );
}

export default function ModalAjustes({ onClose }) {
  const {
    soundSetting,
    setSoundSetting,
    triggerClickFeedback,
    musicEnabled,
    setMusicEnabled,
    user,
    logout,
  } = useContext(XafariContext);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const irAPerfil = () => {
    if (typeof onClose === "function") onClose();
    navigate("/perfil");
  };

  const currentLanguage = useMemo(
    () => i18n.language?.split("-")[0] ?? "es",
    [i18n.language]
  );

  const volumenIndex = Math.max(0, NIVELES_VOLUMEN.indexOf(soundSetting));
  const [hapticos, setHapticos] = useState(() => leerBool("ajuste_hapticos", true));
  const [notificaciones, setNotificaciones] = useState(() => leerBool("ajuste_notificaciones", false));
  const [modoObscuro, setModoObscuro] = useState(() => leerBool("ajuste_modoObscuro", false));

  const persistir = (clave, valor, setter) => {
    setter(valor);
    localStorage.setItem(clave, String(valor));
  };

  const handleVolumen = (e) => {
    const idx = Number(e.target.value);
    const valor = NIVELES_VOLUMEN[idx] ?? "full";
    setSoundSetting(valor);
    if (typeof triggerClickFeedback === "function") triggerClickFeedback(valor);
  };

  const handleMusica = () => {
    const next = !musicEnabled;
    setMusicEnabled(next);
    // también persiste en localStorage para que App.jsx lo recupere al recargar
    localStorage.setItem("ajuste_musica", String(next));
  };

  const cerrarSesion = () => {
    logout();
    if (typeof onClose === "function") onClose();
    navigate("/");
  };

  return (
    // ── Capa café: ocupa exactamente el espacio del contenedor ──────────────
    <motion.div className="absolute inset-0 bg-[#7b5226] font-apercu overflow-hidden rounded-3xl">

      {/* ── Panel crema: con scroll vertical si desborda ─── */}
      <div className="absolute inset-3 rounded-2xl bg-[#f4ead9] overflow-y-auto">
        <div className="flex min-h-full flex-col justify-between px-4 pb-4 pt-4">

          {/* ── Grupo superior: título + idioma ──────────────────────────── */}
          <div>
          {/* Título centrado */}
          <h1 className="mb-2 text-center text-xl font-extrabold text-[#345230]">
            {t("settingsTitle")}
          </h1>

          {/* ── Idioma (con rótulo) + avatar ─────────────────────────────── */}
          <div className="mb-3 flex items-start justify-between">
            <div>
              <h2 className="mb-2 text-lg font-bold text-[#345230]">
                {t("settingsLanguageTitle")}
              </h2>
              {/* Píldora verde sólida con botón activo elevado */}
              <div className="inline-flex items-center rounded-full bg-[#7faa55] p-1 shadow-md">
                {LANGS.map((l) => {
                  const activo = currentLanguage === l.code;
                  return (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => i18n.changeLanguage(l.code)}
                      aria-pressed={activo}
                      lang={l.code}
                      className="rounded-full px-4 py-1.5 text-sm font-semibold transition-all"
                      style={{
                        backgroundColor: activo ? "#a7cd80" : "transparent",
                        color: "#2f4a2c",
                        boxShadow: activo ? "0 1px 3px rgba(0,0,0,0.25)" : "none",
                      }}
                    >
                      {l.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Avatar — elipse + cara superpuesta */}
            <button
              type="button"
              onClick={irAPerfil}
              aria-label={t("editProfile")}
              className="relative flex-shrink-0 bg-transparent transition-transform active:scale-95"
              style={{ width: "130px", height: "130px" }}
            >
              {/* Marco elipse debajo */}
              <img
                src="/iconos/elipseAvatar.png"
                alt=""
                className="absolute inset-0 w-full h-full object-contain"
              />
              {/* Cara del avatar encima */}
              {user?.avatar && (
                <>
                  <img
                    src={`/avatares/cara-${(user.avatar.faceOptions ?? 0) + 1}.webp`}
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{
                      zIndex: 10,
                      transform: `translate(${FACE_OFFSETS[(user.avatar.faceOptions ?? 0) + 1]?.x || 0}%, ${FACE_OFFSETS[(user.avatar.faceOptions ?? 0) + 1]?.y || 0}%)`
                    }}
                  />
                </>
              )}
            </button>
          </div>
          </div>

          {/* ── Grupo medio: personaliza tu experiencia ──────────────────── */}
          <div>
          {/* ── Personaliza tu experiencia ────────────────────────────────── */}
          <h2 className="mb-2 text-base font-bold text-[#345230]">
            {t("settingsPersonalizeTitle")}
          </h2>

          {/* Volumen general */}
          <p className="mb-1 text-sm font-semibold text-[#345230]">
            {t("settingsVolumeLabel")}
          </p>
          <div className="mb-3 flex items-center gap-3">
            <img src="/iconos/iconoSonidoSettings.png" alt="" className="h-11 w-11 shrink-0 object-contain" />
            <input
              type="range"
              min="0"
              max="3"
              step="1"
              value={volumenIndex}
              onChange={handleVolumen}
              aria-label={t("settingsVolumeLabel")}
              className="ajustes-slider h-2 w-full cursor-pointer appearance-none rounded-full bg-[#8a6a3a]"
            />
          </div>

          {/* ── Toggles ───────────────────────────────────────────────────── */}
          <div className="mb-3 grid grid-cols-2 gap-y-2">
            <Toggle
              on={hapticos}
              onClick={() => {
                const nuevoValor = !hapticos;
                persistir("ajuste_hapticos", nuevoValor, setHapticos);
                if (typeof navigator !== "undefined" && navigator.vibrate) {
                  if (nuevoValor) {
                    navigator.vibrate([80, 50, 80]);
                  } else {
                    navigator.vibrate(80);
                  }
                }
              }}
              label={t("settingsHapticsLabel")}
            />
            {/* Música: controla SOLO la música de fondo */}
            <Toggle
              on={musicEnabled}
              onClick={handleMusica}
              label={t("settingsMusicLabel")}
            />
            <Toggle
              on={notificaciones}
              onClick={() => persistir("ajuste_notificaciones", !notificaciones, setNotificaciones)}
              label={t("settingsNotificationsLabel")}
            />
            <Toggle
              on={modoObscuro}
              onClick={() => persistir("ajuste_modoObscuro", !modoObscuro, setModoObscuro)}
              label={t("settingsDarkModeLabel")}
            />
          </div>
          </div>

          {/* ── Grupo inferior: aviso de privacidad y cerrar sesión ──────────────────────── */}
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/privacy"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full bg-[#4a2e0e] px-6 py-2.5 text-sm font-semibold text-[#f4ead9] shadow-md transition-transform active:scale-95"
            >
              {t("settingsLegalButton")}
            </Link>
            <button
              type="button"
              onClick={cerrarSesion}
              className="inline-flex items-center justify-center rounded-full bg-[#9e3b32] px-6 py-2.5 text-sm font-semibold text-[#f4ead9] shadow-md transition-transform active:scale-95"
            >
              {t("logout")}
            </button>
          </div>
        </div>
      </div>

      {/* Estilo del thumb del slider */}
      <style>{`
        .ajustes-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 36px;
          width: 36px;
          border-radius: 0;
          background: url('/iconos/iconoSlider.png') center / contain no-repeat;
          box-shadow: none;
          cursor: pointer;
        }
        .ajustes-slider::-moz-range-thumb {
          height: 36px;
          width: 36px;
          border: none;
          border-radius: 0;
          background: url('/iconos/iconoSlider.png') center / contain no-repeat;
          box-shadow: none;
          cursor: pointer;
        }
      `}</style>
    </motion.div>
  );
}
