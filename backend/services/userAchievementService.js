const database = require("../config/database");
const { Achievement, UserAchievement } = require("../models");
const { ResourceNotFoundError } = require("../utils/errors");
const userService = require("./userService");

exports.addAchievement = async (userId, achievementId, amount) => {
  const transaction = await database.transaction();

  try {
    const user = await userService.getUser(userId);
    if (!user) throw new ResourceNotFoundError("User not found");

    const achievement = await Achievement.findByPk(achievementId, {
      transaction,
    });

    if (!achievement) {
      throw new ResourceNotFoundError("Achievement not found");
    }

    const userAchievement = await UserAchievement.create(
      {
        userId: user.id,
        achievementId: achievement.id,
        amount,
      },
      {
        transaction,
      }
    );

    await transaction.commit();

    return userAchievement;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

exports.deleteAchievement = async (userId, achievementId) => {
  const transaction = await database.transaction();

  try {
    const user = await userService.getUser(userId, transaction);
    if (!user) throw new ResourceNotFoundError("User not found");

    const achievement = await Achievement.findByPk(achievementId, {
      transaction,
    });

    if (!achievement) {
      throw new ResourceNotFoundError("Achievement not found");
    }

    const userAchievement = await UserAchievement.findOne(
      {
        where: {
          userId: user.id,
          achievementId: achievement.id,
        },
      },
      {
        transaction,
      }
    );

    if (!userAchievement)
      throw new ResourceNotFoundError("UserAchievement not found");

    const destroyed = await userAchievement.destroy({
      transaction,
    });
    await transaction.commit();

    return destroyed;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

exports.updateAchievement = async (userId, achievementId, newData) => {
  const transaction = await database.transaction();

  try {
    const user = await userService.getUser(userId, transaction);

    if (!user) throw new ResourceNotFoundError("User not found");

    const achievement = await Achievement.findByPk(achievementId, {
      transaction,
    });

    if (!achievement) {
      throw new ResourceNotFoundError("Achievement not found");
    }

    const userAchievement = await UserAchievement.findOne(
      {
        where: {
          userId: user.id,
          achievementId: achievement.id,
        },
      },
      {
        transaction,
      }
    );

    if (!userAchievement)
      throw new ResourceNotFoundError("userAchievement not found");

    const updated = await userAchievement.update(
      {
        ...newData,
      },
      {
        transaction,
      }
    );

    await transaction.commit();

    return updated;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};
