const xelfieService = require("../services/xelfieService");
const {
  handleSequelizeError,
  ResourceNotFoundError,
  ValidationError,
} = require("../utils/errors");

exports.createXelfie = async (req, res, next) => {
  const { minAge, maxAge, ...activityParams } = req.body;

  if (!isNaN(minAge) && !isNaN(maxAge) && minAge >= maxAge) {
    return next(new ValidationError("Age limits are not valid"));
  }

  try {
    const xelfie = await xelfieService.createXelfie({
      type: "Xelfie",
      ...activityParams,
    });
    res.json({
      xelfie: xelfie.toJSON(),
    });
  } catch (err) {
    next(handleSequelizeError(err, "Xelfie"));
  }
};

exports.getXelfie = async (req, res, next) => {
  const id = req.params.id;
  try {
    const xelfie = await xelfieService.getXelfie(id);

    if (!xelfie) return next(new ResourceNotFoundError("Xelfie not found"));

    res.json({
      xelfie: xelfie.toJSON(),
    });
  } catch (err) {
    next(handleSequelizeError(err, "Xelfie"));
  }
};

exports.deleteXelfie = async (req, res, next) => {
  const id = req.params.id;
  try {
    const xelfie = await xelfieService.deleteXelfie(id);

    if (!xelfie) return next(new ResourceNotFoundError("Xelfie not found"));

    res.json({
      xelfie: xelfie.toJSON(),
    });
  } catch (err) {
    next(handleSequelizeError(err, "Xelfie"));
  }
};

exports.updateXelfie = async (req, res, next) => {
  const id = req.params.id;

  try {
    const newXelfieData = {
      ...(req.body.name ? { name: req.body.name } : {}),
      ...(req.body.description ? { description: req.body.description } : {}),
      ...(req.body.location ? { location: req.body.location } : {}),
      ...(req.body.type ? { type: req.body.type } : {}),
      ...(req.body.isActive ? { isActive: req.body.isActive } : {}),
      ...(req.body.minAge ? { minAge: req.body.minAge } : {}),
      ...(req.body.maxAge ? { maxAge: req.body.maxAge } : {}),
    };

    if (
      !isNaN(newXelfieData.minAge) &&
      !isNaN(newXelfieData.maxAge) &&
      newXelfieData.minAge >= newXelfieData.maxAge
    ) {
      return next(new ValidationError("Age limits are not valid"));
    }

    const newXelfie = await xelfieService.updateXelfie(id, newXelfieData);

    if (!newXelfie) return next(new ResourceNotFoundError("Xelfie not found"));

    res.json({
      xelfie: newXelfie.toJSON(),
    });
  } catch (err) {
    next(handleSequelizeError(err, "Xelfie"));
  }
};
