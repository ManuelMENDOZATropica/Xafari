import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import XafariContext from "../components/XafariContext";
import { FACE_OFFSETS } from "@/data/avatar";
import SoundMenu from "../components/SoundMenu";
import { api, ApiError } from "@/lib/api";

// Las 10 casas (mismas de la base de datos)
const CASAS = [
  "Viento", "Tierra", "Espiral", "Agua", "Fuego",
  "Cielo", "Eclipse", "Luna", "Sol", "Vida",
];

const GENERO_OPTIONS = ["female", "male", "other"];

const labelCls = "mb-1 block text-sm font-semibold text-[#5b4636]";
const inputCls =
  "w-full rounded-lg border border-[#cdbfa3] bg-[#fbf7ee] px-3 py-2 text-base text-[#352416] shadow-inner outline-none disabled:opacity-70 focus:border-[#80A850]";

// Fuera del componente: si se define dentro, React lo vuelve a montar en cada tecla.
function Campo({ id, label, children }) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

function toDateInput(value) {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
}

function formFrom(u) {
  return {
    name: u?.name || "",
    lastname: u?.lastname || "",
    email: u?.email || "",
    birthdate: toDateInput(u?.birthdate),
    pronouns: u?.pronouns || "",
    casa: u?.casa || "",
    reservationNumber: u?.reservationNumber || "",
  };
}

