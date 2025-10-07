import { Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import RegisterStep1 from "./pages/RegisterStep1";
import RegisterStep2 from "./pages/RegisterStep2";
import WelcomeAnimation from "./pages/WelcomeAnimation";
import AvatarSelection from "./pages/AvatarSelection";
import TreeOfLife from "./pages/TreeOfLife";
import Intro from "./pages/Intro";
import LogIn from "./pages/LogIn";
import EditAvatar from "./pages/EditAvatar";
import WelcomeAnimationLogin from "./pages/WelcomeAnimationLogin";
import MinimalQr from "./components/minimalQr";
import XafariContext from "./components/XafariContext";
import { useEffect, useMemo, useState } from "react";
import SoundMenu from "./components/SoundMenu";
import useSoundController from "./hooks/useSoundController";

function App() {
  // carga user desde localStorage o lo define
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

  const { triggerClickFeedback } = useSoundController(soundSetting);

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
    }),
    [user, token, soundSetting, triggerClickFeedback]
  );

  return (
    <XafariContext.Provider value={contextValue}>
      <SoundMenu />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route
          path="/welcome-animation-login"
          element={<WelcomeAnimationLogin />}
        />
        <Route path="/welcome-animation" element={<WelcomeAnimation />} />
        <Route path="/register-step1" element={<RegisterStep1 />} />
        <Route path="/register-step2" element={<RegisterStep2 />} />
        <Route path="/create-avatar" element={<AvatarSelection />} />
        <Route path="/treeoflife" element={<TreeOfLife />} />
        <Route path="/intro" element={<Intro />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/edit-avatar" element={<EditAvatar />} />
        <Route path="/minimalqr" element={<MinimalQr />} />
      </Routes>
    </XafariContext.Provider>
  );
}

export default App;
