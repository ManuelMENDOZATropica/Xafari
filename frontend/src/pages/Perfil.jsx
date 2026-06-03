import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import XafariContext from "../components/XafariContext";
import { FACE_OFFSETS } from "../components/AvatarRender";
import SoundMenu from "../components/SoundMenu";

// Las 10 casas (mismas de la base de datos)
const CASAS = [
  "Viento", "Tierra", "Espiral", "Agua", "Fuego",
  "Cielo", "Eclipse", "Luna", "Sol", "Vida",
];
const CASA_OPTIONS = CASAS.map((c) => ({ value: c.toLowerCase(), label: `Casa ${c}` }));

const GENERO_OPTIONS = ["Femenino", "Masculino", "Otro"];

// Solo la cara, centrada en el círculo
function AvatarFaceOnly({ avatarData }) {
  const faceOptions = Array.from({ length: 23 }, (_, i) => `/avatares/cara (${i + 1}).png`);
  const idx = avatarData?.faceOptions || 0;
  const offset = FACE_OFFSETS[idx + 1] || { x: 0, y: 0 };
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <img
        src={faceOptions[idx]}
        alt="avatar"
        draggable={false}
        className="absolute left-1/2 top-1/2 w-[78%] object-contain"
        style={{
          transform: `translate(-50%, -50%) translate(${offset.x}%, ${offset.y}%)`
        }}
      />
      {avatarData?.expressionOptions !== undefined && avatarData?.expressionOptions !== null && avatarData?.expressionOptions > 0 && (
        <img
          src={`/avatares/expresiones/expresion (${avatarData.expressionOptions}).png`}
          alt="expression"
          draggable={false}
          className="absolute left-1/2 top-1/2 w-[78%] object-contain"
          style={{
            zIndex: 1,
            transform: `translate(-50%, -50%) translate(${offset.x}%, ${offset.y}%) scale(0.5) translateY(14%)`,
          }}
        />
      )}
    </div>
  );
}

