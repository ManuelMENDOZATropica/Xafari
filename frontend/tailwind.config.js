/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        slideWingUpExit: {
          "0%": { transform: "translateY(100%) scale(2.5)", opacity: 1 },
          "50%": { transform: "translateY(0%) scale(2.5)", opacity: 1 },
          "100%": { transform: "translateY(-200%) scale(2.5)", opacity: 1 },
        },
      },
      animation: {
        "slide-wing-up-exit": "slideWingUpExit 3s ease-in-out forwards",
      },
      fontFamily: {
        lufga: ['"Lufga"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
