import { createContext } from "react";

const XafariContext = createContext({
  user: { name: null, lastname: null, email: null, avatar: { bodyOptions: 0, faceOptions: 0 } },
  setUser: () => { },
  token: null,
  setToken: () => { },
  activitiesMap: {},
  registerActivityCompleted: async () => { },
  saveActivityRating: async () => { },
  syncUserProgress: async () => { },
  // ── Progreso (fuente de verdad: BD, no localStorage) ──────────────────
  progresoXperiencias: {},
  xecretos: {},
  progresoChecklist: {},
  progresoXelfies: {},
  calificacionesXperiencias: {},
  calificacionesChecklist: {},
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
