import { useContext, useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jsQR from "jsqr";
import QRCode from "qrcode";
import XafariContext from "./XafariContext";

const FAMILIA_BASE = "https://www.xafari.xcaret.com/familia/";
const API = import.meta.env.VITE_API_URL || "/api";
const MAX_MEMBERS = 6;

// ─── Genera QR en un canvas ─────────────────────────────────────────────────
async function renderQR(canvasEl, text) {
  await QRCode.toCanvas(canvasEl, text, {
    errorCorrectionLevel: "H",
    width: 260,
    margin: 2,
    color: { dark: "#3D1A00", light: "#F2E8DA" },
  });
}

export default function ModalFamilia({ onClose }) {
  const { user, token, familyTree, setFamilyTree } = useContext(XafariContext);

  // Tabs: "menu" | "crear" | "unirse"
  const [view, setView] = useState(familyTree ? "familia" : "menu");

  // ── Crear familia ────────────────────────────────────────────────────────
  const [nombre, setNombre]       = useState("");
  const [creating, setCreating]   = useState(false);
  const [createErr, setCreateErr] = useState("");
  const qrCanvasRef               = useRef(null);

  // ── Unirse con QR ────────────────────────────────────────────────────────
  const videoRef      = useRef(null);
  const canvasRef     = useRef(null);
  const rafRef        = useRef(null);
  const streamRef     = useRef(null);
  const [joining, setJoining]       = useState(false);
  const [joinErr, setJoinErr]       = useState("");
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [cameraErr, setCameraErr]   = useState(null);

  // ── Polling real-time: refresca familia cada 8s mientras el modal está abierto ──
  const [newMemberIds, setNewMemberIds] = useState(new Set());
  const knownIdsRef = useRef(new Set((familyTree?.users || []).map((u) => u.id)));

  useEffect(() => {
    if (view !== "familia" || !familyTree?.id || !token) return;

    const poll = async () => {
      try {
        const res = await fetch(`${API}/family-trees/${familyTree.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        const ft = data.familyTree || data;
        const currentIds = new Set((ft.users || []).map((u) => u.id));

        // Detectar miembros nuevos
        const nuevos = [...currentIds].filter((id) => !knownIdsRef.current.has(id));
        if (nuevos.length > 0) {
          setNewMemberIds((prev) => new Set([...prev, ...nuevos]));
          knownIdsRef.current = currentIds;
          setFamilyTree(ft);
          // Quitar badge de "nuevo" después de 4s
          setTimeout(() => {
            setNewMemberIds((prev) => {
              const next = new Set(prev);
              nuevos.forEach((id) => next.delete(id));
              return next;
            });
          }, 4000);
        }
      } catch (_) {}
    };

    const interval = setInterval(poll, 8000);
    return () => clearInterval(interval);
  }, [view, familyTree?.id, token, setFamilyTree]);

  // ── Compartir QR (si ya tengo familia) ───────────────────────────────────
  const shareQrRef = useRef(null);
  useEffect(() => {
    if (view === "familia" && familyTree?.id && shareQrRef.current) {
      renderQR(shareQrRef.current, `${FAMILIA_BASE}${familyTree.id}`);
    }
  }, [view, familyTree]);

  // ── Render QR al crear ────────────────────────────────────────────────────
  const handleCrear = async () => {
    if (!nombre.trim()) { setCreateErr("Ponle un nombre a tu familia"); return; }
    setCreating(true);
    setCreateErr("");
    try {
      const res = await fetch(`${API}/family-trees`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ adminId: user.id, name: nombre.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al crear familia");
      const ft = data.familyTree || data;
      setFamilyTree(ft);
      setView("familia");
    } catch (err) {
      setCreateErr(err.message);
    } finally {
      setCreating(false);
    }
  };

  // ── Render QR de familia después de cargar el view "familia" ─────────────
  useEffect(() => {
    if (view === "familia" && familyTree?.id && shareQrRef.current) {
      renderQR(shareQrRef.current, `${FAMILIA_BASE}${familyTree.id}`);
    }
  }, [view, familyTree?.id]);

  // ── Cámara para unirse ────────────────────────────────────────────────────
  useEffect(() => {
    if (view !== "unirse") {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      cancelAnimationFrame(rafRef.current);
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } },
        });
        if (!mounted) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        if (mounted) setCameraErr(err.message);
      }
    })();
    return () => {
      mounted = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      cancelAnimationFrame(rafRef.current);
    };
  }, [view]);

  const handleJoinDetected = useCallback(async (familyId) => {
    if (joining) return;
    setJoining(true);
    setJoinErr("");
    streamRef.current?.getTracks().forEach((t) => t.stop());
    cancelAnimationFrame(rafRef.current);
    try {
      const res = await fetch(`${API}/family-trees/${familyId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "No se pudo unir");
      setFamilyTree(data.familyTree || data);
      setJoinSuccess(true);
      setTimeout(() => { setView("familia"); setJoining(false); setJoinSuccess(false); }, 1800);
    } catch (err) {
      setJoinErr(err.message);
      setJoining(false);
    }
  }, [joining, token, user?.id, setFamilyTree]);

  // ── jsQR scan loop ────────────────────────────────────────────────────────
  useEffect(() => {
    if (view !== "unirse" || joining) return;
    const canvas = canvasRef.current;
    const video  = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const tick = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width  = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const img  = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(img.data, img.width, img.height, { inversionAttempts: "dontInvert" });
        if (code?.data?.startsWith(FAMILIA_BASE)) {
          const familyId = code.data.slice(FAMILIA_BASE.length).replace(/\/$/, "");
          handleJoinDetected(familyId);
          return;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [view, joining, handleJoinDetected]);

  // ── Salir de familia ──────────────────────────────────────────────────────
  const handleLeave = async () => {
    try {
      const res = await fetch(`${API}/family-trees/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: user.id }),
      });
      if (!res.ok) throw new Error("Error al salir");
      setFamilyTree(null);
      setView("menu");
    } catch (err) {
      console.error(err);
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
              <button onClick={() => setView(familyTree ? "familia" : "menu")} className="p-1 -ml-1 opacity-60 hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#3D1A00" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <h1 className="text-lg font-bold" style={{ color: "#3D1A00" }}>
              {view === "menu"   ? "Modo Familia"
               : view === "crear"  ? "Crear familia"
               : view === "unirse" ? "Unirse a familia"
               : familyTree?.name || "Mi familia"}
            </h1>
          </div>
          <button onClick={onClose} className="p-1 opacity-60 hover:opacity-100 transition-opacity">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#3D1A00" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Vista menú ────────────────────────────────────────────── */}
        {view === "menu" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 pb-8">
            <p className="text-sm text-center opacity-60" style={{ color: "#3D1A00" }}>
              Crea una familia o únete a una existente para compartir tu árbol Xafari
            </p>
            <button
              onClick={() => setView("crear")}
              className="w-full py-4 rounded-2xl font-bold text-sm active:scale-95 transition-all flex items-center justify-center gap-2"
              style={{ backgroundColor: "#3D1A00", color: "#F2E8DA" }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Crear familia
            </button>
            <button
              onClick={() => setView("unirse")}
              className="w-full py-4 rounded-2xl font-bold text-sm active:scale-95 transition-all flex items-center justify-center gap-2"
              style={{ backgroundColor: "rgba(61,26,0,0.12)", color: "#3D1A00", border: "2px solid rgba(61,26,0,0.2)" }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
              Escanear QR para unirme
            </button>
          </div>
        )}

        {/* ── Vista crear ───────────────────────────────────────────── */}
        {view === "crear" && (
          <div className="flex-1 flex flex-col px-6 pb-8 gap-4 justify-center">
            <label className="text-xs font-semibold opacity-60 uppercase tracking-wider" style={{ color: "#3D1A00" }}>
              Nombre de la familia
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCrear()}
              placeholder="Ej: Familia Hernández"
              maxLength={40}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ backgroundColor: "rgba(61,26,0,0.08)", color: "#3D1A00", border: "2px solid rgba(61,26,0,0.15)" }}
            />
            {createErr && <p className="text-xs text-red-600">{createErr}</p>}
            <p className="text-xs opacity-40" style={{ color: "#3D1A00" }}>
              Máximo {MAX_MEMBERS} miembros
            </p>
            <button
              onClick={handleCrear}
              disabled={creating}
              className="w-full py-4 rounded-2xl font-bold text-sm active:scale-95 transition-all"
              style={{ backgroundColor: "#3D1A00", color: "#F2E8DA", opacity: creating ? 0.6 : 1 }}
            >
              {creating ? "Creando…" : "Crear familia"}
            </button>
          </div>
        )}

        {/* ── Vista unirse (cámara QR) ─────────────────────────────── */}
        {view === "unirse" && (
          <div className="flex-1 flex flex-col px-4 pb-6 gap-3">
            <p className="text-xs text-center opacity-50 pt-1" style={{ color: "#3D1A00" }}>
              Apunta la cámara al QR de un familiar
            </p>
            {/* Canvas oculto jsQR */}
            <canvas ref={canvasRef} className="hidden" />
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
                      <svg className="w-12 h-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              {cameraErr && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                  <p className="text-white text-xs text-center px-4">Cámara no disponible</p>
                </div>
              )}
            </div>
            {joinErr && <p className="text-xs text-red-600 text-center">{joinErr}</p>}
            {joining && !joinSuccess && <p className="text-xs text-center opacity-50" style={{ color: "#3D1A00" }}>Uniéndome…</p>}
          </div>
        )}

        {/* ── Vista familia activa ──────────────────────────────────── */}
        {view === "familia" && familyTree && (
          <div className="flex-1 flex flex-col px-5 pb-6 gap-4 overflow-y-auto">
            {/* Contador miembros */}
            <div className="flex items-center justify-between">
              <span className="text-xs opacity-50" style={{ color: "#3D1A00" }}>
                {familyTree.users?.length ?? 1} / {MAX_MEMBERS} miembros
              </span>
              <button onClick={handleLeave} className="text-xs font-semibold text-red-600 active:scale-95 transition-all">
                Salir de familia
              </button>
            </div>

            {/* Lista miembros */}
            <div className="flex flex-col gap-2">
              {(familyTree.users || []).map((m) => (
                <motion.div
                  key={m.id}
                  initial={newMemberIds.has(m.id) ? { opacity: 0, x: -20 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl relative"
                  style={{ backgroundColor: newMemberIds.has(m.id) ? "rgba(52,211,153,0.15)" : "rgba(61,26,0,0.06)" }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: "#3D1A00", color: "#F2E8DA" }}>
                    {(m.name || "?")[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium flex-1" style={{ color: "#3D1A00" }}>
                    {m.name} {m.lastname || ""}
                    {m.id === familyTree.adminId && (
                      <span className="ml-1 text-[10px] opacity-50">(admin)</span>
                    )}
                  </span>
                  {newMemberIds.has(m.id) && (
                    <motion.span
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: "#34d399", color: "#fff" }}
                    >
                      ¡Nuevo!
                    </motion.span>
                  )}
                </motion.div>
              ))}
            </div>

            {/* QR para compartir */}
            <div className="flex flex-col items-center gap-2 pt-2">
              <p className="text-xs opacity-50 text-center" style={{ color: "#3D1A00" }}>
                Comparte este QR para que se unan
              </p>
              <canvas ref={shareQrRef} className="rounded-xl shadow-md" />
            </div>

            {/* Botón unir a otro */}
            {(familyTree.users?.length ?? 1) < MAX_MEMBERS && (
              <button
                onClick={() => setView("unirse")}
                className="w-full py-3 rounded-2xl font-bold text-sm active:scale-95 transition-all flex items-center justify-center gap-2"
                style={{ backgroundColor: "rgba(61,26,0,0.1)", color: "#3D1A00", border: "2px solid rgba(61,26,0,0.15)" }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Añadir miembro
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
