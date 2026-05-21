import { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import XafariContext from "./XafariContext";
import AvatarRender from "@/components/AvatarRender";

// Idiomas mostrados en el toggle de Idioma
const LANGS = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
];

// Niveles de volumen mapeados al soundSetting del contexto
const NIVELES_VOLUMEN = ["off", "vibrate", "medium", "full"];

const leerBool = (clave, def) => {
  const v = localStorage.getItem(clave);
  return v === null ? def : v === "true";
};

export default function ModalAjustes({ onClose }) {
  const { soundSetting, setSoundSetting, triggerClickFeedback } = useContext(XafariContext);
  const { t, i18n } = useTranslation();

  const user = useMemo(() => JSON.parse(localStorage.getItem("user") || "{}"), []);

  const currentLanguage = useMemo(
    () => i18n.language?.split("-")[0] ?? "es",
    [i18n.language]
  );

  const volumenIndex = Math.max(0, NIVELES_VOLUMEN.indexOf(soundSetting));
  const [hapticos, setHapticos] = useState(() => leerBool("ajuste_hapticos", true));
  const [musica, setMusica] = useState(() => leerBool("ajuste_musica", false));
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
        style={{ backgroundColor: on ? "#5f7d3a" : "#a8432f" }}
      >
        <span
          className="inline-block h-6 w-6 transform rounded-full bg-[#efe7d6] shadow transition-transform"
          style={{ transform: on ? "translateX(32px)" : "translateX(0px)" }}
        />
      </button>
    </div>
  );

  return (
    <motion.div className="relative flex h-full w-full flex-col overflow-y-auto bg-[#f4ead9] font-apercu">
      {/* Borde verde del panel */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl border-4 border-[#586b39]" />

      <div className="relative flex flex-1 flex-col px-6 pb-5 pt-5">
        {/* Encabezado: título + avatar */}
        <div className="relative mb-5">
          <h1 className="pt-1 text-center text-xl font-extrabold text-[#3d3d33]">
            {t("settingsTitle") || "Ajustes"}
          </h1>
          <div className="absolute right-0 top-0 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-[3px] border-[#586b39] bg-[#efe7d6]">
            <AvatarRender avatarData={user?.avatar} className="h-full w-full" />
          </div>
        </div>

        {/* Idioma */}
        <h2 className="mb-2 text-lg font-bold text-[#3d2a14]">
          {t("settingsLanguageTitle") || "Idioma"}
        </h2>
        <div className="mb-6 inline-flex w-fit items-center rounded-full border-2 border-[#586b39] p-1">
          {LANGS.map((l) => {
            const activo = currentLanguage === l.code;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => i18n.changeLanguage(l.code)}
                className="rounded-full px-5 py-1.5 text-sm font-semibold transition-colors"
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

        {/* Personaliza tu experiencia */}
        <h2 className="mb-4 text-lg font-bold text-[#3d2a14]">
          {t("settingsPersonalizeTitle") || "Personaliza tu experiencia"}
        </h2>

        {/* Volumen */}
        <p className="mb-2 text-sm font-semibold text-[#3d2a14]">
          {t("settingsVolumeLabel") || "Volumen"}
        </p>
        <div className="mb-6 flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#6f8f43]">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="#f4ead9" aria-hidden="true">
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

        {/* Toggles */}
        <div className="mb-6 grid grid-cols-2 gap-y-6">
          <Toggle
            on={hapticos}
            onClick={() => persistir("ajuste_hapticos", !hapticos, setHapticos)}
            label={t("settingsHapticsLabel") || "Hápticos"}
          />
          <Toggle
            on={musica}
            onClick={() => persistir("ajuste_musica", !musica, setMusica)}
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
        <div className="mt-auto flex justify-center pt-2">
          <Link
            to="/privacy"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-full bg-[#4a2e0e] px-8 py-3 text-sm font-semibold text-[#f4ead9] shadow-md transition-transform active:scale-95"
          >
            {t("settingsLegalButton") || "Aviso de privacidad"}
          </Link>
        </div>
      </div>

      {/* Estilo del thumb del slider (disco marrón) */}
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
