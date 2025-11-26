import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function TermsConditions() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const accountItems = useMemo(
    () => t("terms.accountList", { returnObjects: true }) ?? [],
    [t, i18n.language]
  );
  const playItems = useMemo(
    () => t("terms.playList", { returnObjects: true }) ?? [],
    [t, i18n.language]
  );
  const conductItems = useMemo(
    () => t("terms.conductList", { returnObjects: true }) ?? [],
    [t, i18n.language]
  );
  const dataItems = useMemo(
    () => t("terms.dataList", { returnObjects: true }) ?? [],
    [t, i18n.language]
  );

  return (
    <div className="relative min-h-screen overflow-hidden font-lufga text-gray-800">
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
            className="rounded-full border border-gray-200 bg-white/90 px-4 py-2 text-sm font-semibold text-sky-800 shadow transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            ← {t("back")}
          </button>
          <p className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-sky-500 md:block">
            {t("terms.updated")}
          </p>
        </div>

        <header className="rounded-3xl border border-white/60 bg-gradient-to-br from-emerald-500/80 via-teal-500/80 to-sky-500/80 p-[1px] shadow-xl">
          <div className="rounded-[calc(1.5rem-2px)] bg-white/95 p-6 text-center shadow-inner">
            <h1 className="text-2xl font-bold text-emerald-900 drop-shadow md:text-3xl">
              {t("terms.title")}
            </h1>
            <p className="mt-3 text-sm text-emerald-800 md:text-base">{t("terms.intro")}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-sky-500 md:hidden">
              {t("terms.updated")}
            </p>
          </div>
        </header>

        <section className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur">
          <h2 className="text-xl font-semibold text-emerald-700 md:text-2xl">
            {t("terms.accountTitle")}
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed md:text-base">
            {accountItems.map((item, index) => (
              <li key={`${item}-${index}`} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  ●
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur">
          <h2 className="text-xl font-semibold text-sky-700 md:text-2xl">
            {t("terms.playTitle")}
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed md:text-base">
            {playItems.map((item, index) => (
              <li key={`${item}-${index}`} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                  ●
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur">
          <h2 className="text-xl font-semibold text-indigo-700 md:text-2xl">
            {t("terms.conductTitle")}
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed md:text-base">
            {conductItems.map((item, index) => (
              <li key={`${item}-${index}`} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  ●
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur">
          <h2 className="text-xl font-semibold text-purple-700 md:text-2xl">
            {t("terms.dataTitle")}
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed md:text-base">
            {dataItems.map((item, index) => (
              <li key={`${item}-${index}`} className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                  ●
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-6 rounded-3xl border border-white/60 bg-gradient-to-r from-emerald-500/80 to-lime-500/80 p-[1px] shadow-xl">
          <div className="rounded-[calc(1.5rem-2px)] bg-white/95 p-6 text-center shadow-inner">
            <h3 className="text-lg font-semibold text-emerald-700 md:text-xl">{t("terms.supportTitle")}</h3>
            <p className="mt-3 text-sm text-emerald-800 md:text-base">{t("terms.supportDescription")}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
