import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import alaMaya from "/intro/alaMaya.png";

const baseNames = [
  "001 ARBOL",
  "002 GUARDIANES",
  "003 CELEBRACION",
  "004 ELEMENTOS",
  "005 RAMA",
  "006 VIAJE"
];

const Intro = () => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [exitFade, setExitFade] = useState(false);

  const [torchPos, setTorchPos] = useState({ x: 0, y: 0, isDragging: false });
  const [torchSize, setTorchSize] = useState({ width: 600, height: 0 });
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

  // --- FUNCIÓN MANUAL (CLICK) ---
  const goToNextImage = () => {
    // Limpiamos los timers automáticos para evitar conflictos
    clearTimeout(fadeOutTimeout.current);
    clearTimeout(nextImageTimeout.current);

    setIndex((prev) => {
      const next = prev + 1;
      
      // Si el siguiente índice se sale del array, terminamos
      if (next >= baseNames.length) {
        setExitFade(true);
        setTimeout(() => navigate("/create-avatar"), 500);
        return prev; // 👈 IMPORTANTE: Mantenemos la imagen actual visible
      }
      
      // Si no, avanzamos y activamos el fade in
      setFade(true); 
      return next;
    });
  };

  // --- FUNCIÓN AUTOMÁTICA (TIMER) ---
  useEffect(() => {
    // Si ya estamos en proceso de salida, no configurar timers
    if (exitFade) return;

    // 1. Programar el Fade Out de la imagen actual a los 5s
    fadeOutTimeout.current = setTimeout(() => setFade(false), 5000);
    
    // 2. Programar el cambio a la siguiente imagen a los 5.5s
    nextImageTimeout.current = setTimeout(() => {
      setIndex((prev) => {
        const next = prev + 1;
        
        // Verificamos si llegamos al final
        if (next >= baseNames.length) {
          setExitFade(true);
          setTimeout(() => navigate("/create-avatar"), 500);
          return prev; // 👈 IMPORTANTE: Nos quedamos en la última imagen
        }
        
        // Si seguimos, activamos fade in
        setFade(true);
        return next;
      });
    }, 5500);

    return () => {
      clearTimeout(fadeOutTimeout.current);
      clearTimeout(nextImageTimeout.current);
    };
  }, [index, exitFade, navigate]); // Agregamos exitFade a dependencias

  // --- CENTRAR ANTORCHA AL INICIO Y RESIZE ---
  useEffect(() => {
    const centerTorch = () => {
      if (!containerRef.current || !torchRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const torchRect = torchRef.current.getBoundingClientRect();

      const fixedY = containerRect.height - torchRect.height + 40;

      setTorchPos((prev) => ({
        ...prev,
        x: (containerRect.width - torchRect.width) / 2,
        y: fixedY,
      }));
      setTorchSize({ width: torchRect.width, height: torchRect.height });
    };

    setTimeout(centerTorch, 100);
    window.addEventListener("resize", centerTorch);

    return () => {
      window.removeEventListener("resize", centerTorch);
    };
  }, []);

  const getClientPosition = (event) => {
    if (event.touches && event.touches[0]) {
      return {
        clientX: event.touches[0].clientX,
        clientY: event.touches[0].clientY,
      };
    }
    return { clientX: event.clientX, clientY: event.clientY };
  };

  const clampPosition = (clientX, clientY) => {
    if (!containerRef.current || !torchRef.current) return { x: 0, y: 0 };

    const containerRect = containerRef.current.getBoundingClientRect();
    const torchRect = torchRef.current.getBoundingClientRect();

    const halfWidth = torchRect.width / 2;
    const minX = -halfWidth; 
    const maxX = containerRect.width - halfWidth; 

    const nextX = clientX - containerRect.left - dragOffset.current.x;

    const fixedY = containerRect.height - torchRect.height + 40;

    return {
      x: Math.min(Math.max(nextX, minX), maxX),
      y: fixedY,
    };
  };

  useEffect(() => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const torchCenter = {
      x: torchPos.x + torchSize.width / 2,
      y: torchPos.y + torchSize.height / 2,
    };

    const LIGHT_RADIUS = 350;

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

    if (!event.type.includes("touch")) {
      event.preventDefault();
    }

    const { clientX, clientY } = getClientPosition(event);
    const torchRect = torchRef.current.getBoundingClientRect();

    dragOffset.current = {
      x: clientX - torchRect.left,
      y: 0,
    };

    const clamped = clampPosition(clientX, clientY);
    setTorchPos((prev) => ({ ...prev, ...clamped, isDragging: true }));
  };

  const handleMove = (event) => {
    if (!torchPos.isDragging) return;

    if (!event.type.includes('touch')) {
       event.preventDefault();
    }

    const { clientX, clientY } = getClientPosition(event);
    const clamped = clampPosition(clientX, clientY);
    setTorchPos((prev) => ({ ...prev, ...clamped }));
  };
  
  const endDrag = () => {
    setTorchPos((prev) => ({ ...prev, isDragging: false }));
  };

  // Safe Guard: Si por alguna razón index es inválido, usar el último
  const safeIndex = Math.min(index, baseNames.length - 1);
  const currentName = baseNames[safeIndex];

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
          touch-action: none; 
        }

        .exit-fade {
          opacity: 0;
        }

        .intro-image {
          height: 100vh;
          width: auto;
          position: absolute;
          opacity: 0;
          filter: brightness(1) saturate(1);
          transition: opacity 0.5s ease-in-out, filter 0.2s ease;
        }

        .fade-in { opacity: 1; }
        .fade-out { opacity: 0; }

        .torch-image {
          position: fixed;
          pointer-events: auto;
          z-index: 15; 
          transition: transform 0.1s linear; 
        }

        .torch-image:active {
          cursor: grabbing;
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
          color: white; 
          z-index: 10;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
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
      `}</style>

      {/* LUZ INVERTIDA */}
      <div
        className="light-overlay"
        style={{
          background: `radial-gradient(circle at ${
            torchPos.x + torchSize.width / 2
          }px ${
            torchPos.y + torchSize.height * 0.4
          }px, 
          transparent 0%, 
          rgba(0,0,0,0.5) 25%, 
          rgba(0,0,0,0.9) 45%, 
          black 80%)`,
        }}
      />

      <img
        ref={torchRef}
        src={alaMaya}
        alt="ala maya"
        className="torch-image"
        style={{
          left: `${torchPos.x}px`,
          bottom: "-40px",
          top: "auto",
          width: "600px",
          height: "auto",
          cursor: torchPos.isDragging ? "grabbing" : "grab",
        }}
      />

      {/* Imagen base */}
      <img
        ref={introImageRef}
        src={`/intro/${currentName}.jpg`}
        alt={`intro-${currentName}`}
        className={`intro-image ${fade ? "fade-in" : "fade-out"}`}
      />

      {/* Texto superpuesto */}
      <div
        ref={introTextRef}
        className={`intro-text no-bg`}
      >
        {t(`intro.${currentName}`)}
      </div>

      {/* Botón Siguiente */}
      {index < baseNames.length && (
        <div className="absolute bottom-8 right-8 z-20">
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