import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const checklistItems = [
  {
    nombre: "quesadillas",
    lugar: "Mercado la Merced",
    copy: "Quesadillas deliciosas",
  },
  { nombre: "ceviche", lugar: "La Trajinera", copy: "Ceviche fresco" },
  { nombre: "acai", lugar: "Bio", copy: "Acai Bowl nutritivo" },
  { nombre: "ravioli", lugar: "Fuego", copy: "Ravioli artesanal" },
  { nombre: "espada", lugar: "Las Cuevas", copy: "Espada con carnita" },
  {
    nombre: "mezcal",
    lugar: "Cantina Los Faroles",
    copy: "Caballito con mezcal",
  },
  { nombre: "paleta", lugar: "Chibalí", copy: "Paleta de dulce miguelito" },
  { nombre: "tostada", lugar: "Las Playas", copy: "Tostada de pulpo" },
  { nombre: "ramen", lugar: "Xin-Gao", copy: "Ramen japonés" },
  { nombre: "quesos", lugar: "Arriba Baja", copy: "Tabla de quesos" },
  { nombre: "torta", lugar: "La Xentral", copy: "Torta deliciosa" },
  { nombre: "palomitas", lugar: "Xinema", copy: "Palomitas de película" },
  { nombre: "nogada", lugar: "Azul Nogada", copy: "Chile en nogada" },
  { nombre: "panucho", lugar: "Chi’", copy: "Panucho tradicional" },
  { nombre: "corunda", lugar: "Monarca", copy: "Corunda michoacana" },
  { nombre: "coctel", lugar: "Costero", copy: "Coctel de camarón" },
  { nombre: "carne", lugar: "La Silla", copy: "Carne asada" },
  { nombre: "ostion", lugar: "Ha’", copy: "Ostión fresco" },
  {
    nombre: "mimosa",
    lugar: "Brunch Dominical Xcaret",
    copy: "Mimosa espumosa",
  },
  { nombre: "sushi", lugar: "Tama-Mon", copy: "Rollito de sushi" },
];

export default function ChecklistGastro({ onClose }) {
  const { t, i18n } = useTranslation();

  const [estado, setEstado] = useState(() => {
    const saved = localStorage.getItem("progresoChecklistGastro");
    return saved ? JSON.parse(saved) : {};
  });

  const [ratings, setRatings] = useState(() => {
    const saved = localStorage.getItem("calificacionesChecklistGastro");
    return saved ? JSON.parse(saved) : {};
  });

  const handleCheck = (clave) => {
    const actualizado = { ...estado, [clave]: true };
    setEstado(actualizado);
    localStorage.setItem(
      "progresoChecklistGastro",
      JSON.stringify(actualizado)
    );

    // Espera para permitir que se vea la insignia activada antes de cerrar
    setTimeout(() => {
      onClose(); // cerrar modal
    }, 1000); // puedes ajustar la duración
  };

  const handleSetRating = (clave, valor) => {
    const actualizado = { ...ratings, [clave]: valor };
    setRatings(actualizado);
    localStorage.setItem(
      "calificacionesChecklistGastro",
      JSON.stringify(actualizado)
    );
  };

  const completadas = Object.values(estado).filter((v) => v === true).length;
  const progreso = Math.round((completadas / checklistItems.length) * 100);

  return (
    <div className="fixed inset-0 z-50">
      {/* Fondo de imagen */}
      <img
        src="/img/V03-CERRITOS.jpg"
        alt="Fondo"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      <div className="absolute inset-0 w-full h-full bg-white/0 overflow-hidden flex flex-col z-10">
        {/* Barra superior */}
        <div className="flex justify-between items-center px-4 py-3 border-b z-10">
          <button
            onClick={onClose}
            className="bg-white/80 backdrop-blur-sm text-black px-4 py-2 rounded-full shadow border border-gray-300 hover:bg-white"
          >
            ← {t("back")}
          </button>
          <button
            onClick={() =>
              i18n.changeLanguage(i18n.language === "es" ? "en" : "es")
            }
            className="bg-white/80 backdrop-blur-sm text-black px-4 py-2 rounded-full shadow border border-gray-300 hover:bg-white"
          >
            {t("language")}
          </button>
        </div>

        {/* Progreso */}
        <div className="px-6 pt-3 pb-1">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow mx-auto w-fit">
            <h1 className="text-xl md:text-2xl font-bold text-emerald-800 text-center">
              Checklist Gastronómico
            </h1>
          </div>

          <div className="w-full max-w-md mx-auto mt-3 bg-white/80 rounded-full overflow-hidden shadow border border-gray-300">
            <div
              className="bg-green-500 text-white text-xs font-semibold text-center py-1 transition-all"
              style={{ width: `${progreso}%` }}
            >
              {progreso}%
            </div>
          </div>
        </div>

        {/* Ítems */}
        <div className="flex-1 overflow-y-auto px-4 pb-6 pt-4">
          <div className="grid gap-6">
            {checklistItems.map(({ nombre, lugar, copy }, idx) => {
              const completado = estado[nombre] === true;
              return (
                <div
                  key={idx}
                  className={`relative bg-white/90 backdrop-blur-md p-4 md:p-6 rounded-2xl shadow-md border transition-all ${
                    completado ? "border-green-500" : "border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800 mb-1">
                      {lugar}
                    </h2>
                    <motion.img
                      src={`/insigniasChecklist/${nombre}.png`}
                      alt={nombre}
                      className="w-10 h-10 object-contain"
                      initial={{ opacity: 0.2, scale: 0.8 }}
                      animate={
                        completado
                          ? {
                              opacity: 1,
                              scale: [1, 1.3, 1],
                              transition: { duration: 0.6 },
                            }
                          : { opacity: 0.2, scale: 0.8 }
                      }
                    />
                  </div>

                  <p className="text-sm text-gray-700 leading-snug">{copy}</p>

                  <div className="mt-4">
                    {!completado ? (
                      <button
                        onClick={() => handleCheck(nombre)}
                        className="px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-all border bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                      >
                        {t("checklist_comido")} "{lugar}"
                      </button>
                    ) : (
                      <>
                      

                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            {t("rateExperience")}
                          </p>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                role="button"
                                onClick={() => handleSetRating(nombre, star)}
                                className={`text-xl cursor-pointer transition-transform ${
                                  ratings[nombre] >= star
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
