import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function PrivacyNotice() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const privacyItems = useMemo(
    () => t("privacy.privacyList", { returnObjects: true }) ?? [],
    [t, i18n.language]
  );
  const cookiesItems = useMemo(
    () => t("privacy.cookiesList", { returnObjects: true }) ?? [],
    [t, i18n.language]
  );
  const dataUseItems = useMemo(
    () => t("privacy.dataUseList", { returnObjects: true }) ?? [],
    [t, i18n.language]
  );

  return (
    <div className="relative min-h-screen overflow-hidden font-apercu text-gray-800">
      <div className="absolute inset-0">
        <img
          src="/img/fondoArbolDeLaVida.png"
          alt="Fondo Xafari"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-white/85 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 pb-12 pt-6 md:px-10">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-md border border-white/40 text-gray-800 shadow-lg transition-all hover:bg-white active:scale-90 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            aria-label={t("back")}
          >
            <img src="/iconos/icon_regresar.svg" alt={t("back")} className="w-5 h-5" />
          </button>
          <p className="hidden text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-600/70 md:block">
            {t("privacy.updated")}
          </p>
        </div>

        <header className="rounded-full border border-white/60 bg-emerald-600/80 p-0.5 shadow-2xl">
          <div className="rounded-full bg-white/95 py-6 px-10 text-center shadow-inner">
            <h1 className="text-xl font-bold uppercase tracking-[0.1em] text-emerald-900 md:text-2xl">
              {t("privacy.title")}
            </h1>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-emerald-600/60 md:hidden">
              {t("privacy.updated")}
            </p>
          </div>
        </header>

        <p className="max-w-3xl mx-auto text-center text-sm leading-relaxed text-emerald-900/80 bg-white/40 backdrop-blur-md py-4 px-8 rounded-[2rem] border border-white/40">
          {t("privacy.intro")}
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
          <section className="rounded-[2.5rem] border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur-md">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-700 border-b border-emerald-100 pb-3 mb-6">
              {t("privacy.privacyTitle")}
            </h2>
            <ul className="space-y-4 text-xs font-medium leading-relaxed text-emerald-900/80">
              {privacyItems.map((item, index) => (
                <li key={`${item}-${index}`} className="flex items-start gap-4">
                  <span className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100/50 text-emerald-600 text-[8px]">
                    ●
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[2.5rem] border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur-md">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-700 border-b border-emerald-100 pb-3 mb-6">
              {t("privacy.cookiesTitle")}
            </h2>
            <ul className="space-y-4 text-xs font-medium leading-relaxed text-emerald-900/80">
              {cookiesItems.map((item, index) => (
                <li key={`${item}-${index}`} className="flex items-start gap-4">
                  <span className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100/50 text-emerald-600 text-[8px]">
                    ●
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[2.5rem] border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur-md">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-700 border-b border-emerald-100 pb-3 mb-6">
              {t("privacy.dataUseTitle")}
            </h2>
            <ul className="space-y-4 text-xs font-medium leading-relaxed text-emerald-900/80">
              {dataUseItems.map((item, index) => (
                <li key={`${item}-${index}`} className="flex items-start gap-4">
                  <span className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100/50 text-emerald-600 text-[8px]">
                    ●
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mb-6 rounded-full border border-white/60 bg-emerald-600/80 p-0.5 shadow-2xl">
          <div className="rounded-full bg-white/95 py-6 px-10 text-center shadow-inner">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-700">
              {t("privacy.contactTitle")}
            </h3>
            <p className="mt-1 text-[10px] font-medium text-emerald-800/80 uppercase tracking-widest">
              {t("privacy.contactDescription")}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
