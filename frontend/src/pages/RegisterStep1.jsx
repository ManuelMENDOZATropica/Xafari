import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getPasswordStrength = (password) => {
    if (password.length < 6) return "weak";
    if (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password))
      return "medium";
    if (
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      )
    )
      return "strong";
    return "weak";
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordsMatch =
    formData.password === formData.confirmPassword &&
    formData.password.length > 0;
  const isFormValid =
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    passwordsMatch &&
    passwordStrength !== "weak";

  return (
    <div className="relative h-screen w-full overflow-hidden font-lufga">
      <div className="absolute inset-0 z-0">
        <img
          src="/img/V03-CERRITOS.jpg"
          alt="Fondo Registro"
          className="w-full h-full object-cover object-bottom md:object-center"
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen px-[6%] pt-20 pb-10 overflow-y-auto">
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
            onClick={() =>
              i18n.changeLanguage(i18n.language === "es" ? "en" : "es")
            }
            className="bg-white/80 backdrop-blur-sm text-black px-4 py-2 rounded-full shadow border border-gray-300 hover:bg-white"
          >
            {t("language")}
          </button>
        </div>

        <div className="w-full mb-4">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl px-6 py-3 shadow-md">
            <p className="text-center text-base md:text-lg font-bold text-gray-800">
              {t("registerStep1")}
            </p>
          </div>
        </div>

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
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder={t("password")}
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg bg-white text-black text-base shadow-inner"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-sm p-1 rounded-full text-gray-600 hover:bg-white/90 transition"
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="w-full h-2 rounded">
            <div
              className={`h-full rounded transition-all duration-300 ${
                passwordStrength === "weak"
                  ? "bg-red-400 w-1/12"
                  : passwordStrength === "medium"
                  ? "bg-amber-400 w-2/12"
                  : "bg-emerald-600 w-3/12"
              }`}
            ></div>
          </div>

          <p
            className={`text-sm font-medium ${
              passwordStrength === "weak"
                ? "text-red-600"
                : passwordStrength === "medium"
                ? "text-amber-600"
                : "text-emerald-600"
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
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder={t("confirmPassword")}
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg bg-white text-black text-base shadow-inner"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-sm p-1 rounded-full text-gray-600 hover:bg-white/90 transition"
              aria-label={
                showConfirm ? "Ocultar confirmación" : "Mostrar confirmación"
              }
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="min-h-[1.25rem]">
            {!passwordsMatch && (
              <p className="text-red-600 font-medium">
                {t("passwordsDoNotMatch")}
              </p>
            )}
          </div>

          <button
            disabled={!isFormValid}
            onClick={() => {
              sessionStorage.setItem("registerData", JSON.stringify(formData));
              navigate("/register-step2");
            }}
            className={`mt-2 w-full py-3 rounded-full text-white text-lg font-semibold shadow-md transition-all ${
              isFormValid
                ? "bg-gradient-to-r from-emerald-600 to-lime-500 hover:brightness-105"
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
