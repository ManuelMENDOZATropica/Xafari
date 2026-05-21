import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Welcome from "./pages/Welcome";
import SplashScreen from "./pages/SplashScreen";
import RegisterStep1 from "./pages/RegisterStep1";
import RegisterStep2 from "./pages/RegisterStep2";
import Register from "./pages/Register";
import WelcomeAnimation from "./pages/WelcomeAnimation";
import AvatarSelection from "./pages/AvatarSelection";
import TreeOfLife from "./pages/TreeOfLife";
import BienvenidaGuacamaya from "./pages/BienvenidaGuacamaya";
import TutorialArbol from "./pages/TutorialArbol";
import Intro from "./pages/Intro";
import IntroMaya from "./pages/IntroMaya";
import LogIn from "./pages/LogIn";
import EditAvatar from "./pages/EditAvatar";
import WelcomeAnimationLogin from "./pages/WelcomeAnimationLogin";
import MinimalQr from "./components/minimalQr";
import XecretoRegister from "./components/XecretoRegister";
import XafariContext from "./components/XafariContext";
import { useEffect, useMemo, useState } from "react";
import useSoundController from "./hooks/useSoundController";
import PrivacyNotice from "./pages/PrivacyNotice";
import TermsConditions from "./pages/TermsConditions";

function App() {
  const location = useLocation();
  const [user, setUser] = useState({
    name: null,
    lastname: null,
    email: null,
    avatar: {
      bodyOptions: 0,
      hairOptions: 0,
      clothingOptions: 0,
      shoeOptions: 0,
      eyesOptions: 0,
      glassesAccessoryOptions: 0,
      headAccessoryOptions: 0,
      bodyAccessoryOptions: 0,
    },
  });
  const [token, setToken] = useState(() => {
    try {
      const stored = localStorage.getItem("token");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (_) {
          return stored;
        }
      }
    } catch (_e) {}
    return null;
  });
  const [activitiesMap, setActivitiesMap] = useState({});

  // ── Progreso en React state — fuente de verdad: BD ───────────────────────
  const [progresoXperiencias, setProgresoXperiencias] = useState({});
  const [xecretos, setXecretos] = useState({});
  const [progresoChecklist, setProgresoChecklist] = useState({});
  const [progresoXelfies, setProgresoXelfies] = useState({});
  const [calificacionesXperiencias, setCalificacionesXperiencias] = useState({});
  const [calificacionesChecklist, setCalificacionesChecklist] = useState({});
  const [familyTree, setFamilyTree] = useState(null);
  const [soundSetting, setSoundSetting] = useState(() => {
    if (typeof window === "undefined") {
      return "full";
    }

    return localStorage.getItem("soundSetting") || "full";
  });

  const [musicEnabled, setMusicEnabled] = useState(() => {
    const v = localStorage.getItem("ajuste_musica");
    // default true: music ON unless the user has explicitly turned it off
    return v === null ? true : v === "true";
  });

  const { triggerClickFeedback, playWardrobeSound, playSuccessSound, playErrorSound } =
    useSoundController(soundSetting, musicEnabled);

  useEffect(() => {
    try {
      const rawUser = JSON.parse(localStorage.getItem("user") || null);

      if (rawUser) {
        setUser(() => rawUser);
      }
    } catch (_e) {
      localStorage.removeItem("user");
    }
  }, []);

  // Fetch all activities on start
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "/api";
        const res = await fetch(`${apiUrl}/activities`);
        if (res.ok) {
          const data = await res.json();
          const map = {};
          data.forEach((act) => {
            map[act.name] = { id: act.id, type: act.type };
          });
          setActivitiesMap(map);
        }
      } catch (err) {
        console.error("Error fetching activities:", err);
      }
    };
    fetchActivities();
  }, []);

  // ── Sync progreso desde BD cuando hay sesión ───────────────────────────
  useEffect(() => {
    if (!token) {
      setProgresoXperiencias({});
      setXecretos({});
      setProgresoChecklist({});
      setProgresoXelfies({});
      setCalificacionesXperiencias({});
      setCalificacionesChecklist({});
      return;
    }
    if (!user?.id) return;

    const syncUserProgress = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "/api";
        const res = await fetch(`${apiUrl}/users/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;

        const data = await res.json();
        const dbUser = data.user || data;
        setUser((old) => ({ ...old, ...dbUser }));

        const dbActivities = dbUser.activities || [];
        const dbPreferences = dbUser.preferredActivities || [];

        const answersMap = {
          kayak: "a", vinil: "b", caracola: "c", tv: "b", teatro: "a", salvavidas: "c",
          conejo: "a", camion: "b", estrella: "a", mascarajaguar: "b", piscina: "b",
          patin: "a", tobogan: "a", xpiral: "a", poolpo: "a", drink: "a", xorbeteria: "a",
        };

        const newXperiencias = {};
        const newXecretos = {};
        const newChecklist = {};
        const newXelfies = {};

        dbActivities.forEach((act) => {
          if (!(act.userActivity && act.userActivity.completedAt)) return;
          if (act.type === "Xperiencia") newXperiencias[act.name] = answersMap[act.name] || "a";
          else if (act.type === "Xecreto")  newXecretos[act.name] = true;
          else if (act.type === "Event")    newChecklist[act.name] = true;
          else if (act.type === "Xelfie")   newXelfies[act.name] = true;
        });

        const newCalXperiencias = {};
        const newCalChecklist = {};
        dbPreferences.forEach((pref) => {
          const rating = pref.userPreference?.rating;
          if (!rating) return;
          if (pref.type === "Xperiencia") newCalXperiencias[pref.name] = rating;
          else if (pref.type === "Event") newCalChecklist[pref.name] = rating;
        });

        setProgresoXperiencias(newXperiencias);
        setXecretos(newXecretos);
        setProgresoChecklist(newChecklist);
        setProgresoXelfies(newXelfies);
        setCalificacionesXperiencias(newCalXperiencias);
        setCalificacionesChecklist(newCalChecklist);

        // Fetch family tree if user belongs to one
        if (dbUser.familyTreeId) {
          try {
            const fRes = await fetch(`${apiUrl}/family-trees/${dbUser.familyTreeId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (fRes.ok) {
              const fData = await fRes.json();
              setFamilyTree(fData.familyTree || fData);
            }
          } catch (_) {}
        } else {
          setFamilyTree(null);
        }
      } catch (err) {
        console.error("Error syncing user progress:", err);
      }
    };
    syncUserProgress();
  }, [token, user?.id]);

  const answersMap = {
    kayak: "a", vinil: "b", caracola: "c", tv: "b", teatro: "a", salvavidas: "c",
    conejo: "a", camion: "b", estrella: "a", mascarajaguar: "b", piscina: "b",
    patin: "a", tobogan: "a", xpiral: "a", poolpo: "a", drink: "a", xorbeteria: "a",
  };

  const registerActivityCompleted = async (activityName) => {
    const activity = activitiesMap[activityName];

    // 1. Actualizar state inmediatamente (UI reactiva sin esperar backend)
    if (activity) {
      if (activity.type === "Xperiencia") {
        setProgresoXperiencias((prev) => ({ ...prev, [activityName]: answersMap[activityName] || "a" }));
      } else if (activity.type === "Xecreto") {
        setXecretos((prev) => ({ ...prev, [activityName]: true }));
      } else if (activity.type === "Event") {
        setProgresoChecklist((prev) => ({ ...prev, [activityName]: true }));
      } else if (activity.type === "Xelfie") {
        setProgresoXelfies((prev) => ({ ...prev, [activityName]: true }));
      }
    }

    // 2. Persistir en BD
    if (!token || !user?.id || !activity) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "/api";
      await fetch(`${apiUrl}/users/${user.id}/activity`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ activityId: activity.id }),
      });
    } catch (err) {
      console.error("Error registering activity on backend:", err);
    }
  };

  const saveActivityRating = async (activityName, rating) => {
    const activity = activitiesMap[activityName];

    // 1. Actualizar state inmediatamente
    if (activity) {
      if (activity.type === "Xperiencia") {
        setCalificacionesXperiencias((prev) => ({ ...prev, [activityName]: rating }));
      } else if (activity.type === "Event") {
        setCalificacionesChecklist((prev) => ({ ...prev, [activityName]: rating }));
      }
    }

    // 2. Persistir en BD
    if (!token || !user?.id || !activity) return;
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "/api";
      await fetch(`${apiUrl}/user-preferences`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: user.id, activityId: activity.id, rating, comment: "Calificación desde la App" }),
      });
    } catch (err) {
      console.error("Error saving rating on backend:", err);
    }
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem("soundSetting", soundSetting);
  }, [soundSetting]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.setItem("ajuste_musica", String(musicEnabled));
  }, [musicEnabled]);

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      token,
      setToken,
      activitiesMap,
      registerActivityCompleted,
      saveActivityRating,
      // Progreso — desde BD, sin localStorage
      progresoXperiencias,
      xecretos,
      progresoChecklist,
      progresoXelfies,
      calificacionesXperiencias,
      calificacionesChecklist,
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
      activitiesMap,
      progresoXperiencias,
      xecretos,
      progresoChecklist,
      progresoXelfies,
      calificacionesXperiencias,
      calificacionesChecklist,
      familyTree,
      soundSetting,
      musicEnabled,
      triggerClickFeedback,
      playWardrobeSound,
      playSuccessSound,
      playErrorSound,
    ]
  );

  return (
    <XafariContext.Provider value={contextValue}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route
            path="/welcome-animation-login"
            element={<WelcomeAnimationLogin />}
          />
          <Route path="/welcome-animation" element={<WelcomeAnimation />} />
          <Route path="/intro-maya" element={<IntroMaya />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-step1" element={<RegisterStep1 />} />
          <Route path="/register-step2" element={<RegisterStep2 />} />
          <Route path="/create-avatar" element={<AvatarSelection />} />
          <Route path="/bienvenida" element={<BienvenidaGuacamaya />} />
          <Route path="/tutorial" element={<TutorialArbol />} />
          <Route path="/treeoflife" element={<TreeOfLife />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/edit-avatar" element={<EditAvatar />} />
          <Route path="/minimalqr" element={<MinimalQr />} />
          <Route path="/privacy" element={<PrivacyNotice />} />
          <Route path="/terms" element={<TermsConditions />} />
          {/* Debug route — direct access to glyph scanner */}
          <Route
            path="/debug-scan"
            element={
              <div className="fixed inset-0 z-50 bg-black">
                <XecretoRegister onClose={() => window.history.back()} />
              </div>
            }
          />
        </Routes>
      </AnimatePresence>
    </XafariContext.Provider>
  );
}

export default App;
