const database = require("../config/database");
const { UserXelfie, Xelfie, UserActivity } = require("../models");
const { ResourceNotFoundError } = require("../utils/errors");

exports.listForUser = (userId) => UserXelfie.findAll({ where: { userId }, order: [["createdAt", "ASC"]] });

/** Guarda la xelfie del usuario y marca su actividad como completada. */
exports.add = (userId, xelfieId, xelfieUrl) =>
  database.transaction(async (transaction) => {
    const xelfie = await Xelfie.findByPk(xelfieId, { attributes: ["id", "activityId"], transaction });
    if (!xelfie) throw new ResourceNotFoundError("Xelfie not found");

    const userXelfie = await UserXelfie.create({ userId, xelfieId, xelfieUrl }, { transaction });

    const now = new Date();
    const [ua, created] = await UserActivity.findOrCreate({
      where: { userId, activityId: xelfie.activityId },
      defaults: { startedAt: now, completedAt: now },
      transaction,
    });
    if (!created && !ua.completedAt) await ua.update({ completedAt: now }, { transaction });

    return userXelfie;
  });

async function findOwn(userId, xelfieId, transaction) {
  const row = await UserXelfie.findOne({ where: { userId, xelfieId }, transaction });
  if (!row) throw new ResourceNotFoundError("UserXelfie not found");
  return row;
}

exports.update = (userId, xelfieId, xelfieUrl) =>
  database.transaction(async (transaction) => {
    const row = await findOwn(userId, xelfieId, transaction);
    await row.update({ xelfieUrl }, { transaction });
    return row;
  });

exports.remove = (userId, xelfieId) =>
  database.transaction(async (transaction) => {
    const row = await findOwn(userId, xelfieId, transaction);
    await row.destroy({ transaction });
    return row;
  });
