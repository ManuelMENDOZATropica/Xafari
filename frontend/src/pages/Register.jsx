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
  const { setUser } = useContext(XafariContext);

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    day: "",
    month: "",
    year: "",
    acceptTerms: false,
  });

  const steps = useMemo(
    () => [
      { title: t("registerFlow.step1Title"), titleSize: "50px" },
      { title: t("registerFlow.step2Title"), titleSize: "50px" },
      { title: t("registerFlow.step3Title"), titleSize: "40px" },
    ],
    [t, i18n.language]
  );

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const canContinue = useMemo(() => {
    if (step === 0) return formData.firstName.trim() && formData.lastName.trim();
    if (step === 1) return EMAIL_REGEX.test(formData.email.trim());
    return formData.day && formData.month && formData.year && formData.acceptTerms;
  }, [formData, step]);

  const goNext = () => {
    if (!canContinue) return;
    if (step < steps.length - 1) {
      setStep((prev) => prev + 1);
      return;
    }
    const birthdate = `${formData.year.padStart(4, "0")}-${formData.month.padStart(2, "0")}-${formData.day.padStart(2, "0")}`;
    setUser((prev) => ({
      ...prev,
      name: formData.firstName.trim(),
      lastname: formData.lastName.trim(),
      email: formData.email.trim(),
      birthdate,
    }));
    navigate("/create-avatar");
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

    /* — Step 1: Email — */
    if (step === 1) {
      const emailInvalid = formData.email.trim() && !EMAIL_REGEX.test(formData.email.trim());
      return (
        <div style={{ width: "303px" }}>
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
            <p style={{
              marginTop: "6px",
              fontSize: "12px",
              color: "#9C3E32",
              fontFamily: "'Apercu Pro', sans-serif",
              fontWeight: 500,
            }}>
              Ingresa un correo válido (ej: nombre@dominio.com)
            </p>
          )}
        </div>
      );
    }

    /* — Step 2: Cumpleaños — */
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

    return (
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
        <div style={{ display: "flex", justifyContent: "center", paddingBottom: "96px" }}>
          <button
            type="button"
            onClick={goNext}
            disabled={!canContinue}
            style={canContinue ? btnActive : btnDisabled}
          >
            {t("next")}
          </button>
        </div>
      </div>
    </div>
  );
}
