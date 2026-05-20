import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import XafariContext from "./XafariContext";
import CloseIcon from "./CloseIcon";

const checklistItems = [
  "quesadillas",
  "ceviche",
  "acai",
  "ravioli",
  "espada",
  "mezcal",
  "paleta",
  "tostada",
  "ramen",
  "quesos",
  "torta",
  "palomitas",
  "nogada",
  "panucho",
  "corunda",
  "coctel",
  "carne",
  "ostion",
  "mimosa",
  "sushi",
];

export default function ChecklistGastro({ onClose }) {
  const { t } = useTranslation();
  const { playSuccessSound, registerActivityCompleted, saveActivityRating } = useContext(XafariContext);
  const getItemField = (itemKey, field) =>
    t(`gastroChecklist.items.${itemKey}.${field}`);

  const [estado, setEstado] = useState(() => {
    const saved = localStorage.getItem("progresoChecklistGastro");
    return saved ? JSON.parse(saved) : {};
  });

  const [ratings, setRatings] = useState(() => {
    const saved = localStorage.getItem("calificacionesChecklistGastro");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    const reloadLocalState = () => {
      const savedEstado = localStorage.getItem("progresoChecklistGastro");
      if (savedEstado) setEstado(JSON.parse(savedEstado));
      const savedRatings = localStorage.getItem("calificacionesChecklistGastro");
      if (savedRatings) setRatings(JSON.parse(savedRatings));
    };
    window.addEventListener("progression_synced", reloadLocalState);
    return () => window.removeEventListener("progression_synced", reloadLocalState);
  }, []);

  const handleCheck = (clave) => {
    const actualizado = { ...estado, [clave]: true };
    setEstado(actualizado);
    registerActivityCompleted(clave);

    if (typeof playSuccessSound === "function") {
      playSuccessSound();
    }

    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleSetRating = (clave, valor) => {
    const actualizado = { ...ratings, [clave]: valor };
    setRatings(actualizado);
    saveActivityRating(clave, valor);
  };

  const completadas = Object.values(estado).filter((v) => v === true).length;
  const progreso = Math.round((completadas / checklistItems.length) * 100);

  return (
    <div className="w-full h-full min-h-screen mt-[22px] overflow-y-auto px-4">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-[-10px] right-5 z-50 mt-[10px] rounded-full border-2 border-white/50 bg-white px-5 py-1.5 font-bold text-gray-900 shadow-lg transition-transform hover:scale-105"
        aria-label={t("close")}
      >
        <CloseIcon size={20} color="#111827" />
      </button>
      <div className="relative h-full w-full rounded-[10px] bg-[#FFBB00] font-apercu text-black">
        <img
          src="/img/V03-CERRITOS.jpg"
          alt={t("genericBackgroundAlt")}
          className="absolute inset-0 z-0 h-full w-full rounded-[10px] object-cover"
        />

        <div className="absolute inset-0 z-10 flex h-full w-full flex-col overflow-hidden bg-white/0">
          <div className="z-10 flex items-center justify-start border-b px-4 py-3">
            <button
              onClick={onClose}
              className="rounded-full border border-gray-300 bg-white/80 px-4 py-2 text-black shadow backdrop-blur-sm transition hover:bg-white"
            >
              ← {t("back")}
            </button>
          </div>

          <div className="px-6 pb-1 pt-3">
            <div className="mx-auto w-fit rounded-xl bg-white/80 px-4 py-2 shadow backdrop-blur-sm">
              <h1 className="text-center text-xl font-bold text-emerald-800 md:text-2xl">
                {t("gastroChecklist.title")}
              </h1>
            </div>

            <div className="mx-auto mt-3 w-full max-w-md overflow-hidden rounded-full border border-gray-300 bg-white/80 shadow">
              <div
                className="bg-green-500 py-1 text-center text-xs font-semibold text-white transition-all"
                style={{ width: `${progreso}%` }}
              >
                {progreso}%
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-6 pt-4">
            <div className="grid gap-6">
              {checklistItems.map((clave) => {
                const completado = estado[clave] === true;
                const place = getItemField(clave, "place");
                const description = getItemField(clave, "description");
                return (
                  <div
                    key={clave}
                    className={`relative rounded-2xl border bg-white/90 p-4 shadow-md transition-all backdrop-blur-md md:p-6 ${
                      completado ? "border-green-500" : "border-gray-300"
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-gray-800">{place}</h2>
                      <motion.img
                        src={`/insigniasChecklist/${clave}.png`}
                        alt={place}
                        className="h-10 w-10 object-contain"
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

                    <p className="mb-2 text-sm text-gray-700">{description}</p>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleCheck(clave)}
                        disabled={completado}
                        className={`rounded-full px-4 py-2 font-semibold shadow transition-colors ${
                          completado
                            ? "bg-green-500 text-white"
                            : "border border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
                        }`}
                      >
                        {completado ? t("completed") : t("add_to_tree")}
                      </button>

                      <div className="flex items-center gap-1 text-yellow-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleSetRating(clave, star)}
                            className={`text-2xl transition-transform ${
                              ratings[clave] >= star
                                ? "scale-110 drop-shadow"
                                : "opacity-60"
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="px-4 pb-4 mt-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-3 shadow flex items-center justify-between border border-gray-300">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {Object.keys(estado)
                    .filter((k) => estado[k])
                    .slice(0, 5)
                    .map((k) => (
                      <div key={k} className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow bg-white">
                        <img
                          src={`/insigniasChecklist/${k}.png`}
                          alt={getItemField(k, "place")}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{t("progress")}</p>
                  <p className="text-xs text-gray-600">
                    {completadas} / {checklistItems.length} {t("completed")}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="bg-white/80 backdrop-blur-sm text-black px-4 py-2 rounded-full shadow border border-gray-300 hover:bg-white"
              >
                {t("back")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
