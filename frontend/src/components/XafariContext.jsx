import { createContext } from "react";

const XafariContext = createContext({
  user: {
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
  },
  setUser: () => {},
  token: null,
  setToken: () => {},
  xecretos: {},
  soundSetting: "full",
  setSoundSetting: () => {},
});

export default XafariContext;
