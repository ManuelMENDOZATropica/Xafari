import { Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import RegisterStep1 from "./pages/RegisterStep1";
import RegisterStep2 from "./pages/RegisterStep2";
import WelcomeAnimation from "./pages/WelcomeAnimation";
import AvatarSelection from "./pages/AvatarSelection";
import TreeOfLife from './pages/TreeOfLife';
import Intro from './pages/Intro';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Intro />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/welcome-animation" element={<WelcomeAnimation />} />
      <Route path="/register-step1" element={<RegisterStep1 />} />
      <Route path="/register-step2" element={<RegisterStep2 />} />
      <Route path="/create-avatar" element={<AvatarSelection />} />
      <Route path="/treeoflife" element={<TreeOfLife />} />
    </Routes>
  );
}

export default App;
