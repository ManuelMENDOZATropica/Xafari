import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid = formData.email && formData.password;

const handleLogin = async () => {
  setLoading(true);
  try {
    const response = await fetch("https://xafari.rexmalebka.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    console.log("Respuesta del servidor:", data); // 👈 Aquí imprimimos todo

    if (!response.ok) {
      throw new Error(data || "Login failed");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    

    navigate("/welcome-animation-login", { state: data.user });

  } catch (error) {
    console.error("Error en login:", error.message);
    alert("Error al iniciar sesión: " + error.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="relative min-h-screen w-screen overflow-hidden font-lufga">
      <img
        src="/img/V03-CERRITOS.jpg"
        alt="Fondo Login"
        className="absolute inset-0 w-full h-full object-cover object-bottom z-0"
      />

      <div className="absolute top-0 left-0 w-full z-20 px-4 pt-[env(safe-area-inset-top)] mt-4 pb-2 flex justify-between items-center">
        <button
          onClick={() => navigate("/")}
          className="bg-white/80 backdrop-blur-sm text-black px-4 py-2 rounded-full shadow border border-gray-300 hover:bg-white"
        >
          ← {t("back")}
        </button>
        <button
          onClick={() => i18n.changeLanguage(i18n.language === "es" ? "en" : "es")}
          className="bg-white/80 backdrop-blur-sm text-black px-4 py-2 rounded-full shadow border border-gray-300 hover:bg-white"
        >
          {t("language")}
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center w-full px-4 pt-24 pb-10 min-h-screen overflow-y-auto">
        <div className="flex flex-col items-center justify-center flex-grow w-full gap-y-6 min-h-[calc(100vh-100px)]">
          <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-xl shadow-md w-full max-w-sm">
            <h1 className="text-xl md:text-2xl font-bold text-center text-gray-800">
              {t("login")}
            </h1>
          </div>

          <div className="w-full max-w-sm bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md flex flex-col gap-4">
            <div>
              <label className="block text-black text-sm font-semibold mb-1">
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
            </div>

            <div>
              <label className="block text-black text-sm font-semibold mb-1">
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
            </div>

            <button
              disabled={!isFormValid || loading}
              onClick={handleLogin}
              className={`w-full py-3 rounded-full text-white text-lg font-semibold shadow-md transition-all ${
                isFormValid && !loading
                  ? "bg-gradient-to-r from-emerald-600 to-lime-500 hover:brightness-105"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading ? t("loading") : t("login")}
            </button>

            <p className="text-center text-sm text-black">
              {t("noAccount")}&nbsp;
              <button
                onClick={() => navigate("/register-step1")}
                className="underline text-emerald-600 hover:text-emerald-800 transition"
              >
                {t("registerHere")}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
