const { toXecretoDTO } = require("../dto/xecreto..dto");
const xecretoService = require("../services/xecretoService");
const {
  handleSequelizeError,
  ResourceNotFoundError,
  ValidationError,
} = require("../utils/errors");

exports.createXecreto = async (req, res, next) => {
  const { clues, ...activityParams } = req.body;

  try {
    const xecreto = await xecretoService.createXecreto({
      clues: clues
        ? clues.map((clue, index) => ({ ...clue, order: index }))
        : [],
      type: "Xecreto",
      ...activityParams,
    });

    res.json(toXecretoDTO(xecreto));
  } catch (err) {
    next(handleSequelizeError(err, "Xecreto"));
  }
};

exports.getXecreto = async (req, res, next) => {
  const id = req.params.id;
  try {
    const xecreto = await xecretoService.getXecreto(id);

    if (!xecreto) return next(new ResourceNotFoundError("Xecreto not found"));

    res.json(toXecretoDTO(xecreto));
  } catch (err) {
    next(handleSequelizeError(err, "Xecreto"));
  }
};

exports.deleteXecreto = async (req, res, next) => {
  const id = req.params.id;
  try {
    const xecreto = await xecretoService.deleteXecreto(id);

    if (!xecreto) return next(new ResourceNotFoundError("Xecreto not found"));

    res.json(toXecretoDTO(xecreto));
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
      ...(req.body.clues
        ? {
            clues: req.body.clues.map((clue, index) => ({
              ...clue,
              order: index,
            })),
          }
        : {}),
    };

    const newXecreto = await xecretoService.updateXecreto(id, newXecretoData);

    if (!newXecreto)
      return next(new ResourceNotFoundError("Xecreto not found"));

    res.json(toXecretoDTO(newXecreto));
  } catch (err) {
    next(handleSequelizeError(err, "Xecreto"));
  }
};