export default function Perfil() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, setUser } = useContext(XafariContext);

  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(() => formFrom(user));

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const empezarEdicion = () => {
    setForm(formFrom(user));
    setError("");
    setEditando(true);
  };

  const cancelar = () => {
    setForm(formFrom(user));
    setError("");
    setEditando(false);
  };

  const guardar = async () => {
    if (!form.name.trim()) {
      setError(t("profile.errors.nameRequired"));
      return;
    }
    // Solo campos de perfil (CONTRATO-API §2): ni correo, ni casa, ni contraseña.
    const payload = {
      name: form.name.trim(),
      lastname: form.lastname.trim(),
      pronouns: form.pronouns || null,
      reservationNumber: form.reservationNumber.trim() || null,
    };
    if (form.birthdate) payload.birthdate = form.birthdate;

    setGuardando(true);
    setError("");
    try {
      const data = await api.put("/user", payload);
      setUser((prev) => ({ ...prev, ...(data?.user || payload) }));
      setEditando(false);
    } catch (err) {
      setError(err instanceof ApiError && err.network ? t("errors.network") : t("profile.errors.save"));
    } finally {
      setGuardando(false);
    }
  };

  const baseUser = user;
  const shown = editando ? form : formFrom(user);

  return (
    <div
      className="relative min-h-screen w-screen overflow-y-auto font-apercu"
      style={{ backgroundColor: "#e8dcc4" }}
    >
      {/* Textura sutil */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: "url('/img/patron.svg')",
          backgroundSize: "900px",
          backgroundRepeat: "repeat",
          opacity: 0.12,
        }}
      />

      {/* Botón regresar */}
      <div className="absolute left-4 top-4 z-20">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-full border border-[#cdbfa3] bg-white/80 p-2 shadow backdrop-blur-sm transition-all hover:bg-white active:scale-95"
          aria-label={t("back")}
        >
          <img src="/iconos/icon_regresar.svg" alt="" className="h-6 w-6" />
        </button>
      </div>

      {/* Sonido arriba a la derecha */}
      <div className="absolute right-4 top-4 z-20">
        <SoundMenu />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center px-6 pb-12 pt-16">
        {/* Avatar — elipse + cara */}
        <button
          type="button"
          onClick={() => (editando ? cancelar() : empezarEdicion())}
          aria-label={t("editProfile")}
          className="relative mb-2 bg-transparent transition-transform active:scale-95"
          style={{ width: "163px", height: "163px" }}
        >
          {/* Marco elipse debajo */}
          <img
            src="/iconos/elipseAvatar.png"
            alt=""
            className="absolute inset-0 w-full h-full object-contain"
          />
          {/* Cara encima */}
          {baseUser?.avatar && (
            <>
              <img
                src={`/avatares/cara-${(baseUser.avatar.faceOptions ?? 0) + 1}.webp`}
                alt=""
                draggable={false}
                className="absolute inset-0 w-full h-full object-contain"
                style={{
                  zIndex: 10,
                  transform: `translate(${FACE_OFFSETS[(baseUser.avatar.faceOptions ?? 0) + 1]?.x || 0}%, ${FACE_OFFSETS[(baseUser.avatar.faceOptions ?? 0) + 1]?.y || 0}%)`
                }}
              />
            </>
          )}
        </button>
        <p className="mb-6 text-xs font-medium text-[#5b4636]">
          {editando ? t("profile.editing") : t("profile.tapToEdit")}
        </p>

        {/* Formulario */}
        <div className="w-full">
          <Campo id="perfil-nombre" label={t("profile.name")}>
            <input id="perfil-nombre" type="text" autoComplete="given-name" value={shown.name} disabled={!editando}
              onChange={(e) => setField("name", e.target.value)} className={inputCls} />
          </Campo>

          <Campo id="perfil-apellidos" label={t("profile.lastname")}>
            <input id="perfil-apellidos" type="text" autoComplete="family-name" value={shown.lastname} disabled={!editando}
              onChange={(e) => setField("lastname", e.target.value)} className={inputCls} />
          </Campo>

          {/* Correo — nunca editable */}
          <Campo id="perfil-email" label={t("email")}>
            <input id="perfil-email" type="email" value={shown.email} disabled
              className={`${inputCls} cursor-not-allowed bg-[#efe7d6]`} />
          </Campo>

          <Campo id="perfil-nacimiento" label={t("profile.birthdate")}>
            <input id="perfil-nacimiento" type="date" value={shown.birthdate} disabled={!editando}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => setField("birthdate", e.target.value)} className={inputCls} />
          </Campo>

          <Campo id="perfil-genero" label={t("profile.gender")}>
            <select id="perfil-genero" value={shown.pronouns} disabled={!editando}
              onChange={(e) => setField("pronouns", e.target.value)} className={inputCls}>
              <option value="">{t("profile.select")}</option>
              {GENERO_OPTIONS.map((g) => (
                <option key={g} value={g}>{t(`profile.genders.${g}`)}</option>
              ))}
              {shown.pronouns && !GENERO_OPTIONS.includes(shown.pronouns) && (
                <option value={shown.pronouns}>{shown.pronouns}</option>
              )}
            </select>
          </Campo>

          {/* Casa — la asigna el registro; el contrato no permite cambiarla aquí */}
          <Campo id="perfil-casa" label={t("profile.house")}>
            <select id="perfil-casa" value={shown.casa} disabled className={`${inputCls} cursor-not-allowed bg-[#efe7d6]`}>
              <option value="">{t("profile.select")}</option>
              {CASAS.map((c) => (
                <option key={c} value={c.toLowerCase()}>{t("registerFlow.casaLabel", { name: c })}</option>
              ))}
            </select>
          </Campo>

          <Campo id="perfil-reserva" label={t("roomNumber")}>
            <input id="perfil-reserva" type="text" value={shown.reservationNumber} disabled={!editando}
              onChange={(e) => setField("reservationNumber", e.target.value)} className={inputCls} />
          </Campo>
          {error && <p role="alert" className="mb-2 text-sm font-semibold text-red-800">{error}</p>}
        </div>

        {/* Acciones */}
        {editando && (
          <div className="mt-2 flex w-full items-center justify-center gap-3">
            <button
              type="button"
              onClick={cancelar}
              disabled={guardando}
              className="rounded-full border border-[#cdbfa3] bg-white/70 px-6 py-2.5 text-sm font-semibold text-[#5b4636] shadow transition-transform active:scale-95"
            >
              {t("profile.cancel")}
            </button>
            <button
              type="button"
              onClick={guardar}
              disabled={guardando}
              className="rounded-full bg-[#80A850] px-8 py-2.5 text-sm font-bold text-[#F7F3EA] shadow-md transition-transform active:scale-95 disabled:opacity-60"
            >
              {guardando ? t("profile.saving") : t("profile.save")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
