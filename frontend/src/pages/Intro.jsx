import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import alaMaya from "/intro/alaMaya.png";

const baseNames = ["001 ARBOL", "002 GUARDIANES", "003 CELEBRACION", "004 ELEMENTOS", "005 RAMA", "006 VIAJE", "007 FIN"];

const Intro = () => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [exitFade, setExitFade] = useState(false);
  const [torchPos, setTorchPos] = useState({ x: 0, y: 0, isDragging: false });
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fadeOutTimeout = useRef(null);
  const nextImageTimeout = useRef(null);
  const containerRef = useRef(null);
  const torchRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });

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

  useEffect(() => {
    const centerTorch = () => {
      if (!containerRef.current || !torchRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const torchRect = torchRef.current.getBoundingClientRect();
      setTorchPos((prev) => ({
        ...prev,
        x: (containerRect.width - torchRect.width) / 2,
        y: (containerRect.height - torchRect.height) / 2,
      }));
    };

    centerTorch();
    window.addEventListener("resize", centerTorch);

    return () => {
      window.removeEventListener("resize", centerTorch);
    };
  }, []);

  const getClientPosition = (event) => {
    if (event.touches && event.touches[0]) {
      return { clientX: event.touches[0].clientX, clientY: event.touches[0].clientY };
    }
    return { clientX: event.clientX, clientY: event.clientY };
  };

  const clampPosition = (clientX, clientY) => {
    if (!containerRef.current || !torchRef.current) return { x: 0, y: 0 };

    const containerRect = containerRef.current.getBoundingClientRect();
    const torchRect = torchRef.current.getBoundingClientRect();

    const minX = 0;
    const minY = 0;
    const maxX = containerRect.width - torchRect.width;
    const maxY = containerRect.height - torchRect.height;

    const nextX = clientX - containerRect.left - dragOffset.current.x;
    const nextY = clientY - containerRect.top - dragOffset.current.y;

    return {
      x: Math.min(Math.max(nextX, minX), maxX),
      y: Math.min(Math.max(nextY, minY), maxY),
    };
  };

  const startDrag = (event) => {
    if (!torchRef.current || !torchRef.current.contains(event.target)) return;
    event.preventDefault();
    const { clientX, clientY } = getClientPosition(event);
    const torchRect = torchRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: clientX - torchRect.left,
      y: clientY - torchRect.top,
    };

    const clamped = clampPosition(clientX, clientY);
    setTorchPos((prev) => ({ ...prev, ...clamped, isDragging: true }));
  };

  const handleMove = (event) => {
    if (!torchPos.isDragging) return;
    event.preventDefault();
    const { clientX, clientY } = getClientPosition(event);
    const clamped = clampPosition(clientX, clientY);
    setTorchPos((prev) => ({ ...prev, ...clamped }));
  };

  const endDrag = () => {
    setTorchPos((prev) => ({ ...prev, isDragging: false }));
  };

  const currentName = baseNames[index];

  return (
    <div
      ref={containerRef}
      className={`intro-container ${exitFade ? "exit-fade" : ""} font-lufga`}
      onMouseDown={startDrag}
      onTouchStart={startDrag}
      onMouseMove={handleMove}
      onTouchMove={handleMove}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onTouchEnd={endDrag}
      onTouchCancel={endDrag}
    >
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

        .torch-image {
          position: absolute;
          width: 130px;
          height: auto;
          pointer-events: auto;
          z-index: 15;
          animation: float 4s ease-in-out infinite;
          transition: transform 0.15s ease-in-out;
        }

        .torch-image:hover {
          transform: translateY(-3px);
        }

        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0); }
        }

        .intro-text {
          position: absolute;
          top: 71%;
          left: 50%;
          transform: translate(-50%, -50%);
          padding: 1rem;
          border-radius: 1rem;
          max-width: 70%;
          width: 700px;
          text-align: center;
          font-size: 1rem;
          color: black;
          z-index: 10;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.6);
        }

        /* Elimina fondo blanco */
        .intro-text.no-bg {
          background-color: transparent;
          box-shadow: none;
        }

      `}</style>

      <img
        ref={torchRef}
        src={alaMaya}
        alt="ala maya"
        className="torch-image"
        style={{
          left: `${torchPos.x}px`,
          top: `${torchPos.y}px`,
          cursor: torchPos.isDragging ? "grabbing" : "grab",
        }}
      />

      {/* Imagen base */}
      <img
        src={`/intro/${currentName}.jpg`}
        alt={`intro-${currentName}`}
        className={`intro-image ${fade ? "fade-in" : "fade-out"}`}
      />

      {/* Texto superpuesto */}
      <div className="intro-text no-bg">{t(`intro.${currentName}`)}</div>

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
