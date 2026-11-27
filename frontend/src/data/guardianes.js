// Guardián que se revela con cada xecreto (clave = nombre de la actividad en BD).
export const GUARDIANES = {
  xecreto1: { guardian: "Mono", img: "/arbol/guardianes/mono.webp" },
  xecreto2: { guardian: "Rana", img: "/arbol/guardianes/rana.webp" },
  xecreto3: { guardian: "Jaguar", img: "/arbol/guardianes/jaguar.webp" },
  xecreto4: { guardian: "Guacamaya", img: "/arbol/guardianes/guacamaya.webp" },
  xecreto5: { guardian: "Serpiente", img: "/arbol/guardianes/serpiente.webp" },
  xecreto6: { guardian: "Venado", img: "/arbol/guardianes/venado.webp" },
  xecreto7: { guardian: "Búho", img: "/arbol/guardianes/buho.webp" },
  xecreto8: { guardian: "Mariposa", img: "/arbol/guardianes/mariposa.webp" },
  xecreto9: { guardian: "Flamenco", img: "/arbol/guardianes/flamenco.webp" },
  xecreto10: { guardian: "Coatí", img: "/arbol/guardianes/coati.webp" },
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Lee el contenido de un QR de actividad: `${PUBLIC_APP_URL}/q/<activityId>?k=<code>`.
 * Acepta cualquier dominio (preview, producción o el futuro dominio de Xcaret):
 * quien valida el código es el servidor. Devuelve {activityId, code} o null.
 */
export function parseActivityQr(text) {
  if (!text) return null;
  let url;
  try {
    url = new URL(text.trim(), window.location.origin);
  } catch {
    return null;
  }
  const match = url.pathname.match(/^\/q\/([^/]+)\/?$/);
  if (!match || !UUID_RE.test(match[1])) return null;
  return { activityId: match[1], code: url.searchParams.get("k") || "" };
}

export function isUuid(value) {
  return UUID_RE.test(value || "");
}
