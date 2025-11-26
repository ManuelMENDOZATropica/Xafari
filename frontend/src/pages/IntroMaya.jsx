import { useState } from "react";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    image: "/maya/tutorial/1.png",
    alt: "Guacamaya introductoria 1",
    text: "Texto que expone la problemática y que identifica al buscador",
  },
  {
    image: "/maya/tutorial/2.png",
    alt: "Guacamaya introductoria 2",
    text: "Texto que presenta la misión y te invita a registrarte",
  },
];

export default function IntroMaya() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const goNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    navigate("/register");
  };

  return (
    <div className="relative min-h-screen w-screen overflow-hidden bg-[#0a0a0a] text-white font-lufga">
      <div className="absolute inset-0 opacity-70" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
      </div>

      <div className="relative z-10 flex flex-col h-full min-h-screen px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => navigate("/welcome")}
            className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur-md transition hover:bg-white/20"
          >
            Menú
          </button>
          <span className="text-sm text-white/70">{`${currentStep + 1}/${steps.length}`}</span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <img
            src={steps[currentStep].image}
            alt={steps[currentStep].alt}
            className="max-h-[60vh] object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.45)]"
          />

          <p className="max-w-md text-center text-lg leading-relaxed text-white/90">
            {steps[currentStep].text}
          </p>
        </div>

        <div className="flex justify-end mt-8">
          <button
            type="button"
            onClick={goNext}
            className="flex items-center gap-2 rounded-full bg-[#5CA7FF] px-6 py-3 text-lg font-semibold text-white shadow-xl transition hover:brightness-110"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
