const Xecreto = require("../models/xecreto");
const { NotFoundError } = require("../utils/errors");

const casaService = require("../services/casaService");

exports.getXecretoById = async (id) => {
  if (!id) {
    throw new BadRequestError("Not enough args or wrong parameters");
  }

  const xecreto = await Xecreto.findByPk(id);
  if (!xecreto) {
    throw new NotFoundError("Xecreto not found");
  }
  return xecreto;
};

exports.addXecreto = async (
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
    const xecreto = await Xecreto.create({
      casa_id,
      name,
      description,
      familiar,
      min_age,
      max_age,
    });
    return xecreto;
  } catch (err) {
    if (err instanceof ForeignKeyConstraintError) {
      throw new NotFoundError("Casa not found");
    } else {
      throw err;
    }
  }
};

exports.deleteXecreto = async (id) => {
  const xecreto = await this.getXecretoById(id);
  return await xecreto.destroy();
};
