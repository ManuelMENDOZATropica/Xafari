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
    <div className="relative h-screen w-full overflow-hidden font-lufga">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 z-0">
        <img
          src="/img/fondo-registro.png"
          alt="Fondo Registro"
          className="w-full h-full object-cover object-bottom md:object-center"
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen px-[6%] pt-20 pb-10 overflow-y-auto">
        {/* Encabezado fijo */}
        <div className="absolute top-4 left-4">
          <button
            onClick={() => navigate("/")}
            className="bg-white/80 backdrop-blur-sm text-black px-4 py-2 rounded-full shadow border border-gray-300 hover:bg-white"
          >
            ← {t("back")}
          </button>
        </div>

        <div className="absolute top-4 right-4">
          <button
            onClick={() => i18n.changeLanguage(i18n.language === "es" ? "en" : "es")}
            className="bg-white/80 backdrop-blur-sm text-black px-4 py-2 rounded-full shadow border border-gray-300 hover:bg-white"
          >
            {t("language")}
          </button>
        </div>

        {/* Texto principal */}
        <div className="w-full mb-4 p2">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl px-6 py-3 shadow-md">
            <p className="text-center text-base md:text-lg font-bold text-gray-800">
              {t("registerStep1")}
            </p>
          </div>
        </div>

        {/* Formulario */}
        <div className="w-full h-[72vh] min-h-0 bg-white/50 backdrop-blur-sm p-4 rounded-xl shadow-xl overflow-y-auto flex flex-col gap-3">
          <label className="block text-black text-sm md:text-base font-semibold">
            {t("firstName")}
          </label>
          <input
            type="text"
            name="firstName"
            placeholder={t("firstName")}
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-black text-base shadow-inner"
          />

          <label className="block text-black text-sm md:text-base font-semibold">
            {t("lastName")}
          </label>
          <input
            type="text"
            name="lastName"
            placeholder={t("lastName")}
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-black text-base shadow-inner"
          />

          <label className="block text-black text-sm md:text-base font-semibold">
            {t("email")}
          </label>
          <input
            type="email"
            name="email"
            placeholder={t("email")}
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-black text-base shadow-inner"
          />

          <label className="block text-black text-sm md:text-base font-semibold">
            {t("password")}
          </label>
          <input
            type="password"
            name="password"
            placeholder={t("password")}
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-black text-base shadow-inner"
          />

          <div className="w-full h-2 rounded">
            <div
              className={`h-full rounded transition-all duration-300 ${
                passwordStrength === "weak"
                  ? "bg-red-500 w-1/12"
                  : passwordStrength === "medium"
                  ? "bg-yellow-500 w-2/12"
                  : "bg-green-500 w-3/12"
              }`}
            ></div>
          </div>

          <p
            className={`text-sm font-medium ${
              passwordStrength === "weak"
                ? "text-red-600"
                : passwordStrength === "medium"
                ? "text-yellow-600"
                : "text-green-600"
            }`}
          >
            {passwordStrength === "weak"
              ? t("passwordWeak")
              : passwordStrength === "medium"
              ? t("passwordMedium")
              : t("passwordStrong")}
          </p>

          <label className="block text-black text-sm md:text-base font-semibold">
            {t("confirmPassword")}
          </label>
          <input
            type="password"
            name="confirmPassword"
            placeholder={t("confirmPassword")}
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-black text-base shadow-inner"
          />
          {!passwordsMatch && (
            <p className="text-red-600 font-medium">
              {t("passwordsDoNotMatch")}
            </p>
          )}

          <button
            disabled={!isFormValid}
            onClick={() => navigate("/register-step2", { state: formData })}
            className={`mt-2 w-full py-3 rounded-full text-white text-lg font-semibold shadow-md transition-all ${
              isFormValid
                ? "bg-gradient-to-r from-orange-500 to-red-500 hover:brightness-110"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {t("continue")}
          </button>
        </div>
      </div>
    </div>
  );
}
