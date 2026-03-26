import { useEffect, useRef, useState } from "react";

/**
 * Dropdown custom con imagen de fondo por fila.
 * Muestra exactamente 7 opciones visibles y permite scroll.
 * triggerImg → imagen con flecha (textfieldDia.png etc.)
 * vacioImg   → imagen sin flecha para cada fila (textfieldDiaVacio.png etc.)
 */
export default function DateDropdown({
  value,
  onChange,
  options,
  triggerImg,
  vacioImg,
  width,
  height = 43,
  placeholder,
  fontSize = 18,
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // Cierra al hacer click fuera
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const VISIBLE = 6;
  const ITEM_H = 36;  // altura de cada fila (más compacto)
  const listHeight = ITEM_H * VISIBLE;

  const selectedLabel =
    options.find((o) => o.value === value)?.label ?? placeholder;

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width, flexShrink: 0, zIndex: open ? 200 : 1 }}
    >
      {/* ── Trigger ──────────────────────────────────────────────── */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        style={{ position: "relative", width, height, cursor: "pointer", userSelect: "none" }}
      >
        <img
          src={triggerImg}
          alt=""
          draggable={false}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "fill" }}
        />
        <span
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            paddingLeft: "10px",
            paddingRight: "28px",
            fontFamily: "'Apercu Pro', sans-serif",
            fontSize,
            fontWeight: 400,
            color: "#352416",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {selectedLabel}
        </span>
      </div>

      {/* ── Lista desplegable ─────────────────────────────────────── */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: height,
            left: 0,
            width,
            height: listHeight,
            overflowY: "scroll",
            overflowX: "hidden",
            zIndex: 300,
            /* Oculta la scrollbar nativa pero mantiene funcionalidad */
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                style={{
                  position: "relative",
                  width: "100%",
                  height: ITEM_H,
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                {/* Fila-imagen (vacío) */}
                <img
                  src={vacioImg}
                  alt=""
                  draggable={false}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "fill",
                    /* Tinte sutil para el ítem seleccionado */
                    filter: isSelected ? "brightness(0.88)" : "none",
                  }}
                />
                {/* Texto centrado */}
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Apercu Pro', sans-serif",
                    fontSize,
                    fontWeight: isSelected ? 700 : 400,
                    color: "#352416",
                  }}
                >
                  {opt.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
