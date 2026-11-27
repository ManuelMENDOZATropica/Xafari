import { useContext, useId, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import XafariContext from "../components/XafariContext";
import { useTranslation } from "react-i18next";
import SoundMenu from "../components/SoundMenu";
import CloseIcon from "@/components/CloseIcon";
import DateDropdown from "@/components/DateDropdown";
import { api, ApiError } from "@/lib/api";


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

const PASSWORD_MIN = 8; // igual que el backend
const ADULT_AGE = 18;

/** Días del mes; con año desconocido febrero admite 29. */
function daysInMonth(month, year) {
  if (!month) return 31;
  return new Date(Number(year) || 2000, Number(month), 0).getDate();
}

/** Valida y arma la fecha (YYYY-MM-DD) o devuelve null si no existe o es futura. */
function buildBirthdate({ day, month, year }) {
  const d = Number(day);
  const m = Number(month);
  const y = Number(year);
  if (!d || !m || !y || d > daysInMonth(m, y)) return null;
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return null;
  if (date.getTime() > Date.now()) return null;
  return `${String(y).padStart(4, "0")}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function ageFrom(isoDate) {
  if (!isoDate) return null;
  const [y, m, d] = isoDate.split("-").map(Number);
  const now = new Date();
  let age = now.getFullYear() - y;
  if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d)) age -= 1;
  return age;
}

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

/* ── Casilla accesible (role=checkbox) con el estilo de Figma ── */
function ConsentCheckbox({ checked, onToggle, label }) {
  const labelId = useId();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "260px" }}>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-labelledby={labelId}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
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
          padding: 0,
        }}
      >
        {checked && <CloseIcon size={18} color="#7F5C34" />}
      </button>
      <span
        id={labelId}
        style={{
          color: "#F7F3EA",
          fontSize: "13px",
          fontFamily: "'Apercu Pro', sans-serif",
          fontWeight: 400,
          lineHeight: "1.35",
          textAlign: "left",
          flex: 1,
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { startSession } = useContext(XafariContext);

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
    parentalConsent: false,
  });

  const monthOptions = useMemo(
    () => (t("registerFlow.months", { returnObjects: true }) || []).map((m, i) => ({ value: String(i + 1), label: m })),
    [t]
  );
  const dayOptions = useMemo(
    () =>
      Array.from({ length: daysInMonth(formData.month, formData.year) }, (_, i) => ({
        value: String(i + 1),
        label: String(i + 1).padStart(2, "0"),
      })),
    [formData.month, formData.year]
  );
  const casaOptions = useMemo(
    () => CASAS.map((c) => ({ value: c.toLowerCase(), label: t("registerFlow.casaLabel", { name: c }) })),
    [t]
  );
  const birthdate = buildBirthdate(formData);
  const age = ageFrom(birthdate);
  const isMinor = age !== null && age < ADULT_AGE;
  const dateIncomplete = !formData.day || !formData.month || !formData.year;

  const steps = useMemo(
    () => [
      { title: t("registerFlow.step1Title"), titleSize: "50px" },
      { title: t("registerFlow.step2Title"), titleSize: "50px" },
      { title: t("registerFlow.step3Title"), titleSize: "40px" },
      { title: t("registerFlow.step4Title"), titleSize: "40px" },
    ],
    [t]
  );

  const handleChange = (key, value) => {
    setFormData((prev) => {
      const next = { ...prev, [key]: value };
      // Si el día ya no existe en el mes/año elegido (31 de febrero), se limpia.
      if ((key === "month" || key === "year") && Number(next.day) > daysInMonth(next.month, next.year)) {
        next.day = "";
      }
      return next;
    });
  };

  // ── Fuerza de contraseña ───────────────────────────────────────────────────────
  const getPasswordStrength = (pwd) => {
    if (!pwd || pwd.length < PASSWORD_MIN) return "weak";
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
        formData.password.length >= PASSWORD_MIN &&
        pwdMatch
      );
    }
    if (step === 2) return Boolean(birthdate) && formData.acceptTerms && (!isMinor || formData.parentalConsent);
    return Boolean(formData.casa);
  }, [formData, step, pwdMatch, birthdate, isMinor]);

  const goNext = async () => {
    if (!canContinue || loading) return;
    if (step < steps.length - 1) {
      setStep((prev) => prev + 1);
      return;
    }

    // ── Último step: registrar en backend ──────────────────────────────────
    if (!birthdate) {
      setStep(2);
      setServerError(t("registerFlow.errors.invalidDate"));
      return;
    }
    setServerError("");
    setLoading(true);

    try {
      const body = {
        name: formData.firstName.trim(),
        lastname: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        birthdate,
        casa: formData.casa,
        avatar: { bodyOptions: 0, faceOptions: 0 },
      };
      if (isMinor) body.parentalConsent = true;

      const data = await api.post("/users", body, { auth: false });
      startSession(data.token, data.user || data);
      navigate("/create-avatar");
    } catch (err) {
      const status = err instanceof ApiError ? err.status : 0;
      const msg = (err?.code || err?.message || "").toLowerCase();
      if (err instanceof ApiError && err.network) {
        setServerError(t("errors.network"));
      } else if (status === 409 || msg.includes("exist") || msg.includes("email")) {
        setServerError(t("registerFlow.errors.emailTaken"));
        setStep(1);
      } else if (msg.includes("parental")) {
        setServerError(t("registerFlow.errors.parentalConsent"));
        setStep(2);
      } else if (msg.includes("birthdate") || msg.includes("fecha")) {
        setServerError(t("registerFlow.errors.invalidDate"));
        setStep(2);
      } else if (status === 429) {
        setServerError(t("loginErrors.tooMany"));
      } else {
        setServerError(t("registerFlow.errors.generic"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTermsClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    navigate("/terms");
  };

  const handlePrivacyClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    navigate("/privacy");
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
              placeholder={t("registerFlow.firstNamePlaceholder")}
              aria-label={t("firstName")}
              autoComplete="given-name"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              style={INPUT_OVERLAY_STYLE}
            />
          </TextfieldWrapper>
          <TextfieldWrapper>
            <input
              type="text"
              placeholder={t("registerFlow.lastNamePlaceholder")}
              aria-label={t("lastName")}
              autoComplete="family-name"
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
        if (!formData.password || formData.password.length < PASSWORD_MIN) return t("registerFlow.pwd.tooShort", { min: PASSWORD_MIN });
        const hasLetter = /[A-Za-z]/.test(formData.password);
        const hasDigit = /\d/.test(formData.password);
        if (!hasLetter || !hasDigit) return t("registerFlow.pwd.weak");
        if (pwdStrength === "medium") return t("registerFlow.pwd.medium");
        return t("registerFlow.pwd.strong");
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
          aria-label={visible ? t("hidePassword") : t("showPassword")}
          aria-pressed={visible}
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
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          ) : (
            // ojo cerrado
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
              placeholder={t("registerFlow.emailPlaceholder")}
              aria-label={t("email")}
              autoComplete="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              style={INPUT_OVERLAY_STYLE}
            />
          </TextfieldWrapper>
          {emailInvalid && (
            <p style={{ marginTop: "-10px", fontSize: "12px", color: "#9C3E32", fontFamily: "'Apercu Pro', sans-serif", fontWeight: 500 }}>
              {t("registerFlow.errors.invalidEmail")}
            </p>
          )}

          {/* Contraseña */}
          <div style={{ position: "relative" }}>
            <TextfieldWrapper>
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t("password")}
                aria-label={t("password")}
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
                placeholder={t("confirmPassword")}
                aria-label={t("confirmPassword")}
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
              {pwdMatch ? t("registerFlow.pwd.match") : t("passwordsDoNotMatch")}
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
            options={dayOptions}
            triggerImg="/iconos/textfieldDia.png"
            vacioImg="/iconos/textfieldDiaVacio.png"
            width={100}
            placeholder={t("registerFlow.dayPlaceholder")}
            fontSize={17}
          />
          <DateDropdown
            value={formData.month}
            onChange={(v) => handleChange("month", v)}
            options={monthOptions}
            triggerImg="/iconos/textfieldMes.png"
            vacioImg="/iconos/textfieldMesVacio.png"
            width={113}
            placeholder={t("registerFlow.monthPlaceholder")}
            fontSize={15}
          />
          <DateDropdown
            value={formData.year}
            onChange={(v) => handleChange("year", v)}
            options={YEAR_OPTIONS}
            triggerImg="/iconos/textfieldAnio.png"
            vacioImg="/iconos/textfieldAnioVacio.png"
            width={97}
            placeholder={t("registerFlow.yearPlaceholder")}
            fontSize={15}
          />
        </div>
        {!dateIncomplete && !birthdate && (
          <p role="alert" style={{ marginTop: "-12px", fontSize: "13px", color: "#F7F3EA", fontWeight: 600 }}>
            {t("registerFlow.errors.invalidDate")}
          </p>
        )}
      </div>
    );

    /* — Step 3: Casa — */
    return (
      <div style={{ width: "303px" }}>
        <DateDropdown
          value={formData.casa}
          onChange={(v) => handleChange("casa", v)}
          options={casaOptions}
          triggerImg="/iconos/textfieldMes.png"
          vacioImg="/iconos/textfieldMesVacio.png"
          width={152}
          placeholder={t("registerFlow.casaPlaceholder")}
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

        {/* Casillas — solo step 2, arriba del botón */}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            {isMinor && (
              <ConsentCheckbox
                checked={formData.parentalConsent}
                onToggle={() => handleChange("parentalConsent", !formData.parentalConsent)}
                label={t("registerFlow.parentalConsent")}
              />
            )}
            <ConsentCheckbox
              checked={formData.acceptTerms}
              onToggle={() => handleChange("acceptTerms", !formData.acceptTerms)}
              label={
                <>
                  {t("registerFlow.acceptTermsPrefix")}{" "}
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
                    {t("registerFlow.acceptTermsLink")}
                  </button>{" "}
                  {t("registerFlow.acceptPrivacyPrefix")}{" "}
                  <button
                    type="button"
                    onClick={handlePrivacyClick}
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
                    {t("registerFlow.acceptPrivacyLink")}
                  </button>
                </>
              }
            />
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
            <div role="alert" style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
              backgroundColor: "rgba(156, 62, 50, 0.85)",
              borderRadius: "12px",
              padding: "10px 14px",
              maxWidth: "280px",
              backdropFilter: "blur(4px)",
            }}>
              <span aria-hidden="true" style={{ fontSize: "16px", flexShrink: 0, marginTop: "1px" }}>⚠️</span>
              <p style={{
                fontSize: "13px",
                color: "#fff",
                fontFamily: "'Apercu Pro', sans-serif",
                fontWeight: 500,
                margin: 0,
                lineHeight: "1.4",
                textAlign: "left",
              }}>
                {serverError}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
