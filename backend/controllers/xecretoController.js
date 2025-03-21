const xecretoService = require("../services/xecretoService");
const {
  handleSequelizeError,
  ResourceNotFoundError,
  ValidationError,
} = require("../utils/errors");

exports.createXecreto = async (req, res, next) => {
  const { clues, minAge, maxAge, ...activityParams } = req.body;

  if (!isNaN(minAge) && !isNaN(maxAge) && minAge >= maxAge) {
    return next(new ValidationError("Age limits are not valid"));
  }

  try {
    const xecreto = await xecretoService.createXecreto({
      clues: clues
        ? clues.map((clue, index) => ({ ...clue, order: index }))
        : [],
      type: "Xecreto",
      ...activityParams,
    });

    res.json({
      xecreto: xecreto.toJSON(),
    });
  } catch (err) {
    next(handleSequelizeError(err, "Xecreto"));
  }
};

exports.getXecreto = async (req, res, next) => {
  const id = req.params.id;
  try {
    const xecreto = await xecretoService.getXecreto(id);

    if (!xecreto) return next(new ResourceNotFoundError("Xecreto not found"));

    res.json({
      xecreto: xecreto.toJSON(),
    });
  } catch (err) {
    next(handleSequelizeError(err, "Xecreto"));
  }
};

exports.deleteXecreto = async (req, res, next) => {
  const id = req.params.id;
  try {
    const xecreto = await xecretoService.deleteXecreto(id);

    if (!xecreto) return next(new ResourceNotFoundError("Xecreto not found"));

    res.json({
      xecreto: xecreto.toJSON(),
    });
  } catch (err) {
    next(handleSequelizeError(err, "Xecreto"));
  }
};

exports.updateXecreto = async (req, res, next) => {
  const id = req.params.id;

  try {
    const newXecretoData = {
      ...(req.body.name ? { name: req.body.name } : {}),
      ...(req.body.description ? { description: req.body.description } : {}),
      ...(req.body.location ? { location: req.body.location } : {}),
      ...(req.body.type ? { type: req.body.type } : {}),
      ...(req.body.isActive ? { isActive: req.body.isActive } : {}),
      ...(req.body.minAge ? { minAge: req.body.minAge } : {}),
      ...(req.body.maxAge ? { maxAge: req.body.maxAge } : {}),
      ...(req.body.clues ? { qrCode: req.body.clues } : {}),
    };

    if (
      !isNaN(newXecretoData.minAge) &&
      !isNaN(newXecretoData.maxAge) &&
      newXecretoData.minAge >= newXecretoData.maxAge
    ) {
      return next(new ValidationError("Age limits are not valid"));
    }

    const newXecreto = await xecretoService.updateXecreto(id, newXecretoData);

    if (!newXecreto)
      return next(new ResourceNotFoundError("Xecreto not found"));

    res.json({
      xecreto: newXecreto.toJSON(),
    });
  } catch (err) {
    next(handleSequelizeError(err, "Xecreto"));
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
