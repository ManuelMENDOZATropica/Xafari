const { toUserPreferenceDTO } = require("../dto/preference.dto");
const {
  ResourceNotFoundError,
  handleSequelizeError,
} = require("../utils/errors");

const userPreferenceService = require("../services/userPreferenceService");

exports.addPreference = async (req, res, next) => {
  const { userId, activityId, rating, comment, isFavorite } = req.body;

  try {
    const userPreference = await userPreferenceService.addPreference({
      userId,
      activityId,
      rating,
      comment,
      isFavorite,
    });

    res.status(200).json(toUserPreferenceDTO(userPreference));
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return next(err);
    }

    handleSequelizeError(err, "UserPreference");
  }
};

exports.deletePreference = async (req, res, next) => {
  const { id } = req.params;

  try {
    const userPreference = await userPreferenceService.deletePreference(id);

    if (!userPreference) {
      return next(BadRequestError("Error adding preference"));
    }

    res.status(200).json(toUserPreferenceDTO(userPreference));
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return next(err);
    }

    handleSequelizeError(err, "UserPreference");
  }
};

exports.updatePreference = async (req, res, next) => {
  const { id } = req.params;

  try {
    const newUserPreferenceData = {
      ...(req.body.activityId ? { activityId: req.body.activityId } : {}),
      ...(req.body.rating ? { rating: req.body.rating } : {}),
      ...(req.body.comment ? { comment: req.body.comment } : {}),
      ...(req.body.isFavorite ? { isFavorite: req.body.isFavorite } : {}),
    };

    const newUserPreference = await userPreferenceService.updatePreference(
      id,
      newUserPreferenceData
    );

    if (!newUser)
      return next(new ResourceNotFoundError("User Preference not found"));

    res.status(200).json(toUserPreferenceDTO(newUserPreference));
  } catch (err) {
    handleSequelizeError(err, "UserPreference");
  }
};
