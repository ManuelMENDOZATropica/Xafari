const { toUserActivityDTO } = require("../dto/activity.dto");
const userActivityService = require("../services/userActivityService");
const {
  BadRequestError,
  ResourceNotFoundError,
  handleSequelizeError,
} = require("../utils/errors");

exports.addActivity = async (req, res, next) => {
  const id = req.params.id;
  const { activityId } = req.body;

  try {
    const userActivity = await userActivityService.addActivity(id, activityId);
    if (!userActivity) {
      return next(BadRequestError("Error adding activity"));
    }

    res.json(toUserActivityDTO(userActivity));
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return next(err);
    }

    handleSequelizeError(err, "UserActivity");
  }
};

exports.deleteActivity = async (req, res, next) => {
  const { id, activityId } = req.params;

  try {
    const userActivity = await userActivityService.deleteActivity(
      id,
      activityId
    );
    if (!userActivity) {
      return next(BadRequestError("Error adding activity"));
    }

    res.json(toUserActivityDTO(userActivity));
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return next(err);
    }

    handleSequelizeError(err, "UserActivity");
  }
};

exports.updateActivity = async (req, res, next) => {
  const { id, activityId } = req.params;

  try {
    const newUserActivityData = {
      ...(req.body.startedAt ? { startedAt: req.body.startedAt } : {}),
      ...(req.body.completedAt ? { completedAt: req.body.completedAt } : {}),
    };

    const newUserActivity = await userActivityService.updateUserActivity(
      id,
      activityId,
      newUserActivityData
    );

    if (!newUserActivity) {
      return next(new ResourceNotFoundError("UserActivity not found"));
    }

    res.json(toUserActivityDTO(newUserActivity));
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return next(err);
    }
    next(handleSequelizeError(err, "UserActivity"));
  }
};