export default function Perfil() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, setUser, token } = useContext(XafariContext);

  const baseUser = useMemo(
    () => user || JSON.parse(localStorage.getItem("user") || "{}"),
    [user]
  );

  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // Fecha en formato YYYY-MM-DD para el input date
  const birthdateInput = baseUser?.birthdate
    ? new Date(baseUser.birthdate).toISOString().split("T")[0]
    : "";

  const [form, setForm] = useState({
    name: baseUser?.name || "",
    lastname: baseUser?.lastname || "",
    email: baseUser?.email || "",
    birthdate: birthdateInput,
    pronouns: baseUser?.pronouns || "",
    casa: baseUser?.casa || "",
    reservationNumber: baseUser?.reservationNumber || "",
  });

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const cancelar = () => {
    setForm({
      name: baseUser?.name || "",
      lastname: baseUser?.lastname || "",
      email: baseUser?.email || "",
      birthdate: birthdateInput,
      pronouns: baseUser?.pronouns || "",
      casa: baseUser?.casa || "",
      reservationNumber: baseUser?.reservationNumber || "",
    });
    setEditando(false);
  };

  const guardar = async () => {
    // Nunca enviamos el correo (no editable)
    const payload = {
      name: form.name,
      lastname: form.lastname,
      birthdate: form.birthdate ? new Date(form.birthdate).toISOString() : undefined,
      pronouns: form.pronouns,
      casa: form.casa,
      reservationNumber: form.reservationNumber,
    };

    // Actualiza localmente siempre
    const merged = { ...baseUser, ...payload };
    setUser((prev) => ({ ...prev, ...payload }));
    localStorage.setItem("user", JSON.stringify(merged));

    // Persiste en backend si hay sesión
    if (token) {
      try {
        setGuardando(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL || "/api"}/user`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("update failed");
        const data = await res.json().catch(() => ({}));
        if (data.user) {
          setUser((prev) => ({ ...prev, ...data.user }));
          localStorage.setItem("user", JSON.stringify({ ...merged, ...data.user }));
        }
      } catch (e) {
        console.error("No se pudo guardar el perfil:", e);
      } finally {
        setGuardando(false);
      }
    }
    setEditando(false);
  };

  // ── Campo de formulario reutilizable ────────────────────────────────────────
  const labelCls = "mb-1 block text-sm font-semibold text-[#5b4636]";
  const inputCls =
    "w-full rounded-lg border border-[#cdbfa3] bg-[#fbf7ee] px-3 py-2 text-base text-[#352416] shadow-inner outline-none disabled:opacity-70 focus:border-[#80A850]";

  const Campo = ({ label, children }) => (
    <div className="mb-4">
      <span className={labelCls}>{label}</span>
      {children}
    </div>
  );

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
          onClick={() => navigate(-1)}
          className="rounded-full border border-[#cdbfa3] bg-white/80 p-2 shadow backdrop-blur-sm transition-all hover:bg-white active:scale-95"
          aria-label={t("back") || "Regresar"}
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
          onClick={() => setEditando((v) => !v)}
          aria-label={t("editProfile") || "Editar perfil"}
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
                src={`/avatares/cara (${(baseUser.avatar.faceOptions ?? 0) + 1}).png`}
                alt="avatar"
                draggable={false}
                className="absolute inset-0 w-full h-full object-contain"
                style={{
                  zIndex: 10,
                  transform: `translate(${FACE_OFFSETS[(baseUser.avatar.faceOptions ?? 0) + 1]?.x || 0}%, ${FACE_OFFSETS[(baseUser.avatar.faceOptions ?? 0) + 1]?.y || 0}%)`
                }}
              />
              {baseUser.avatar.expressionOptions !== undefined && baseUser.avatar.expressionOptions !== null && baseUser.avatar.expressionOptions > 0 && (
                <img
                  src={`/avatares/expresiones/expresion (${baseUser.avatar.expressionOptions}).png`}
                  alt="expression"
                  draggable={false}
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{
                    zIndex: 11,
                    transform: `translate(${FACE_OFFSETS[(baseUser.avatar.faceOptions ?? 0) + 1]?.x || 0}%, ${FACE_OFFSETS[(baseUser.avatar.faceOptions ?? 0) + 1]?.y || 0}%) scale(0.5) translateY(14%)`
                  }}
                />
              )}
            </>
          )}
        </button>
        <p className="mb-6 text-xs font-medium text-[#5b4636]">
          {editando ? "Editando perfil…" : "Toca tu avatar para editar"}
        </p>

        {/* Formulario */}
        <div className="w-full">
          <Campo label="Nombre">
            <input
              type="text"
              value={form.name}
              disabled={!editando}
              onChange={(e) => setField("name", e.target.value)}
              className={inputCls}
            />
          </Campo>

          <Campo label="Apellidos">
            <input
              type="text"
              value={form.lastname}
              disabled={!editando}
              onChange={(e) => setField("lastname", e.target.value)}
              className={inputCls}
            />
          </Campo>

          {/* Correo — nunca editable */}
          <Campo label="Correo electrónico">
            <input
              type="email"
              value={form.email}
              disabled
              className={`${inputCls} cursor-not-allowed bg-[#efe7d6]`}
            />
          </Campo>

          <Campo label="Fecha de nacimiento">
            <input
              type="date"
              value={form.birthdate}
              disabled={!editando}
              onChange={(e) => setField("birthdate", e.target.value)}
              className={inputCls}
            />
          </Campo>

          <Campo label="Género">
            <select
              value={form.pronouns}
              disabled={!editando}
              onChange={(e) => setField("pronouns", e.target.value)}
              className={inputCls}
            >
              <option value="">Selecciona…</option>
              {GENERO_OPTIONS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </Campo>

          <Campo label="Casa">
            <select
              value={form.casa}
              disabled={!editando}
              onChange={(e) => setField("casa", e.target.value)}
              className={inputCls}
            >
              <option value="">Selecciona…</option>
              {CASA_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </Campo>

          <Campo label="Número de reservación">
            <input
              type="text"
              value={form.reservationNumber}
              disabled={!editando}
              onChange={(e) => setField("reservationNumber", e.target.value)}
              className={inputCls}
            />
          </Campo>
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
              Cancelar
            </button>
            <button
              type="button"
              onClick={guardar}
              disabled={guardando}
              className="rounded-full bg-[#80A850] px-8 py-2.5 text-sm font-bold text-[#F7F3EA] shadow-md transition-transform active:scale-95 disabled:opacity-60"
            >
              {guardando ? "Guardando…" : "Guardar"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
