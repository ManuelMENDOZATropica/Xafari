// Cliente único para la API de Xafari (ver docs/CONTRATO-API.md).
// - Agrega `Authorization: Bearer <token>` cuando hay sesión.
// - Revisa `res.ok` y lanza ApiError con status y código del servidor.
// - Ante 401 con token avisa al handler registrado (App cierra sesión y manda a /login).

export const API_BASE = import.meta.env.VITE_API_URL || "/api";

const TOKEN_KEY = "token";
const DEFAULT_TIMEOUT = 15000;

export class ApiError extends Error {
  constructor(message, { status = 0, data = null, network = false } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.network = network;
    this.code = data && typeof data.error === "string" ? data.error : null;
  }

  /** Errores que vale la pena reintentar más tarde (sin red, timeout o 5xx). */
  get retryable() {
    return this.network || this.status >= 500 || this.status === 0;
  }
}

export function getStoredToken() {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    // Versiones viejas guardaban el token como JSON.stringify(token).
    if (raw.startsWith('"')) {
      try {
        const parsed = JSON.parse(raw);
        return typeof parsed === "string" ? parsed : null;
      } catch {
        return raw;
      }
    }
    return raw;
  } catch {
    return null;
  }
}

export function storeToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* almacenamiento no disponible (modo privado) */
  }
}

let unauthorizedHandler = null;

/** Registra quién maneja un 401 (cierre de sesión). Devuelve la función para quitarlo. */
export function setUnauthorizedHandler(fn) {
  unauthorizedHandler = fn;
  return () => {
    if (unauthorizedHandler === fn) unauthorizedHandler = null;
  };
}

/**
 * Llama a la API.
 * @param {string} path  Ruta relativa, p. ej. "/user-activities".
 * @param {object} [opts]
 * @param {string} [opts.method]
 * @param {any}    [opts.body]     Se serializa como JSON.
 * @param {boolean}[opts.auth]     Enviar el token si existe (default true).
 * @param {AbortSignal} [opts.signal]
 * @param {number} [opts.timeout]  ms antes de abortar (default 15 s).
 */
export async function api(path, { method = "GET", body, auth = true, signal, timeout = DEFAULT_TIMEOUT } = {}) {
  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const token = auth ? getStoredToken() : null;
  if (token) headers.Authorization = `Bearer ${token}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new DOMException("timeout", "TimeoutError")), timeout);
  const onAbort = () => controller.abort(signal.reason);
  if (signal) {
    if (signal.aborted) controller.abort(signal.reason);
    else signal.addEventListener("abort", onAbort, { once: true });
  }

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      cache: "no-store",
    });
  } catch (err) {
    if (signal?.aborted) throw err; // cancelado por quien llama: no es error de red
    throw new ApiError("network_error", { network: true, data: { error: String(err?.message || err) } });
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener?.("abort", onAbort);
  }

  let data = null;
  const text = await res.text().catch(() => "");
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text.slice(0, 200) };
    }
  }

  if (!res.ok) {
    // Un servidor caído detrás de un proxy puede responder HTML: trátalo como 5xx.
    if (res.status === 401 && token && unauthorizedHandler) unauthorizedHandler();
    throw new ApiError(data?.error || `HTTP ${res.status}`, { status: res.status, data });
  }
  return data;
}

api.get = (path, opts) => api(path, { ...opts, method: "GET" });
api.post = (path, body, opts) => api(path, { ...opts, method: "POST", body });
api.put = (path, body, opts) => api(path, { ...opts, method: "PUT", body });
api.del = (path, opts) => api(path, { ...opts, method: "DELETE" });
