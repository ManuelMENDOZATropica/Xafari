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

exports.deleteUserActivity = async (id) => {
  const transaction = await database.transaction();

  try {
    const userActivity = await UserActivity.findOne(
      {
        where: {
          id,
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

exports.getUserActivity = async (id) => {
  const userActivity = await UserActivity.findOne({
    where: {
      id,
    },
  });

  return userActivity;
};

exports.updateUserActivity = async (id, newData) => {
  const transaction = await database.transaction();

  try {
    const userActivity = await UserActivity.findOne(
      {
        where: {
          id,
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
