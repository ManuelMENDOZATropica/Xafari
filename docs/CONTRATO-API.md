# Contrato API — rama fix/auditoria-2026-11

Acordado antes de corregir la auditoría del 27 nov 2026 (ver ../AUDITORIA-2026-11-27.md fuera del repo).
Backend y frontend deben cumplir esto. Si algo no cuadra, se ajusta AQUÍ primero.

## 1. Autenticación
- Header `Authorization: Bearer <jwt>` en toda petición, salvo las públicas:
  - `POST /login`, `POST /users` (registro), `GET /health`
  - Catálogo de solo lectura: `GET /houses*`, `GET /activities*`, `GET /xecretos*`, `GET /xelfies*`, `GET /xperiencias*`, `GET /events*`, `GET /achievements*`
  - `GET /leaderboard`
- Token ausente/ inválido/ expirado → `401 {error}`. El frontend, ante 401, cierra sesión y manda a `/login` conservando la ruta de origen.
- JWT: payload `{id, role, tv}` (tv = tokenVersion; cambia al cambiar contraseña → tokens viejos dan 401). Expira en 7 días.
- En producción el server no arranca sin `JWT_SECRET` ni `QR_SECRET` (ni `DATABASE_URL`).
- `POST /users` (registro) responde `201 {token, user}`; `POST /login` `200 {token, user}` (los campos de `user` también van en la raíz por compatibilidad). Email sin distinguir mayúsculas. Password ≥ 8.
- Swagger (`/docs`) solo fuera de producción.

## 2. Dueño
- El usuario actuante SIEMPRE sale del token. Cualquier `userId` en el body se ignora.
- Rutas con `:userId` o `/users/:id` de usuario: si no coincide con el token → `403`.
- `GET /users/:id` (solo el propio; un `admin` puede ver cualquiera) y `GET /user` (alias del propio). `DELETE /user` borra la cuenta propia. La respuesta nunca incluye `password`, `tokenVersion` ni `role` de otros.
- `PUT /user` (perfil propio; `PUT /users/:id` igual con chequeo de dueño): solo `name`, `lastname`, `pronouns`, `avatar`, `birthdate`, `reservationNumber`. Cualquier otro campo (`email`, `password`, `casa`, `role`…) se IGNORA en silencio (no da 400), así el front puede mandar el objeto `user` completo. Responde `{user}` con el usuario completo.
- `PUT /user/password` `{currentPassword, newPassword}` (newPassword ≥ 8). Hashea, sube tokenVersion y devuelve un token nuevo `{token}`.

## 3. Roles
- `User.role` ∈ `user|admin`, default `user`, nunca asignable desde el body.
- POST/PUT/DELETE de catálogo (casas, actividades, xecretos, xelfies, xperiencias, eventos, logros) → solo `admin` (403 si no).

## 4. Completar actividades
- Endpoint que usa el frontend: `POST /user-activities` body `{activityId, code?}` (userId del token). Respuesta 201 `{userActivity}`; si ya estaba completada → `200` idempotente (no duplica, no da error).
- `completedAt` lo pone el servidor. No se puede editar desde clientes.
- Solo `Xecreto` (placas con QR físico) exige `code` válido; si falta o es inválido → `403 {error:"invalid_code"}`. **Cambio:** las Xperiencias no tienen QR físico (son la trivia de `XperienciasXtop`), así que en vez de `code` exigen `answer` (`"a"|"b"|"c"`), que el servidor compara con la respuesta guardada (seed). Sin `answer` → `400 {error:"answer_required"}`; incorrecta → `400 {error:"wrong_answer", retryAfter:180}`. Checklist (`Event`) y `Xelfie` no exigen nada.
- Body: `{activityId, code?, answer?}`. Cualquier `userId`/`completedAt` se ignora.
- `GET /user-activities` (lista propia) y `GET /user-activities/:activityId`. Ya no hay PUT/DELETE de user-activities.
- `code = base64url(HMAC_SHA256(QR_SECRET, activityId)).slice(0, 16)`.
- Payload de TODO QR de actividad: `${PUBLIC_APP_URL}/q/<activityId>?k=<code>` (sirve con la cámara nativa del teléfono y con el escáner de la app, que extrae activityId y k de la URL).
- `PUBLIC_APP_URL` por defecto `https://xafari-phi.vercel.app` (el dominio `xafari.xcaret.com` no resuelve; se cambia cuando exista).
- Cooldown de Xperiencias: tras un `wrong_answer`, durante `XPERIENCIA_COOLDOWN_SECONDS` (180 s) cualquier intento → `429 {error:"cooldown", retryAfter}` (también en header `Retry-After`). El front puede seguir mostrando su contador, pero manda la respuesta al servidor y respeta el 429.
- `GET /xecretos` ya no devuelve `correctAnswer`. Si el front necesita validar una respuesta: `POST /xecretos/:id/check {clueId, answer}` → `{correct:boolean}` (requiere auth).
- Script `backend/scripts/generate-qrs.js` (`npm run generate-qrs -- --out <dir>`) genera los PNG (con QR_SECRET y PUBLIC_APP_URL del entorno y los ids de la base a la que apunte). **Cambio:** salen por defecto en `backend/qrcodes/` (gitignored), NO en `frontend/public/qrcodes/`: todo lo de `public/` se publica en Vercel y cualquiera podría bajar los PNG y canjear sin ir al parque. Los PNG viejos de `frontend/public/qrcodes/` (URL a `xafari.xcaret.com/xecreto/...`) ya no sirven y conviene borrarlos.
- Ruta del front `/q/:activityId?k=<code>`: debe hacer `POST /user-activities {activityId, code:k}` (tras login si hace falta).

