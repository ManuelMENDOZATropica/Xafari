import { useContext, useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import QRCode from "qrcode";
import XafariContext from "./XafariContext";
import useQrScanner from "@/hooks/useQrScanner";
import { api, ApiError } from "@/lib/api";

const MAX_MEMBERS = 6;
const POLL_MS = 8000;

// ─── Genera QR en un canvas ─────────────────────────────────────────────────
async function renderQR(canvasEl, text) {
  await QRCode.toCanvas(canvasEl, text, {
    errorCorrectionLevel: "M",
    width: 260,
    margin: 2,
    color: { dark: "#3D1A00", light: "#F2E8DA" },
  });
}

/** El QR de familia lleva el inviteToken (JWT). Acepta también una URL con ?invite=. */
function parseInvite(text) {
  if (!text) return null;
  const raw = text.trim();
  if (/^[\w-]+\.[\w-]+\.[\w-]+$/.test(raw)) return raw;
  try {
    const url = new URL(raw);
    const tok = url.searchParams.get("invite");
    return tok && /^[\w-]+\.[\w-]+\.[\w-]+$/.test(tok) ? tok : null;
  } catch {
    return null;
  }
}

function familyError(err, t) {
  if (err instanceof ApiError) {
    if (err.network) return t("errors.network");
    if (err.code === "invalid_invite" || err.status === 403) return t("family.errors.invalidInvite");
    if (err.status === 409) return t("family.errors.alreadyMember");
    if (err.status === 400 && /full|lleno|max/i.test(err.message)) return t("family.errors.full");
  }
  return t("family.errors.generic");
}

export default function ModalFamilia({ onClose }) {
  const { t } = useTranslation();
  const { token, familyTree, setFamilyTree, syncUserProgress } = useContext(XafariContext);

  // Vistas: "menu" | "crear" | "unirse" | "familia"
  const [view, setView] = useState(familyTree ? "familia" : "menu");

  // ── Crear familia ────────────────────────────────────────────────────────
  const [nombre, setNombre] = useState("");
  const [creating, setCreating] = useState(false);
  const [createErr, setCreateErr] = useState("");

  // ── Unirse con QR ────────────────────────────────────────────────────────
  const [joining, setJoining] = useState(false);
  const [joinErr, setJoinErr] = useState("");
  const [joinSuccess, setJoinSuccess] = useState(false);

  // ── Invitación (QR para compartir) ───────────────────────────────────────
  const [invite, setInvite] = useState(null); // {inviteToken, expiresAt}
  const [inviteErr, setInviteErr] = useState("");
  const shareQrRef = useRef(null);

  // ── Salir ────────────────────────────────────────────────────────────────
  const [leaving, setLeaving] = useState(false);
  const [leaveErr, setLeaveErr] = useState("");

  const timers = useRef([]);
  useEffect(() => {
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, []);

  // ── Polling: refresca la familia mientras el modal está abierto ──────────
  const [newMemberIds, setNewMemberIds] = useState(() => new Set());
  const knownIdsRef = useRef(new Set((familyTree?.users || []).map((u) => u.id)));
  const familyId = familyTree?.id;

  useEffect(() => {
    if (view !== "familia" || !familyId || !token) return undefined;
    let cancelled = false;
    const poll = async () => {
      try {
        const data = await api.get(`/family-trees/${familyId}`);
        if (cancelled) return;
        const ft = data.familyTree || data;
        const currentIds = new Set((ft.users || []).map((u) => u.id));
        const nuevos = [...currentIds].filter((id) => !knownIdsRef.current.has(id));
        knownIdsRef.current = currentIds;
        setFamilyTree(ft);
        if (nuevos.length > 0) {
          setNewMemberIds((prev) => new Set([...prev, ...nuevos]));
          timers.current.push(
            setTimeout(() => {
              setNewMemberIds((prev) => {
                const next = new Set(prev);
                nuevos.forEach((id) => next.delete(id));
                return next;
              });
            }, 4000)
          );
        }
      } catch (err) {
        // 403: ya no pertenece a esta familia (la dejó desde otro teléfono)
        if (!cancelled && err instanceof ApiError && err.status === 403) {
          setFamilyTree(null);
          setView("menu");
        }
      }
    };
    const interval = setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [view, familyId, token, setFamilyTree]);

  // ── Invitación firmada (24 h) para el QR; se renueva al caducar ──────────
  useEffect(() => {
    if (view !== "familia" || !familyId) return undefined;
    let cancelled = false;
    let timer = null;
    const load = async () => {
      setInviteErr("");
      try {
        const data = await api.post(`/family-trees/${familyId}/invite`);
        if (cancelled) return;
        setInvite(data);
        const ms = data.expiresAt ? new Date(data.expiresAt).getTime() - Date.now() - 60000 : 0;
        if (ms > 0) timer = setTimeout(load, Math.min(ms, 2 ** 31 - 1));
      } catch (err) {
        if (!cancelled) setInviteErr(familyError(err, t));
      }
    };
    load();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [view, familyId, t]);

  useEffect(() => {
    if (view === "familia" && invite?.inviteToken && shareQrRef.current) {
      renderQR(shareQrRef.current, invite.inviteToken).catch((err) => console.error(err));
    }
  }, [view, invite]);

  // ── Crear ────────────────────────────────────────────────────────────────
  const handleCrear = async () => {
    if (!nombre.trim()) {
      setCreateErr(t("family.errors.nameRequired"));
      return;
    }
    setCreating(true);
    setCreateErr("");
    try {
      const data = await api.post("/family-trees", { name: nombre.trim() });
      const ft = data.familyTree || data;
      knownIdsRef.current = new Set((ft.users || []).map((u) => u.id));
      setFamilyTree(ft);
      setView("familia");
      syncUserProgress?.(); // refresca user.familyTreeId
    } catch (err) {
      setCreateErr(familyError(err, t));
    } finally {
      setCreating(false);
    }
  };

  // ── Unirse (cámara) ──────────────────────────────────────────────────────
  const handleDecode = useCallback(
    (text) => {
      const inviteToken = parseInvite(text);
      if (!inviteToken) {
        setJoinErr(t("family.errors.notFamilyQr"));
        return false;
      }
      setJoining(true);
      setJoinErr("");
      (async () => {
        try {
          const data = await api.post("/family-trees/join", { inviteToken });
          const ft = data.familyTree || data;
          knownIdsRef.current = new Set((ft.users || []).map((u) => u.id));
          setFamilyTree(ft);
          setJoinSuccess(true);
          syncUserProgress?.();
          timers.current.push(
            setTimeout(() => {
              setView("familia");
              setJoining(false);
              setJoinSuccess(false);
            }, 1800)
          );
        } catch (err) {
          // La cámara sigue encendida: se puede volver a intentar sin salir.
          setJoinErr(familyError(err, t));
          setJoining(false);
        }
      })();
      return true;
    },
    [setFamilyTree, syncUserProgress, t]
  );

  const { videoRef, error: cameraErr } = useQrScanner({
    active: view === "unirse",
    paused: joining,
    onDecode: handleDecode,
  });

  // ── Salir de familia ─────────────────────────────────────────────────────
  const handleLeave = async () => {
    if (leaving) return;
    setLeaving(true);
    setLeaveErr("");
    try {
      await api.post("/family-trees/leave");
      setFamilyTree(null);
      setInvite(null);
      setView("menu");
      syncUserProgress?.();
    } catch (err) {
      setLeaveErr(familyError(err, t));
    } finally {
      setLeaving(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <motion.div
      className="absolute inset-0 bg-[#7b5226] font-apercu overflow-hidden rounded-3xl"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute inset-3 rounded-2xl bg-[#f4ead9] overflow-hidden flex flex-col">

        {/* Cabecera */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            {view !== "menu" && view !== "familia" && (
              <button type="button" aria-label={t("back")} onClick={() => setView(familyTree ? "familia" : "menu")} className="bg-transparent p-1 -ml-1 opacity-80 hover:opacity-100 transition-opacity">
                <svg aria-hidden="true" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#3D1A00" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <h1 className="text-lg font-bold" style={{ color: "#3D1A00" }}>
              {view === "menu"   ? t("family.title")
               : view === "crear"  ? t("family.create")
               : view === "unirse" ? t("family.joinTitle")
               : familyTree?.name || t("family.myFamily")}
            </h1>
          </div>
          <button type="button" aria-label={t("close")} onClick={onClose} className="bg-transparent p-1 opacity-80 hover:opacity-100 transition-opacity">
            <svg aria-hidden="true" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#3D1A00" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Vista menú ────────────────────────────────────────────── */}
        {view === "menu" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 pb-8">
            <p className="text-sm text-center" style={{ color: "#3D1A00" }}>
              {t("family.intro")}
            </p>
            <button
              onClick={() => setView("crear")}
              className="w-full py-4 rounded-2xl font-bold text-sm active:scale-95 transition-all flex items-center justify-center gap-2"
              style={{ backgroundColor: "#3D1A00", color: "#F2E8DA" }}
            >
              <svg aria-hidden="true" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              {t("family.create")}
            </button>
            <button
              onClick={() => setView("unirse")}
              className="w-full py-4 rounded-2xl font-bold text-sm active:scale-95 transition-all flex items-center justify-center gap-2"
              style={{ backgroundColor: "rgba(61,26,0,0.12)", color: "#3D1A00", border: "2px solid rgba(61,26,0,0.2)" }}
            >
              <svg aria-hidden="true" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
              {t("family.scanToJoin")}
            </button>
          </div>
        )}

        {/* ── Vista crear ───────────────────────────────────────────── */}
        {view === "crear" && (
          <div className="flex-1 flex flex-col px-6 pb-8 gap-4 justify-center">
            <label htmlFor="family-name" className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#3D1A00" }}>
              {t("family.nameLabel")}
            </label>
            <input
              id="family-name"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCrear()}
              placeholder={t("family.namePlaceholder")}
              maxLength={40}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ backgroundColor: "rgba(61,26,0,0.08)", color: "#3D1A00", border: "2px solid rgba(61,26,0,0.15)" }}
            />
            {createErr && <p role="alert" className="text-xs text-red-700">{createErr}</p>}
            <p className="text-xs" style={{ color: "#3D1A00" }}>
              {t("family.maxMembers", { count: MAX_MEMBERS })}
            </p>
            <button
              onClick={handleCrear}
              disabled={creating}
              className="w-full py-4 rounded-2xl font-bold text-sm active:scale-95 transition-all"
              style={{ backgroundColor: "#3D1A00", color: "#F2E8DA", opacity: creating ? 0.6 : 1 }}
            >
              {creating ? t("family.creating") : t("family.create")}
            </button>
          </div>
        )}

        {/* ── Vista unirse (cámara QR) ─────────────────────────────── */}
        {view === "unirse" && (
          <div className="flex-1 flex flex-col px-4 pb-6 gap-3">
            <p className="text-xs text-center pt-1" style={{ color: "#3D1A00" }}>
              {t("family.pointCamera")}
            </p>
            {/* Área cámara */}
            <div className="flex-1 relative rounded-2xl overflow-hidden bg-black">
              <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
              {/* Marco QR */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative w-44 h-44">
                  {["top-0 left-0 border-t-4 border-l-4 rounded-tl-lg","top-0 right-0 border-t-4 border-r-4 rounded-tr-lg","bottom-0 left-0 border-b-4 border-l-4 rounded-bl-lg","bottom-0 right-0 border-b-4 border-r-4 rounded-br-lg"].map((cls, i) => (
                    <div key={i} className={`absolute w-9 h-9 ${cls}`} style={{ borderColor: joinSuccess ? "#34d399" : "rgba(242,232,218,0.8)" }} />
                  ))}
                  {joinSuccess && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg aria-hidden="true" className="w-12 h-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              {cameraErr && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                  <p className="text-white text-xs text-center px-4">{t("scanner.cameraUnavailable")}</p>
                </div>
              )}
            </div>
            {joinErr && <p role="alert" className="text-xs text-red-700 text-center">{joinErr}</p>}
            {joining && !joinSuccess && <p role="status" className="text-xs text-center" style={{ color: "#3D1A00" }}>{t("family.joining")}</p>}
          </div>
        )}

        {/* ── Vista familia activa ──────────────────────────────────── */}
        {view === "familia" && familyTree && (
          <div className="flex-1 flex flex-col px-5 pb-6 gap-4 overflow-y-auto">
            {/* Contador miembros */}
            <div className="flex items-center justify-between">
              <span className="text-xs" style={{ color: "#3D1A00" }}>
                {t("family.membersCount", { count: familyTree.users?.length ?? 1, max: MAX_MEMBERS })}
              </span>
              <button type="button" onClick={handleLeave} disabled={leaving} className="bg-transparent px-0 text-xs font-semibold text-red-700 active:scale-95 transition-all">
                {t("family.leave")}
              </button>
            </div>
            {leaveErr && <p role="alert" className="text-xs text-red-700">{leaveErr}</p>}

            {/* Lista miembros */}
            <div className="flex flex-col gap-2">
              {(familyTree.users || []).map((m, i) => (
                <motion.div
                  key={m.id || i}
                  initial={newMemberIds.has(m.id) ? { opacity: 0, x: -20 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl relative"
                  style={{ backgroundColor: newMemberIds.has(m.id) ? "rgba(52,211,153,0.15)" : "rgba(61,26,0,0.06)" }}
                >
                  <div aria-hidden="true" className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: "#3D1A00", color: "#F2E8DA" }}>
                    {(m.name || "?")[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium flex-1" style={{ color: "#3D1A00" }}>
                    {m.name} {m.lastname || ""}
                    {m.id && m.id === familyTree.adminId && (
                      <span className="ml-1 text-[10px]">({t("family.admin")})</span>
                    )}
                  </span>
                  {newMemberIds.has(m.id) && (
                    <motion.span
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: "#34d399", color: "#fff" }}
                    >
                      {t("family.new")}
                    </motion.span>
                  )}
                </motion.div>
              ))}
            </div>

            {/* QR para compartir */}
            <div className="flex flex-col items-center gap-2 pt-2">
              <p className="text-xs text-center" style={{ color: "#3D1A00" }}>
                {t("family.shareQr")}
              </p>
              {inviteErr ? (
                <p role="alert" className="text-xs text-red-700 text-center">{inviteErr}</p>
              ) : (
                <canvas ref={shareQrRef} role="img" aria-label={t("family.shareQr")} className="rounded-xl shadow-md" />
              )}
              {invite?.expiresAt && (
                <p className="text-[11px] text-center" style={{ color: "#3D1A00" }}>{t("family.inviteExpires")}</p>
              )}
            </div>

            {/* Botón unir a otro */}
            {(familyTree.users?.length ?? 1) < MAX_MEMBERS && (
              <button
                onClick={() => setView("unirse")}
                className="w-full py-3 rounded-2xl font-bold text-sm active:scale-95 transition-all flex items-center justify-center gap-2"
                style={{ backgroundColor: "rgba(61,26,0,0.1)", color: "#3D1A00", border: "2px solid rgba(61,26,0,0.15)" }}
              >
                <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                {t("family.addMember")}
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
