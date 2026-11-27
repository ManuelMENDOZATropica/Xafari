import { createContext } from "react";

// Valor real en App.jsx. Estos defaults solo sirven fuera del Provider (tests/aislado).
const XafariContext = createContext({
  user: { name: null, lastname: null, email: null, avatar: { bodyOptions: 0, faceOptions: 0 } },
  setUser: () => {},
  token: null,
  setToken: () => {},
  startSession: () => {},
  logout: () => {},
  activitiesMap: {},
  activitiesById: {},
  activitiesReady: false,
  registerActivityCompleted: async () => ({ ok: false, error: "no_provider" }),
  saveActivityRating: async () => {},
  syncUserProgress: async () => {},
  progressReady: false,
  pendingCount: 0,
  // ── Progreso (fuente de verdad: BD) ──────────────────────────────────────
  progresoXperiencias: {},
  xecretos: {},
  progresoChecklist: {},
  progresoXelfies: {},
  calificacionesXperiencias: {},
  calificacionesChecklist: {},
  familyTree: null,
  setFamilyTree: () => {},
  // ─────────────────────────────────────────────────────────────────────────
  soundSetting: "full",
  setSoundSetting: () => {},
  musicEnabled: true,
  setMusicEnabled: () => {},
  triggerClickFeedback: () => {},
  playWardrobeSound: () => {},
  playSuccessSound: () => {},
  playErrorSound: () => {},
});

export default XafariContext;
