const House = require("../models/house");

const { Activity, Achievement } = require("../models");

exports.createHouse = async ({ name, element, animal }) => {
  const house = await House.create({
    name,
    element,
    animal,
  });

  return house;
};

exports.getHouse = async (id) => {
  const house = await House.findByPk(id, {
    include: [Activity, Achievement],
  });

  return house;
};

exports.getAllHouses = async () => {
  const houses = await House.findAll({
    include: [Activity, Achievement],
  });

  return houses;
};

exports.deleteHouse = async (id) => {
  const house = await this.getHouse(id);

  if (house == null) throw new ResourceNotFoundError("Resource not found");

  const destroyed = await house.destroy();

  return destroyed;
};

exports.updateHouse = async (id, newData) => {
  const house = await this.getHouse(id);

  if (house == null) throw new ResourceNotFoundError("Resource not found");
  const updated = await house.update(newData);

  return updated;
};
