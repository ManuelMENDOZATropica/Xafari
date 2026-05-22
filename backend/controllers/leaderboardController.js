const { Op } = require("sequelize");
const { User, UserActivity, Activity, Xperiencia, Xecreto, Xelfie, UserXelfie } = require("../models");

// Devuelve el filtro de fecha según el período solicitado
function getPeriodFilter(periodo) {
  const now = new Date();
  if (periodo === "hoy") {
    const start = new Date(now); start.setHours(0, 0, 0, 0);
    const end   = new Date(now); end.setHours(23, 59, 59, 999);
    return { [Op.between]: [start, end] };
  }
  if (periodo === "mes") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return { [Op.between]: [start, end] };
  }
  // "siempre" — cualquier fecha completada
  return { [Op.ne]: null };
}

exports.getLeaderboard = async (req, res) => {
  try {
    const { periodo = "siempre" } = req.query;
    const completedAtFilter = getPeriodFilter(periodo);

    // Traer todos los usuarios con sus actividades completadas en el período
    const users = await User.findAll({
      attributes: ["id", "name", "casa"],
      include: [
        {
          model: Activity,
          as: "activities",
          required: false,
          attributes: ["id"],
          through: {
            model: UserActivity,
            attributes: ["completedAt"],
            where: { completedAt: completedAtFilter },
          },
          include: [
            { model: Xperiencia, required: false, attributes: ["id"] },
            { model: Xecreto,    required: false, attributes: ["id"] },
            { model: Xelfie,     required: false, attributes: ["id"] },
          ],
        },
      ],
    });

    // Mapear a datos del podio
    const leaderboard = users
      .map((u) => {
        const acts       = u.activities || [];
        const xperiencias = acts.filter((a) => a.Xperiencia).length;
        const xecretos    = acts.filter((a) => a.Xecreto).length;
        const xelfies     = acts.filter((a) => a.Xelfie).length;
        return {
          id: u.id,
          nombre: u.name,
          casa: u.casa || "",
          xperiencias,
          xecretos,
          xelfies,
          total: xperiencias + xecretos + xelfies,
        };
      })
      .sort((a, b) => b.total - a.total);

    return res.json(leaderboard);
  } catch (err) {
    console.error("[leaderboard]", err);
    return res.status(500).json({ error: "Error al obtener el leaderboard" });
  }
};
