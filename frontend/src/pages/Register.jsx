import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import XafariContext from "../components/XafariContext";
import { useTranslation } from "react-i18next";
import SoundMenu from "../components/SoundMenu";
import CloseIcon from "@/components/CloseIcon";
import DateDropdown from "@/components/DateDropdown";


const INPUT_OVERLAY_STYLE = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  background: "transparent",
  border: "none",
  outline: "none",
  padding: "0 12px",
  fontFamily: "'Apercu Pro', sans-serif",
  fontSize: "20px",
  fontWeight: 400,
  color: "#352416",
  boxSizing: "border-box",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => ({
  value: String(i + 1),
  label: String(i + 1).padStart(2, "0"),
}));
const MONTH_OPTIONS = MONTHS.map((m, i) => ({ value: String(i + 1), label: m }));
const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 100 }, (_, i) => ({
  value: String(currentYear - i),
  label: String(currentYear - i),
}));

/* Las 10 casas (mismas de la base de datos) */
const CASAS = [
  "Viento", "Tierra", "Espiral", "Agua", "Fuego",
  "Cielo", "Eclipse", "Luna", "Sol", "Vida",
];
const CASA_OPTIONS = CASAS.map((c) => ({
  value: c.toLowerCase(),
  label: `Casa ${c}`,
}));

/* ── Textfield image wrapper (fuera del componente para evitar remount) ── */
function TextfieldWrapper({ children }) {
  return (
    <div style={{ position: "relative", width: "303px", height: "44px" }}>
      <img
        src="/iconos/Textfield.png"
        alt=""
        draggable={false}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "fill" }}
      />
      {children}
    </div>
  );
}

