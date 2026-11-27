const database = require("../config/database");
const { House, Activity, Achievement } = require("../models");
const { ResourceNotFoundError } = require("../utils/errors");

const include = [
  { model: Activity, attributes: ["id", "name", "type", "location"] },
  { model: Achievement, attributes: ["id", "name", "type", "imageUrl"] },
];

exports.get = (id, transaction) => House.findByPk(id, { include, transaction });
exports.list = () => House.findAll({ include, order: [["name", "ASC"]] });
exports.create = (data) => House.create(data);

exports.update = (id, data) =>
  database.transaction(async (transaction) => {
    const house = await House.findByPk(id, { transaction });
    if (!house) throw new ResourceNotFoundError("House not found");
    await house.update(data, { transaction });
    return exports.get(id, transaction);
  });

exports.remove = (id) =>
  database.transaction(async (transaction) => {
    const house = await House.findByPk(id, { transaction });
    if (!house) throw new ResourceNotFoundError("House not found");
    await house.destroy({ transaction });
    return house;
  });
