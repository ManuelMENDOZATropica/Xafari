import { Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import RegisterStep1 from "./pages/RegisterStep1";
import RegisterStep2 from "./pages/RegisterStep2";
import WelcomeAnimation from "./pages/WelcomeAnimation";
import AvatarSelection from "./pages/AvatarSelection";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      
      <Route path="/welcome-animation" element={<WelcomeAnimation />} />
      <Route path="/register-step1" element={<RegisterStep1 />} />
      <Route path="/register-step2" element={<RegisterStep2 />} />
      <Route path="/create-avatar" element={<AvatarSelection />} />
    </Routes>
  );
}

export default App;
