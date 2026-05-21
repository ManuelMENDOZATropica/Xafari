import { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import XafariContext from "./XafariContext";

// ─── Idiomas ──────────────────────────────────────────────────────────────────
const LANGS = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
];

// ─── Niveles de volumen ───────────────────────────────────────────────────────
const NIVELES_VOLUMEN = ["off", "vibrate", "medium", "full"];

const leerBool = (clave, def) => {
  const v = localStorage.getItem(clave);
  return v === null ? def : v === "true";
};

// ─── Avatar: solo cara + cuello ───────────────────────────────────────────────
function AvatarFaceOnly({ avatarData }) {
  if (!avatarData) return null;

  const bodyOptions = ["/avatares/cuerpoNiñoIcono.png", "/avatares/cuerpoAdultoIcono.png"];
  const faceOptions = Array.from({ length: 23 }, (_, i) => `/avatares/cara (${i + 1}).png`);
  const isChild = avatarData.bodyOptions === 0;

  return (
    // Contenedor con overflow hidden — recortamos para mostrar sólo cara+cuello
    // La zona visible es el tercio superior del cuerpo completo
    <div className="relative w-full h-full overflow-hidden">
      {/* Cuerpo posicionado para que la cara quede centrada en el círculo */}
      <img
        src={bodyOptions[avatarData.bodyOptions || 0]}
        alt="body"
        className="absolute left-1/2 object-contain"
        style={{
          width: isChild ? "160%" : "140%",
          // Desplazamos hacia abajo para que solo se vea el cuello/pecho
          top: isChild ? "-8%" : "-5%",
          transform: "translateX(-50%)",
        }}
      />
      {/* Cara superpuesta en la parte superior */}
      <img
        src={faceOptions[avatarData.faceOptions || 0]}
        alt="face"
        className="absolute left-1/2 object-contain"
        style={{
          width: isChild ? "90%" : "80%",
          top: isChild ? "-22%" : "-18%",
          transform: "translateX(-50%)",
        }}
      />
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
  } = useContext(XafariContext);
  const { t, i18n } = useTranslation();

  const user = useMemo(() => JSON.parse(localStorage.getItem("user") || "{}"), []);

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

  // ─── Toggle genérico ────────────────────────────────────────────────────────
  const Toggle = ({ on, onClick, label }) => (
    <div className="flex flex-col items-center gap-2">
      <span className="text-sm font-semibold text-[#3d2a14]">{label}</span>
      <button
        type="button"
        onClick={onClick}
        role="switch"
        aria-checked={on}
        aria-label={label}
        className="relative inline-flex h-8 w-16 items-center rounded-full px-1 transition-colors"
        style={{ backgroundColor: on ? "#5f7d3a" : "#4a2e0e" }}
      >
        <span
          className="inline-block h-6 w-6 transform rounded-full bg-[#efe7d6] shadow transition-transform"
          style={{ transform: on ? "translateX(32px)" : "translateX(0px)" }}
        />
      </button>
    </div>
  );

  return (
    // ── Capa café: ocupa exactamente el espacio del contenedor ──────────────
    <motion.div className="absolute inset-0 bg-[#7b5226] font-apercu overflow-hidden rounded-3xl">

      {/* ── Panel crema: anclado 12px adentro, sin scroll en ningún eje ─── */}
      <div className="absolute inset-3 rounded-2xl bg-[#f4ead9] overflow-hidden">
        <div className="flex flex-col px-5 pb-4 pt-4">

          {/* Título centrado */}
          <h1 className="mb-3 text-center text-lg font-extrabold text-[#3d3d33]">
            {t("settingsTitle") || "Ajustes"}
          </h1>

          {/* ── Fila: toggle de idioma + avatar ──────────────────────────── */}
          <div className="mb-4 flex items-center gap-3">
            {/* Toggle idioma (izquierda) */}
            <div className="inline-flex items-center rounded-full border-2 border-[#586b39] p-1">
              {LANGS.map((l) => {
                const activo = currentLanguage === l.code;
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => i18n.changeLanguage(l.code)}
                    className="rounded-full px-4 py-1 text-sm font-semibold transition-colors"
                    style={{
                      backgroundColor: activo ? "#6f8f43" : "transparent",
                      color: activo ? "#ffffff" : "#3d2a14",
                    }}
                  >
                    {l.label}
                  </button>
                );
              })}
            </div>

            {/* Avatar — h-24 (96px), alineado con el toggle */}
            <div className="ml-auto flex-shrink-0 h-24 w-24 overflow-hidden rounded-full border-[3px] border-[#586b39] bg-[#efe7d6]">
              <AvatarFaceOnly avatarData={user?.avatar} />
            </div>
          </div>

          {/* ── Personaliza tu experiencia ────────────────────────────────── */}
          <h2 className="mb-2 text-base font-bold text-[#3d2a14]">
            {t("settingsPersonalizeTitle") || "Personaliza tu experiencia"}
          </h2>

          {/* Volumen general */}
          <p className="mb-1 text-sm font-semibold text-[#3d2a14]">
            {t("settingsVolumeLabel") || "Volumen"}
          </p>
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#6f8f43]">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#f4ead9" aria-hidden="true">
                <path d="M4 9v6h4l5 5V4L8 9H4z" />
                <path d="M16 8.5a4 4 0 0 1 0 7" fill="none" stroke="#f4ead9" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M18.5 6a7 7 0 0 1 0 12" fill="none" stroke="#f4ead9" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type="range"
              min="0"
              max="3"
              step="1"
              value={volumenIndex}
              onChange={handleVolumen}
              aria-label={t("settingsVolumeLabel") || "Volumen"}
              className="ajustes-slider h-2 w-full cursor-pointer appearance-none rounded-full bg-[#8a6a3a]"
            />
          </div>

          {/* ── Toggles ───────────────────────────────────────────────────── */}
          <div className="mb-4 grid grid-cols-2 gap-y-3">
            <Toggle
              on={hapticos}
              onClick={() => persistir("ajuste_hapticos", !hapticos, setHapticos)}
              label={t("settingsHapticsLabel") || "Hápticos"}
            />
            {/* Música: controla SOLO la música de fondo */}
            <Toggle
              on={musicEnabled}
              onClick={handleMusica}
              label={t("settingsMusicLabel") || "Música"}
            />
            <Toggle
              on={notificaciones}
              onClick={() => persistir("ajuste_notificaciones", !notificaciones, setNotificaciones)}
              label={t("settingsNotificationsLabel") || "Notificaciones"}
            />
            <Toggle
              on={modoObscuro}
              onClick={() => persistir("ajuste_modoObscuro", !modoObscuro, setModoObscuro)}
              label={t("settingsDarkModeLabel") || "Modo Obscuro"}
            />
          </div>

          {/* Aviso de privacidad */}
          <div className="flex justify-center pt-1">
            <Link
              to="/privacy"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full bg-[#4a2e0e] px-8 py-2.5 text-sm font-semibold text-[#f4ead9] shadow-md transition-transform active:scale-95"
            >
              {t("settingsLegalButton") || "Aviso de privacidad"}
            </Link>
          </div>
        </div>
      </div>

      {/* Estilo del thumb del slider */}
      <style>{`
        .ajustes-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 32px;
          width: 32px;
          border-radius: 9999px;
          background: #6b4423 radial-gradient(circle at 50% 50%, #8a5a2c 22%, transparent 23%);
          box-shadow: 0 1px 3px rgba(0,0,0,0.35);
          cursor: pointer;
        }
        .ajustes-slider::-moz-range-thumb {
          height: 32px;
          width: 32px;
          border: none;
          border-radius: 9999px;
          background: #6b4423;
          box-shadow: 0 1px 3px rgba(0,0,0,0.35);
          cursor: pointer;
        }
      `}</style>
    </motion.div>
  );
}
