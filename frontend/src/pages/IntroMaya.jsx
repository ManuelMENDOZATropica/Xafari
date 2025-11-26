import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function IntroMaya() {
  const { t, i18n } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const steps = useMemo(
    () => [
      {
        image: "/maya/tutorial/1.png",
        alt: t("introMaya.slide1Alt"),
        text: t("introMaya.slide1Text"),
      },
      {
        image: "/maya/tutorial/2.png",
        alt: t("introMaya.slide2Alt"),
        text: t("introMaya.slide2Text"),
      },
    ],
    [t, i18n.language]
  );

  const goNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    navigate("/register");
  };

  return (
    <div className="relative min-h-screen w-screen overflow-hidden bg-[#0a0a0a] text-white font-apercu">
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
            {t("menu")}
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
            {t("next")}
          </button>
        </div>
      </div>
    </div>
  );
}
