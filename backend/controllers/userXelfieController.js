const userXelfieService = require("../services/userXelfieService");
const { toUserXelfieDTO } = require("../dto/xelfie.dto");

const {
  BadRequestError,
  ResourceNotFoundError,
  handleSequelizeError,
} = require("../utils/errors");

exports.addXelfie = async (req, res, next) => {
  const { userId } = req.params;
  const { xelfieId, xelfieUrl } = req.body;

  try {
    const userXelfie = await userXelfieService.addXelfie(
      userId,
      xelfieId,
      xelfieUrl
    );
    if (!userXelfie) {
      return next(BadRequestError("Error adding xelfie"));
    }

    res.json(toUserXelfieDTO(userXelfie));
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return next(err);
    }

    handleSequelizeError(err, "UserXelfie");
  }
};

exports.deleteXelfie = async (req, res, next) => {
  const { userId, xelfieId } = req.params;

  try {
    const userXelfie = await userXelfieService.deleteXelfie(userId, xelfieId);
    if (!userXelfie) {
      return next(BadRequestError("Error adding xelfie"));
    }

    res.json(toUserXelfieDTO(userXelfie));
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return next(err);
    }

    handleSequelizeError(err, "UserXelfie");
  }
};

exports.updateXelfie = async (req, res, next) => {
  const { userId, xelfieId } = req.params;

  try {
    const newUserXelfieData = {
      ...(req.body.xelfieUrl ? { xelfieUrl: req.body.xelfieUrl } : {}),
    };

    const newUserXelfie = await userXelfieService.updateUserXelfie(
      userId,
      xelfieId,
      newUserXelfieData
    );

    if (!newUserXelfie) {
      return next(new ResourceNotFoundError("UserXelfie not found"));
    }

    res.json(toUserXelfieDTO(newUserXelfie));
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return next(err);
    }
    next(handleSequelizeError(err, "UserXelfie"));
  }
};
