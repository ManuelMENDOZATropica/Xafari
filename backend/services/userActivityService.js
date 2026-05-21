const database = require("../config/database");
const { Activity, UserActivity } = require("../models");
const { ResourceNotFoundError } = require("../utils/errors");
const userService = require("./userService");

exports.addUserActivity = async (userId, activityId, trans) => {
  const transaction = trans || (await database.transaction());

  try {
    const user = await userService.getUser(userId);
    if (!user) throw new ResourceNotFoundError("User not found");

    const activity = await Activity.findByPk(activityId, {
      transaction,
    });

    if (!activity) {
      throw new ResourceNotFoundError("Activity not found");
    }

    const [userActivity, created] = await UserActivity.findOrCreate({
      where: { userId: user.id, activityId: activity.id },
      defaults: {
        userId: user.id,
        activityId: activity.id,
        completedAt: new Date(),
      },
      transaction,
    });

    if (!created && !userActivity.completedAt) {
      await userActivity.update({ completedAt: new Date() }, { transaction });
    }

    if (!trans) await transaction.commit();

    return userActivity;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

exports.deleteUserActivity = async (id, userId) => {
  const transaction = await database.transaction();

  try {
    if (userId) {
      const user = await userService.getUser(userId, transaction);
      if (!user) throw new ResourceNotFoundError("User not found");

      const activity = await Activity.findByPk(id, { transaction });
      if (!activity) throw new ResourceNotFoundError("Activity not found");
    }

    const whereClause = userId ? { userId, activityId: id } : { id };
    const userActivity = await UserActivity.findOne(
      {
        where: whereClause,
      },
      {
        transaction,
      }
    );

    if (!userActivity)
      throw new ResourceNotFoundError("UserActivity not found");

    const destroyed = await userActivity.destroy({
      transaction,
    });
    await transaction.commit();

    return destroyed;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

exports.getUserActivity = async (id) => {
  const userActivity = await UserActivity.findOne({
    where: {
      id,
    },
  });

  return userActivity;
};

exports.updateUserActivity = async (id, newData, userId) => {
  const transaction = await database.transaction();

  try {
    if (userId) {
      const user = await userService.getUser(userId, transaction);
      if (!user) throw new ResourceNotFoundError("User not found");

      const activity = await Activity.findByPk(id, { transaction });
      if (!activity) throw new ResourceNotFoundError("Activity not found");
    }

    const whereClause = userId ? { userId, activityId: id } : { id };
    const userActivity = await UserActivity.findOne(
      {
        where: whereClause,
      },
      {
        transaction,
      }
    );

    if (!userActivity)
      throw new ResourceNotFoundError("UserActivity not found");

    const updated = await userActivity.update(
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
