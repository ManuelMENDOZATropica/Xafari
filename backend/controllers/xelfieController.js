const { toXelfieDTO } = require("../dto/xelfie.dto");
const xelfieService = require("../services/xelfieService");
const {
  handleSequelizeError,
  ResourceNotFoundError,
} = require("../utils/errors");

exports.createXelfie = async (req, res, next) => {
  const { ...activityParams } = req.body;

  try {
    const xelfie = await xelfieService.createXelfie({
      type: "Xelfie",
      ...activityParams,
    });

    res.status(200).json(toXelfieDTO(xelfie));
  } catch (err) {
    next(handleSequelizeError(err, "Xelfie"));
  }
};

exports.getXelfie = async (req, res, next) => {
  const id = req.params.id;
  try {
    const xelfie = await xelfieService.getXelfie(id);

    if (!xelfie) return next(new ResourceNotFoundError("Xelfie not found"));

    res.status(200).json(toXelfieDTO(xelfie));
  } catch (err) {
    next(handleSequelizeError(err, "Xelfie"));
  }
};

exports.getAllXelfies = async (req, res, next) => {
  try {
    const xelfies = await xelfieService.getAllXelfies();

    res.status(200).json(xelfies.map((xelfie) => toXelfieDTO(xelfie)));
  } catch (err) {
    logger.error(err);
    next(handleSequelizeError(err, "Xelfie"));
  }
};

exports.deleteXelfie = async (req, res, next) => {
  const id = req.params.id;
  try {
    const xelfie = await xelfieService.deleteXelfie(id);

    if (!xelfie) return next(new ResourceNotFoundError("Xelfie not found"));

    res.status(200).json(toXelfieDTO(xelfie));
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

    const newXelfie = await xelfieService.updateXelfie(id, newXelfieData);

    if (!newXelfie) return next(new ResourceNotFoundError("Xelfie not found"));

    res.status(200).json(toXelfieDTO(newXelfie));
  } catch (err) {
    next(handleSequelizeError(err, "Xelfie"));
  }
};
