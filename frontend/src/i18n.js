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
            "Explora las caletas del hotel en Kayak o Paddle board y sumérgete en la belleza del paisaje en cada remada.",
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
            "¡Déjate sorprender en uno de los espectáculos de Teatro del Río! Vive un momento mágico en el restaurante.",
          q_espiral_lamparas:
            "¿Qué forma tienen las lámparas que cuelgan del techo?",

          t_experiencia_tierra_alberca:
            "Sumérgete en la alberca infinita y déjate envolver por la tranquilidad del horizonte. Relájate y disfruta de una vista que se funde con el cielo y el mar",
          q_tierra_logo:
            "¿Qué imagen puedes encontrar en el fondo del azulejo de la alberca?",

          t_experiencia_eclipse_luna:
            "¡Descubre la magia de La Lunateca junto a los más peques de la familia! Sumérgete en un mundo de juegos, risas y aventuras",
          q_eclipse_luna: "¿Qué animal hay en la Luna?",

          t_experiencia_eclipse_xiquit:
            "¡Explora todos los roles en Xiquit Inn: el hotel hecho para y por niños! Resuelve todos los retos y conviértete en el Gerente del Hotel.",
          q_eclipse_xiquit:
            "Una familia de ______ fueron los responsables del desorden dentro de las habitaciones",

          t_experiencia_sol_infinity:
            "¡Adéntrate en el asombroso Infinity Room y deja que las estrellas te envuelvan! Una experiencia inmersiva fuera de este mundo.",
          q_sol_mensaje: "¿Cuál es el mensaje de la experiencia?",

          t_experiencia_sol_jaguar:
            "¡Déjate llevar por el ritmo en la Paxanguería!Sumérgete en un ambiente lleno de luces y música",
          q_sol_jaguar:
            "¿Cuál es la máscara del animal guardián que está arriba del DJ?",

          t_experiencia_fuego_piscina:
            "Eleva tus sentidos en Rooftop Fuego, donde el cielo y el mar se encuentran. Un oasis exclusivo para adultos",
          q_fuego_piscina:
            "Aquí puedes encontrar una de las____ más icónicas del Hotel Xcaret México",

          t_experiencia_canal_patin:
            "¡Súbete al patín y reta a otro jugador en una carrera! Demuestra tu velocidad y siente la emoción.",
          q_canal_patin: "¿Cuál es la pista más complicada?",

          t_experiencia_vida_tobogan:
            "¡Atrévete a subir al Kamikaze , el tobogán más alto y siente la emoción al máximo! Prueba tu valentía desde las alturas",
          q_vida_tobogan: "¿En qué piso está el tobogán más alto?",

          t_experiencia_ixla_xpiral:
            "¡Llega a la cima de la Xpiral y contempla una vista que te dejará sin aliento! Desde lo más alto, disfruta un paisaje paradisíaco.",
          q_ixla_xpiral: "¿Cuántos ángeles hay en La Capilla?",

          t_experiencia_viento_poolpo:
            "¡Atrévete a conquistar el muro de Pool’po! Pon a prueba tu fuerza y llega a la cima con una sonrisa de victoria.",
          q_viento_poolpo: "¿Cuántas rocas hay sobre el muro de escalar?",

          t_experiencia_cielo_xupes:
            "¡Tómate unos tragos en Xupes, el antro para adultos más vibrante del hotel! Y cuando la fiesta termine… ponle el broche de oro con unos tacos de Pava Jarla.",
          q_cielo_xupes: "¿Cuántas máscaras de luchadores hay en Pava Jarla?",

          options: {
            q_caletas: {
              A: "Verdes y blancos",
              B: "Rojos y verdes",
              C: "Azules y blancos",
            },
            q_cielo_flamingos: {
              A: "Más de 5",
              B: "Más de 15",
              C: "Más de 25",
            },
            q_muluk: {
              A: "Una",
              B: "Cinco",
              C: "Dos",
            },
            q_vida_juegos: {
              A: "Un boliche, un billar y un air hockey",
              B: "Un billar, un air hockey y un futbolito",
              C: "Juegos de apuestas, un boliche y un billar",
            },
            q_espiral_lamparas: {
              A: "Rectangulares",
              B: "Circulares",
              C: "En forma de espirales",
            },
            q_tierra_logo: {
              A: "El logo de Casa Tierra",
              B: "El logo de Hotel Xcaret México",
              C: "Ninguna de las anteriores",
            },
            q_eclipse_luna: {
              A: "El conejo",
              B: "El coatí",
              C: "El búho",
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
              A: "Escaleras",
              B: "Piscinas",
              C: "Sillas",
            },
            q_canal_patin: {
              A: "Son iguales",
              B: "La que está del lado de las tiendas del canal",
              C: "Datos pendientes",
            },
            q_vida_tobogan: {
              A: "Piso 10",
              B: "Piso 7",
              C: "Piso 5",
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
              A: "28",
              B: "30",
              C: "32",
            },
          },
          copy: {
            kayak:
              "¡Kraaak-kaaa! ¡Lo has logrado, el Amuleto del Remador es tuyo! Todo gran buxcador sabe cómo remar para cruzar entre islas y ríos.",
            vinil:
              "¡Kraaak-kaaa! ¡Lo has logrado, el Amuleto del Bailador es tuyo! Todo gran buxcador sabe cómo bailar para comunicarse sin tener que usar palabras.",
            caracola:
              "¡Kraaak-kaaa! ¡Lo has logrado, el Amuleto del Contemplador es tuyo! Todo gran buxcador sabe cómo calmar su mente para sentir lo que ocurre alrededor.",
            tv: "¡Kraaak-kaaa! ¡Lo has logrado, el Amuleto del Ambientador es tuyo! Todo gran buxcador sabe cómo mezclarse en cualquier ambiente para no desentonar.",
            teatro:
              "¡Kraaak-kaaa! ¡Lo has logrado, el Amuleto del Actor es tuyo! Todo gran buxcador sabe cómo meterse en el papel y no ser descubierto en la aventura.",
            salvavidas:
              "¡Kraaak-kaaa! ¡Lo has logrado, el Amuleto del Buceador es tuyo! Todo gran buxcador sabe cómo aguantar la respiración para descubrir tesoros submarinos.",
            conejo:
              "¡Kraaak-kaaa! ¡Lo has logrado, el Amuleto del Cuidador es tuyo! Todo gran buxcador sabe cómo cuidar a los más pequeños de la tropa.",
            camion:
              "¡Kraaak-kaaa! ¡Lo has logrado, el Amuleto del Chambeador es tuyo! Todo gran buxcador sabe cómo resolver cualquier trabajo que surja en el campamento.",
            estrella:
              "¡Kraaak-kaaa! ¡Lo has logrado, el Amuleto del Soñador es tuyo! Todo gran buxcador sabe cómo encontrar su camino en la noche más oscura  estrellada.",
            mascarajaguar:
              "Datos Pendientes",
            piscina:
              "Satos Pendientes",
            patin:
              "¡Kraaak-kaaa! ¡Lo has logrado, el Amuleto del Competidor es tuyo! Todo gran buxcador sabe cómo ganar a cualquier desafío que se le presenta.",
            tobogan:
              "Datos Pendientes",
            xpiral:
              "¡Kraaak-kaaa! ¡Lo has logrado, el Amuleto del Conquistador es tuyo! Todo gran buxcador sabe cómo llegar tan alto como el cielo.",
            poolpo:
              "¡Kraaak-kaaa! ¡Lo has logrado, el Amuleto del Escalador es tuyo! Todo gran buxcador sabe cómo esquivar obstáculos para llegar hasta la cima.",
            drink:
              "Datos Pendientes",
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
            "Explore the hotel’s coves by kayak or paddle board and immerse yourself in the beauty of the landscape with every stroke.",
          q_caletas: "What color are the kayaks and the paddle boards?",

          t_experiencia_cielo_flamingos:
            "Let the rhythm carry you away at the Flamingo Lounge! Dance like never before, feel the energy of the best music, and own the dance floor with your best moves.",
          q_cielo_flamingos:
            "At the back, there are niches with flamingo sculptures. How many are there?",

          t_experiencia_agua_muluk:
            "Let yourself be wrapped in calm at the Muluk Family Spa. Enjoy a natural setting filled with soothing scents and sounds.",
          q_muluk: "How many pools are there in Muluk?",

          t_experiencia_vida_maquinitas:
            "Sneak off to Las Maquinitas Bar! Enjoy great music, vibrant vibes, and unforgettable moments.",
          q_vida_juegos: "What can you find in the game area?",

          t_experiencia_espiral_teatro:
            "Let yourself be amazed by one of the shows at Teatro del Río! Experience a magical moment at the restaurant.",
          q_espiral_lamparas:
            "What shape are the lamps hanging from the ceiling?",

          t_experiencia_tierra_alberca:
            "Immerse yourself in the infinity pool and let the calm of the horizon surround you. Relax and enjoy a view where the sky and sea become one.",
          q_tierra_logo:
            "What image can you find at the bottom of the pool tile?",

          t_experiencia_eclipse_luna:
            "Discover the magic of La Lunateca with the little ones in the family! Dive into a world of games, laughter, and adventure.",
          q_eclipse_luna: "What animal is on the Moon?",

          t_experiencia_eclipse_xiquit:
            "Try every role at Xiquit Inn: the hotel made for and by kids! Take on fun challenges and rise to the top as the Hotel Manager.",
          q_eclipse_xiquit:
            "A family of ______ were responsible for the mess inside the rooms",

          t_experiencia_sol_infinity:
            "Step into the amazing Infinity Room and let the stars surround you! An immersive experience that's truly out of this world.",
          q_sol_mensaje: "What is the message of the experience?",

          t_experiencia_sol_jaguar:
            "Let the rhythm take over at the Paxanguería! Dive into an atmosphere full of lights and music.",
          q_sol_jaguar: "Which animal guardian mask is above the DJ?",

          t_experiencia_fuego_piscina:
            "Awaken your senses at Rooftop Fuego, where sky and sea become one. An exclusive adults-only oasis.",
          q_fuego_piscina:
            "Here you can find one of the most iconic ____ of Hotel Xcaret México",
          t_experiencia_canal_patin:
            "Hop on Patín and challenge another player to a race! Show your speed and feel the thrill.",
          q_canal_patin: "Which is the most challenging track?",

          t_experiencia_vida_tobogan:
            "Dare to ride the Kamikaze, the tallest slide, and feel the thrill at its peak! Test your courage from way up high.",
          q_vida_tobogan: "On which floor is the tallest slide located?",

          t_experiencia_ixla_xpiral:
            "Reach the top of the Xpiral and enjoy a breathtaking view! From the highest point, marvel at a paradisiacal landscape.",
          q_ixla_xpiral: "How many angels are in the Chapel?",

          t_experiencia_viento_poolpo:
            "Dare to conquer the Pool’po wall!Show your strength and climb to the top with a winning smile.",
          q_viento_poolpo: "How many rocks are on the climbing wall?",

          t_experiencia_cielo_xupes:
            "Grab a few drinks at Xupes, the hotel’s most vibrant nightclub for adults! And when the party’s over… top it all off with some tacos from Pava Jarla.",
          q_cielo_xupes: "How many wrestler masks are there in Pava Jarla?",

          options: {
            q_caletas: {
              A: "Green and white",
              B: "Red and green",
              C: "Blue and white",
            },
            q_cielo_flamingos: {
              A: "More than 5",
              B: "More than 15",
              C: "More than 25",
            },
            q_muluk: {
              A: "One",
              B: "Five",
              C: "Two",
            },
            q_vida_juegos: {
              A: "A bowling alley, a billiards table, and air hockey.",
              B: "A billiards table, air hockey, and foosball.",
              C: "Gambling games, a bowling alley, and a billiards table",
            },
            q_espiral_lamparas: {
              A: "Rectangular.",
              B: "Circular.",
              C: "Spiral shaped",
            },
            q_tierra_logo: {
              A: "The Casa Tierra logo",
              B: "The Hotel Xcaret México logo",
              C: "None of the above",
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
              A: "Stairs",
              B: "Pools",
              C: "Chairs",
            },
            q_canal_patin: {
              A: "They are the same",
              B: "The one on the side of the canal shops",
              C: "Pending data",
            },
            q_vida_tobogan: {
              A: "10th floor",
              B: "7th floor",
              C: "5th floor",
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
              A: "28",
              B: "30",
              C: "32",
            },
          },
          copy: {
            kayak:
              "Kraaak-kaaa! You did it—the Paddler’s Amulet is yours! Every great buxcador knows how to paddle across islands and rivers.",
            vinil:
              "Kraaak-kaaa! You did it—the Dancer’s Amulet is yours! Every great buxcador knows how to dance to communicate without using words.",
            caracola:
              "Kraaak-kaaa! You did it—the Contemplator’s Amulet is yours! Every great buxcador knows how to calm their mind to feel what’s happening around them.",
            tv: "Kraaak-kaaa! You did it—the Party Starter’s Amulet is yours! Every great buxcador knows how to blend into any environment without standing out.",
            teatro:
              "Kraaak-kaaa! You did it—the Actor’s Amulet is yours! Every great buxcador knows how to get into character and not get caught during the adventure.",
            salvavidas:
              "Kraaak-kaaa! You did it—the Diver’s Amulet is yours! Every great buxcador knows how to hold their breath to discover underwater treasures.",
            conejo:
              "Kraaak-kaaa! You did it—the Caretaker’s Amulet is yours! Every great buxcador knows how to look after the youngest members of the troop.",
            camion:
              "Kraaak-kaaa! You did it—the Hardworker’s Amulet is yours! Every great buxcador knows how to handle any task that comes up at camp.",
            estrella:
              "Kraaak-kaaa! You did it—the Dreamer’s Amulet is yours! Every great buxcador knows how to find their way through the darkest starry night.",
            mascarajaguar:
              "Datos pendientes",
            piscina:
              "Datos pendientes",
            patin:
              "Kraaak-kaaa! You did it—the Competitor’s Amulet is yours! Every great buxcador knows how to win any challenge that comes their way.",
            tobogan:
              "Datos pendientes",
            xpiral:
              "Kraaak-kaaa! You did it—the Conqueror’s Amulet is yours! Every great buxcador knows how to reach as high as the sky.",
            poolpo:
              "Kraaak-kaaa! You did it—the Climber’s Amulet is yours! Every great buxcador knows how to dodge obstacles to reach the top.",
            drink:
              "Datos pendientes",
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
