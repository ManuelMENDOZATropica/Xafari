const database = require("../config/database");
const { UserXelfie } = require("../models");
const { ResourceNotFoundError } = require("../utils/errors");
const userService = require("./userService");
const xelfieService = require("./xelfieService");
const UserActivityService = require("./userActivityService");

exports.addXelfie = async (userId, xelfieId, xelfieUrl) => {
  const transaction = await database.transaction();

  try {
    const user = await userService.getUser(userId);
    if (!user) throw new ResourceNotFoundError("User not found");

    const xelfie = await xelfieService.getXelfie(xelfieId, transaction);

    if (!xelfie) {
      throw new ResourceNotFoundError("Xelfie not found");
    }

    const userXelfie = await UserXelfie.create(
      {
        userId: user.id,
        xelfieId: xelfie.id,
        xelfieUrl: xelfieUrl,
      },
      {
        transaction,
      }
    );

    if (!user.activities.find((a) => a.id == xelfie.activity.id)) {
      await UserActivityService.addActivity(
        user.id,
        xelfie.activity.id,
        transaction
      );
    }

    await transaction.commit();

    return userXelfie;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

exports.deleteXelfie = async (userId, xelfieId) => {
  const transaction = await database.transaction();

  try {
    const user = await userService.getUser(userId);
    if (!user) throw new ResourceNotFoundError("User not found");

    const xelfie = await xelfieService.getXelfie(xelfieId, transaction);

    if (!xelfie) {
      throw new ResourceNotFoundError("Xelfie not found");
    }

    const userXelfie = await UserXelfie.findOne(
      {
        where: {
          userId: user.id,
          xelfieId: xelfie.id,
        },
      },
      {
        transaction,
      }
    );

    if (!userXelfie) throw new ResourceNotFoundError("UserXelfie not found");

    const destroyed = await userXelfie.destroy({
      transaction,
    });
    await transaction.commit();

    return destroyed;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

exports.updateUserXelfie = async (userId, xelfieId, newData) => {
  const transaction = await database.transaction();

  try {
    const user = await userService.getUser(userId, transaction);

    if (!user) throw new ResourceNotFoundError("User not found");

    const xelfie = await Xelfie.findByPk(xelfieId, {
      transaction,
    });

    if (!xelfie) {
      throw new ResourceNotFoundError("Xelfie not found");
    }

    const userXelfie = await UserXelfie.findOne(
      {
        where: {
          userId: user.id,
          xelfieId: xelfie.id,
        },
      },
      {
        transaction,
      }
    );

    if (!userXelfie) throw new ResourceNotFoundError("UserXelfie not found");

    const updated = await userXelfie.update(
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
