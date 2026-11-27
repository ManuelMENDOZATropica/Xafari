// Ruta a la que hay que volver después del login/registro (p. ej. un QR escaneado sin sesión).
// Se guarda en sessionStorage para sobrevivir al flujo de registro (varias pantallas).

const KEY = "xafari:returnTo";

export function saveReturnTo(path) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return;
  try {
    sessionStorage.setItem(KEY, path);
  } catch {
    /* sin almacenamiento */
  }
}

/** Devuelve la ruta guardada (y la borra), o `fallback`. */
export function takeReturnTo(fallback = null) {
  try {
    const path = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    if (path && path.startsWith("/") && !path.startsWith("//")) return path;
  } catch {
    /* sin almacenamiento */
  }
  return fallback;
}

// Aviso de "tu sesión terminó" para la pantalla de login (sobrevive a redirecciones dobles).
const EXPIRED_KEY = "xafari:sessionExpired";

export function markSessionExpired() {
  try {
    sessionStorage.setItem(EXPIRED_KEY, "1");
  } catch {
    /* sin almacenamiento */
  }
}

export function takeSessionExpired() {
  try {
    const v = sessionStorage.getItem(EXPIRED_KEY) === "1";
    sessionStorage.removeItem(EXPIRED_KEY);
    return v;
  } catch {
    return false;
  }
}
