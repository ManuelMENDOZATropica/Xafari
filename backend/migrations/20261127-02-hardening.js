// Auditoría nov 2026:
// 1. Borra los UNIQUE/FK duplicados que dejó sync({alter:true}) (users_email_key1, ...).
// 2. users: role, tokenVersion, avatar → TEXT, emails en minúsculas (si no chocan)
//    e índice único por lower(email) cuando no hay duplicados.
// 3. xperiencia.correctAnswer (trivia validada en el servidor).
// 4. Árboles con admin que ya no es miembro: reasigna al miembro más antiguo o borra el árbol vacío.
// Solo Postgres. Idempotente.

async function dropDuplicateConstraints(sequelize, transaction) {
  const [rows] = await sequelize.query(
    `SELECT c.conrelid::regclass::text AS tbl, c.conname, c.contype,
            pg_get_constraintdef(c.oid) AS def
       FROM pg_constraint c
       JOIN pg_namespace n ON n.oid = c.connamespace
      WHERE n.nspname = 'public' AND c.contype IN ('u', 'f')
      ORDER BY c.conrelid::regclass::text, pg_get_constraintdef(c.oid),
               (c.conname ~ '[0-9]+$') ASC, length(c.conname) ASC, c.conname ASC`,
    { transaction }
  );
  const seen = new Set();
  const dropped = [];
  for (const r of rows) {
    const key = `${r.tbl}|${r.def}`;
    if (!seen.has(key)) {
      seen.add(key);
      continue;
    }
    await sequelize.query(`ALTER TABLE ${r.tbl} DROP CONSTRAINT IF EXISTS "${r.conname}"`, { transaction });
    dropped.push(`${r.tbl}.${r.conname}`);
  }
  return dropped;
}

module.exports = {
  async up({ context: queryInterface }) {
    const { sequelize } = queryInterface;
    await sequelize.transaction(async (transaction) => {
      const q = (sql) => sequelize.query(sql, { transaction });

      const dropped = await dropDuplicateConstraints(sequelize, transaction);
      if (dropped.length) {
        // eslint-disable-next-line no-console
        console.log(`[migración] constraints duplicados eliminados: ${dropped.length}`);
      }

      await q(`ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role character varying(16) NOT NULL DEFAULT 'user'`);
      await q(`ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "tokenVersion" integer NOT NULL DEFAULT 0`);
      await q(`DO $$ BEGIN
                 ALTER TABLE public.users ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'admin'));
               EXCEPTION WHEN duplicate_object THEN NULL; END $$`);
      await q(`ALTER TABLE public.users ALTER COLUMN avatar TYPE text`);

      // Emails a minúsculas solo donde no haya otra cuenta con el mismo correo.
      await q(`UPDATE public.users u SET email = lower(u.email)
                WHERE u.email <> lower(u.email)
                  AND NOT EXISTS (SELECT 1 FROM public.users o
                                   WHERE o.id <> u.id AND lower(o.email) = lower(u.email))`);
      const [[{ dups }]] = await q(
        `SELECT count(*)::int AS dups FROM (SELECT lower(email) FROM public.users GROUP BY lower(email) HAVING count(*) > 1) d`
      );
      if (dups === 0) {
        await q(`CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_key ON public.users (lower(email))`);
      } else {
        // eslint-disable-next-line no-console
        console.warn(`[migración] ${dups} correos duplicados por mayúsculas; no se crea users_email_lower_key. Revisar a mano.`);
      }

      await q(`ALTER TABLE public.xperiencia ADD COLUMN IF NOT EXISTS "correctAnswer" character varying(255)`);

      // Árboles cuyo admin ya no es miembro → admin = miembro más antiguo.
      await q(`UPDATE public."familyTrees" ft
                  SET admin = sub.next_admin, "updatedAt" = now()
                 FROM (SELECT DISTINCT ON (u."familyTreeId") u."familyTreeId" AS fid, u.id AS next_admin
                         FROM public.users u
                        WHERE u."familyTreeId" IS NOT NULL
                        ORDER BY u."familyTreeId", u."createdAt" ASC) sub
                WHERE ft.id = sub.fid
                  AND NOT EXISTS (SELECT 1 FROM public.users a WHERE a.id = ft.admin AND a."familyTreeId" = ft.id)
                  AND NOT EXISTS (SELECT 1 FROM public."familyTrees" o WHERE o.admin = sub.next_admin AND o.id <> ft.id)`);
      // Árboles sin miembros → se borran.
      await q(`DELETE FROM public."familyTrees" ft
                WHERE NOT EXISTS (SELECT 1 FROM public.users u WHERE u."familyTreeId" = ft.id)`);

      await q(`CREATE INDEX IF NOT EXISTS "userActivities_completedAt_idx" ON public."userActivities" ("completedAt")`);
    });
  },
  async down() {},
};
