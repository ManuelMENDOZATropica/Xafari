import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import AvatarRender from "@/components/AvatarRender";
import CloseIcon from "./CloseIcon";

const NOMBRES = [
  "Ana", "Luis", "Carlos", "María", "Jorge", 
  "Valeria", "Sofía", "Miguel", "Elena", "Tomás"
];

const generarAvanceAleatorio = () => ({
  x: Object.fromEntries(
    Array.from({ length: Math.floor(Math.random() * 13) }, (_, i) => [`e${i}`, true])
  ),
  c: Object.fromEntries(
    Array.from({ length: Math.floor(Math.random() * 11) }, (_, i) => [`c${i}`, true])
  ),
  e: Object.fromEntries(
    Array.from({ length: Math.floor(Math.random() * 11) }, (_, i) => [`x${i}`, true])
  ),
});

export default function PodiumModal({ onClose }) {
  const { t } = useTranslation();
  const [top10, setTop10] = useState([]);
  const [userProgress, setUserProgress] = useState({ xperiencias: 0, checklist: 0, xecretos: 0 });
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const totalExperiencias = 12;
  const totalChecklist = 10;
  const totalXecretos = 10;

  const calcularAvancePorcentual = (completados, total) => {
    if (!total) return "0.0";
    return ((completados / total) * 100).toFixed(1);
  };

  const calcularAvanceDetalle = (datos) => {
    const { x = {}, c = {}, e = {} } = datos || {};
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
        <div className="absolute inset-0 z-10 flex h-full w-full flex-col overflow-hidden bg-white/0">
          <motion.div className="relative h-full w-full overflow-y-auto bg-[url('/img/fondoArbolDeLaVida.png')] bg-cover bg-center px-4 py-6 pt-16 font-apercu md:px-10">
            <div className="mb-6 flex items-center justify-between gap-4">
              <button
                onClick={onClose}
                className="rounded-full border border-gray-300 bg-white/80 px-4 py-2 text-black shadow backdrop-blur-sm transition hover:bg-white"
              >
                ← {t("back")}
              </button>
            </div>

            <div className="mx-auto mb-4 w-fit rounded-xl bg-white/80 px-4 py-2 shadow backdrop-blur-sm">
              <h1 className="text-center text-xl font-bold text-emerald-800 md:text-2xl">
                {t("your_progress")}
              </h1>
            </div>

            <div className="mx-auto mb-10 flex max-w-md items-center gap-4 rounded-2xl border border-gray-300 bg-white/90 p-4 shadow-md backdrop-blur-md">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl shadow-md">
                <AvatarRender avatarData={user?.avatarData || {}} className="h-full w-full object-cover" />
              </div>
              <div className="flex w-full flex-col">
                <p className="text-lg font-bold text-gray-800">{user?.name || t("youLabel")}</p>

                <div className="mt-1">
                  <p className="text-xs text-gray-700">{t("xperiencesLabel")}</p>
                  <progress
                    value={userProgress.xperiencias || 0}
                    max="100"
                    className="h-2 w-full rounded bg-gray-200 [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-emerald-600"
                  />
                </div>

                <div className="mt-1">
                  <p className="text-xs text-gray-700">{t("checklistLabel")}</p>
                  <progress
                    value={userProgress.checklist || 0}
                    max="100"
                    className="h-2 w-full rounded bg-gray-200 [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-blue-500"
                  />
                </div>

                <div className="mt-1">
                  <p className="text-xs text-gray-700">{t("secretsLabel")}</p>
                  <progress
                    value={userProgress.xecretos || 0}
                    max="100"
                    className="h-2 w-full rounded bg-gray-200 [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-purple-500"
                  />
                </div>
              </div>
            </div>

            <div className="mx-auto mb-4 w-fit rounded-xl bg-white/80 px-4 py-2 shadow backdrop-blur-sm">
              <h1 className="text-center text-xl font-bold text-emerald-800 md:text-2xl">{t("podium")}</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 max-w-5xl mx-auto pb-10">
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
                      <p className="text-xs text-gray-700">{t("xperiencesLabel")}</p>
                      <progress
                        value={jugador.detalle.xperiencias}
                        max="100"
                        className="w-full h-2 rounded bg-gray-200 [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-emerald-600"
                      />
                    </div>

                    <div className="mt-1">
                      <p className="text-xs text-gray-700">{t("checklistLabel")}</p>
                      <progress
                        value={jugador.detalle.checklist}
                        max="100"
                        className="w-full h-2 rounded bg-gray-200 [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-blue-500"
                      />
                    </div>

                    <div className="mt-1">
                      <p className="text-xs text-gray-700">{t("secretsLabel")}</p>
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
          </motion.div>
        </div>
      </div>
    </div>
  );
}