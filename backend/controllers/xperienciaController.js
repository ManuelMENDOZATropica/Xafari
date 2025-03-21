const xperienciaService = require("../services/xperienciaService");
const {
  handleSequelizeError,
  ResourceNotFoundError,
  ValidationError,
} = require("../utils/errors");

exports.createXperiencia = async (req, res, next) => {
  const { qrCode, isValidable, minAge, maxAge, ...activityParams } = req.body;

  if (!isNaN(minAge) && !isNaN(maxAge) && minAge >= maxAge) {
    return next(new ValidationError("Age limits are not valid"));
  }

  try {
    const xperiencia = await xperienciaService.createXperiencia({
      qrCode,
      isValidable,
      type: "Xperiencia",
      ...activityParams,
    });

    res.json({
      xperiencia: xperiencia.toJSON(),
    });
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

    res.json({
      xperiencia: xperiencia.toJSON(),
    });
  } catch (err) {
    next(handleSequelizeError(err, "Xperiencia"));
  }
};

exports.deleteXperiencia = async (req, res, next) => {
  const id = req.params.id;
  try {
    const xperiencia = await xperienciaService.deleteXperiencia(id);

    if (!xperiencia)
      return next(new ResourceNotFoundError("Xperiencia not found"));

    res.json({
      xperiencia: xperiencia.toJSON(),
    });
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

    if (
      !isNaN(newXperienciaData.minAge) &&
      !isNaN(newXperienciaData.maxAge) &&
      newXperienciaData.minAge >= newXperienciaData.maxAge
    ) {
      return next(new ValidationError("Age limits are not valid"));
    }

    const newXperiencia = await xperienciaService.updateXperiencia(
      id,
      newXperienciaData
    );

    if (!newXperiencia)
      return next(new ResourceNotFoundError("Xperiencia not found"));

    res.json({
      xperiencia: newXperiencia.toJSON(),
    });
  } catch (err) {
    next(handleSequelizeError(err, "Xperiencia"));
  }
};

// exports.getXperiencia = async (req, res) => {
//   const id = req.params.id;
//   const xperiencia = await xperienciaService.getXperienciaById(id);

//   res.json({
//     xperiencia: {
//       name: xperiencia.name,
//       description: xperiencia.description,
//       familiar: xperiencia.familiar,
//       min_age: xperiencia.min_age,
//       max_age: xperiencia.max_age,
//     },
//   });
// };

// exports.getAllXperiencias = async (req, res) => {
//   const xperiencias = await xperienciaService.getAllXperiencias();
//   res.json({
//     xperiencias: xperiencias.map((xperiencia) => xperiencia.id),
//   });
// };

// exports.deleteXperiencia = async (req, res) => {
//   const id = req.params.id;

//   await xperienciaService.deleteXperiencia(id);

//   res.json({
//     xperiencia: {
//       id: id,
//     },
//   });
// };

// exports.addXperiencia = async (req, res) => {
//   const { name, description, familiar, min_age, max_age, casa_id } = req.body;

//   const xperiencia = await casaService.addXperiencia(
//     casa_id,
//     name,
//     description,
//     familiar,
//     min_age,
//     max_age
//   );

//   res.json({
//     xperiencia: {
//       id: xperiencia.id,
//     },
//   });
// };
