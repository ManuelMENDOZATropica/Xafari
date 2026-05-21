import { createContext } from "react";

const XafariContext = createContext({
  user: { name: null, lastname: null, email: null, avatar: { bodyOptions: 0, faceOptions: 0 } },
  setUser: () => { },
  token: null,
  setToken: () => { },
  activitiesMap: {},
  registerActivityCompleted: async () => { },
  saveActivityRating: async () => { },
  // ── Progreso (fuente de verdad: BD, no localStorage) ──────────────────
  progresoXperiencias: {},      // { kayak: "a", vinil: "b", ... }
  xecretos: {},                  // { xecreto1: true, ... }
  progresoChecklist: {},         // { quesadillas: true, ... }
  calificacionesXperiencias: {}, // { kayak: 4, ... }
  calificacionesChecklist: {},   // { quesadillas: 3, ... }
  // ─────────────────────────────────────────────────────────────────────
  soundSetting: "full",
  setSoundSetting: () => { },
  musicEnabled: true,
  setMusicEnabled: () => { },
  triggerClickFeedback: () => { },
  playWardrobeSound: () => { },
  playSuccessSound: () => { },
  playErrorSound: () => { },
});

export default XafariContext;
