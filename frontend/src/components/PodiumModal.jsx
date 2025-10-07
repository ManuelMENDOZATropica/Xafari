import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import AvatarRender from "@/components/AvatarRender";

const NOMBRES = [
  "Ana",
  "Luis",
  "Carlos",
  "María",
  "Jorge",
  "Valeria",
  "Sofía",
  "Miguel",
  "Elena",
  "Tomás",
];
const user = JSON.parse(localStorage.getItem("user"));

const generarAvanceAleatorio = () => ({
  x: Object.fromEntries(
    Array.from({ length: Math.floor(Math.random() * 13) }, (_, i) => [
      `e${i}`,
      true,
    ])
  ),
  c: Object.fromEntries(
    Array.from({ length: Math.floor(Math.random() * 11) }, (_, i) => [
      `c${i}`,
      true,
    ])
  ),
  e: Object.fromEntries(
    Array.from({ length: Math.floor(Math.random() * 11) }, (_, i) => [
      `x${i}`,
      true,
    ])
  ),
});

export default function PodiumModal({ onClose }) {
  const { t, i18n } = useTranslation();
  const [top10, setTop10] = useState([]);
  const [userProgress, setUserProgress] = useState({});

  const totalExperiencias = 12;
  const totalChecklist = 10;
  const totalXecretos = 10;

  const calcularAvancePorcentual = (completados, total) => {
    return ((completados / total) * 100).toFixed(1);
  };

  const calcularAvanceDetalle = (datos) => {
    const { x = {}, c = {}, e = {} } = datos;
    const completadosE = Object.values(e).filter(Boolean).length;
    const completadosC = Object.values(c).filter(Boolean).length;
    const completadosX = Object.values(x).filter(Boolean).length;

    return {
      xperiencias: calcularAvancePorcentual(completadosE, totalExperiencias),
      checklist: calcularAvancePorcentual(completadosC, totalChecklist),
      xecretos: calcularAvancePorcentual(completadosX, totalXecretos),
    };
  };

  useEffect(() => {
    const simulacion = NOMBRES.map((nombre, index) => {
      const avatarData = {
        bodyOptions: index % 10,
        eyesOptions: index % 5,
        hairOptions: index % 18,
        clothingOptions: index % 16,
        glassesAccessoryOptions: index % 10,
        headAccessoryOptions: index % 10,
        bodyAccessoryOptions: index % 2,
        shoeOptions: index % 15,
      };

      const progreso = generarAvanceAleatorio();
      const detalle = calcularAvanceDetalle(progreso);

      return {
        nombre,
        avatarData,
        progreso,
        detalle,
        total:
          parseFloat(detalle.xperiencias) +
          parseFloat(detalle.checklist) +
          parseFloat(detalle.xecretos),
      };
    }).sort((a, b) => b.total - a.total);

    setTop10(simulacion);

    const local = {
      x: JSON.parse(localStorage.getItem("xecretos") || "{}"),
      c: JSON.parse(localStorage.getItem("progresoChecklistGastro") || "{}"),
      e: JSON.parse(localStorage.getItem("progresoXperiencias") || "{}"),
    };

    setUserProgress(calcularAvanceDetalle(local));
  }, []);

  const borderClass = (index) => {
    if (index === 0) return "border-4 border-yellow-400";
    if (index === 1) return "border-4 border-gray-400";
    if (index === 2) return "border-4 border-amber-700";
    return "border border-gray-300";
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
<div className="relative w-full h-full bg-[url('/img/fondoArbolDeLaVida.png')] bg-cover bg-center px-4 md:px-10 py-6 pt-28 overflow-y-auto font-lufga">
        {/* Encabezado */}
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={onClose}
            className="bg-white/80 backdrop-blur-sm text-black px-4 py-2 rounded-full shadow border border-gray-300 hover:bg-white"
          >
            ← {t("back")}
          </button>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() =>
              i18n.changeLanguage(i18n.language === "es" ? "en" : "es")
            }
            className="bg-white/80 backdrop-blur-sm text-black px-4 py-2 rounded-full shadow border border-gray-300 hover:bg-white"
          >
            {t("language")}
          </button>
        </div>

        {/* TU PROGRESO */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow mx-auto w-fit mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-emerald-800 text-center">
            {t("your_progress") || "Tu Progreso"}
          </h1>
        </div>

        <div className="flex items-center gap-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-md border border-gray-300 max-w-md mx-auto mb-10">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-md shrink-0">
            <AvatarRender className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col w-full">
            <p className="text-lg font-bold text-gray-800">
              {user?.name || "Tú"}
            </p>

            <div className="mt-1">
              <p className="text-xs text-gray-700">Xperiencias</p>
              <progress
                value={userProgress.xperiencias}
                max="100"
                className="w-full h-2 rounded bg-gray-200 [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-emerald-600"
              />
            </div>

            <div className="mt-1">
              <p className="text-xs text-gray-700">Checklist</p>
              <progress
                value={userProgress.checklist}
                max="100"
                className="w-full h-2 rounded bg-gray-200 [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-blue-500"
              />
            </div>

            <div className="mt-1">
              <p className="text-xs text-gray-700">Xecretos</p>
              <progress
                value={userProgress.xecretos}
                max="100"
                className="w-full h-2 rounded bg-gray-200 [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Subtítulo */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl px-4 py-2 shadow mx-auto w-fit mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-emerald-800 text-center">
            {t("podium") || "Podio de Exploradores"}
          </h1>
        </div>

        {/* TOP 10 */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {top10.map((jugador, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-md transition-transform relative ${borderClass(
                idx
              )}`}
            >
              <div className="relative w-20 h-20 rounded-full overflow-hidden shadow-md shrink-0">
                <AvatarRender
                  avatarData={jugador.avatarData}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col w-full">
                <p className="text-lg font-bold text-gray-800">
                  {jugador.nombre}
                </p>

                <div className="mt-1">
                  <p className="text-xs text-gray-700">Xperiencias</p>
                  <progress
                    value={jugador.detalle.xperiencias}
                    max="100"
                    className="w-full h-2 rounded bg-gray-200 [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-emerald-600"
                  />
                </div>

                <div className="mt-1">
                  <p className="text-xs text-gray-700">Checklist</p>
                  <progress
                    value={jugador.detalle.checklist}
                    max="100"
                    className="w-full h-2 rounded bg-gray-200 [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-blue-500"
                  />
                </div>

                <div className="mt-1">
                  <p className="text-xs text-gray-700">Xecretos</p>
                  <progress
                    value={jugador.detalle.xecretos}
                    max="100"
                    className="w-full h-2 rounded bg-gray-200 [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-purple-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
