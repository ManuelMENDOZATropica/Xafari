const Xperiencia = require("../models/xperiencia");
const { NotFoundError } = require("../utils/errors");

const casaService = require("../services/casaService");

exports.getXperienciaById = async (id) => {
  if (!id) {
    throw new BadRequestError("Not enough args or wrong parameters");
  }

  const xperiencia = await Xperiencia.findByPk(id);
  if (!xperiencia) {
    throw new NotFoundError("Xperiencia not found");
  }
  return xperiencia;
};

exports.addXperiencia = async (
  casa_id,
  name,
  description,
  familiar,
  min_age,
  max_age
) => {
  if (
    !name ||
    !description ||
    typeof familiar != "boolean" ||
    isNaN(min_age) ||
    isNaN(max_age)
  ) {
    throw new BadRequestError("Not enough args or wrong parameters");
  }

  try {
    const xperiencia = await Xperiencia.create({
      casa_id,
      name,
      description,
      familiar,
      min_age,
      max_age,
    });
    return xperiencia;
  } catch (err) {
    if (err instanceof ForeignKeyConstraintError) {
      throw new NotFoundError("Casa not found");
    } else {
      throw err;
    }
  }
};

exports.deleteXperiencia = async (id) => {
  const xperiencia = await this.getXperienciaById(id);
  return await xperiencia.destroy();
};