export default function Register() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { setUser, setToken } = useContext(XafariContext);

  const [step, setStep] = useState(0);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    day: "",
    month: "",
    year: "",
    casa: "",
    acceptTerms: false,
  });

  const steps = useMemo(
    () => [
      { title: t("registerFlow.step1Title"), titleSize: "50px" },
      { title: t("registerFlow.step2Title"), titleSize: "50px" },
      { title: t("registerFlow.step3Title"), titleSize: "40px" },
      { title: t("registerFlow.step4Title"), titleSize: "40px" },
    ],
    [t, i18n.language]
  );

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // ── Fuerza de contraseña ───────────────────────────────────────────────────────
  const getPasswordStrength = (pwd) => {
    if (!pwd || pwd.length < 8) return "weak";
    const hasLetter = /[A-Za-z]/.test(pwd);
    const hasDigit = /\d/.test(pwd);
    const hasSpecial = /[@$!%*?&#^()_+\-={}|]/.test(pwd);
    if (hasLetter && hasDigit && hasSpecial && pwd.length >= 10) return "strong";
    if (hasLetter && hasDigit) return "medium";
    return "weak";
  };
  const pwdStrength = getPasswordStrength(formData.password);
  const pwdMatch = formData.password.length > 0 && formData.password === formData.confirmPassword;

  const canContinue = useMemo(() => {
    if (step === 0) return formData.firstName.trim() && formData.lastName.trim();
    if (step === 1) {
      return (
        EMAIL_REGEX.test(formData.email.trim()) &&
        pwdStrength !== "weak" &&
        pwdMatch
      );
    }
    if (step === 2) return formData.day && formData.month && formData.year && formData.acceptTerms;
    return Boolean(formData.casa);
  }, [formData, step, pwdStrength, pwdMatch]);

  const goNext = async () => {
    if (!canContinue || loading) return;
    if (step < steps.length - 1) {
      setStep((prev) => prev + 1);
      return;
    }

    // ── Último step: registrar en backend ──────────────────────────────────
    const birthdate = `${formData.year.padStart(4, "0")}-${formData.month.padStart(2, "0")}-${formData.day.padStart(2, "0")}`;
    setServerError("");
    setLoading(true);

    try {
      const body = {
        name: formData.firstName.trim(),
        lastname: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        birthdate: new Date(birthdate).toISOString(),
        reservationNumber: formData.roomNumber || "",
        casa: formData.casa,
        avatar: { bodyOptions: 0, faceOptions: 0 },
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL || "/api"}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data?.error || "Ocurrió un error al registrarse.");
        setLoading(false);
        return;
      }

      // Persistir token y usuario en contexto
      const userFromServer = data.user || data;
      setToken(data.token);
      setUser((prev) => ({
        ...prev,
        ...userFromServer,
        name: userFromServer.name,
        lastname: userFromServer.lastname,
        email: userFromServer.email,
        birthdate: userFromServer.birthdate,
        casa: userFromServer.casa,
        avatar: userFromServer.avatar || { bodyOptions: 0, faceOptions: 0 },
      }));
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userFromServer));

      navigate("/create-avatar");
    } catch (err) {
      console.error(err);
      setServerError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleTermsClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    navigate("/terms");
  };

  /* ── Step renders ─────────────────────────────────────────────── */
  const renderFields = () => {
    /* — Step 0: Nombre & Apellido — */
    if (step === 0) {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "303px" }}>
          <TextfieldWrapper>
            <input
              type="text"
              placeholder="Nombre"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              style={INPUT_OVERLAY_STYLE}
            />
          </TextfieldWrapper>
          <TextfieldWrapper>
            <input
              type="text"
              placeholder="Apellido"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              style={INPUT_OVERLAY_STYLE}
            />
          </TextfieldWrapper>
        </div>
      );
    }

    /* — Step 1: Email + Contraseña — */
    if (step === 1) {
      const emailInvalid = formData.email.trim() && !EMAIL_REGEX.test(formData.email.trim());

      // Colores y ancho de la barra de fuerza
      const getStrengthLabel = () => {
        if (!formData.password || formData.password.length < 8) return "Débil — mín. 8 caracteres";
        const hasLetter = /[A-Za-z]/.test(formData.password);
        const hasDigit = /\d/.test(formData.password);
        if (!hasLetter || !hasDigit) return "Débil — combina letras y números";
        if (pwdStrength === "medium") return "Media — agrega un símbolo (!@#$...) para hacerla fuerte";
        return "Fuerte ✔";
      };
      const strengthMeta = {
        weak:   { color: "#c0392b", w: "30%"  },
        medium: { color: "#27ae60", w: "65%"  },
        strong: { color: "#27ae60", w: "100%" },
      };
      const sm = strengthMeta[pwdStrength];

      const EYE_BTN = (visible, toggle) => (
        <button
          type="button"
          onClick={toggle}
          aria-label={visible ? "Ocultar" : "Mostrar"}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            lineHeight: 1,
            color: "#7c5c38",
          }}
        >
          {visible ? (
            // ojo abierto
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          ) : (
            // ojo cerrado
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          )}
        </button>
      );

      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "303px" }}>
          {/* Email */}
          <TextfieldWrapper>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              style={INPUT_OVERLAY_STYLE}
            />
          </TextfieldWrapper>
          {emailInvalid && (
            <p style={{ marginTop: "-10px", fontSize: "12px", color: "#9C3E32", fontFamily: "'Apercu Pro', sans-serif", fontWeight: 500 }}>
              Ingresa un correo válido (ej: nombre@dominio.com)
            </p>
          )}

          {/* Contraseña */}
          <div style={{ position: "relative" }}>
            <TextfieldWrapper>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                style={{ ...INPUT_OVERLAY_STYLE, paddingRight: "36px" }}
                autoComplete="new-password"
              />
            </TextfieldWrapper>
            {EYE_BTN(showPassword, () => setShowPassword((v) => !v))}
          </div>

          {/* Barra de fuerza */}
          {formData.password.length > 0 && (
            <div style={{ marginTop: "-8px" }}>
              <div style={{ height: "4px", borderRadius: "4px", background: "rgba(255,255,255,0.25)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: sm.w, background: sm.color, borderRadius: "4px", transition: "width 0.3s, background 0.3s" }} />
              </div>
              <p style={{ marginTop: "4px", fontSize: "11px", color: "#000000", fontFamily: "'Apercu Pro', sans-serif", fontWeight: 600 }}>
                {getStrengthLabel()}
              </p>
            </div>
          )}

          {/* Confirmar contraseña */}
          <div style={{ position: "relative" }}>
            <TextfieldWrapper>
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirmar contraseña"
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                style={{ ...INPUT_OVERLAY_STYLE, paddingRight: "36px" }}
                autoComplete="new-password"
              />
            </TextfieldWrapper>
            {EYE_BTN(showConfirm, () => setShowConfirm((v) => !v))}
          </div>

          {/* Indicador de coincidencia */}
          {formData.confirmPassword.length > 0 && (
            <p style={{ marginTop: "-8px", fontSize: "11px", fontFamily: "'Apercu Pro', sans-serif", fontWeight: 600,
              color: pwdMatch ? "#27ae60" : "#c0392b" }}>
              {pwdMatch ? "Las contraseñas coinciden ✔" : "Las contraseñas no coinciden"}
            </p>
          )}
        </div>
      );
    }

    /* — Step 2: Cumpleaños — */
    if (step === 2) return (
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Dropdowns custom con 7 items visibles */}
        <div style={{ display: "flex", justifyContent: "space-between", width: "313px", gap: "8px" }}>
          <DateDropdown
            value={formData.day}
            onChange={(v) => handleChange("day", v)}
            options={DAY_OPTIONS}
            triggerImg="/iconos/textfieldDia.png"
            vacioImg="/iconos/textfieldDiaVacio.png"
            width={100}
            placeholder="Día"
            fontSize={17}
          />
          <DateDropdown
            value={formData.month}
            onChange={(v) => handleChange("month", v)}
            options={MONTH_OPTIONS}
            triggerImg="/iconos/textfieldMes.png"
            vacioImg="/iconos/textfieldMesVacio.png"
            width={113}
            placeholder="Mes"
            fontSize={15}
          />
          <DateDropdown
            value={formData.year}
            onChange={(v) => handleChange("year", v)}
            options={YEAR_OPTIONS}
            triggerImg="/iconos/textfieldAnio.png"
            vacioImg="/iconos/textfieldAnioVacio.png"
            width={97}
            placeholder="Año"
            fontSize={15}
          />
        </div>

      </div>
    );

    /* — Step 3: Casa — */
    return (
      <div style={{ width: "303px" }}>
        <DateDropdown
          value={formData.casa}
          onChange={(v) => handleChange("casa", v)}
          options={CASA_OPTIONS}
          triggerImg="/iconos/textfieldMes.png"
          vacioImg="/iconos/textfieldMesVacio.png"
          width={152}
          placeholder={t("registerFlow.casaPlaceholder") || "Selecciona tu casa"}
          fontSize={15}
        />
      </div>
    );
  };

  /* ── Button styles ───────────────────────────────────────────── */
  const btnActive = {
    width: "200px", height: "60px",
    borderRadius: "30px",
    backgroundColor: "#80A850",
    color: "#F7F3EA",
    fontSize: "24px", fontWeight: 700,
    border: "none", cursor: "pointer",
    boxShadow: "3.2px 3.2px 3.2px 0px rgba(0,0,0,0.25)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Apercu Pro', sans-serif",
  };
  const btnDisabled = {
    ...btnActive,
    backgroundColor: "rgba(199, 219, 178, 0.92)",
    color: "rgba(149, 174, 123, 0.88)",
    cursor: "not-allowed",
    boxShadow: "none",
  };

  return (
    <div
      className="font-apercu"
      style={{
        position: "relative",
        width: "100vw",
        minHeight: "100dvh",
        overflow: "hidden",
        backgroundColor: "rgba(107, 138, 80, 1)",
      }}
    >
      {/* ── Patrón SVG con opacidad 0.45 ─────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/img/patron.svg')",
          backgroundRepeat: "repeat",
          backgroundSize: "1162px 1117px",
          backgroundPosition: "center",
          opacity: 0.45,
          zIndex: 0,
        }}
      />

      {/* ── Sound — top right ─────────────────────────────────────── */}
      <div style={{ position: "absolute", top: "27px", right: "20px", zIndex: 20 }}>
        <SoundMenu />
      </div>

      {/* ── Contenido ─────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          minHeight: "100dvh",
          padding: "0 35px",
        }}
      >
        {/* Título — Volume TC, tamaño por step */}
        <div style={{ flex: "0 0 auto", marginTop: "285px" }}>
          <h1
            style={{
              fontFamily: "'Volume TC', sans-serif",
              fontSize: steps[step].titleSize,
              fontWeight: 400,
              color: "#F7F3EA",
              margin: 0,
              lineHeight: "normal",
              width: "323px",
            }}
          >
            {steps[step].title}
          </h1>
        </div>

        {/* Campos */}
        <div style={{ marginTop: "20px" }}>
          {renderFields()}
        </div>

        {/* Espaciador */}
        <div style={{ flex: 1 }} />

        {/* Checkbox términos — centrado, solo step 2, arriba del botón */}
        {step === 2 && (
          <div style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "16px",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "230px",
            }}>
              {/* Caja checkbox — CloseIcon del proyecto al activar */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleChange("acceptTerms", !formData.acceptTerms);
                }}
                style={{
                  width: "30px",
                  height: "30px",
                  flexShrink: 0,
                  border: "2px solid #7F5C34",
                  borderRadius: "3px",
                  backgroundColor: "#F7F3EA",
                  boxShadow: "2px 2px 2px rgba(0,0,0,0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                {formData.acceptTerms && (
                  <CloseIcon size={18} color="#7F5C34" />
                )}
              </div>
              {/* Texto — left-align, 13px, 2 líneas */}
              <span style={{
                color: "#F7F3EA",
                fontSize: "13px",
                fontFamily: "'Apercu Pro', sans-serif",
                fontWeight: 400,
                lineHeight: "1.35",
                textAlign: "left",
                flex: 1,
              }}>
                Estoy de acuerdo y acepto los{" "}
                <button
                  type="button"
                  onClick={handleTermsClick}
                  style={{
                    color: "#F7F3EA",
                    textDecoration: "underline",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontFamily: "'Apercu Pro', sans-serif",
                    padding: 0,
                  }}
                >
                  términos y condiciones
                </button>
              </span>
            </div>
          </div>
        )}



        {/* Botón Siguiente */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", paddingBottom: "96px" }}>
          <button
            type="button"
            onClick={goNext}
            disabled={!canContinue || loading}
            style={canContinue && !loading ? btnActive : btnDisabled}
          >
            {loading ? "..." : t("next")}
          </button>
          {serverError && (
            <p style={{
              fontSize: "13px",
              color: "#fca5a5",
              fontFamily: "'Apercu Pro', sans-serif",
              textAlign: "center",
              maxWidth: "280px",
            }}>
              {serverError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