## 5. Familia
- `POST /family-trees` `{name}` → `201`, crea con el usuario del token como admin (`adminId` del body se ignora). Si ya está en una familia → `409`.
- `POST /family-trees/:id/invite` (miembro) → `{inviteToken, expiresAt}` (JWT firmado, 24 h). El QR de la familia codifica `inviteToken` (no el id).
- `POST /family-trees/join` `{inviteToken}` → une al usuario del token (máx. 6, con lock; llena → `409`). Token inválido/expirado → `403 {error:"invalid_invite"}`. Si estaba en otra familia, sale de ella (con la misma regla de admin que `leave`). Ya no existe `POST /family-trees/:id/join`.
- `POST /family-trees/leave` (sin body) → saca al usuario del token; si era admin se reasigna admin al miembro más antiguo o se borra el árbol si queda vacío.
- `GET /family-trees/:id` solo para miembros (403 si no; un `admin` de la app también puede). Respuesta `{familyTree, ...familyTree}` con `{id, name, adminId, members:[ids], users:[{id, name, casa, avatar, activities:[{id,name,type,location,houseId,userActivity:{completedAt}}]}]}`; NO email, fecha de nacimiento, reservación ni rol.
- "Miembro más antiguo" = el usuario con `createdAt` más viejo (no se guarda la fecha de unión).
- `DELETE /family-trees/:id` solo admin del árbol.
- `PUT /family-trees/:id` solo admin, solo `{name}`.

## 6. Leaderboard
- `GET /leaderboard?periodo=hoy|mes|total` (`siempre` = `total`, otro valor → 400) sin ids de usuario: `[{nombre, casa, avatar, puntos, xperiencias, xecretos, xelfies, esYo?}]` (`esYo: true` solo en la fila propia si viene token). `puntos` = Xperiencias + Xecretos + Xelfies (el checklist no suma, como antes). Solo usuarios con ≥ 1 punto en el periodo. Límites de día/mes en `America/Cancun`. Máx. 50 filas.

## 7. Errores
- Formato `{error: string, details?: []}`. 400 validación, 401, 403, 404, 409 duplicado, 429, 500 sin detalles internos.
- Ids no-UUID → 400.
- Rate limit general 429 (1000 req/15 min por IP), login 10/15 min por IP+email, registro 30/h por IP.

## 8. Rutas eliminadas (forma canónica)
- Alias en singular (`/house`, `/xecreto`, `/xelfie`, `/xperiencia`, `/event`, `/achievement`, `/activity`, `/familyTree`, `/user-activity`, `/user-xelfie`, `/user-preference`): solo queda el plural. `/user` se queda como alias del usuario del token.
- Updates por `POST /:id` → ahora `PUT /:id`.
- Rutas anidadas `/users/:userId/activity|xelfie|achievement` y `/user-avatar` (el avatar va por `PUT /user`).
- Logros de usuario: `GET /user-achievements` (propios); otorgar/editar/quitar solo admin en `/user-achievements/:userId[/:achievementId]`.
- `user-xelfies`: `POST {xelfieId, xelfieUrl}`, `PUT|DELETE /user-xelfies/:xelfieId`.
- `user-preferences`: `POST {activityId, rating 1–5, comment?, isFavorite?}` hace upsert (201 creada / 200 actualizada); `PUT|DELETE /user-preferences/:id` solo las propias.
