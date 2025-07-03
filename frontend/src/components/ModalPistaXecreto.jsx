import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const pistasKeys = {
  xecreto1: "pistas.xecreto1",
  xecreto2: "pistas.xecreto2",
  xecreto3: "pistas.xecreto3",
  xecreto4: "pistas.xecreto4",
  xecreto5: "pistas.xecreto5",
  xecreto6: "pistas.xecreto6",
  xecreto7: "pistas.xecreto7",
  xecreto8: "pistas.xecreto8",
  xecreto9: "pistas.xecreto9",
  xecreto10: "pistas.xecreto10",
};

export default function ModalPistaXecreto({ show, onClose, scannedCodes }) {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <button
  onClick={onClose}
  className="absolute top-4 right-4 text-gray-600 hover:text-black bg-transparent border-none p-0 m-0"
  title={t("close")}
>
  ✕
</button>


            <h2 className="text-xl font-bold text-emerald-700 mb-4 text-center">
              {t("clue_title") /* ejemplo: "Pistas de los Xecretos" */}
            </h2>

            <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {Object.entries(pistasKeys).map(([key, translationKey]) => (
                <li
                  key={key}
                  className={`text-sm ${
                    scannedCodes?.[key]
                      ? "text-gray-400 line-through"
                      : "text-black"
                  }`}
                >
                  <span className="font-bold">
                    {t("clue_label", { num: key.replace("xecreto", "") })}:{" "}
                  </span>
                  {t(translationKey)}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
