const { QueryTypes } = require("sequelize");
const database = require("../config/database");
const env = require("../config/env");
const { periodRange } = require("../utils/time");
const { parseAvatar } = require("../dto/user.dto");
const { BadRequestError } = require("../utils/errors");

const LIMIT = 50;
const PERIODOS = { hoy: "hoy", mes: "mes", total: "total", siempre: "total" };

/**
 * GET /leaderboard?periodo=hoy|mes|total ("siempre" = total)
 * Agregado en SQL. Sin ids: [{nombre, casa, avatar, puntos, xperiencias, xecretos, xelfies, esYo?}]
 */
exports.getLeaderboard = async (req, res) => {
  const periodo = PERIODOS[req.query.periodo || "total"];
  if (!periodo) throw new BadRequestError("periodo must be hoy, mes or total");

  const range = periodRange(periodo, env.TIMEZONE);
  const replacements = { limit: LIMIT };
  let dateFilter = "";
  if (range) {
    dateFilter = 'AND ua."completedAt" >= :start AND ua."completedAt" < :end';
    replacements.start = range.start;
    replacements.end = range.end;
  }

  const rows = await database.query(
    `SELECT u.id AS id, u.name AS nombre, u.casa AS casa, u.avatar AS avatar,
            SUM(CASE WHEN a.type = 'Xperiencia' THEN 1 ELSE 0 END) AS xperiencias,
            SUM(CASE WHEN a.type = 'Xecreto' THEN 1 ELSE 0 END) AS xecretos,
            SUM(CASE WHEN a.type = 'Xelfie' THEN 1 ELSE 0 END) AS xelfies
       FROM users u
       JOIN "userActivities" ua ON ua."userId" = u.id AND ua."completedAt" IS NOT NULL ${dateFilter}
       JOIN activities a ON a.id = ua."activityId" AND a.type IN ('Xperiencia', 'Xecreto', 'Xelfie')
      GROUP BY u.id, u.name, u.casa, u.avatar
      ORDER BY COUNT(*) DESC, MIN(ua."completedAt") ASC
      LIMIT :limit`,
    { type: QueryTypes.SELECT, replacements }
  );

  const meId = req.user && req.user.id;
  const result = rows.map((r) => {
    const xperiencias = Number(r.xperiencias) || 0;
    const xecretos = Number(r.xecretos) || 0;
    const xelfies = Number(r.xelfies) || 0;
    const row = {
      nombre: r.nombre,
      casa: r.casa || "",
      avatar: parseAvatar(r.avatar),
      puntos: xperiencias + xecretos + xelfies,
      xperiencias,
      xecretos,
      xelfies,
    };
    if (meId && r.id === meId) row.esYo = true;
    return row;
  });

  res.set("Cache-Control", "no-store");
  res.status(200).json(result);
};
