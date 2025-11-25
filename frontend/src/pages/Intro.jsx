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
  const [torchSize, setTorchSize] = useState({ width: 130, height: 130 });
  const [litElements, setLitElements] = useState({ image: false, text: false });
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fadeOutTimeout = useRef(null);
  const nextImageTimeout = useRef(null);
  const containerRef = useRef(null);
  const torchRef = useRef(null);
  const introImageRef = useRef(null);
  const introTextRef = useRef(null);
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
      setTorchSize({ width: torchRect.width, height: torchRect.height });
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

  useEffect(() => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    const torchRect = torchRef.current?.getBoundingClientRect();

    if (!containerRect || !torchRect) return;

    const torchCenter = {
      x: torchPos.x + torchSize.width / 2,
      y: torchPos.y + torchSize.height / 2,
    };

    const LIGHT_RADIUS = 220;

    const isLit = (elementRef) => {
      const rect = elementRef.current?.getBoundingClientRect();
      if (!rect) return false;

      const center = {
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top + rect.height / 2,
      };

      const dx = center.x - torchCenter.x;
      const dy = center.y - torchCenter.y;
      return Math.hypot(dx, dy) <= LIGHT_RADIUS;
    };

    setLitElements({ image: isLit(introImageRef), text: isLit(introTextRef) });
  }, [torchPos, torchSize, index]);

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
          filter: brightness(0.75) saturate(0.9);
          transition: opacity 0.5s ease-in-out, filter 0.2s ease;
        }

        .fade-in {
          opacity: 1;
        }

        .fade-out {
          opacity: 0;
        }

        .intro-image.lit {
          filter: brightness(1.1) drop-shadow(0 0 25px rgba(255, 223, 128, 0.35));
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
          transition: text-shadow 0.2s ease, filter 0.2s ease;
        }

        /* Elimina fondo blanco */
        .intro-text.no-bg {
          background-color: transparent;
          box-shadow: none;
        }

        .intro-text.lit {
          filter: brightness(1.1);
          text-shadow: 0 0 18px rgba(255, 241, 196, 0.85), 1px 1px 3px rgba(0, 0, 0, 0.6);
        }

        .light-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          mix-blend-mode: screen;
          opacity: 0.95;
          transition: background-position 0.15s ease, background-size 0.15s ease, opacity 0.2s ease;
          z-index: 12;
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

      <div
        className="light-overlay"
        style={{
          background: `radial-gradient(circle at ${torchPos.x + torchSize.width / 2}px ${
            torchPos.y + torchSize.height / 2
          }px, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.35) 35%, rgba(255, 255, 255, 0.15) 55%, rgba(0, 0, 0, 0) 75%)`,
        }}
      />

      {/* Imagen base */}
      <img
        ref={introImageRef}
        src={`/intro/${currentName}.jpg`}
        alt={`intro-${currentName}`}
        className={`intro-image ${fade ? "fade-in" : "fade-out"} ${litElements.image ? "lit" : ""}`}
      />

      {/* Texto superpuesto */}
      <div
        ref={introTextRef}
        className={`intro-text no-bg ${litElements.text ? "lit" : ""}`}
      >
        {t(`intro.${currentName}`)}
      </div>

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
