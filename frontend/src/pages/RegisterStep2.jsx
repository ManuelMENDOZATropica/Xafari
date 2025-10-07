import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function RegisterStep2() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
 const storedData = sessionStorage.getItem("registerData");
const userData = storedData ? JSON.parse(storedData) : {};

  const [serverError, setServerError] = useState("");


  const [formData, setFormData] = useState({
    roomNumber: "",
    gender: "",
    birthdate: "",
    ...userData,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid =
    formData.roomNumber && formData.gender && formData.birthdate;

 const handleRegister = async () => {
  try {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        password: formData.password,
        birthdate: new Date(formData.birthdate).toISOString(),
        reservationNumber: formData.roomNumber,
        pronouns: formData.gender,
        avatar: {
          bodyOptions: 1,
          eyesOptions: 1,
          hairOptions: 1,
          clothingOptions: 1,
          glassesAccessoryOptions: 1,
          headAccessoryOptions: 1,
          bodyAccessoryOptions: 1,
          shoeOptions: 1
        }
      }),
    });

    const data = await response.json();

   if (!response.ok) {
  console.error("Error del servidor:", data);
  setServerError(data?.error || "Ocurrió un error.");
  return;
}


    localStorage.setItem("token", data.token);
    navigate("/welcome-animation", { state: data.user });

  } catch (error) {
  console.error(error);
  setServerError("Ocurrió un error inesperado.");
}

};


  return (
    <div className="relative flex flex-col items-center justify-start h-screen w-full overflow-hidden px-[6%] pt-[30%] pb-[10%] font-lufga">
      <div className="absolute inset-0 z-0">
        <img
          src="/img/V03-CERRITOS.jpg"
          alt="Fondo Registro"
          className="w-full h-full object-cover object-bottom md:object-center"
        />
      </div>

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

      <div className="z-20 w-full mb-12">
        <div className="bg-white/50 backdrop-blur-sm rounded-xl px-6 py-4 shadow-md">
          <p className="text-center text-base md:text-lg font-bold text-gray-800">
            {t("registerStep2")}
          </p>
        </div>
      </div>

      <div className="z-10 w-full mt-4 bg-white/50 backdrop-blur-sm p-6 rounded-xl shadow-xl space-y-4">
        <div>
          <label className="block text-black text-sm md:text-base font-semibold mb-1">
            {t("roomNumber")}
          </label>
          <input
            type="text"
            name="roomNumber"
            placeholder={t("roomNumber")}
            value={formData.roomNumber}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black text-base shadow-inner"
          />
        </div>

        <div>
          <label className="block text-black text-sm md:text-base font-semibold mb-1">
            {t("birthdate")}
          </label>
          <input
            type="date"
            name="birthdate"
            value={formData.birthdate}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-black text-base shadow-inner"
            max={new Date().toISOString().split("T")[0]}
          />
        </div>

        <div>
          <label className="block text-black text-sm md:text-base font-semibold mb-2">
            {t("selectGender")}
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setFormData({ ...formData, gender: "buxcadora" })}
              className={`p-3 border border-gray-300 rounded-lg w-full text-base font-semibold shadow-md backdrop-blur-sm transition-all ${
                formData.gender === "buxcadora"
                  ? "bg-emerald-600 text-white"
                  : "bg-white/50 text-black"
              }`}
            >
              {t("buxcadora")}
            </button>
            <button
              onClick={() => setFormData({ ...formData, gender: "buxcador" })}
              className={`p-3 border border-gray-300 rounded-lg w-full text-base font-semibold shadow-md backdrop-blur-sm transition-all ${
                formData.gender === "buxcador"
                  ? "bg-emerald-600 text-white"
                  : "bg-white/50 text-black"
              }`}
            >
              {t("buxcador")}
            </button>
          </div>
        </div>

        <button
          disabled={!isFormValid}
          onClick={handleRegister}
          className={`mt-6 w-full py-3 rounded-full text-white text-lg font-semibold shadow-md transition-all ${
            isFormValid
              ? "bg-gradient-to-r from-emerald-600 to-lime-500 hover:brightness-105"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {t("finish")}
        </button>

        {serverError && (
  <p className="text-red-600 text-sm font-medium text-center">{serverError}</p>
)}

      </div>
    </div>
  );
}
