const {
  handleSequelizeError,
  ResourceNotFoundError,
} = require("../utils/errors");
const achievementService = require("../services/achievementService");
const { toAchievementDTO } = require("../dto/achievement.dto");

exports.createAchievement = async (req, res, next) => {
  const { name, description, type, imageUrl, activityId, houseId } = req.body;

  try {
    const achievement = await achievementService.createAchievement({
      name,
      description,
      type,
      imageUrl,
      activityId,
      houseId,
    });

    res.status(200).json(toAchievementDTO(achievement));
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return next(err);
    }
    next(handleSequelizeError(err, "Event"));
  }
};

exports.getAchievement = async (req, res, next) => {
  const id = req.params.id;

  try {
    const achievement = await achievementService.getAchievement(id);

    if (!achievement)
      return next(new ResourceNotFoundError("Achievement not found"));

    res.status(200).json(toAchievementDTO(achievement));
  } catch (err) {
    next(handleSequelizeError(err, "Achievement"));
  }
};

exports.getAllAchievements = async (req, res, next) => {
  try {
    const achievements = await achievementService.getAllAchievements();

    res
      .status(200)
      .json(achievements.map((achievement) => toAchievementDTO(achievement)));
  } catch (err) {
    logger.error(err);
    next(handleSequelizeError(err, "Achievement"));
  }
};

exports.deleteAchievement = async (req, res, next) => {
  const id = req.params.id;
  try {
    const achievement = await achievementService.deleteAchievement(id);

    if (!achievement)
      return next(new ResourceNotFoundError("Achievement not found"));

    res.status(200).json(toAchievementDTO(achievement));
  } catch (err) {
    next(handleSequelizeError(err, "Achievement"));
  }
};

exports.updateAchievement = async (req, res, next) => {
  const id = req.params.id;

  try {
    const newAchievementData = {
      ...(req.body.name ? { name: req.body.name } : {}),
      ...(req.body.description ? { description: req.body.description } : {}),
      ...(req.body.type ? { type: req.body.type } : {}),
      ...(req.body.imageUrl ? { imageUrl: req.body.imageUrl } : {}),
      ...(req.body.activityId ? { activityId: req.body.activityId } : {}),
      ...(req.body.houseId ? { houseId: req.body.houseId } : {}),
    };

    const newAchievement = await achievementService.updateAchievement(
      id,
      newAchievementData
    );

    if (!newAchievement)
      return next(new ResourceNotFoundError("Achievement not found"));

    res.status(200).json(toAchievementDTO(newAchievement));
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return next(err);
    }
    next(handleSequelizeError(err, "Achievement"));
  }
};
