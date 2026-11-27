const database = require("../config/database");
const { Achievement, Activity, House } = require("../models");
const { ResourceNotFoundError } = require("../utils/errors");

async function assertRefs({ activityId, houseId }, transaction) {
  if (activityId !== undefined && !(await Activity.findByPk(activityId, { attributes: ["id"], transaction }))) {
    throw new ResourceNotFoundError("Activity not found");
  }
  if (houseId !== undefined && !(await House.findByPk(houseId, { attributes: ["id"], transaction }))) {
    throw new ResourceNotFoundError("House not found");
  }
}

exports.get = (id, transaction) => Achievement.findByPk(id, { transaction });
exports.list = () => Achievement.findAll({ order: [["createdAt", "ASC"]] });

exports.create = (data) =>
  database.transaction(async (transaction) => {
    await assertRefs(data, transaction);
    return Achievement.create(data, { transaction });
  });

exports.update = (id, data) =>
  database.transaction(async (transaction) => {
    const a = await Achievement.findByPk(id, { transaction });
    if (!a) throw new ResourceNotFoundError("Achievement not found");
    await assertRefs(data, transaction);
    await a.update(data, { transaction });
    return a;
  });

exports.remove = (id) =>
  database.transaction(async (transaction) => {
    const a = await Achievement.findByPk(id, { transaction });
    if (!a) throw new ResourceNotFoundError("Achievement not found");
    await a.destroy({ transaction });
    return a;
  });
