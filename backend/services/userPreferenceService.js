const database = require("../config/database");

const userService = require("./userService");
const { Activity, UserPreference } = require("../models");
const { ResourceNotFoundError } = require("../utils/errors");

exports.addPreference = async (
  { userId, activityId, isFavorite, comment, rating },
  trans
) => {
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

    let userPreference = await UserPreference.findOne({
      where: { userID: user.id, activityId: activity.id },
      transaction,
    });

    if (userPreference) {
      await userPreference.update(
        {
          isFavorite,
          comment,
          rating,
        },
        {
          transaction,
        }
      );
    } else {
      userPreference = await UserPreference.create(
        {
          userID: user.id,
          activityId: activity.id,
          isFavorite,
          comment,
          rating,
        },
        {
          transaction,
        }
      );
    }

    if (!trans) await transaction.commit();

    return userPreference;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

exports.deletePreference = async (id) => {
  const transaction = await database.transaction();

  try {
    const userPreference = await UserPreference.findByPk(id, {
      transaction,
    });

    if (!userPreference)
      throw new ResourceNotFoundError("UserPreference not found");

    const destroyed = await userPreference.destroy({
      transaction,
    });
    await transaction.commit();

    return destroyed;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

exports.updatePreference = async (id, newData) => {
  const transaction = await database.transaction();

  try {
    const userPreference = await UserPreference.findByPk(id, {
      transaction,
    });

    if (!userPreference)
      throw new ResourceNotFoundError("UserPreference not found");

    const updated = await userPreference.update(newData, {
      transaction,
    });
    await transaction.commit();

    return updated;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};
