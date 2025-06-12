import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: {
        translation: {
          // Global
          back: "Volver",
          continue: "Continuar",
          finish: "Finalizar",
          close: "Cerrar",
          language: "Idioma",

          // Home
          welcome: "Descubre todas las sorpresas y aventuras que Xcaret México tiene para ti y tu familia.",
          newAdventure: "Empieza nueva aventura",
          alreadyUser: "Ya soy usuario",
          whatIsXafari: "¿Qué es Xafari?",
          xafariDescription: "Xafari es una experiencia interactiva dentro del Hotel Xcaret México donde los huéspedes pueden explorar, descubrir secretos y ganar recompensas a través de dinámicas gamificadas.",

          // Registro - Paso 1
          registerStep1: "Debes crear una cuenta para guardar tu progreso en el juego.",
          firstName: "Primer nombre",
          lastName: "Primer apellido",
          email: "Correo electrónico",
          password: "Contraseña",
          confirmPassword: "Confirmar contraseña",
          passwordsDoNotMatch: "Las contraseñas no coinciden",
          passwordWeak: "Contraseña débil",
          passwordMedium: "Contraseña aceptable",
          passwordStrong: "Contraseña fuerte",

          // Registro - Paso 2
          registerStep2: "Ingresa tu número de reserva y selecciona cómo prefieres que te llamen.",
          roomNumber: "Número de reserva",
          selectGender: "¿Cómo prefieres que se te llame?",
          buxcadora: "Buxcadora",
          buxcador: "Buxcador",
          explorerMale: "Explorador",
          explorerFemale: "Exploradora",
          registerComplete: "Registro completado. ¡Bienvenido a Xafari!",

          // Animación de bienvenida
          welcomeApprentice: "¡Qué alegría tenerte aquí!",
          welcomeToAdventure: "Has llegado al lugar donde comienzan las aventuras",

          // Selección de avatar
          chooseYourStyle: "Elige tu estilo",
          skinTone: "Tono de piel",
          hair: "Cabello",
          clothing: "Ropa",
          body: "Cuerpo",
          eyes: "Ojos",
          shoes: "Zapatos",
          hairAccessory: "Acc. Cabello",
          bodyAccessory: "Acc. Cuerpo",
          saveAvatarAndContinue: "Guardar y continuar",
          randomize: "Aleatorio",
          reset: "Reiniciar"
        },
      },
      en: {
        translation: {
          // Global
          back: "Back",
          continue: "Continue",
          finish: "Finish",
          close: "Close",
          language: "Language",

          // Home
          welcome: "Discover all the surprises and adventures that Xcaret México has for you and your family.",
          newAdventure: "Start a new adventure",
          alreadyUser: "I am already a user",
          whatIsXafari: "What is Xafari?",
          xafariDescription: "Xafari is an interactive experience inside Hotel Xcaret México where guests can explore, discover secrets, and earn rewards through gamified dynamics.",

          // Register - Step 1
          registerStep1: "You need to create an account to save your progress in the game.",
          firstName: "First name",
          lastName: "Last name",
          email: "Email",
          password: "Password",
          confirmPassword: "Confirm password",
          passwordsDoNotMatch: "Passwords do not match",
          passwordWeak: "Weak password",
          passwordMedium: "Acceptable password",
          passwordStrong: "Strong password",

          // Register - Step 2
          registerStep2: "Enter your reservation number and select how you prefer to be called.",
          roomNumber: "Reservation number",
          selectGender: "How do you prefer to be called?",
          buxcadora: "Explorer (she/her)",
          buxcador: "Explorer (he/him)",
          explorerMale: "Explorer",
          explorerFemale: "Explorer",
          registerComplete: "Registration complete. Welcome to Xafari!",

          // Welcome animation
          welcomeApprentice: "We're glad you're here!",
          welcomeToAdventure: "You've arrived where adventures begin",

          // Avatar selection
          chooseYourStyle: "Choose your style",
          skinTone: "Skin Tone",
          hair: "Hair",
          clothing: "Clothing",
          body: "Body",
          eyes: "Eyes",
          shoes: "Shoes",
          hairAccessory: "Hair accessory",
          bodyAccessory: "Body accessory",
          saveAvatarAndContinue: "Save avatar and continue",
          randomize: "Randomize",
          reset: "Reset"
        },
      },
    },
    fallbackLng: "es",
    interpolation: { escapeValue: false },
  });

export default i18n;
