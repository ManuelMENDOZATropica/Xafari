const { toXperienciaDTO } = require("../dto/xperiencia.dto");
const xperienciaService = require("../services/xperienciaService");
const {
  handleSequelizeError,
  ResourceNotFoundError,
} = require("../utils/errors");

exports.createXperiencia = async (req, res, next) => {
  const { qrCode, isValidable, ...activityParams } = req.body;

  try {
    const xperiencia = await xperienciaService.createXperiencia({
      qrCode,
      isValidable,
      type: "Xperiencia",
      ...activityParams,
    });

    res.status(200).json(toXperienciaDTO(xperiencia));
  } catch (err) {
    next(handleSequelizeError(err, "Xperiencia"));
  }
};

exports.getXperiencia = async (req, res, next) => {
  const id = req.params.id;
  try {
    const xperiencia = await xperienciaService.getXperiencia(id);

    if (!xperiencia)
      return next(new ResourceNotFoundError("Xperiencia not found"));

    res.status(200).json(toXperienciaDTO(xperiencia));
  } catch (err) {
    next(handleSequelizeError(err, "Xperiencia"));
  }
};

exports.getAllXperiencias = async (req, res, next) => {
  try {
    const xperiencias = await xperienciaService.getAllXperiencias();

    res
      .status(200)
      .json(xperiencias.map((xperiencia) => toXperienciaDTO(xperiencia)));
  } catch (err) {
    logger.error(err);
    next(handleSequelizeError(err, "Xperiencia"));
  }
};

exports.deleteXperiencia = async (req, res, next) => {
  const id = req.params.id;
  try {
    const xperiencia = await xperienciaService.deleteXperiencia(id);

    if (!xperiencia)
      return next(new ResourceNotFoundError("Xperiencia not found"));

    res.status(200).json(toXperienciaDTO(xperiencia));
  } catch (err) {
    next(handleSequelizeError(err, "Xperiencia"));
  }
};

exports.updateXperiencia = async (req, res, next) => {
  const id = req.params.id;

  try {
    const newXperienciaData = {
      ...(req.body.name ? { name: req.body.name } : {}),
      ...(req.body.description ? { description: req.body.description } : {}),
      ...(req.body.location ? { location: req.body.location } : {}),
      ...(req.body.type ? { type: req.body.type } : {}),
      ...(req.body.isActive ? { isActive: req.body.isActive } : {}),
      ...(req.body.minAge ? { minAge: req.body.minAge } : {}),
      ...(req.body.maxAge ? { maxAge: req.body.maxAge } : {}),
      ...(req.body.qrCode ? { qrCode: req.body.qrCode } : {}),
      ...(req.body.isValidable ? { isValidable: req.body.isValidable } : {}),
    };

    const newXperiencia = await xperienciaService.updateXperiencia(
      id,
      newXperienciaData
    );

    if (!newXperiencia)
      return next(new ResourceNotFoundError("Xperiencia not found"));

    res.status(200).json(toXperienciaDTO(newXperiencia));
  } catch (err) {
    next(handleSequelizeError(err, "Xperiencia"));
  }
};
