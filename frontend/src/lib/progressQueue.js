// Cola persistente de progreso (POST /user-activities) para cuando falla la red.
// Cada elemento se guarda con el id del usuario: nunca se envía con la sesión de otra persona.

import { api, ApiError } from "./api";

const KEY = "xafari:pendingActivities";
const MAX_ATTEMPTS = 30;

function read() {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function write(list) {
  try {
    if (list.length) localStorage.setItem(KEY, JSON.stringify(list));
    else localStorage.removeItem(KEY);
  } catch {
    /* sin almacenamiento: se queda solo en memoria de esta sesión */
  }
  listeners.forEach((fn) => fn());
}

const listeners = new Set();
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function pendingFor(userId) {
  return read().filter((item) => item.userId === userId);
}

/** Construye el body del contrato: {activityId, code?, answer?} (sin userId). */
export function buildBody({ activityId, code, answer }) {
  const body = { activityId };
  if (code) body.code = code;
  if (answer !== undefined && answer !== null) body.answer = answer;
  return body;
}

export function enqueue(userId, payload) {
  const list = read().filter((item) => !(item.userId === userId && item.activityId === payload.activityId));
  list.push({ userId, ...buildBody(payload), name: payload.name, attempts: 0, queuedAt: Date.now() });
  write(list);
}

let flushing = null;

/**
 * Reintenta lo pendiente del usuario. Devuelve los nombres de actividad que el
 * servidor confirmó y los que rechazó (4xx) para que la UI lo refleje.
 */
export function flush(userId) {
  if (!userId) return Promise.resolve({ done: [], rejected: [] });
  if (flushing) return flushing;
  flushing = (async () => {
    const done = [];
    const rejected = [];
    for (const item of pendingFor(userId)) {
      try {
        await api.post("/user-activities", buildBody(item));
        done.push(item);
        write(read().filter((x) => !(x.userId === userId && x.activityId === item.activityId)));
      } catch (err) {
        const retry = err instanceof ApiError ? err.retryable : true;
        if (err instanceof ApiError && err.status === 401) break; // sesión caída: se reintenta tras el login
        if (retry && item.attempts + 1 < MAX_ATTEMPTS) {
          write(read().map((x) => (x.userId === userId && x.activityId === item.activityId ? { ...x, attempts: x.attempts + 1 } : x)));
          if (err.network) break; // sin red: no tiene caso seguir con los demás
        } else {
          console.error("Progreso rechazado por el servidor:", item, err);
          rejected.push({ ...item, error: err.code || err.message });
          write(read().filter((x) => !(x.userId === userId && x.activityId === item.activityId)));
        }
      }
    }
    return { done, rejected };
  })().finally(() => {
    flushing = null;
  });
  return flushing;
}
