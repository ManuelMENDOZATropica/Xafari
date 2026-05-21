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

  // Fetch user profile and progress if token exists
  useEffect(() => {
    if (!token || !user?.id) return;
    const syncUserProgress = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "/api";
        const res = await fetch(`${apiUrl}/users/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          const dbUser = data.user || data;

          // Update user state without overwriting local changes completely
          setUser((old) => ({ ...old, ...dbUser }));

          const dbActivities = dbUser.activities || [];
          const dbPreferences = dbUser.preferredActivities || [];

          const progresoXperiencias = {};
          const xecretos = {};
          const progresoChecklistGastro = {};

          dbActivities.forEach((act) => {
            const isCompleted = act.userActivity && act.userActivity.completedAt;
            if (isCompleted) {
              if (act.type === "Xperiencia") {
                const answersMap = {
                  kayak: "a", vinil: "b", caracola: "c", tv: "b", teatro: "a", salvavidas: "c",
                  conejo: "a", camion: "b", estrella: "a", mascarajaguar: "b", piscina: "b",
                  patin: "a", tobogan: "a", xpiral: "a", poolpo: "a", drink: "a", xorbeteria: "a"
                };
                progresoXperiencias[act.name] = answersMap[act.name] || "a";
              } else if (act.type === "Xecreto") {
                xecretos[act.name] = true;
              } else if (act.type === "Event") {
                progresoChecklistGastro[act.name] = true;
              }
            }
          });

          const calificacionesXperiencias = {};
          const calificacionesChecklistGastro = {};
          dbPreferences.forEach((pref) => {
            const rating = pref.userPreference ? pref.userPreference.rating : null;
            if (rating) {
              if (pref.type === "Xperiencia") {
                calificacionesXperiencias[pref.name] = rating;
              } else if (pref.type === "Event") {
                calificacionesChecklistGastro[pref.name] = rating;
              }
            }
          });

          localStorage.setItem("progresoXperiencias", JSON.stringify(progresoXperiencias));
          localStorage.setItem("xecretos", JSON.stringify(xecretos));
          localStorage.setItem("progresoChecklistGastro", JSON.stringify(progresoChecklistGastro));
          localStorage.setItem("calificacionesXperiencias", JSON.stringify(calificacionesXperiencias));
          localStorage.setItem("calificacionesChecklistGastro", JSON.stringify(calificacionesChecklistGastro));

          window.dispatchEvent(new Event("progression_synced"));
        }
      } catch (err) {
        console.error("Error syncing user progress:", err);
      }
    };
    syncUserProgress();
  }, [token, user?.id]);

  const registerActivityCompleted = async (activityName) => {
    // 1. Update local storage immediately for fast UI response
    const activity = activitiesMap[activityName];
    if (activity) {
      if (activity.type === "Xperiencia") {
        const saved = JSON.parse(localStorage.getItem("progresoXperiencias") || "{}");
        const answersMap = {
          kayak: "a", vinil: "b", caracola: "c", tv: "b", teatro: "a", salvavidas: "c",
          conejo: "a", camion: "b", estrella: "a", mascarajaguar: "b", piscina: "b",
          patin: "a", tobogan: "a", xpiral: "a", poolpo: "a", drink: "a", xorbeteria: "a"
        };
        saved[activityName] = answersMap[activityName] || "a";
        localStorage.setItem("progresoXperiencias", JSON.stringify(saved));
      } else if (activity.type === "Xecreto") {
        const saved = JSON.parse(localStorage.getItem("xecretos") || "{}");
        saved[activityName] = true;
        localStorage.setItem("xecretos", JSON.stringify(saved));
      } else if (activity.type === "Event") {
        const saved = JSON.parse(localStorage.getItem("progresoChecklistGastro") || "{}");
        saved[activityName] = true;
        localStorage.setItem("progresoChecklistGastro", JSON.stringify(saved));
      }
      window.dispatchEvent(new Event("progression_synced"));
    }

    // 2. Call backend if authenticated
    if (!token || !user?.id) return;
    if (!activity) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "/api";
      const res = await fetch(`${apiUrl}/users/${user.id}/activity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ activityId: activity.id }),
      });
      if (res.ok) {
        console.log(`Backend: Registered activity completion for ${activityName}`);
      }
    } catch (err) {
      console.error("Error registering activity completion on backend:", err);
    }
  };

  const saveActivityRating = async (activityName, rating) => {
    // 1. Update local storage immediately
    const activity = activitiesMap[activityName];
    if (activity) {
      if (activity.type === "Xperiencia") {
        const saved = JSON.parse(localStorage.getItem("calificacionesXperiencias") || "{}");
        saved[activityName] = rating;
        localStorage.setItem("calificacionesXperiencias", JSON.stringify(saved));
      } else if (activity.type === "Event") {
        const saved = JSON.parse(localStorage.getItem("calificacionesChecklistGastro") || "{}");
        saved[activityName] = rating;
        localStorage.setItem("calificacionesChecklistGastro", JSON.stringify(saved));
      }
      window.dispatchEvent(new Event("progression_synced"));
    }

    // 2. Call backend if authenticated
    if (!token || !user?.id) return;
    if (!activity) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "/api";
      const res = await fetch(`${apiUrl}/user-preferences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: user.id,
          activityId: activity.id,
          rating,
          comment: "Calificación desde la App",
        }),
      });
      if (res.ok) {
        console.log(`Backend: Saved rating for ${activityName}`);
      }
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
