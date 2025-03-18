const Xelfie = require("../models/xelfie");
const { NotFoundError } = require("../utils/errors");
const { ForeignKeyConstraintError } = require("sequelize");
const casaService = require("../services/casaService");

exports.getXelfieById = async (id) => {
  if (!id) {
    throw new BadRequestError("Not enough args or wrong parameters");
  }

  const xelfie = await Xelfie.findByPk(id);
  if (!xelfie) {
    throw new NotFoundError("Xelfie not found");
  }
  return xelfie;
};

exports.addXelfie = async (
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
    const xelfie = await Xelfie.create({
      casa_id,
      name,
      description,
      familiar,
      min_age,
      max_age,
    });
    return xelfie;
  } catch (err) {
    if (err instanceof ForeignKeyConstraintError) {
      throw new NotFoundError("Casa not found");
    } else {
      throw err;
    }
  }
};

exports.deleteXelfie = async (id) => {
  const xelfie = await this.getXelfieById(id);
  return await xelfie.destroy();
};
