import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import XafariContext from "./XafariContext";

/** Aviso discreto cuando hay progreso guardado en el teléfono que aún no llega al servidor. */
export default function SyncStatus() {
  const { t } = useTranslation();
  const { pendingCount } = useContext(XafariContext);
  const [online, setOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  if (!pendingCount) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-1/2 z-[100] -translate-x-1/2 rounded-full px-4 py-1.5 text-xs font-semibold shadow-md"
      style={{ top: "calc(env(safe-area-inset-top) + 8px)", backgroundColor: "#3D1A00", color: "#F7F3EA" }}
    >
      {online ? t("sync.saving", { count: pendingCount }) : t("sync.offline", { count: pendingCount })}
    </div>
  );
}
