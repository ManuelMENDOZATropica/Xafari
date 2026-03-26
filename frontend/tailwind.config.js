/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // ─── Viewport fix (dvh) ───────────────────────────────────────────
      height: { screen: "100dvh" },
      minHeight: { screen: "100dvh" },

      // ─── Paleta cromática completa ────────────────────────────────────
      colors: {
        // ── PRINCIPAL (verdes) ──────────────────────────────────────────
        // Uso: base identitaria, profundidad, soporte, acento suave, fondo
        green: {
          950: "#233C15", // Base identitaria (Primary)
          900: "#3F5A24", // Profundidad
          700: "#4E7A3F", // Soporte / Éxito
          500: "#80A850", // Variante primaria / Interactivo
          200: "#C9DCB5", // Acento suave
          50:  "#F1F6EC", // Fondo verde muy claro
        },

        // ── SECUNDARIA — Cálidos (cremas y ocres) ──────────────────────
        // Uso: fondos cálidos, superficies, soportes visuales
        cream: {
          100: "#F7F3EA", // Fondo general / Secondary
          200: "#F4E6C7", // Superficie / tarjetas
          300: "#EFDAB4", // Soporte medio
          500: "#C5A27A", // Variante secundaria
          700: "#A97A4F", // Tierra medio
          800: "#7F5C34", // Tierra oscuro
        },

        // ── SECUNDARIA — Fríos (teales y marrones profundos) ───────────
        // Uso: profundidades frías, contrastes, información
        teal: {
          50:  "#E1ECEE", // Teal muy claro
          400: "#658F9B", // Info / teal medio
          700: "#34545C", // Teal oscuro / profundidad
        },
        brown: {
          600: "#6A4A2C", // Marrón profundo
          800: "#4B3621", // Marrón muy oscuro
          950: "#352416", // Marrón casi negro
        },

        // ── SECUNDARIA — Dorados y terracota ───────────────────────────
        // Uso: acentos estratégicos, advertencias, error/alerta
        gold: {
          300: "#D4B56C", // Dorado claro
          500: "#B8902F", // Advertencia / oro
          700: "#8F6C2D", // Dorado oscuro
        },
        terra: {
          400: "#C46A4B", // Terracota claro
          600: "#A45A3A", // Terracota oscuro
          800: "#9C3E32", // Error / rojo tierra
        },

        // ── SISTEMA UI — Tokens semánticos funcionales ─────────────────
        // Estos son los colores que debes usar directamente en componentes
        primary:   "#233C15", // Verde base identitario
        "primary-variant": "#80A850", // Verde interactivo / hover
        secondary: "#F7F3EA", // Fondo cálido general
        "secondary-variant": "#C5A27A", // Acento tierra / cálido
        surface:   "#F4E6C7", // Tarjetas, módulos, inputs

        // Estados
        error:   "#9C3E32",
        warning: "#B8902F",
        info:    "#658F9B",
        success: "#4E7A3F",

        // Texto sobre fondos (para usar con `text-on-*`)
        "on-primary":   "#F7F3EA", // Texto claro sobre verdes oscuros
        "on-secondary": "#233C15", // Texto oscuro sobre fondos cálidos
        "on-surface":   "#233C15", // Texto oscuro sobre tarjetas
        "on-state":     "#F7F3EA", // Texto claro sobre error/warning/info/success
      },

      // ─── Tipografía ──────────────────────────────────────────────────
      fontFamily: {
        apercu: ['"Apercu Pro"', "sans-serif"],
        volume: ['"Volume CT"', "sans-serif"],
      },

      // ─── Animaciones ─────────────────────────────────────────────────
      keyframes: {
        slideWingUpExit: {
          "0%":   { transform: "translateY(100%) scale(2.5)", opacity: 1 },
          "50%":  { transform: "translateY(0%) scale(2.5)", opacity: 1 },
          "100%": { transform: "translateY(-200%) scale(2.5)", opacity: 1 },
        },
      },
      animation: {
        "slide-wing-up-exit": "slideWingUpExit 3s ease-in-out forwards",
      },
    },
  },
  plugins: [],
};
