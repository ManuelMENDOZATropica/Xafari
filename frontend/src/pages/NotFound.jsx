import { useContext } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import XafariContext from "@/components/XafariContext";

export default function NotFound() {
  const { t } = useTranslation();
  const { token } = useContext(XafariContext);
  return (
    <main
      className="flex min-h-[100dvh] w-full flex-col items-center justify-center gap-6 px-8 text-center font-apercu"
      style={{ backgroundColor: "#233C15", color: "#F7F3EA" }}
    >
      <img src="/iconos/Pictograma_Xafari_Positivo.png" alt="" className="h-32 w-auto" />
      <h1 className="text-2xl font-bold">{t("notFound.title")}</h1>
      <p className="text-base">{t("notFound.body")}</p>
      <Link
        to={token ? "/treeoflife" : "/"}
        className="rounded-full px-8 py-3 text-lg font-bold"
        style={{ backgroundColor: "#80A850", color: "#F7F3EA" }}
      >
        {t("notFound.cta")}
      </Link>
    </main>
  );
}
