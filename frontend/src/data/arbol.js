/**
 * Posiciones de las insignias sobre el canvas del árbol (2450×4200).
 * Todas en % del canvas: left/top/width/height.
 * Las capas recortadas (checklist, flores) salen de arbolCapas.json, que
 * genera scripts/optimize-images.mjs.
 */
import capas from "./arbolCapas.json";

export const TREE_CANVAS_WIDTH = 2450;
export const TREE_CANVAS_HEIGHT = 4200;

/** Xecretos: activity.name → guardián */
export const guardianPositions = {
  xecreto1: {
    src: "/arbol/guardianes/mono.webp",
    left: "29.175%",
    top: "32.726%",
    width: "11.429%",
    height: "6.667%",
  },
  xecreto10: {
    src: "/arbol/guardianes/coati.webp",
    left: "47.659%",
    top: "39.774%",
    width: "11.429%",
    height: "6.667%",
  },
  xecreto2: {
    src: "/arbol/guardianes/rana.webp",
    left: "32.912%",
    top: "66.250%",
    width: "11.429%",
    height: "6.667%",
  },
  xecreto3: {
    src: "/arbol/guardianes/jaguar.webp",
    left: "65.720%",
    top: "44.476%",
    width: "11.429%",
    height: "6.667%",
  },
  xecreto4: {
    src: "/arbol/guardianes/guacamaya.webp",
    left: "47.013%",
    top: "27.833%",
    width: "11.429%",
    height: "6.667%",
  },
  xecreto5: {
    src: "/arbol/guardianes/serpiente.webp",
    left: "29.498%",
    top: "54.286%",
    width: "11.429%",
    height: "6.667%",
  },
  xecreto6: {
    src: "/arbol/guardianes/venado.webp",
    left: "63.377%",
    top: "53.012%",
    width: "11.429%",
    height: "6.667%",
  },
  xecreto7: {
    src: "/arbol/guardianes/buho.webp",
    left: "60.427%",
    top: "66.262%",
    width: "11.429%",
    height: "6.667%",
  },
  xecreto8: {
    src: "/arbol/guardianes/mariposa.webp",
    left: "65.720%",
    top: "32.321%",
    width: "11.429%",
    height: "6.667%",
  },
  xecreto9: {
    src: "/arbol/guardianes/flamenco.webp",
    left: "27.882%",
    top: "43.179%",
    width: "11.429%",
    height: "6.667%",
  },
};

/** Xperiencias (Xtop): activity.name → insignia */
export const xtopPositions = {
  camion: {
    src: "/arbol/xtop/camion.webp",
    left: "48.093%",
    top: "19.242%",
    width: "9.143%",
    height: "5.333%",
  },
  caracola: {
    src: "/arbol/xtop/caracola.webp",
    left: "39.392%",
    top: "46.450%",
    width: "9.143%",
    height: "5.333%",
  },
  conejo: {
    src: "/arbol/xtop/conejo.webp",
    left: "48.633%",
    top: "47.008%",
    width: "9.143%",
    height: "5.333%",
  },
  drink: {
    src: "/arbol/xtop/drink.webp",
    left: "54.170%",
    top: "56.015%",
    width: "9.143%",
    height: "5.333%",
  },
  estrella: {
    src: "/arbol/xtop/estrella.webp",
    left: "71.862%",
    top: "63.754%",
    width: "9.143%",
    height: "5.333%",
  },
  kayak: {
    src: "/arbol/xtop/kayak.webp",
    left: "74.846%",
    top: "55.319%",
    width: "9.143%",
    height: "5.333%",
  },
  mascarajaguar: {
    src: "/arbol/xtop/mascarajaguar.webp",
    left: "45.428%",
    top: "61.447%",
    width: "9.143%",
    height: "5.333%",
  },
  patin: {
    src: "/arbol/xtop/patin.webp",
    left: "36.994%",
    top: "27.381%",
    width: "9.143%",
    height: "5.333%",
  },
  piscina: {
    src: "/arbol/xtop/piscina.webp",
    left: "20.276%",
    top: "58.901%",
    width: "9.143%",
    height: "5.333%",
  },
  poolpo: {
    src: "/arbol/xtop/poolpo.webp",
    left: "58.460%",
    top: "26.929%",
    width: "9.143%",
    height: "5.333%",
  },
  salvavidas: {
    src: "/arbol/xtop/salvavidas.webp",
    left: "81.087%",
    top: "60.651%",
    width: "9.143%",
    height: "5.333%",
  },
  teatro: {
    src: "/arbol/xtop/teatro.webp",
    left: "18.794%",
    top: "53.513%",
    width: "9.143%",
    height: "5.333%",
  },
  tobogan: {
    src: "/arbol/xtop/tobogan.webp",
    left: "44.931%",
    top: "54.546%",
    width: "9.143%",
    height: "5.333%",
  },
  tv: {
    src: "/arbol/xtop/tv.webp",
    left: "20.377%",
    top: "65.085%",
    width: "9.143%",
    height: "5.333%",
  },
  vinil: {
    src: "/arbol/xtop/vinil.webp",
    left: "11.227%",
    top: "64.279%",
    width: "9.143%",
    height: "5.333%",
  },
  xorbeteria: {
    src: "/arbol/xtop/xorbeteria.webp",
    left: "44.391%",
    top: "69.284%",
    width: "9.143%",
    height: "5.333%",
  },
  xpiral: {
    src: "/arbol/xtop/xpiral.webp",
    left: "84.045%",
    top: "50.691%",
    width: "9.143%",
    height: "5.333%",
  },
};

/** Checklist gastro (Event): activity.name → capa recortada */
export const checklistPositions = Object.fromEntries(
  Object.entries(capas.checklist).map(([k, v]) => [
    k,
    { src: v.src, left: `${v.left}%`, top: `${v.top}%`, width: `${v.width}%`, height: `${v.height}%` },
  ])
);

/** Centro de una insignia en px del canvas */
export function centerOf(pos) {
  return {
    x: ((parseFloat(pos.left) + parseFloat(pos.width) / 2) / 100) * TREE_CANVAS_WIDTH,
    y: ((parseFloat(pos.top) + parseFloat(pos.height) / 2) / 100) * TREE_CANVAS_HEIGHT,
  };
}
