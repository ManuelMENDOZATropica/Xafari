const Insignia = require("../models/insignia");
const { NotFoundError } = require("../utils/errors");

const casaService = require("../services/casaService");

exports.getInsigniaById = async (id) => {
  const insignia = await Insignia.findByPk(id);
  if (!insignia) {
    throw new NotFoundError("Insignia not found");
  }
  return insignia;
};

exports.addInsignia = async (casa_id, name, description) => {
  const casa = await casaService.getCasaById(casa_id);

  return await Insignia.create({
    casa_id: casa.id,
    name,
    description,
  });
};

exports.deleteInsignia = async (id) => {
    const insignia = await this.getInsigniaById(id);
    return await insignia.destroy();
  };