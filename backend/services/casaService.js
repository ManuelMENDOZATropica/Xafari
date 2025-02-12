const Casa = require("../models/casa");
const { NotFoundError } = require("../utils/errors");

const Xecreto = require("../models/xecreto");
const Xelfie = require("../models/xelfie");
const Xperiencia = require("../models/xperiencia");

const XecretoService = require("./xecretoService");
const XelfieService = require("./xelfieService");
const XperienciaService = require("./xperienciaService");

exports.getCasaById = async (id, include = []) => {
  if (!id) {
    throw new BadRequestError("Not enough args or wrong parameters");
  }

  const casa = await Casa.findByPk(id, {
    include,
  });
  if (!casa) {
    throw new NotFoundError("Casa not found");
  }
  return casa;
};

exports.addCasa = async (name, elemento, animal) => {
  if (!name || !elemento || !animal) {
    throw new BadRequestError("Not enough args or wrong parameters");
  }

  return await Casa.create({
    name,
    elemento,
    animal,
  });
};

exports.addXecreto = async (
  id,
  name,
  description,
  familiar,
  min_age,
  max_age
) => {
  return await XecretoService.addXecreto(
    id,
    name,
    description,
    familiar,
    min_age,
    max_age
  );
};

exports.addXelfie = async (
  id,
  name,
  description,
  familiar,
  min_age,
  max_age
) => {
  return await XelfieService.addXelfie(
    id,
    name,
    description,
    familiar,
    min_age,
    max_age
  );
};

exports.addXperiencia = async (
  id,
  name,
  description,
  familiar,
  min_age,
  max_age
) => {
  return await XperienciaService.addXperiencia(
    id,
    name,
    description,
    familiar,
    min_age,
    max_age
  );
};

exports.deleteCasa = async (id) => {
  const casa = await this.getCasaById(id);
  return await casa.destroy();
};

exports.getAll = async () => {
  return await Casa.findAll();
};

exports.getAllXecretos = async (casa_id) => {
  const casa = await this.getCasaById(
    casa_id,
    (include = [
      {
        model: Xecreto,
      },
    ])
  );

  return casa.xecretos;
};

exports.getAllXelfies = async (casa_id) => {
  const casa = await this.getCasaById(
    casa_id,
    (include = [
      {
        model: Xelfie,
      },
    ])
  );

  return casa.xelfies;
};

exports.getAllXperiencias = async (casa_id) => {
  const casa = await this.getCasaById(
    casa_id,
    (include = [
      {
        model: Xperiencia,
      },
    ])
  );

  return casa.xperiencia;
};
