import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const baseNames = [
  "caverna (1)",
  "caverna (2)",
  "caverna (3)",
  "caverna (4)",
  "caverna (5)",
  "caverna (6)"
];

const Intro = () => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [exitFade, setExitFade] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [countdown, setCountdown] = useState(5);

  const [torchPos, setTorchPos] = useState({ x: 0, y: 0 });

  const navigate = useNavigate();
  const { t } = useTranslation();

  const fadeOutTimeout = useRef(null);
  const nextImageTimeout = useRef(null);
  const countdownInterval = useRef(null);
  const containerRef = useRef(null);
  const introImageRef = useRef(null);
  const introTextRef = useRef(null);

  const handleInteraction = () => {
    if (showTutorial) setShowTutorial(false);
  };

  const repeatIntro = () => {
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    setExitFade(false);
    setIndex(0);
    setFade(true);
    setShowTutorial(false);
    setCountdown(5);
  };

  const finishIntro = () => {
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    setExitFade(true);
    setTimeout(() => navigate("/intro-maya"), 500);
  };

  useEffect(() => {
    if (exitFade || showTutorial) return;

    const isLast = index === baseNames.length - 1;

    if (isLast) {
      // Start countdown
      setCountdown(5); // Reset countdown when entering the last slide
      countdownInterval.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval.current);
            finishIntro();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Auto-progression logic
      fadeOutTimeout.current = setTimeout(() => setFade(false), 5000);
      nextImageTimeout.current = setTimeout(() => {
        setIndex((prev) => {
          const next = prev + 1;
          if (next >= baseNames.length) {
            // Stay on last image to show repeat option
            return prev;
          }
          setFade(true);
          return next;
        });
      }, 5500);
    }

    return () => {
      clearTimeout(fadeOutTimeout.current);
      clearTimeout(nextImageTimeout.current);
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    };
  }, [index, exitFade, navigate, showTutorial]);

  useEffect(() => {
    const centerTorch = () => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      setTorchPos({
        x: containerRect.width / 2,
        y: containerRect.height / 2,
      });
    };

    setTimeout(centerTorch, 100);
    window.addEventListener("resize", centerTorch);

    return () => {
      window.removeEventListener("resize", centerTorch);
    };
  }, []);

  const handleMove = (event) => {
    handleInteraction();
    if (!containerRef.current) return;

    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;

    const containerRect = containerRef.current.getBoundingClientRect();

    setTorchPos({
      x: clientX - containerRect.left,
      y: clientY - containerRect.top,
    });
  };

  const goToNextImage = () => {
    clearTimeout(fadeOutTimeout.current);
    clearTimeout(nextImageTimeout.current);

    setIndex((prev) => {
      const next = prev + 1;
      if (next >= baseNames.length) {
        return prev; // stays on last slide to show repeat option
      }
      setFade(true);
      return next;
    });
  };

  const safeIndex = Math.min(index, baseNames.length - 1);
  const currentName = baseNames[safeIndex];
  const isLastImage = index === baseNames.length - 1;

  return (
    <div
      ref={containerRef}
      className={`intro-container ${exitFade ? "exit-fade" : ""} font-apercu`}
      onMouseMove={handleMove}
      onTouchMove={handleMove}
      onClick={handleInteraction}
    >
      <style>{`
        .intro-container {
          width: 100vw;
          height: 100dvh;
          background-color: black;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          position: relative;
          opacity: 1;
          transition: opacity 0.5s ease-in-out;
          touch-action: none; 
          cursor: none;
        }

        .exit-fade {
          opacity: 0;
        }

        .intro-image {
          height: 100dvh;
          width: auto;
          position: absolute;
          opacity: 0;
          filter: brightness(1) saturate(1);
          transition: opacity 0.5s ease-in-out, filter 0.2s ease;
        }

        .fade-in { opacity: 1; }
        .fade-out { opacity: 0; }

        .intro-text {
          position: absolute;
          top: 15%;
          left: 50%;
          transform: translate(-50%, -50%);
          padding: 1rem;
          border-radius: 1rem;
          max-width: 80%;
          width: 700px;
          text-align: center;
          font-size: 1.1rem;
          color: white; 
          z-index: 10;
          text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.9);
          transition: text-shadow 0.2s ease, filter 0.2s ease;
        }

        .intro-text.no-bg {
          background-color: transparent;
          box-shadow: none;
        }

        .light-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          transition: background-position 0.05s linear;
          z-index: 14; 
        }

        .tutorial-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.4);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 100;
          color: white;
          pointer-events: none;
          animation: fadeIn 0.5s ease;
        }

        .tutorial-hand {
          width: 80px;
          height: auto;
          animation: handMove 3s infinite ease-in-out;
        }

        @keyframes handMove {
          0%, 100% { transform: translate(-50px, -20px); }
          50% { transform: translate(50px, 20px) scale(0.9); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .btn-repeat, .btn-next {
           cursor: pointer;
           pointer-events: auto;
        }
      `}</style>

      <div
        className="light-overlay"
        style={{
          background: `radial-gradient(circle at ${torchPos.x}px ${torchPos.y}px, 
          transparent 0%, 
          rgba(0,0,0,0.5) 25%, 
          rgba(0,0,0,0.9) 45%, 
          black 80%)`,
        }}
      />

      {showTutorial && (
        <div className="tutorial-overlay">
          <img src="/iconos/icon_toqueBlanco.png" alt="Tutorial" className="tutorial-hand" />
          <p className="mt-8 text-lg font-medium tracking-widest uppercase opacity-80">
            {t("intro.tutorial")}
          </p>
        </div>
      )}

      <img
        ref={introImageRef}
        src={`/intro/${currentName}.jpg`}
        alt={`intro-${currentName}`}
        className={`intro-image ${fade ? "fade-in" : "fade-out"}`}
      />

      <div
        ref={introTextRef}
        className={`intro-text no-bg`}
      >
        {t(`intro.${currentName}`)}
      </div>

      {!isLastImage && (
        <div className="absolute bottom-10 right-10 z-20">
          <button
            onClick={goToNextImage}
            className="btn-next px-6 py-2 bg-white/20 text-white rounded-full border border-white/30 backdrop-blur-md hover:bg-white/40 transition-all font-semibold uppercase tracking-widest text-[10px]"
          >
            {t("next") || "Siguiente"}
          </button>
        </div>
      )}

      {isLastImage && (
        <div className="absolute bottom-8 flex flex-col items-center gap-4 z-20">
          <button
            onClick={repeatIntro}
            className="btn-repeat px-8 py-3 bg-white/10 text-white rounded-full border border-white/20 backdrop-blur-md hover:bg-white/20 transition-all font-semibold uppercase tracking-wider text-xs"
          >
            {t("intro.repeatIntro")} ({countdown}s)
          </button>
        </div>
      )}
    </div>
  );
};

export default Intro;
