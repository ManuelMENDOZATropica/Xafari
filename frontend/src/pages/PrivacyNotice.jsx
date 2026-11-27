import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CloseIcon from "@/components/CloseIcon";

export default function PrivacyNotice({ onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleClose = onClose ?? (() => navigate(-1));

  const sections = useMemo(() => {
    const value = t("privacy.sections", { returnObjects: true });
    return Array.isArray(value) ? value : [];
  }, [t]);

  return (
    <motion.div
      className="relative min-h-screen font-apercu"
      style={{ backgroundColor: "#F7F3EA", color: "#233C15" }}
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.92, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      {/* ── Header fijo ───────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-20 flex items-center justify-between px-6 py-4"
        style={{ backgroundColor: "#F7F3EA" }}
      >
        <h1
          className="font-bold"
          style={{ fontSize: "22px", color: "#233C15" }}
        >
          {t("privacy.title")}
        </h1>
        <motion.button
          type="button"
          onClick={handleClose}
          whileTap={{ scale: 0.9 }}
          className="flex items-center justify-center bg-transparent border-none cursor-pointer p-0"
          aria-label={t("back")}
        >
          <CloseIcon size={27} color="#233C15" />
        </motion.button>
      </div>

      {/* ── Contenido ─────────────────────────────────────────────── */}
      <div className="mx-auto max-w-md px-6 pb-16 flex flex-col gap-8">

        {/* Intro */}
        <p style={{ fontSize: "16px", lineHeight: "1.6", color: "#233C15" }}>
          {t("privacy.intro")}
        </p>

        <p role="note" style={{ fontSize: "13px", lineHeight: "1.5", color: "#233C15", fontWeight: 600 }}>
          {t("privacy.pendingNote")}
        </p>

        {sections.map((section) => (
          <Section key={section.title} title={section.title} items={section.items || []} />
        ))}

        {/* Contacto */}
        <div
          className="rounded-[20px] p-5"
          style={{ backgroundColor: "#233C15" }}
        >
          <h3
            className="font-bold mb-2"
            style={{ fontSize: "14px", color: "#F7F3EA", letterSpacing: "0.08em", textTransform: "uppercase" }}
          >
            {t("privacy.contactTitle")}
          </h3>
          <p style={{ fontSize: "14px", color: "#F7F3EA", lineHeight: "1.5", margin: 0 }}>
            {t("privacy.contactDescription")}
          </p>
        </div>

        {/* Botón volver */}
        <motion.button
          type="button"
          onClick={handleClose}
          whileTap={{ scale: 0.97 }}
          className="w-full font-bold uppercase border-none cursor-pointer"
          style={{
            height: "60px",
            borderRadius: "30px",
            backgroundColor: "#80A850",
            color: "#F7F3EA",
            fontSize: "16px",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "2px 2px 2px 0px rgba(0,0,0,0.25)",
          }}
        >
          {t("back")}
        </motion.button>

        {/* Fecha actualización */}
        <p
          className="text-center"
          style={{ fontSize: "11px", color: "#233C15", letterSpacing: "0.08em", textTransform: "uppercase" }}
        >
          {t("privacy.updated")}
        </p>
      </div>
    </motion.div>
  );
}

/* ── Componente interno de sección ──────────────────────────── */
function Section({ title, items }) {
  return (
    <div className="flex flex-col gap-4">
      <h2
        className="font-bold uppercase"
        style={{
          fontSize: "13px",
          color: "#233C15",
          letterSpacing: "0.12em",
          borderBottom: "1.5px solid #233C15",
          paddingBottom: "8px",
        }}
      >
        {title}
      </h2>
      <ul className="flex flex-col gap-3" style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {items.map((item, index) => (
          <li
            key={`${index}`}
            className="flex items-start gap-3"
            style={{ fontSize: "15px", lineHeight: "1.6", color: "#233C15" }}
          >
            <span
              aria-hidden="true"
              className="shrink-0 mt-1"
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#80A850",
                marginTop: "8px",
              }}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
