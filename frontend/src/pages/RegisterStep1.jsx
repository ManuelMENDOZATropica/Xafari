import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function RegisterStep1() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Evaluar la fortaleza de la contraseña
  const getPasswordStrength = (password) => {
    if (password.length < 6) return "weak";
    if (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password)) return "medium";
    if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) return "strong";
    return "weak";
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const passwordsMatch = formData.password === formData.confirmPassword && formData.password.length > 0;
  const isFormValid = formData.firstName && formData.lastName && formData.email && passwordsMatch;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-white px-6">
      {/* Barra superior con Volver y Language */}
      <div className="flex justify-between w-full max-w-md absolute top-4 px-4">
        <button onClick={() => navigate("/")} className="border border-gray-500 bg-white text-black px-3 py-1 rounded-lg shadow-md hover:bg-gray-200">
          ← {t("back")}
        </button>
        <button
          onClick={() => i18n.changeLanguage(i18n.language === "es" ? "en" : "es")}
          className="border border-gray-500 bg-white text-black px-3 py-1 rounded-lg shadow-md hover:bg-gray-200"
        >
          {t("language")}
        </button>
      </div>

      {/* Texto principal */}
      <p className="mt-16 mb-6 text-center text-black font-semibold">{t("registerStep1")}</p>

      {/* Formulario */}
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md border border-gray-500">
        <label className="block text-black mb-1">{t("firstName")}</label>
        <input
          type="text"
          name="firstName"
          placeholder={t("firstName")}
          value={formData.firstName}
          onChange={handleChange}
          className="w-full p-2 border border-gray-500 rounded bg-white text-black mb-4"
        />

        <label className="block text-black mb-1">{t("lastName")}</label>
        <input
          type="text"
          name="lastName"
          placeholder={t("lastName")}
          value={formData.lastName}
          onChange={handleChange}
          className="w-full p-2 border border-gray-500 rounded bg-white text-black mb-4"
        />

        <label className="block text-black mb-1">{t("email")}</label>
        <input
          type="email"
          name="email"
          placeholder={t("email")}
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border border-gray-500 rounded bg-white text-black mb-4"
        />

        <label className="block text-black mb-1">{t("password")}</label>
        <input
          type="password"
          name="password"
          placeholder={t("password")}
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border border-gray-500 rounded bg-white text-black mb-2"
        />

        {/* Indicador de fortaleza de la contraseña */}
        <div className="w-full h-2 rounded mb-4">
          <div
            className={`h-full ${
              passwordStrength === "weak"
                ? "bg-red-500 w-1/12"
                : passwordStrength === "medium"
                ? "bg-yellow-500 w-2/12"
                : "bg-green-500 w-3/12"
            }`}
          ></div>
        </div>
        <p
          className={`text-sm ${
            passwordStrength === "weak"
              ? "text-red-500"
              : passwordStrength === "medium"
              ? "text-yellow-500"
              : "text-green-500"
          }`}
        >
          {passwordStrength === "weak"
            ? t("passwordWeak")
            : passwordStrength === "medium"
            ? t("passwordMedium")
            : t("passwordStrong")}
        </p>

        <label className="block text-black mt-4 mb-1">{t("confirmPassword")}</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder={t("confirmPassword")}
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full p-2 border border-gray-500 rounded bg-white text-black mb-4"
        />
        {!passwordsMatch && <p className="text-red-500">{t("passwordsDoNotMatch")}</p>}

        {/* Botón de Continuar */}
        <button
          disabled={!isFormValid}
          onClick={() => navigate("/register-step2", { state: formData })}
          className={`mt-6 w-full p-2 border border-gray-500 rounded ${
            isFormValid ? "bg-gray-200 hover:bg-gray-300 text-black" : "bg-gray-100 text-gray-600 cursor-not-allowed"
          }`}
        >
          {t("continue")}
        </button>
      </div>
    </div>
  );
}
