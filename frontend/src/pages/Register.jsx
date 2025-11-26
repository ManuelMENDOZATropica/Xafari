import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import XafariContext from "../components/XafariContext";

const steps = [
  {
    title: "Nombre",
    description: "Escribe tus nombres",
    secondary: "Escribe tus Apellidos",
    fields: ["firstName", "lastName"],
  },
  {
    title: "e-Mail",
    description: "Correo",
    fields: ["email"],
  },
  {
    title: "Cumpleaños",
    description: "Día",
    secondary: "Mes",
    tertiary: "Año",
    fields: ["day", "month", "year"],
  },
];

export default function Register() {
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

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const canContinue = useMemo(() => {
    if (step === 0) {
      return formData.firstName.trim() && formData.lastName.trim();
    }

    if (step === 1) {
      return formData.email.trim();
    }

    const filledBirthday = formData.day && formData.month && formData.year;
    return filledBirthday && formData.acceptTerms;
  }, [formData.acceptTerms, formData.day, formData.email, formData.firstName, formData.lastName, formData.month, formData.year, step]);

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

  const renderFields = () => {
    if (step === 0) {
      return (
        <div className="flex flex-col gap-4 w-full max-w-md">
          <input
            type="text"
            placeholder={steps[0].description}
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            className="w-full rounded-lg bg-white/80 px-4 py-3 text-base text-gray-900 shadow-inner focus:outline-none"
          />
          <input
            type="text"
            placeholder={steps[0].secondary}
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            className="w-full rounded-lg bg-white/80 px-4 py-3 text-base text-gray-900 shadow-inner focus:outline-none"
          />
        </div>
      );
    }

    if (step === 1) {
      return (
        <div className="w-full max-w-md">
          <input
            type="email"
            placeholder={steps[1].description}
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full rounded-lg bg-white/80 px-4 py-3 text-base text-gray-900 shadow-inner focus:outline-none"
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-3 w-full max-w-md">
        <div className="grid grid-cols-3 gap-3">
          <input
            type="number"
            min="1"
            max="31"
            placeholder={steps[2].description}
            value={formData.day}
            onChange={(e) => handleChange("day", e.target.value.slice(0, 2))}
            className="rounded-lg bg-white/80 px-4 py-3 text-base text-gray-900 shadow-inner focus:outline-none"
          />
          <input
            type="number"
            min="1"
            max="12"
            placeholder={steps[2].secondary}
            value={formData.month}
            onChange={(e) => handleChange("month", e.target.value.slice(0, 2))}
            className="rounded-lg bg-white/80 px-4 py-3 text-base text-gray-900 shadow-inner focus:outline-none"
          />
          <input
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            placeholder={steps[2].tertiary}
            value={formData.year}
            onChange={(e) => handleChange("year", e.target.value.slice(0, 4))}
            className="rounded-lg bg-white/80 px-4 py-3 text-base text-gray-900 shadow-inner focus:outline-none"
          />
        </div>

        <label className="flex items-center gap-3 text-white text-sm">
          <input
            type="checkbox"
            checked={formData.acceptTerms}
            onChange={(e) => handleChange("acceptTerms", e.target.checked)}
            className="h-4 w-4 rounded border-white/60 bg-white/80 text-emerald-600 focus:ring-emerald-500"
          />
          <span>Aceptar términos y condiciones</span>
        </label>
      </div>
    );
  };

  return (
    <div
      className="relative min-h-screen w-screen overflow-hidden bg-center bg-cover font-lufga"
      style={{ backgroundImage: "url('/img/fondoPrincipal.png')" }}
    >
      <div className="absolute inset-0 bg-black/35" aria-hidden="true" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-10 gap-6 text-white text-center">
        <div className="flex flex-col items-center gap-3 bg-black/30 px-6 py-4 rounded-xl backdrop-blur-md border border-white/10 shadow-lg">
          <h1 className="text-3xl font-bold drop-shadow">{steps[step].title}</h1>
          <div className="w-20 h-1 rounded-full bg-[#5CA7FF]" aria-hidden="true" />
          {renderFields()}
        </div>

        <button
          type="button"
          onClick={goNext}
          disabled={!canContinue}
          className={`w-full max-w-xs rounded-xl bg-[#5CA7FF] px-8 py-3 text-lg font-semibold text-white shadow-xl transition ${
            canContinue ? "hover:brightness-110" : "opacity-60 cursor-not-allowed"
          }`}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
