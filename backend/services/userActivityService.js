const database = require("../config/database");
const { Activity, UserActivity } = require("../models");
const { ResourceNotFoundError } = require("../utils/errors");
const userService = require("./userService");

exports.addActivity = async (userId, activityId, trans) => {
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

    const userActivity = await UserActivity.create(
      {
        userId: user.id,
        activityId: activity.id,
      },
      {
        transaction,
      }
    );

    if (!trans) await transaction.commit();

    return userActivity;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

exports.deleteActivity = async (id, activityId) => {
  const transaction = await database.transaction();

  try {
    const user = await userService.getUser(id);
    if (!user) throw new ResourceNotFoundError("User not found");

    const activity = await Activity.findByPk(activityId, {
      transaction,
    });

    if (!activity) {
      throw new ResourceNotFoundError("Activity not found");
    }

    const userActivity = await UserActivity.findOne(
      {
        where: {
          userId: user.id,
          activityId: activity.id,
        },
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

exports.updateUserActivity = async (userId, activityId, newData) => {
  const transaction = await database.transaction();

  try {
    const user = await userService.getUser(userId, transaction);

    if (!user) throw new ResourceNotFoundError("User not found");

    const activity = await Activity.findByPk(activityId, {
      transaction,
    });

    if (!activity) {
      throw new ResourceNotFoundError("Activity not found");
    }

    const userActivity = await UserActivity.findOne(
      {
        where: {
          userId: user.id,
          activityId: activity.id,
        },
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
