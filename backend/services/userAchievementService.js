const database = require("../config/database");
const { Achievement, UserAchievement, User } = require("../models");
const { ResourceNotFoundError } = require("../utils/errors");

exports.listForUser = (userId) => UserAchievement.findAll({ where: { userId }, order: [["createdAt", "ASC"]] });

exports.grant = (userId, achievementId, amount = 1) =>
  database.transaction(async (transaction) => {
    if (!(await User.findByPk(userId, { attributes: ["id"], transaction }))) throw new ResourceNotFoundError("User not found");
    if (!(await Achievement.findByPk(achievementId, { attributes: ["id"], transaction }))) {
      throw new ResourceNotFoundError("Achievement not found");
    }
    return UserAchievement.create({ userId, achievementId, amount, completedAt: new Date() }, { transaction });
  });

async function findOne(userId, achievementId, transaction) {
  const ua = await UserAchievement.findOne({ where: { userId, achievementId }, transaction });
  if (!ua) throw new ResourceNotFoundError("UserAchievement not found");
  return ua;
}

exports.update = (userId, achievementId, amount) =>
  database.transaction(async (transaction) => {
    const ua = await findOne(userId, achievementId, transaction);
    await ua.update({ amount }, { transaction });
    return ua;
  });

exports.remove = (userId, achievementId) =>
  database.transaction(async (transaction) => {
    const ua = await findOne(userId, achievementId, transaction);
    await ua.destroy({ transaction });
    return ua;
  });
