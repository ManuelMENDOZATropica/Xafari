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
          back: "Regresar",
          continue: "Continuar",
          finish: "Finalizar",
          close: "Cerrar",
          language: "Idioma",

          // Login
          login: "Iniciar sesión",
          noAccount: "¿No tienes cuenta?",
          registerHere: "Regístrate aquí",

          // Home
          welcome:
            "Descubre todas las sorpresas y aventuras que Xcaret México tiene para ti y tu familia.",
          newAdventure: "Empieza nueva aventura",
          alreadyUser: "Ya soy usuario",
          whatIsXafari: "¿Qué es Xafari?",
          xafariDescription:
            "Xafari es una experiencia interactiva dentro del Hotel Xcaret México donde los huéspedes pueden explorar, descubrir secretos y ganar recompensas a través de dinámicas gamificadas.",

          // Registro - Paso 1
          registerStep1:
            "Debes crear una cuenta para guardar tu progreso en el juego.",
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
          registerStep2:
            "Ingresa tu número de reserva y selecciona cómo prefieres que te llamen.",
          roomNumber: "Número de reserva",
          selectGender: "¿Cómo prefieres que se te llame?",
          buxcadora: "Buxcadora",
          buxcador: "Buxcador",
          explorerMale: "Explorador",
          explorerFemale: "Exploradora",
          registerComplete: "Registro completado. ¡Bienvenido a Xafari!",

          // Avatar
          editAvatar: "Editar avatar",
          chooseYourStyle: "Elige tu estilo",
          skinTone: "Tono de piel",
          hair: "Cabello",
          clothing: "Ropa",
          body: "Cuerpo",
          eyes: "Ojos",
          shoes: "Zapatos",
          hairAccessory: "Accesorios cabello",
          bodyAccessory: "Accesorios cuerpo",
          glasses: "Lentes",
          headAccessory: "Accesorios cabeza",
          saveAvatarAndContinue: "Guardar y continuar",
          randomize: "Aleatorio",
          reset: "Reiniciar",

          // Xecretos
          scan_title: "Escanea un Xecreto",
          how_scan: "¿Cómo escanear?",
          see_clues: "Ver pistas",
          found_guardian: "¡Encontraste al guardián {{guardian}}!",

          // Instrucciones Escaneo
          understood: "Entendido",
          scan_step1: "Ubica las placas escondidas en el hotel.",
          scan_step2:
            "Acércate con tu dispositivo móvil y abre la cámara desde esta app.",
          scan_step3: "Escanea el código QR visible en la placa.",
          scan_step4:
            "Descubre qué guardián has desbloqueado y mira cómo se agrega al Árbol de la Vida.",

          // Animaciones y bienvenida
          welcomeApprentice: "¡Qué alegría tenerte aquí!",
          welcomeToAdventure:
            "Has llegado al lugar donde comienzan las aventuras",

          // Feedback preguntas
          correct: "Respuesta correcta.",
          next_unlocked: "",
          incorrect: "Respuesta incorrecta.",
          retry_in: "Intenta de nuevo en",

          // Títulos modal
          clue_title: "Pistas de los Xecretos",
          clue_label: "Xecreto {{num}}",

          // Pistas
          pistas: {
            xecreto1:
              "Y cuando sientas que tu mundo se acaba, El mono abre una puerta reflejante para salvarte",
            xecreto2:
              "El tronco de un árbol nace desde el piso, entre sus pedestales una rana aguarda ¿escuchas su croar?",
            xecreto3:
              "Entre azulejos, madera y cristales, las manchas del Jaguar se difuminan cerca de la luz del sol",
            xecreto4:
              "Cuando el hambre llega, es la guacamaya quien nos guía hacia el alimento que nutre los cuerpos cansados",
            xecreto5:
              "La serpiente, guardián del ciclo del tiempo, nos dice que la aplastante muerte se evidencia solo si miras hacia arriba",
            xecreto6:
              "Entre los archivos secretos de Xurreal, es el venado quien los resguarda bajo sus astas",
            xecreto7:
              "El búho aguarda desde el otro lado del cristal, durante las noches vigila que las aves estén descansando",
            xecreto8:
              "La sabiduría esconde a la mariposa, entre las palabras de quienes también han pisado este mundo",
            xecreto9:
              "Entre la inmensa vegetación de un tronco, allá donde las luces cálidas iluminan un frío lugar, el flamingo mira.",
            xecreto10:
              "Bajo la tribu de vestidos blancos aguarda el gran guardián coatí",
          },

          // Experiencias y preguntas

          rateExperience: "Califica esta experiencia",
          logrado: "Listo",
          t_experiencia_caletas:
            "Explora las caletas del hotel en kayak o paddle board y sumérgete en la belleza del paisaje en cada remada.",
          q_caletas: "¿De qué color son los Kayaks y el Paddle board?",

          t_experiencia_cielo_flamingos:
            "¡Déjate llevar por el ritmo en el Salón Flamingo! Baila como nunca, vibra con la mejor música y conquista la pista con tus mejores pasos.",
          q_cielo_flamingos:
            "En la parte de atrás hay nichos con esculturas de flamingo ¿Cuántos hay?",

          t_experiencia_agua_muluk:
            "¡Déjate envolver por la calma en el Muluk Family Spa. Disfruta de un entorno natural, aromas y sonidos.",
          q_muluk: "¿Cuántas albercas hay en Muluk?",

          t_experiencia_vida_maquinitas:
            "¡Escápate de pinta al Bar Las Maquinitas! Disfruta buena música, ambiente vibrante y momentos que se vuelven recuerdos.",
          q_vida_juegos: "¿Qué puedes encontrar en el área de juegos?",

          t_experiencia_espiral_teatro:
            "Disfruta de la experiencia teatral bajo las luces únicas del techo.",
          q_espiral_lamparas:
            "¿Qué forma tienen las lámparas que cuelgan del techo?",

          t_experiencia_tierra_alberca:
            "Sumérgete en la piscina de Casa Tierra y descubre los detalles escondidos.",
          q_tierra_logo:
            "¿Qué imagen puedes encontrar en el fondo del azulejo de la alberca?",

          t_experiencia_eclipse_luna:
            "Contempla la Luna y descubre su místico habitante.",
          q_eclipse_luna: "¿Qué animal hay en la Luna?",

          t_experiencia_eclipse_xiquit:
            "Investiga el desastre en las habitaciones del Xiquit Inn.",
          q_eclipse_xiquit:
            "Una familia de ______ fueron los responsables del desorden dentro de las habitaciones",

          t_experiencia_sol_infinity:
            "Encuentra el mensaje que te inspira a brillar en el Infinity.",
          q_sol_mensaje: "¿Cuál es el mensaje de la experiencia?",

          t_experiencia_sol_jaguar:
            "Descubre la máscara del guardián jaguar que te vigila desde lo alto.",
          q_sol_jaguar:
            "¿Cuál es la máscara del animal guardián que está arriba del DJ?",

          t_experiencia_fuego_piscina:
            "Admira la famosa alberca transparente y su estructura icónica.",
          q_fuego_piscina:
            "Aquí puedes encontrar una de las____ más icónicas del Hotel Xcaret México",

          t_experiencia_canal_patin:
            "¡Súbete al patín y reta a otro jugador en una carrera! Demuestra tu velocidad y siente la emoción.",
          q_canal_patin: "¿Cuál es la pista más complicada?",

          t_experiencia_vida_tobogan:
            "¡Atrévete a subir al Xechén, el tobogán más alto y siente la emoción al máximo! Prueba tu valentía desde las alturas.",
          q_vida_tobogan: "¿En qué piso está el tobogán más alto?",

          t_experiencia_ixla_xpiral:
            "¡Llega a la cima de la Xpiral y contempla una vista que te dejará sin aliento! Desde lo más alto, disfruta un paisaje paradisiaco.",
          q_ixla_xpiral: "¿Cuántos ángeles hay en La Capilla?",

          t_experiencia_viento_poolpo:
            "¡Atrévete a conquistar el muro de Pool’po! Pon a prueba tu fuerza y llega a la cima con una sonrisa de victoria.",
          q_viento_poolpo: "¿Cuántas rocas hay sobre el muro de escalar?",

          t_experiencia_cielo_xupes:
            "¡Tómate unos tragos en Xupes, el antro para adultos más vibrante del hotel! Y cuando la fiesta termine… ponle el broche de oro con unos tacos de Pava Jarla.",
          q_cielo_xupes: "¿Cuántas máscaras de luchadores hay en Pava Jarla?",

          options: {
            q_caletas: {
              A: "Verdes y Blancos",
              B: "Rojos y Verdes",
              C: "Azules y Blancos",
            },
            q_cielo_flamingos: {
              A: "2",
              B: "4",
              C: "6",
            },
            q_muluk: {
              A: "Una",
              B: "Cinco",
              C: "Dos",
            },
            q_vida_juegos: {
              A: "Un boliche, un billar y un Air Hockey.",
              B: "Un billar, un air hockey y un futbolito.",
              C: "Juegos de apuestas, un boliche y un billar",
            },
            q_espiral_lamparas: {
              A: "Rectangulares.",
              B: "Circulares.",
              C: "En forma de espirales",
            },
            q_tierra_logo: {
              A: "El logo de Casa Tierra.",
              B: "El logo de Hotel Xcaret México.",
              C: "El logo del animal guardián: El venado",
            },
            q_eclipse_luna: {
              A: "El conejo.",
              B: "El coatí.",
              C: "El Búho",
            },
            q_eclipse_xiquit: {
              A: "Conejos",
              B: "Coatíes",
              C: "Búhos",
            },
            q_sol_mensaje: {
              A: "Que somos importantes en el mundo",
              B: "Que somos amados",
              C: "Que siempre vale la pena intentarlo",
            },
            q_sol_jaguar: {
              A: "Venado",
              B: "Guacamaya",
              C: "Serpiente",
            },
            q_fuego_piscina: {
              A: "Escaleras.",
              B: "Piscinas.",
              C: "Sillas",
            },
            q_canal_patin: {
              A: "Datos pendientes",
              B: "Datos pendientes",
              C: "Datos pendientes",
            },
            q_vida_tobogan: {
              A: "Datos pendientes",
              B: "Datos pendientes",
              C: "Datos pendientes",
            },
            q_ixla_xpiral: {
              A: "Datos pendientes",
              B: "Datos pendientes",
              C: "Datos pendientes",
            },
            q_viento_poolpo: {
              A: "Datos pendientes",
              B: "Datos pendientes",
              C: "Datos pendientes",
            },
            q_cielo_xupes: {
              A: "Datos pendientes",
              B: "Datos pendientes",
              C: "Datos pendientes",
            },
          },
          copy: {
            kayak:
              "\u00a1Kraaak-kaaa! \u00a1Lo has logrado, el Amuleto del Navegante es tuyo! Todo gran buxcador sabe c\u00f3mo remar con valent\u00eda y disfrutar del paisaje natural.",
            vinil:
              "\u00a1Kraaak-kaaa! \u00a1Lo has logrado, el Amuleto del Rumbero es tuyo! Todo gran buxcador sabe c\u00f3mo brillar con ritmo y moverse sin parar.",
            caracola:
              "\u00a1Kraaak-kaaa! \u00a1Lo has logrado, el Amuleto del Sereno es tuyo! Todo gran buxcador sabe c\u00f3mo encontrar calma entre las aguas del esp\u00edritu.",
            tv: "\u00a1Kraaak-kaaa! \u00a1Lo has logrado, el Amuleto del Jugador Retro es tuyo! Todo gran buxcador sabe c\u00f3mo dominar los cl\u00e1sicos del pasado.",
            teatro:
              "\u00a1Kraaak-kaaa! \u00a1Lo has logrado, el Amuleto del Artista es tuyo! Todo gran buxcador sabe c\u00f3mo actuar con el coraz\u00f3n y brillar con luz propia.",
            salvavidas:
              "\u00a1Kraaak-kaaa! \u00a1Lo has logrado, el Amuleto del Guardi\u00e1n Acu\u00e1tico es tuyo! Todo gran buxcador sabe c\u00f3mo mantenerse a flote en cualquier tormenta.",
            conejo:
              "\u00a1Kraaak-kaaa! \u00a1Lo has logrado, el Amuleto Lunar es tuyo! Todo gran buxcador sabe c\u00f3mo seguir los secretos que brillan en la noche.",
            camion:
              "\u00a1Kraaak-kaaa! \u00a1Lo has logrado, el Amuleto del Explorador Peque\u00f1o es tuyo! Todo gran buxcador comienza su viaje con curiosidad infinita.",
            estrella:
              "\u00a1Kraaak-kaaa! \u00a1Lo has logrado, el Amuleto Estelar es tuyo! Todo gran buxcador sabe que su brillo interior puede iluminar el mundo.",
            mascarajaguar:
              "\u00a1Kraaak-kaaa! \u00a1Lo has logrado, el Amuleto del Jaguar es tuyo! Todo gran buxcador sabe c\u00f3mo avanzar con sigilo y poder.",
            piscina:
              "\u00a1Kraaak-kaaa! \u00a1Lo has logrado, el Amuleto del Nadador es tuyo! Todo gran buxcador sabe c\u00f3mo lanzarse al fuego sin quemarse.",
            patin:
              "\u00a1Kraaak-kaaa! \u00a1Lo has logrado, el Amuleto del Competidor es tuyo! Todo gran buxcador sabe c\u00f3mo acelerar con destreza y mantener el equilibrio en cualquier reto sobre ruedas.",
            tobogan:
              "\u00a1Kraaak-kaaa! \u00a1Lo has logrado, el Amuleto del Valiente es tuyo! Todo gran buxcador sabe c\u00f3mo lanzarse desde las alturas con una sonrisa en el rostro.",
            xpiral:
              "\u00a1Kraaak-kaaa! \u00a1Lo has logrado, el Amuleto del Conquistador es tuyo! Todo gran buxcador sabe c\u00f3mo llegar tan alto como el cielo.",
            poolpo:
              "\u00a1Kraaak-kaaa! \u00a1Lo has logrado, el Amuleto del Escalador es tuyo! Todo gran buxcador sabe c\u00f3mo esquivar obst\u00e1culos para llegar hasta la cima.",
            drink:
              "\u00a1Kraaak-kaaa! \u00a1Lo has logrado, el Amuleto del Fiestero es tuyo! Todo gran buxcador sabe c\u00f3mo brindar con estilo y guardar los mejores secretos de la noche.",
          },
          blocked: "Bloqueado",

          lee_hint: "Lee la pista",
          scan: "Encuentra y escanea",
          discover_guardian: "Descubre al guardián",

          ///Checklist
          checklist_comido: "Ya comí en:",
          your_progress: "Tu Progreso",
          podium: "Podio de Exploradores",
        },
      },

      // El bloque "en" (inglés) continúa debajo…
      en: {
        translation: {
          // Global
          back: "Back",
          continue: "Continue",
          finish: "Finish",
          close: "Close",
          language: "Language",

          // Login
          login: "Login",
          noAccount: "Don't have an account?",
          registerHere: "Register here",

          // Home
          welcome:
            "Discover all the surprises and adventures that Xcaret México has for you and your family.",
          newAdventure: "Start a new adventure",
          alreadyUser: "I am already a user",
          whatIsXafari: "What is Xafari?",
          xafariDescription:
            "Xafari is an interactive experience inside Hotel Xcaret México where guests can explore, discover secrets, and earn rewards through gamified dynamics.",

          // Register - Step 1
          registerStep1:
            "You need to create an account to save your progress in the game.",
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
          registerStep2:
            "Enter your reservation number and select how you prefer to be called.",
          roomNumber: "Reservation number",
          selectGender: "How do you prefer to be called?",
          buxcadora: "Explorer (she/her)",
          buxcador: "Explorer (he/him)",
          explorerMale: "Explorer",
          explorerFemale: "Explorer",
          registerComplete: "Registration complete. Welcome to Xafari!",

          // Avatar
          editAvatar: "Edit avatar",
          chooseYourStyle: "Choose your style",
          skinTone: "Skin Tone",
          hair: "Hair",
          clothing: "Clothing",
          body: "Body",
          eyes: "Eyes",
          shoes: "Shoes",
          hairAccessory: "Hair accessory",
          bodyAccessory: "Body accessory",
          glasses: "Glasses",
          headAccessory: "Head accessory",
          saveAvatarAndContinue: "Save avatar and continue",
          randomize: "Randomize",
          reset: "Reset",

          // Xecretos
          scan_title: "Scan a Xecreto",
          how_scan: "How to scan?",
          see_clues: "See clues",
          found_guardian: "You found the guardian {{guardian}}!",

          // Instructions
          understood: "Got it",
          scan_step1: "Find the hidden plaques around the hotel.",
          scan_step2:
            "Approach with your mobile device and open the camera from this app.",
          scan_step3: "Scan the visible QR code on the plaque.",
          scan_step4:
            "Discover which guardian you’ve unlocked and see it added to your Tree of Life.",

          // Animations
          welcomeApprentice: "We're glad you're here!",
          welcomeToAdventure: "You've arrived where adventures begin",

          // Feedback
          correct: "Correct answer.",
          next_unlocked: "",
          incorrect: "Incorrect answer.",
          retry_in: "Try again in",

          // Modal
          clue_title: "Xecreto Clues",
          clue_label: "Xecreto {{num}}",

          // Clues
          pistas: {
            xecreto1:
              "When you feel like your world is falling apart, the monkey opens a reflective door to save you.",
            xecreto2:
              "A tree trunk rises from the ground, among its pedestals a frog waits — can you hear its croak?",
            xecreto3:
              "Among tiles, wood, and glass, the jaguar’s spots fade near the sunlight.",
            xecreto4:
              "When hunger strikes, the macaw guides you to the food that nourishes weary bodies.",
            xecreto5:
              "The serpent, guardian of the time cycle, tells us that crushing death reveals itself only if you look up.",
            xecreto6:
              "Among the secret archives of Xurreal, the deer guards them beneath its antlers.",
            xecreto7:
              "The owl waits behind the glass, watching over the birds as they rest at night.",
            xecreto8:
              "Wisdom hides the butterfly, among the words of those who have walked this world before.",
            xecreto9:
              "Among the lush vegetation of a trunk, where warm lights illuminate a cold place, the flamingo watches.",
            xecreto10:
              "Under the tribe of white-dressed beings, the great guardian coati awaits.",
          },

          // Experiences and Questions
          rateExperience: "Rate this experience",
          logrado: "Ready",
          t_experiencia_caletas:
            "Explore the hotel's coves by kayak or paddle board and immerse yourself in the beauty of the scenery with every stroke.",
          q_caletas: "What color are the kayaks and the paddle board?",

          t_experiencia_cielo_flamingos:
            "Let yourself go to the rhythm in the Flamingo Lounge! Dance like never before and own the dance floor.",
          q_cielo_flamingos:
            "In the back, there are niches with flamingo sculptures. How many are there?",

          t_experiencia_agua_muluk:
            "Let yourself be wrapped by calm at the Muluk Family Spa. Enjoy the natural setting, scents, and sounds.",
          q_muluk: "How many pools are there in Muluk?",

          t_experiencia_vida_maquinitas:
            "Sneak off to Las Maquinitas Bar! Enjoy great music, vibrant vibes, and unforgettable moments.",
          q_vida_juegos: "What can you find in the game area?",

          t_experiencia_espiral_teatro:
            "Enjoy the theatrical experience under the unique ceiling lights.",
          q_espiral_lamparas:
            "What shape are the lamps hanging from the ceiling?",

          t_experiencia_tierra_alberca:
            "Dive into the Casa Tierra pool and discover the hidden details.",
          q_tierra_logo:
            "What image can be found on the tile at the bottom of the pool?",

          t_experiencia_eclipse_luna:
            "Gaze at the Moon and discover its mystical inhabitant.",
          q_eclipse_luna: "What animal is on the Moon?",

          t_experiencia_eclipse_xiquit:
            "Investigate the mess in the Xiquit Inn rooms.",
          q_eclipse_xiquit:
            "A family of ______ were responsible for the mess inside the rooms",

          t_experiencia_sol_infinity:
            "Find the message that inspires you to shine at Infinity.",
          q_sol_mensaje: "What is the message of the experience?",

          t_experiencia_sol_jaguar:
            "Discover the jaguar guardian mask watching you from above.",
          q_sol_jaguar: "Which animal guardian mask is above the DJ?",

          t_experiencia_fuego_piscina:
            "Admire the famous transparent pool and its iconic structure.",
          q_fuego_piscina:
            "Here you can find one of the most iconic ____ of Hotel Xcaret México",
          t_experiencia_canal_patin:
            "Hop on your skates and challenge another player to a race! Show your speed and feel the thrill.",
          q_canal_patin: "Which is the most challenging track?",

          t_experiencia_vida_tobogan:
            "Dare to climb Xechén, the tallest slide, and feel the thrill at its peak! Test your courage from great heights.",
          q_vida_tobogan: "On which floor is the tallest slide located?",

          t_experiencia_ixla_xpiral:
            "Reach the top of the Xpiral and enjoy a breathtaking view! From the highest point, marvel at a paradisiacal landscape.",
          q_ixla_xpiral: "How many angels are in the Chapel?",

          t_experiencia_viento_poolpo:
            "Take on the Pool’po climbing wall! Test your strength and reach the top with a victorious smile.",
          q_viento_poolpo: "How many rocks are on the climbing wall?",

          t_experiencia_cielo_xupes:
            "Have a drink at Xupes, the hotel’s most vibrant adult nightclub! And when the party ends… wrap it up with some tacos from Pava Jarla.",
          q_cielo_xupes: "How many luchador masks are there in Pava Jarla?",

          options: {
            q_caletas: {
              A: "Green and White",
              B: "Red and Green",
              C: "Blue and White",
            },
            q_cielo_flamingos: {
              A: "2",
              B: "4",
              C: "6",
            },
            q_muluk: {
              A: "One",
              B: "Five",
              C: "Two",
            },
            q_vida_juegos: {
              A: "A bowling alley, a billiards table, and Air Hockey.",
              B: "A billiards table, air hockey, and foosball.",
              C: "Gambling games, a bowling alley, and a billiards table",
            },
            q_espiral_lamparas: {
              A: "Rectangular.",
              B: "Circular.",
              C: "Spiral shaped",
            },
            q_tierra_logo: {
              A: "Casa Tierra's logo.",
              B: "Hotel Xcaret México's logo.",
              C: "The guardian animal’s logo: the deer",
            },
            q_eclipse_luna: {
              A: "The rabbit.",
              B: "The coati.",
              C: "The owl",
            },
            q_eclipse_xiquit: {
              A: "Rabbits",
              B: "Coatis",
              C: "Owls",
            },
            q_sol_mensaje: {
              A: "That we are important in the world",
              B: "That we are loved",
              C: "That it’s always worth trying",
            },
            q_sol_jaguar: {
              A: "Deer",
              B: "Macaw",
              C: "Snake",
            },
            q_fuego_piscina: {
              A: "Stairs.",
              B: "Pools.",
              C: "Chairs",
            },
            q_canal_patin: {
              A: "Pending data",
              B: "Pending data",
              C: "Pending data",
            },
            q_vida_tobogan: {
              A: "Pending data",
              B: "Pending data",
              C: "Pending data",
            },
            q_ixla_xpiral: {
              A: "Pending data",
              B: "Pending data",
              C: "Pending data",
            },
            q_viento_poolpo: {
              A: "Pending data",
              B: "Pending data",
              C: "Pending data",
            },
            q_cielo_xupes: {
              A: "Pending data",
              B: "Pending data",
              C: "Pending data",
            },
          },
          copy: {
            kayak:
              "Kraaak-kaaa! You've done it—the Navigator's Amulet is yours! Every great seeker knows how to paddle with courage and enjoy the scenery.",
            vinil:
              "Kraaak-kaaa! You've done it—the Rumbero's Amulet is yours! Every great seeker knows how to shine with rhythm and keep moving.",
            caracola:
              "Kraaak-kaaa! You've done it—the Serene Amulet is yours! Every great seeker knows how to find calm in the spirit's waters.",
            tv: "Kraaak-kaaa! You've done it—the Retro Player's Amulet is yours! Every great seeker knows how to master the classics of the past.",
            teatro:
              "Kraaak-kaaa! You've done it—the Artist's Amulet is yours! Every great seeker knows how to act from the heart and shine brightly.",
            salvavidas:
              "Kraaak-kaaa! You've done it—the Aquatic Guardian's Amulet is yours! Every great seeker knows how to stay afloat through any storm.",
            conejo:
              "Kraaak-kaaa! You've done it—the Lunar Amulet is yours! Every great seeker knows how to follow the secrets that shine at night.",
            camion:
              "Kraaak-kaaa! You've done it—the Little Explorer's Amulet is yours! Every great seeker starts their journey with endless curiosity.",
            estrella:
              "Kraaak-kaaa! You've done it—the Stellar Amulet is yours! Every great seeker knows their inner light can illuminate the world.",
            mascarajaguar:
              "Kraaak-kaaa! You've done it—the Jaguar's Amulet is yours! Every great seeker knows how to move forward with stealth and strength.",
            piscina:
              "Kraaak-kaaa! You've done it—the Swimmer's Amulet is yours! Every great seeker knows how to dive into fire without getting burned.",
            patin:
              "Kraaak-kaaa! You've done it—the Competitor's Amulet is yours! Every great seeker knows how to speed with skill and keep balance on any ride.",
            tobogan:
              "Kraaak-kaaa! You've done it—the Brave's Amulet is yours! Every great seeker knows how to slide from the heights with a smile.",
            xpiral:
              "Kraaak-kaaa! You've done it—the Conqueror's Amulet is yours! Every great seeker knows how to reach as high as the sky.",
            poolpo:
              "Kraaak-kaaa! You've done it—the Climber's Amulet is yours! Every great seeker knows how to overcome obstacles to reach the top.",
            drink:
              "Kraaak-kaaa! You've done it—the Partygoer's Amulet is yours! Every great seeker knows how to toast with style and keep the night’s best secrets.",
          },
          blocked: "Blocked",
          lee_hint: "Read the clue",
          scan: "Find and scan",
          discover_guardian: "Discover the guardian",

          //Checklist
          checklist_comido: "I ate here",
          your_progress: "Your Progress",
          podium: "Explorers' Podium",
        },
      },
    },
    fallbackLng: "es",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
