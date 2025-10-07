const database = require("../config/database");

const Achievement = require("../models/achievement");
const Activity = require("../models/activity");
const House = require("../models/house");
const { ResourceNotFoundError } = require("../utils/errors");

exports.createAchievement = async ({
  name,
  description,
  type,
  imageUrl,
  activityId,
  houseId,
}) => {
  const transaction = await database.transaction();

  try {
    const activity = await Activity.findByPk(activityId, { transaction });

    if (!activity) {
      throw new ResourceNotFoundError("Activity not found");
    }

    const house = await House.findByPk(houseId, { transaction });

    if (!house) {
      throw new ResourceNotFoundError("House not found");
    }

    const achievement = await Achievement.create(
      {
        name,
        description,
        type,
        imageUrl,
      },
      {
        transaction,
      }
    );

    await achievement.setHouse(house, { transaction });
    await achievement.setActivity(activity, { transaction });

    await transaction.commit();

    return achievement;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

exports.getAchievement = async (id, transaction) => {
  let achievement = await Achievement.findByPk(id, {
    include: [Activity, House],
    transaction,
  });
  return achievement;
};

exports.getAllAchievements = async () => {
  const achievements = await Achievement.findAll({
    include: [Activity, House],
  });

  return achievements;
};

exports.deleteAchievement = async (id) => {
  const achievement = await this.getAchievement(id);

  if (achievement == null)
    throw new ResourceNotFoundError("Resource not found");

  const destroyed = await achievement.destroy();
  return destroyed;
};

exports.updateAchievement = async (id, newData) => {
  const transaction = await database.transaction();

  try {
    const achievement = await this.getAchievement(id, transaction);

    if (!achievement) {
      throw new ResourceNotFoundError("Achievement not found");
    }

    await achievement.update(newData, {
      transaction,
    });

    if (newData.houseId && newData.houseId != achievement.house.id) {
      const newHouse = await House.findByPk(newData.houseId);

      if (!newHouse) {
        throw new ResourceNotFoundError("New house not found");
      }

      await achievement.update(
        {
          house: newHouse,
        },
        {
          transaction,
        }
      );
    }

    if (newData.activityId && newData.activityId != achievement.activity.id) {
      const newActivity = await Activity.findByPk(newData.activityId);

      if (!newActivity) {
        throw new ResourceNotFoundError("New activity not found");
      }

      await achievement.update(
        {
          activity: newActivity,
        },
        {
          transaction,
        }
      );
    }

    const updatedAchievement = await this.getAchievement(id, transaction);

    await transaction.commit();

    return updatedAchievement;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};
