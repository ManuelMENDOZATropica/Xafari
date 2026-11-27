# Xafari — backend

API REST de Xafari: Express 4 + Sequelize 6. En desarrollo usa SQLite; en producción, Postgres.
El acuerdo entre front y back está en [`../docs/CONTRATO-API.md`](../docs/CONTRATO-API.md) y la especificación en [`api/openapi.yaml`](api/openapi.yaml) (Swagger en `/docs` fuera de producción).

## Correr en local

```bash
cd backend
npm install
npm run dev          # http://localhost:3000, SQLite en database.sqlite
npm test             # Jest + Supertest con SQLite en memoria
```

No hace falta `.env` para desarrollo: sin `DATABASE_URL` usa SQLite y `JWT_SECRET`/`QR_SECRET` toman valores de desarrollo. Copia [`.env.example`](.env.example) a `.env` si quieres cambiar algo.

Al arrancar en SQLite se crean las tablas que falten (`sync()` sin `alter`) y se corre el seed. Si cambian los modelos, borra `database.sqlite` y vuelve a arrancar.

Para dar rol de admin a un usuario (local):

```bash
sqlite3 database.sqlite "UPDATE users SET role='admin' WHERE email='tu@correo.com';"
```

En Postgres es la misma sentencia con `psql`. El rol no se puede asignar desde la API.

## Variables de entorno

| Variable | Obligatoria en prod | Para qué |
|---|---|---|
| `DATABASE_URL` | sí | Postgres. En desarrollo, si existe, se usa en vez de SQLite. |
| `JWT_SECRET` | sí | Firma sesiones e invitaciones de familia. |
| `QR_SECRET` | sí | Firma los códigos de los QR impresos. Si cambia, hay que reimprimir. |
| `PUBLIC_APP_URL` | recomendado | URL del front que va dentro de los QR. Por defecto `https://xafari-phi.vercel.app`. |
| `CORS_ORIGINS` | recomendado | Orígenes permitidos separados por coma. Por defecto en prod: `https://xafari-phi.vercel.app`. (`FRONTEND_URL` se sigue aceptando.) |
| `DB_SSL` / `DB_SSL_CA` | no | `DB_SSL=false` sin SSL; `DB_SSL_CA` (ruta o PEM) verifica el certificado. Sin ninguna: SSL sin verificar (comportamiento histórico en Render). |
| `TRUST_PROXY` | no | Saltos de proxy delante (Render = 1, valor por defecto). |
| `RATE_LIMIT_MAX`, `LOGIN_LIMIT_MAX`, `REGISTER_LIMIT_MAX` | no | Límites (1000 por IP/15 min, 10 por IP+email/15 min, 30 registros por IP/hora). |
| `XPERIENCIA_COOLDOWN_SECONDS` | no | Espera tras fallar la trivia de una Xperiencia (180). |
| `APP_TIMEZONE` | no | Zona de "hoy" y "mes" del leaderboard (`America/Cancun`). |
| `ENABLE_DOCS`, `DB_LOGGING`, `LOG_LEVEL`, `DB_POOL_MAX`, `JWT_EXPIRES_IN` | no | Ver `.env.example`. |

En producción el server no arranca si falta `JWT_SECRET`, `QR_SECRET` o `DATABASE_URL`.

## Base de datos y migraciones

- **Producción (Postgres):** `npm start` corre las migraciones pendientes (Umzug, historial en la tabla `SequelizeMeta`), después el seed y luego levanta el server. Nunca usa `sync({alter})`.
- Para correrlas a mano: `DATABASE_URL=... npm run migrate`.
- Migraciones en [`migrations/`](migrations):
  - `20261127-01-baseline.js`: esquema completo con `IF NOT EXISTS`. En una base que ya tenía las tablas (creadas por `sync`) no cambia nada.
  - `20261127-03-parental-consent.js`: `users.parentalConsentAt` (consentimiento parental de menores en el registro).
  - `20261127-02-hardening.js`: borra los UNIQUE/FK duplicados que dejó `sync({alter})` (`users_email_key1`…), agrega `users.role` y `users.tokenVersion`, pasa `avatar` a `TEXT`, baja emails a minúsculas (si no chocan con otra cuenta), agrega `xperiencia.correctAnswer` y arregla árboles de familia con admin fuera del árbol.
- Para cambios nuevos: crea `migrations/AAAAMMDD-NN-descripcion.js` con `up({context: queryInterface})` (Postgres) y ajusta el modelo.

## Seed

`npm run seed` (y cada arranque): 10 casas y 55 actividades (17 Xperiencias con su respuesta, 10 Xecretos, 20 platillos del checklist con su fila en `events`, 8 Xelfies). Es atómico (una transacción) e idempotente (upsert por nombre): completa lo que falte sin duplicar ni tocar progreso de usuarios.

## QR de las placas

```bash
QR_SECRET=<el de producción> PUBLIC_APP_URL=https://xafari-phi.vercel.app DATABASE_URL=<prod o copia> \
  npm run generate-qrs -- --out ./qrcodes [--types Xecreto,Xperiencia]
```

Cada QR codifica `${PUBLIC_APP_URL}/q/<activityId>?k=<code>` con `code = base64url(HMAC_SHA256(QR_SECRET, activityId)).slice(0,16)`. Los ids son los de la base que uses, así que genera contra producción (o una copia). Salen en `backend/qrcodes/` (ignorado por git). **No los publiques en `frontend/public/`**: cualquiera podría descargarlos y canjear sin estar en el parque.

## Estructura

```
app.js                 Express: helmet, CORS, rate limit, auth global, rutas, 404 y error handler
server.js              arranque: secretos → DB → migraciones (PG) o sync (SQLite) → seed → listen
config/                env.js (variables), config.js (Sequelize), database.js
middleware/            authHandler (globalAuth, requireAdmin, requireSelf), rateLimits, errorHandler, validateRequest
routes/ controllers/ services/ dto/ validation/
migrations/            Umzug + migraciones Postgres
scripts/               seed.js, generate-qrs.js
tests/                 Jest + Supertest
```

## Docker

```bash
docker build -t xafari-backend .
docker run -p 3000:3000 -e DATABASE_URL=... -e JWT_SECRET=... -e QR_SECRET=... xafari-backend
```

Corre como usuario `node` (no root).
