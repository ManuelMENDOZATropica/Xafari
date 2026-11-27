import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import XafariContext from "../components/XafariContext";
import { api, ApiError } from "@/lib/api";
import { takeReturnTo, takeSessionExpired } from "@/lib/returnTo";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { startSession } = useContext(XafariContext);
  const [sessionExpired] = useState(() => takeSessionExpired() || Boolean(location.state?.expired));

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid = formData.email && formData.password;

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!isFormValid || loading) return;
    setLoading(true);
    setLoginError("");
    try {
      const data = await api.post(
        "/login",
        { email: formData.email.trim(), password: formData.password },
        { auth: false }
      );
      // Un solo sync: lo dispara App al cambiar el token.
      startSession(data.token, data.user);
      const back = takeReturnTo();
      if (back) navigate(back, { replace: true });
      else navigate("/welcome-animation-login", { replace: true });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) setLoginError(t("loginErrors.invalid"));
      else if (error instanceof ApiError && error.status === 429) setLoginError(t("loginErrors.tooMany"));
      else if (error instanceof ApiError && error.network) setLoginError(t("errors.network"));
      else setLoginError(t("loginErrors.generic"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-screen overflow-hidden font-apercu">
      <img
        src="/img/fondoPrincipal.webp"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-bottom z-0"
      />

      <div className="absolute top-0 left-0 w-full z-20 px-4 pt-[env(safe-area-inset-top)] mt-4 pb-2 flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow border border-gray-300 hover:bg-white transition-all active:scale-95"
          aria-label={t("back")}
        >
          <img src="/iconos/icon_regresar.svg" alt="" className="w-6 h-6" />
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center w-full px-4 pt-24 pb-10 min-h-screen overflow-y-auto">
        <div className="flex flex-col items-center justify-center flex-grow w-full gap-y-6 min-h-[calc(100dvh-100px)]">
          <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-xl shadow-md w-full max-w-sm">
            <h1 className="text-xl md:text-2xl font-bold text-center text-gray-800">
              {t("login")}
            </h1>
          </div>

          {sessionExpired && (
            <p role="status" className="w-full max-w-sm rounded-xl bg-white/90 px-4 py-2 text-center text-sm font-semibold text-gray-800">
              {t("loginErrors.expired")}
            </p>
          )}
          <form
            onSubmit={handleLogin}
            noValidate
            className="w-full max-w-sm bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-md flex flex-col gap-4"
          >
            <div>
              <label htmlFor="login-email" className="block text-black text-sm font-semibold mb-1">
                {t("email")}
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                name="email"
                placeholder={t("email")}
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-black text-base shadow-inner"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-black text-sm font-semibold mb-1">
                {t("password")}
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                name="password"
                placeholder={t("password")}
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-black text-base shadow-inner"
              />
            </div>

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={`w-full py-3 rounded-full text-white text-lg font-semibold shadow-md transition-all ${
                isFormValid && !loading
                  ? "bg-gradient-to-r from-emerald-600 to-lime-500 hover:brightness-105"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading ? t("loading") : t("login")}
            </button>

            {loginError && (
              <div role="alert" style={{
                display: "flex", alignItems: "flex-start", gap: "8px",
                backgroundColor: "rgba(156,62,50,0.85)", borderRadius: "12px",
                padding: "10px 14px",
              }}>
                <span aria-hidden="true" style={{ fontSize: "16px", flexShrink: 0 }}>⚠️</span>
                <p style={{ fontSize: "13px", color: "#fff", margin: 0, lineHeight: "1.4" }}>
                  {loginError}
                </p>
              </div>
            )}

            <div className="flex flex-col items-center gap-2 mt-3">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">
                {t("noAccount")}
              </p>
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="px-6 py-2 bg-emerald-600/10 text-emerald-700 rounded-full border border-emerald-600/20 backdrop-blur-md hover:bg-emerald-600/20 transition-all font-semibold uppercase tracking-widest text-[10px]"
              >
                {t("registerHere")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
