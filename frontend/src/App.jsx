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
  const [token, setToken] = useState(localStorage.getItem(null) || null);
  const [soundSetting, setSoundSetting] = useState(() => {
    if (typeof window === "undefined") {
      return "full";
    }

    return localStorage.getItem("soundSetting") || "full";
  });

  const { triggerClickFeedback, playWardrobeSound, playSuccessSound, playErrorSound } =
    useSoundController(soundSetting);

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

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("token", JSON.stringify(token));
  }, [token]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem("soundSetting", soundSetting);
  }, [soundSetting]);

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      token,
      setToken,
      soundSetting,
      setSoundSetting,
      triggerClickFeedback,
      playWardrobeSound,
      playSuccessSound,
      playErrorSound,
    }),
    [
      user,
      token,
      soundSetting,
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
