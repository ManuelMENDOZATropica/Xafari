import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SoundMenu from "@/components/SoundMenu";

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

  // Saltar: skip the whole intro
  const skipIntro = () => {
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    clearTimeout(fadeOutTimeout.current);
    clearTimeout(nextImageTimeout.current);
    finishIntro();
  };

  useEffect(() => {
    if (exitFade || showTutorial) return;

    const isLast = index === baseNames.length - 1;

    if (isLast) {
      setCountdown(5);
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
      fadeOutTimeout.current = setTimeout(() => setFade(false), 5000);
      nextImageTimeout.current = setTimeout(() => {
        setIndex((prev) => {
          const next = prev + 1;
          if (next >= baseNames.length) return prev;
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

  // Center torch on mount
  useEffect(() => {
    const centerTorch = () => {
      if (!containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      setTorchPos({ x: r.width / 2, y: r.height / 2 });
    };
    setTimeout(centerTorch, 100);
    window.addEventListener("resize", centerTorch);
    return () => window.removeEventListener("resize", centerTorch);
  }, []);

  const handleMove = (event) => {
    handleInteraction();
    if (!containerRef.current) return;
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    const r = containerRef.current.getBoundingClientRect();
    setTorchPos({ x: clientX - r.left, y: clientY - r.top });
  };

  const goToNextImage = () => {
    clearTimeout(fadeOutTimeout.current);
    clearTimeout(nextImageTimeout.current);
    setIndex((prev) => {
      const next = prev + 1;
      if (next >= baseNames.length) return prev;
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
      className="font-apercu"
      style={{
        width: "100vw",
        height: "100dvh",
        backgroundColor: "#070707",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
        opacity: exitFade ? 0 : 1,
        transition: "opacity 0.5s ease-in-out",
        touchAction: "none",
        cursor: "none",
      }}
      onMouseMove={handleMove}
      onTouchMove={handleMove}
      onClick={handleInteraction}
    >
      {/* ── Background image ───────────────────────────────────────── */}
      <img
        src={`/intro/${currentName}.jpg`}
        alt={`intro-${currentName}`}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          opacity: fade ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
        }}
      />

      {/* ── Torch overlay ──────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 14,
          background: `radial-gradient(circle at ${torchPos.x}px ${torchPos.y}px,
            transparent 0%,
            rgba(0,0,0,0.4) 38%,
            rgba(0,0,0,0.85) 58%,
            black 85%)`,
        }}
      />

      {/* ── Sound icon — top right ─────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "27px",
          right: "27px",
          zIndex: 30,
          cursor: "auto",
        }}
      >
        <SoundMenu />
      </div>

      {/* ── Story text box — imagen contenedorTextoIntro ─────────── */}
      <div
        onClick={(e) => { e.stopPropagation(); goToNextImage(); }}
        style={{
          position: "absolute",
          top: "94px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "313px",
          minHeight: "140px",
          zIndex: 10,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Imagen de fondo del contenedor */}
        <img
          src="/intro/contenedorTextoIntro.png"
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "fill",
          }}
          draggable={false}
        />
        {/* Texto encima de la imagen */}
        <p
          style={{
            position: "relative",
            zIndex: 1,
            color: "#F7F3EA",
            fontSize: "17px",
            fontFamily: "'Volume TC', sans-serif",
            fontWeight: 400,
            lineHeight: "1.5",
            textAlign: "center",
            margin: 0,
            padding: "16px 24px",
            textShadow: "1px 1px 4px rgba(0,0,0,0.8)",
          }}
        >
          {t(`intro.${currentName}`)}
        </p>
      </div>

      {/* ── Tutorial overlay ──────────────────────────────────────── */}
      {showTutorial && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            color: "white",
            pointerEvents: "none",
            animation: "fadeIn 0.5s ease",
          }}
        >
          <style>{`
            @keyframes handMove {
              0%, 100% { transform: translate(-50px, -20px); }
              50% { transform: translate(50px, 20px) scale(0.9); }
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to   { opacity: 1; }
            }
            .tutorial-hand { animation: handMove 3s infinite ease-in-out; }
          `}</style>
          <img
            src="/iconos/icon_toqueBlanco.png"
            alt="Tutorial"
            className="tutorial-hand"
            style={{ width: "80px", height: "auto" }}
          />
          <p style={{ marginTop: "32px", fontSize: "18px", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.8 }}>
            {t("intro.tutorial")}
          </p>
        </div>
      )}

      {/* ── Botón Saltar — Figma: 200×60px, #80A850, 24px bold ────── */}
      {!isLastImage && (
        <button
          onClick={(e) => { e.stopPropagation(); goToNextImage(); }}
          style={{
            position: "absolute",
            bottom: "96px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "200px",
            height: "60px",
            borderRadius: "30px",
            backgroundColor: "#80A850",
            color: "#F7F3EA",
            fontSize: "24px",
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            zIndex: 20,
            boxShadow: "3.2px 3.2px 3.2px 0px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {t("intro.skip") || "Saltar"}
        </button>
      )}

      {/* ── Última diapositiva ─────────────────────────────────────── */}
      {isLastImage && (
        <div
          style={{
            position: "absolute",
            bottom: "96px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            zIndex: 20,
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); finishIntro(); }}
            style={{
              width: "200px",
              height: "60px",
              borderRadius: "30px",
              backgroundColor: "#80A850",
              color: "#F7F3EA",
              fontSize: "24px",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              boxShadow: "3.2px 3.2px 3.2px 0px rgba(0,0,0,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {t("intro.continue") || "Continuar"}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); repeatIntro(); }}
            style={{
              width: "200px",
              height: "60px",
              borderRadius: "30px",
              backgroundColor: "#F4E6C7",
              color: "#352416",
              fontSize: "24px",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              boxShadow: "3.2px 3.2px 3.2px 0px rgba(0,0,0,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              whiteSpace: "nowrap",
            }}
          >
            {t("intro.repeatIntro")}
          </button>
        </div>
      )}
    </div>
  );
};

export default Intro;
