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
    ...userData, // Mantener datos de la primera pantalla
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid = formData.roomNumber && formData.gender;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-white px-6">
      {/* Barra superior con Volver y Language */}
      <div className="flex justify-between w-full max-w-md absolute top-4 px-4">
        <button onClick={() => navigate("/register-step1")} className="border border-gray-500 bg-white text-black px-3 py-1 rounded-lg shadow-md hover:bg-gray-200">
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
      <p className="mt-16 mb-6 text-center text-black font-semibold">{t("registerStep2")}</p>

      {/* Formulario */}
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md border border-gray-500">
        <label className="block text-black mb-1">{t("roomNumber")}</label>
        <input
          type="text"
          name="roomNumber"
          placeholder={t("roomNumber")}
          value={formData.roomNumber}
          onChange={handleChange}
          className="w-full p-2 border border-gray-500 rounded bg-white text-black mb-4"
        />

        <label className="block text-black mb-2">{t("selectGender")}</label>
        <div className="flex gap-2">
          <button
            onClick={() => setFormData({ ...formData, gender: "buxcadora" })}
            className={`p-2 border border-gray-500 rounded w-full ${
              formData.gender === "buxcadora" ? "bg-gray-200" : "bg-white"
            } text-black`}
          >
            {t("buxcadora")}
          </button>
          <button
            onClick={() => setFormData({ ...formData, gender: "buxcador" })}
            className={`p-2 border border-gray-500 rounded w-full ${
              formData.gender === "buxcador" ? "bg-gray-200" : "bg-white"
            } text-black`}
          >
            {t("buxcador")}
          </button>
        </div>

        {/* Botón de Finalizar */}
        <button
          disabled={!isFormValid}
          onClick={() => navigate("/welcome")}
          className="mt-6 w-full p-2 border border-gray-500 rounded bg-gray-200 hover:bg-gray-300 text-black"
        >
          {t("finish")}
        </button>
      </div>
    </div>
  );
}
