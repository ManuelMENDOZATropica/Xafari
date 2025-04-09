import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function RegisterStep2() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = location.state || {};

  const [formData, setFormData] = useState({
    roomNumber: "",
    gender: "",
    ...userData,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid = formData.roomNumber && formData.gender;

  return (
    <div className="relative flex flex-col items-center justify-start h-screen w-full overflow-hidden px-[6%] pt-[30%] pb-[10%] font-lufga">
      {/* Fondo */}
      <div className="absolute inset-0 z-0">
        <img
          src="/img/fondo-registro.png"
          alt="Fondo Registro"
          className="w-full h-full object-cover object-bottom md:object-center"
        />
      </div>

      {/* Botones superiores */}
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={() => navigate("/register-step1")}
          className="bg-white/50 backdrop-blur-sm text-black px-4 py-2 rounded-full shadow border border-gray-300 hover:bg-white"
        >
          ← {t("back")}
        </button>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => i18n.changeLanguage(i18n.language === "es" ? "en" : "es")}
          className="bg-white/50 backdrop-blur-sm text-black px-4 py-2 rounded-full shadow border border-gray-300 hover:bg-white"
        >
          {t("language")}
        </button>
      </div>

      {/* Encabezado */}
      <div className="z-20 w-full mb-12">
        <div className="bg-white/50 backdrop-blur-sm rounded-xl px-6 py-4 shadow-md">
          <p className="text-center text-base md:text-lg font-bold text-gray-800">
            {t("registerStep2")}
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="z-10 w-full mt-4 bg-white/50 backdrop-blur-sm p-6 rounded-xl shadow-xl">
        <label className="block text-black text-sm md:text-base mb-1 font-semibold">
          {t("roomNumber")}
        </label>
        <input
          type="text"
          name="roomNumber"
          placeholder={t("roomNumber")}
          value={formData.roomNumber}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black text-base mb-4 shadow-inner"
        />

        <label className="block text-black text-sm md:text-base mb-2 font-semibold">
          {t("selectGender")}
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setFormData({ ...formData, gender: "buxcadora" })}
            className={`p-3 border border-gray-300 rounded-lg w-full text-base font-semibold shadow-md backdrop-blur-sm transition-all ${
              formData.gender === "buxcadora" ? "bg-orange-200" : "bg-white/50"
            }`}
          >
            {t("buxcadora")}
          </button>
          <button
            onClick={() => setFormData({ ...formData, gender: "buxcador" })}
            className={`p-3 border border-gray-300 rounded-lg w-full text-base font-semibold shadow-md backdrop-blur-sm transition-all ${
              formData.gender === "buxcador" ? "bg-orange-200" : "bg-white/50"
            }`}
          >
            {t("buxcador")}
          </button>
        </div>

        {/* Botón finalizar */}
        <button
          disabled={!isFormValid}
          onClick={() => navigate("/welcome-animation", { state: formData })}
          className={`mt-6 w-full py-3 rounded-full text-white text-lg font-semibold shadow-md transition-all ${
            isFormValid
              ? "bg-gradient-to-r from-orange-500 to-red-500 hover:brightness-110"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {t("finish")}
        </button>
      </div>
    </div>
  );
}
