// Todas las cadenas de un idioma en un solo objeto (un chunk por idioma). El orden importa si hay claves repetidas.
import globalStrings from "./global.json";
import loginStrings from "./login.json";
import homeStrings from "./home.json";
import registerStrings from "./register.json";
import avatarStrings from "./avatar.json";
import xecretosStrings from "./xecretos.json";
import experienciasStrings from "./experiencias.json";
import checklistStrings from "./checklist.json";
import introStrings from "./intro.json";
import legalStrings from "./legal.json";

export default {
  ...globalStrings,
  ...loginStrings,
  ...homeStrings,
  ...registerStrings,
  ...avatarStrings,
  ...xecretosStrings,
  ...experienciasStrings,
  ...checklistStrings,
  ...introStrings,
  ...legalStrings,
};
