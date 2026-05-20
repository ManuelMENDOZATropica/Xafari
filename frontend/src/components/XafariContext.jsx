import { createContext } from "react";

const XafariContext = createContext({
  user: {
    name: null,
    lastname: null,
    email: null,
    avatar: {
      bodyOptions: 0,
      faceOptions: 0,
    },
  },
  setUser: () => { },
  token: null,
  setToken: () => { },
  activitiesMap: {},
  registerActivityCompleted: async () => { },
  saveActivityRating: async () => { },
  xecretos: {},
  soundSetting: "full",
  setSoundSetting: () => { },
  triggerClickFeedback: () => { },
  playWardrobeSound: () => { },
  playSuccessSound: () => { },
  playErrorSound: () => { },
});

export default XafariContext;
