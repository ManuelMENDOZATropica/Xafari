const { toUserActivityDTO } = require("../dto/activity.dto");
const userActivityService = require("../services/userActivityService");
const {
  BadRequestError,
  ResourceNotFoundError,
  handleSequelizeError,
} = require("../utils/errors");

exports.addUserActivity = async (req, res, next) => {
  const id = req.params.id;
  const { activityId } = req.body;

  try {
    const userActivity = await userActivityService.addUserActivity(
      id,
      activityId
    );
    if (!userActivity) {
      return next(BadRequestError("Error adding activity"));
    }

    res.status(200).json(toUserActivityDTO(userActivity));
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return next(err);
    }

    handleSequelizeError(err, "UserActivity");
  }
};

exports.getUserActivity = async (req, res, next) => {
  const id = req.params.id;
  try {
    const userActivity = await userActivityService.getUserActivity(id);

    if (!userActivity)
      return next(new ResourceNotFoundError("UserActivity not found"));

    res.status(200).json(toUserActivityDTO(userActivity));
  } catch (err) {
    logger.error(err);
    next(handleSequelizeError(err, "UserActivity"));
  }
};

exports.deleteUserActivity = async (req, res, next) => {
  const { id } = req.params;

  try {
    const userActivity = await userActivityService.deleteUserActivity(id);
    if (!userActivity) {
      return next(BadRequestError("Error adding activity"));
    }

    res.status(200).json(toUserActivityDTO(userActivity));
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return next(err);
    }

    handleSequelizeError(err, "UserActivity");
  }
};

exports.updateUserActivity = async (req, res, next) => {
  const { id } = req.params;

  try {
    const newUserActivityData = {
      ...(req.body.startedAt ? { startedAt: req.body.startedAt } : {}),
      ...(req.body.completedAt ? { completedAt: req.body.completedAt } : {}),
    };

    const newUserActivity = await userActivityService.updateUserActivity(
      id,
      newUserActivityData
    );

    if (!newUserActivity) {
      return next(new ResourceNotFoundError("UserActivity not found"));
    }

    res.status(200).json(toUserActivityDTO(newUserActivity));
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return next(err);
    }
    next(handleSequelizeError(err, "UserActivity"));
  }
};
