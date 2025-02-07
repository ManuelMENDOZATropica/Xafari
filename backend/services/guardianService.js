const Guardian = require("../models/guardian");
const { UniqueConstraintError } = require("sequelize");

exports.createGuardian = async (name, description) => {
  try {
    return await Guardian.create({
      name,
      description,
    });
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      return null;
    }
  }
};

exports.getGuardianById = async (id) => {
  return await Guardian.findByPk(id);
};
