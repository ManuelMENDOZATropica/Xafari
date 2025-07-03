import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function ModalInstruccionesXecretos({ show, onClose }) {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl w-[90%] max-w-lg p-6 relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
         <button
  onClick={onClose}
  className="absolute top-4 right-4 text-gray-600 hover:text-black bg-transparent border-none p-0 m-0"
  title={t("close")}
>
  ✕
</button>


            <h2 className="text-xl font-bold text-emerald-800 mb-4 text-center">
              {t("how_scan")}
            </h2>

            <ul className="text-gray-800 text-sm leading-relaxed space-y-2">
              <li>{t("scan_step1")}</li>
              <li>{t("scan_step2")}</li>
              <li>{t("scan_step3")}</li>
              <li>{t("scan_step4")}</li>
            </ul>

            <div className="mt-6 text-center">
              <button
                onClick={onClose}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2 rounded-full shadow transition"
              >
                {t("understood")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
