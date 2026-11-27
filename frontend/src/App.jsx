import { Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { lazy, Suspense, useEffect, useMemo, useRef, useState, useCallback } from "react";
import XafariContext from "./components/XafariContext";
import PrivateRoute from "./components/PrivateRoute";
import SyncStatus from "./components/SyncStatus";
import useSoundController from "./hooks/useSoundController";
import { api, ApiError, getStoredToken, storeToken, setUnauthorizedHandler } from "./lib/api";
import * as progressQueue from "./lib/progressQueue";
import { markSessionExpired, saveReturnTo } from "./lib/returnTo";
import Welcome from "./pages/Welcome";

// ── Code-splitting por ruta: la portada (Welcome) va en el bundle inicial ──
const Register = lazy(() => import("./pages/Register"));
const WelcomeAnimation = lazy(() => import("./pages/WelcomeAnimation"));
const AvatarSelection = lazy(() => import("./pages/AvatarSelection"));
const TreeOfLife = lazy(() => import("./pages/TreeOfLife"));
const BienvenidaGuacamaya = lazy(() => import("./pages/BienvenidaGuacamaya"));
const TutorialArbol = lazy(() => import("./pages/TutorialArbol"));
const Intro = lazy(() => import("./pages/Intro"));
const IntroMaya = lazy(() => import("./pages/IntroMaya"));
const LogIn = lazy(() => import("./pages/LogIn"));
const WelcomeAnimationLogin = lazy(() => import("./pages/WelcomeAnimationLogin"));
const XecretoRegister = lazy(() => import("./components/XecretoRegister"));
const QrActivity = lazy(() => import("./pages/QrActivity"));
const PrivacyNotice = lazy(() => import("./pages/PrivacyNotice"));
const TermsConditions = lazy(() => import("./pages/TermsConditions"));
const Perfil = lazy(() => import("./pages/Perfil"));
const NotFound = lazy(() => import("./pages/NotFound"));

const IS_DEV = import.meta.env.DEV;

const EMPTY_USER = {
  name: null,
  lastname: null,
  email: null,
  avatar: { bodyOptions: 0, faceOptions: 0 },
};

function readStoredUser() {
  try {
    const raw = JSON.parse(localStorage.getItem("user") || "null");
    return raw && typeof raw === "object" ? raw : EMPTY_USER;
  } catch {
    localStorage.removeItem("user");
    return EMPTY_USER;
  }
}

// Respuesta (letra) de cada Xperiencia, para pintar el progreso que viene de BD.
const XPERIENCIA_ANSWERS = {
  kayak: "a", vinil: "b", caracola: "c", tv: "b", teatro: "a", salvavidas: "c",
  conejo: "a", camion: "b", estrella: "a", mascarajaguar: "b", piscina: "b",
  patin: "a", tobogan: "a", xpiral: "a", poolpo: "a", drink: "a", xorbeteria: "a",
};

const EMPTY_PROGRESS = {
  xperiencias: {},
  xecretos: {},
  checklist: {},
  xelfies: {},
  calXperiencias: {},
  calChecklist: {},
};

function progressFromUser(dbUser) {
  const next = {
    xperiencias: {},
    xecretos: {},
    checklist: {},
    xelfies: {},
    calXperiencias: {},
    calChecklist: {},
  };
  (dbUser.activities || []).forEach((act) => {
    if (!act.userActivity?.completedAt) return;
    if (act.type === "Xperiencia") next.xperiencias[act.name] = XPERIENCIA_ANSWERS[act.name] || "a";
    else if (act.type === "Xecreto") next.xecretos[act.name] = true;
    else if (act.type === "Event") next.checklist[act.name] = true;
    else if (act.type === "Xelfie") next.xelfies[act.name] = true;
  });
  (dbUser.preferredActivities || []).forEach((pref) => {
    const rating = pref.userPreference?.rating;
    if (!rating) return;
    if (pref.type === "Xperiencia") next.calXperiencias[pref.name] = rating;
    else if (pref.type === "Event") next.calChecklist[pref.name] = rating;
  });
  return next;
}

function markCompleted(progress, activity) {
  const { name, type } = activity;
  if (type === "Xperiencia") return { ...progress, xperiencias: { ...progress.xperiencias, [name]: XPERIENCIA_ANSWERS[name] || "a" } };
  if (type === "Xecreto") return { ...progress, xecretos: { ...progress.xecretos, [name]: true } };
  if (type === "Event") return { ...progress, checklist: { ...progress.checklist, [name]: true } };
  if (type === "Xelfie") return { ...progress, xelfies: { ...progress.xelfies, [name]: true } };
  return progress;
}

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(readStoredUser);
  const [token, setTokenState] = useState(getStoredToken);
  const [activities, setActivities] = useState(null); // null = aún no cargan
  const [progress, setProgress] = useState(EMPTY_PROGRESS);
  const [progressReady, setProgressReady] = useState(false);
  const [familyTree, setFamilyTree] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);

  const [soundSetting, setSoundSetting] = useState(() => localStorage.getItem("soundSetting") || "full");
  const [musicEnabled, setMusicEnabled] = useState(() => {
    const v = localStorage.getItem("ajuste_musica");
    return v === null ? true : v === "true";
  });

  const { triggerClickFeedback, playWardrobeSound, playSuccessSound, playErrorSound } =
    useSoundController(soundSetting, musicEnabled);

  const setToken = useCallback((next) => {
    storeToken(next || null);
    setTokenState(next || null);
  }, []);

  const logout = useCallback(() => {
    storeToken(null);
    try {
      localStorage.removeItem("user");
    } catch {
      /* sin almacenamiento */
    }
    setTokenState(null);
    setUser(EMPTY_USER);
    setFamilyTree(null);
  }, []);

  // Inicia sesión con la respuesta de /login o /users (registro).
  const startSession = useCallback((newToken, newUser) => {
    setToken(newToken);
    setUser((prev) => ({ ...prev, ...newUser, avatar: newUser?.avatar || prev.avatar || EMPTY_USER.avatar }));
  }, [setToken]);

  // ── 401 en cualquier llamada → cerrar sesión y mandar a /login conservando el origen ──
  const locationRef = useRef(location);
  locationRef.current = location;
  useEffect(
    () =>
      setUnauthorizedHandler(() => {
        const { pathname, search } = locationRef.current;
        const from = `${pathname}${search}`;
        // Primero la navegación: así PrivateRoute no pisa el aviso de sesión expirada.
        if (pathname !== "/login") {
          saveReturnTo(from);
          markSessionExpired();
          navigate("/login", { replace: true, state: { from, expired: true } });
        }
        logout();
      }),
    [logout, navigate]
  );

  // ── Catálogo de actividades (público), con reintentos si el backend tarda en despertar ──
  useEffect(() => {
    let cancelled = false;
    let timer = null;
    let attempts = 0;
    const load = async () => {
      try {
        const data = await api.get("/activities", { auth: false });
        if (!cancelled) setActivities(Array.isArray(data) ? data : data?.activities || []);
      } catch (err) {
        attempts += 1;
        if (!cancelled && attempts < 6) timer = setTimeout(load, 2000 * attempts);
        else if (!cancelled) console.warn("Backend no disponible para cargar actividades.", err);
      }
    };
    load();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  const activitiesByName = useMemo(() => {
    const map = {};
    (activities || []).forEach((a) => {
      map[a.name] = { id: a.id, type: a.type, name: a.name };
    });
    return map;
  }, [activities]);

  const activitiesById = useMemo(() => {
    const map = {};
    (activities || []).forEach((a) => {
      map[a.id] = { id: a.id, type: a.type, name: a.name };
    });
    return map;
  }, [activities]);

  // ── Progreso del usuario desde BD (GET /user) ─────────────────────────────
  const syncUserProgress = useCallback(async () => {
    if (!getStoredToken()) return;
    try {
      const data = await api.get("/user");
      const dbUser = data.user || data;
      setUser((old) => ({ ...old, ...dbUser }));
      setProgress(progressFromUser(dbUser));
      setProgressReady(true);

      if (dbUser.familyTreeId) {
        try {
          const ft = await api.get(`/family-trees/${dbUser.familyTreeId}`);
          setFamilyTree(ft.familyTree || ft);
        } catch (err) {
          if (err instanceof ApiError && err.status === 403) setFamilyTree(null);
        }
      } else {
        setFamilyTree(null);
      }
    } catch (err) {
      // 401 ya lo maneja el cliente; sin red se queda con lo que hay.
      if (!(err instanceof ApiError && err.status === 401)) console.warn("No se pudo sincronizar el progreso:", err);
      setProgressReady(true);
    }
  }, []);

  // Un solo sync por sesión (el login ya no lo dispara por su cuenta).
  useEffect(() => {
    if (!token) {
      setProgress(EMPTY_PROGRESS);
      setProgressReady(false);
      return;
    }
    setProgressReady(false);
    syncUserProgress();
  }, [token, syncUserProgress]);

  // ── Cola de progreso pendiente ────────────────────────────────────────────
  const userId = user?.id;
  useEffect(() => {
    const update = () => setPendingCount(userId ? progressQueue.pendingFor(userId).length : 0);
    update();
    return progressQueue.subscribe(update);
  }, [userId]);

  const activitiesByIdRef = useRef(activitiesById);
  activitiesByIdRef.current = activitiesById;

  const flushPending = useCallback(async () => {
    if (!userId || !getStoredToken()) return;
    const { done, rejected } = await progressQueue.flush(userId);
    if (done.length || rejected.length) {
      // El servidor es la fuente de verdad: refresca para quitar lo rechazado.
      if (rejected.length) syncUserProgress();
      else
        done.forEach((item) => {
          const act = activitiesByIdRef.current[item.activityId];
          if (act) setProgress((p) => markCompleted(p, act));
        });
    }
  }, [userId, syncUserProgress]);

  useEffect(() => {
    if (!token || !userId) return;
    flushPending();
    const onOnline = () => flushPending();
    const onVisible = () => document.visibilityState === "visible" && flushPending();
    window.addEventListener("online", onOnline);
    document.addEventListener("visibilitychange", onVisible);
    const interval = setInterval(() => {
      if (progressQueue.pendingFor(userId).length) flushPending();
    }, 30000);
    return () => {
      window.removeEventListener("online", onOnline);
      document.removeEventListener("visibilitychange", onVisible);
      clearInterval(interval);
    };
  }, [token, userId, flushPending]);

  /**
   * Registra una actividad completada (POST /user-activities {activityId, code?, answer?}).
   * Devuelve {ok, already?, queued?, status?, error?}. Solo actualiza la UI si el
   * servidor confirmó; si no hay red la encola y la marca como pendiente.
   */
  const registerActivityCompleted = useCallback(
    async (activityName, { code, answer, activityId, queue = true } = {}) => {
      const activity = activityId ? activitiesById[activityId] : activitiesByName[activityName];
      if (!activity) return { ok: false, error: "activity_not_found" };
      if (!getStoredToken() || !userId) return { ok: false, status: 401, error: "no_session" };

      const payload = { activityId: activity.id, code, answer };
      try {
        const data = await api.post("/user-activities", progressQueue.buildBody(payload));
        setProgress((p) => markCompleted(p, activity));
        return { ok: true, activity, data };
      } catch (err) {
        if (err instanceof ApiError && err.retryable && !queue) {
          return { ok: false, activity, network: true, error: "network_error" };
        }
        if (err instanceof ApiError && err.retryable) {
          progressQueue.enqueue(userId, { ...payload, name: activity.name });
          setProgress((p) => markCompleted(p, activity));
          return { ok: false, queued: true, activity, error: "network_error" };
        }
        return {
          ok: false,
          activity,
          status: err.status,
          error: err.code || err.message,
          retryAfter: err.data?.retryAfter,
        };
      }
    },
    [activitiesById, activitiesByName, userId]
  );

  const saveActivityRating = useCallback(
    async (activityName, rating) => {
      const activity = activitiesByName[activityName];
      if (!activity) return;
      setProgress((p) =>
        activity.type === "Xperiencia"
          ? { ...p, calXperiencias: { ...p.calXperiencias, [activityName]: rating } }
          : activity.type === "Event"
            ? { ...p, calChecklist: { ...p.calChecklist, [activityName]: rating } }
            : p
      );
      if (!getStoredToken()) return;
      try {
        await api.post("/user-preferences", { activityId: activity.id, rating });
      } catch (err) {
        console.warn("No se pudo guardar la calificación:", err);
      }
    },
    [activitiesByName]
  );

  useEffect(() => {
    try {
      // Solo lo necesario para pintar la UI al recargar; el progreso vive en el servidor.
      if (user?.id) {
        const { id, name, lastname, casa, avatar, birthdate, pronouns, familyTreeId } = user;
        localStorage.setItem("user", JSON.stringify({ id, name, lastname, casa, avatar, birthdate, pronouns, familyTreeId }));
      }
    } catch {
      /* sin almacenamiento */
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("soundSetting", soundSetting);
  }, [soundSetting]);

  useEffect(() => {
    localStorage.setItem("ajuste_musica", String(musicEnabled));
  }, [musicEnabled]);

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      token,
      setToken,
      startSession,
      logout,
      activitiesMap: activitiesByName,
      activitiesById,
      activitiesReady: activities !== null,
      registerActivityCompleted,
      saveActivityRating,
      syncUserProgress,
      progressReady,
      pendingCount,
      progresoXperiencias: progress.xperiencias,
      xecretos: progress.xecretos,
      progresoChecklist: progress.checklist,
      progresoXelfies: progress.xelfies,
      calificacionesXperiencias: progress.calXperiencias,
      calificacionesChecklist: progress.calChecklist,
      familyTree,
      setFamilyTree,
      soundSetting,
      setSoundSetting,
      musicEnabled,
      setMusicEnabled,
      triggerClickFeedback,
      playWardrobeSound,
      playSuccessSound,
      playErrorSound,
    }),
    [
      user,
      token,
      setToken,
      startSession,
      logout,
      activitiesByName,
      activitiesById,
      activities,
      registerActivityCompleted,
      saveActivityRating,
      syncUserProgress,
      progressReady,
      pendingCount,
      progress,
      familyTree,
      soundSetting,
      musicEnabled,
      triggerClickFeedback,
      playWardrobeSound,
      playSuccessSound,
      playErrorSound,
    ]
  );

  const guard = (el) => <PrivateRoute>{el}</PrivateRoute>;

  return (
    <XafariContext.Provider value={contextValue}>
      <Suspense fallback={<div className="h-full w-full bg-[#233C15]" aria-busy="true" />}>
        <SyncStatus />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* ── Públicas ── */}
            <Route path="/" element={<Welcome showSplashInitial={true} />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/privacy" element={<PrivacyNotice />} />
            <Route path="/terms" element={<TermsConditions />} />

            {/* ── Flujo de registro — sin token aún ── */}
            <Route path="/welcome" element={<Welcome showSplashInitial={false} />} />
            <Route path="/intro" element={<Intro />} />
            <Route path="/intro-maya" element={<IntroMaya />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-step1" element={<Navigate to="/register" replace />} />

            {/* ── Protegidas ── */}
            <Route path="/create-avatar" element={guard(<AvatarSelection />)} />
            <Route path="/bienvenida" element={guard(<BienvenidaGuacamaya />)} />
            <Route path="/tutorial" element={guard(<TutorialArbol />)} />
            <Route path="/treeoflife" element={guard(<TreeOfLife />)} />
            <Route path="/perfil" element={guard(<Perfil />)} />
            <Route path="/welcome-animation-login" element={guard(<WelcomeAnimationLogin />)} />
            <Route path="/welcome-animation" element={guard(<WelcomeAnimation />)} />

            {/* ── QR de actividades: /q/<activityId>?k=<code> (ver CONTRATO-API §4) ── */}
            <Route path="/q/:activityId" element={guard(<QrActivity />)} />
            {/* QR viejos (/xecreto/xecreto1): ya no traen código; se explica y se manda al árbol */}
            <Route path="/xecreto/:legacyKey" element={guard(<QrActivity legacy />)} />

            {IS_DEV && (
              <Route
                path="/debug-scan"
                element={guard(
                  <div className="fixed inset-0 z-50 bg-black">
                    <XecretoRegister onClose={() => window.history.back()} />
                  </div>
                )}
              />
            )}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </XafariContext.Provider>
  );
}

export default App;
