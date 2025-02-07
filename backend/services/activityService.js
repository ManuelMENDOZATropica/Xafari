const Activity = require("../models/activity");
const { UniqueConstraintError } = require("sequelize");

const guardianService = require("./guardianService")

exports.createActivity = async (name, description, guardianId) => {

  const guardian = guardianService.getGuardianById(guardianId)

  if(guardian) return null
  
  try {
    return await Activity.create({
      name,
      description,
    });
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      return null;
    }
  }
};

exports.getActivityById = async (id) => {
  return await Activity.findByPk(id);
};
