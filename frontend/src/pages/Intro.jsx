import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const baseNames = ["1", "2", "3", "4", "5", "6"];

const Intro = () => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [exitFade, setExitFade] = useState(false);
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const fadeOutTimeout = useRef(null);
  const nextImageTimeout = useRef(null);

  const getImageSrc = (name) => {
    return i18n.language === "en"
      ? `/intro/${name}.jpg`
      : `/intro/${name}.jpg`;
  };

  const goToNextImage = () => {
    clearTimeout(fadeOutTimeout.current);
    clearTimeout(nextImageTimeout.current);
    setFade(true);
    setIndex((prev) => {
      const next = prev + 1;
      if (next >= baseNames.length) {
        setExitFade(true);
        setTimeout(() => navigate("/create-avatar"), 500);
      }
      return next;
    });
  };

  useEffect(() => {
    if (index >= baseNames.length) return;

    fadeOutTimeout.current = setTimeout(() => setFade(false), 5000);
    nextImageTimeout.current = setTimeout(() => {
      setIndex((prev) => {
        const next = prev + 1;
        if (next >= baseNames.length) {
          setExitFade(true);
          setTimeout(() => navigate("/create-avatar"), 500);
        }
        return next;
      });
      setFade(true);
    }, 5500);

    return () => {
      clearTimeout(fadeOutTimeout.current);
      clearTimeout(nextImageTimeout.current);
    };
  }, [index, navigate]);

  return (
    <div className={`intro-container ${exitFade ? "exit-fade" : ""} font-lufga`}>
      <style>{`
        .intro-container {
          width: 100vw;
          height: 100vh;
          background-color: black;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          position: relative;
          opacity: 1;
          transition: opacity 0.5s ease-in-out;
        }

        .exit-fade {
          opacity: 0;
        }

        .intro-image {
          height: 100vh;
          width: auto;
          position: absolute;
          opacity: 0;
          transition: opacity 0.5s ease-in-out;
        }

        .fade-in {
          opacity: 1;
        }

        .fade-out {
          opacity: 0;
        }
      `}</style>

      {/* Botón de idioma */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() =>
            i18n.changeLanguage(i18n.language === "es" ? "en" : "es")
          }
          className="px-4 py-2 bg-white text-sm text-gray-800 rounded-full border border-gray-200 shadow-md hover:bg-gray-100 transition-all"
        >
          {t("language")}
        </button>
      </div>

      {/* Imágenes */}
      {baseNames.map((name, i) => (
        <img
          key={i}
          src={getImageSrc(name)}
          alt={`intro-${name}`}
          className={`intro-image ${i === index ? "fade-in" : "fade-out"}`}
        />
      ))}

      {/* Botón Siguiente */}
      {index < baseNames.length && (
        <div className="absolute bottom-8 z-20">
          <button
            onClick={goToNextImage}
            className="px-6 py-3 bg-white text-sm text-gray-800 rounded-full border border-gray-200 shadow-md hover:bg-gray-100 transition-all"
          >
            {t("next") || "Siguiente"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Intro;
