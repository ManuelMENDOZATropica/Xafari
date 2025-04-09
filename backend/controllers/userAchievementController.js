const { toUserAchievementDTO } = require("../dto/achievement.dto");
const userAchievementService = require("../services/userAchievementService");
const {
  BadRequestError,
  ResourceNotFoundError,
  handleSequelizeError,
} = require("../utils/errors");

exports.addAchievement = async (req, res, next) => {
  const { userId } = req.params;
  const { achievementId, amount } = req.body;

  try {
    const userAchievement = await userAchievementService.addAchievement(
      userId,
      achievementId,
      amount
    );
    if (!userAchievement) {
      return next(BadRequestError("Error adding achievement"));
    }

    res.json(toUserAchievementDTO(userAchievement));
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return next(err);
    }

    handleSequelizeError(err, "UserAchievement");
  }
};

exports.deleteAchievement = async (req, res, next) => {
  const { userId, achievementId } = req.params;

  try {
    const userAchievement = await userAchievementService.deleteAchievement(
      userId,
      achievementId
    );

    if (!userAchievement) {
      return next(BadRequestError("Error adding achievement"));
    }

    res.json(toUserAchievementDTO(userAchievement));
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return next(err);
    }

    handleSequelizeError(err, "UserAchievement");
  }
};

exports.updateAchievement = async (req, res, next) => {
  const { userId, achievementId } = req.params;

  try {
    const newUserAchievementData = {
      ...(req.body.amount ? { amount: req.body.amount } : {}),
      ...(req.body.completedAt ? { completedAt: req.body.completedAt } : {}),
    };

    const newUserAchievement = await userAchievementService.updateAchievement(
      userId,
      achievementId,
      newUserAchievementData
    );

    if (!newUserAchievement) {
      return next(new ResourceNotFoundError("UserAchievement not found"));
    }

    res.json(toUserAchievementDTO(newUserAchievement));
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return next(err);
    }
    next(handleSequelizeError(err, "UserAchievement"));
  }
};
