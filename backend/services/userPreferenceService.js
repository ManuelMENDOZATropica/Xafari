const database = require("../config/database");
const { Activity, UserPreference } = require("../models");
const { ResourceNotFoundError } = require("../utils/errors");

exports.listForUser = (userId) => UserPreference.findAll({ where: { userId }, order: [["createdAt", "ASC"]] });

/** Crea o actualiza la calificación del usuario para una actividad. */
exports.upsert = (userId, activityId, data) =>
  database.transaction(async (transaction) => {
    const activity = await Activity.findByPk(activityId, { attributes: ["id"], transaction });
    if (!activity) throw new ResourceNotFoundError("Activity not found");
    const existing = await UserPreference.findOne({ where: { userId, activityId }, transaction });
    if (existing) {
      await existing.update(data, { transaction });
      return { pref: existing, created: false };
    }
    const pref = await UserPreference.create({ ...data, userId, activityId }, { transaction });
    return { pref, created: true };
  });

async function findOwn(userId, id, transaction) {
  const pref = await UserPreference.findOne({ where: { id, userId }, transaction });
  if (!pref) throw new ResourceNotFoundError("UserPreference not found");
  return pref;
}

exports.update = (userId, id, data) =>
  database.transaction(async (transaction) => {
    const pref = await findOwn(userId, id, transaction);
    await pref.update(data, { transaction });
    return pref;
  });

exports.remove = (userId, id) =>
  database.transaction(async (transaction) => {
    const pref = await findOwn(userId, id, transaction);
    await pref.destroy({ transaction });
    return pref;
  });
