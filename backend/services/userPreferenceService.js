const database = require("../config/database");

const userService = require("./userService");
const { Activity, UserPreference } = require("../models");

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

    const userPreference = await UserPreference.create(
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
  const user = await exports.getUser(id);

  if (user == null) throw new ResourceNotFoundError("Resource not found");
  const updated = await UserPreference.update(newData);
  return updated;
};
