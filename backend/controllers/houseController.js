const { toHouseDTO } = require("../dto/house.dto");
const houseService = require("../services/houseService");
const {
  handleSequelizeError,
  ResourceNotFoundError,
} = require("../utils/errors");
const logger = require("../utils/logger");

exports.createHouse = async (req, res, next) => {
  const { name, element, animal } = req.body;

  try {
    const house = await houseService.createHouse({
      name,
      element,
      animal,
    });

    res.status(200).json(toHouseDTO(house));
  } catch (err) {
    next(handleSequelizeError(err, "House"));
  }
};

exports.getHouse = async (req, res, next) => {
  const id = req.params.id;
  try {
    const house = await houseService.getHouse(id);

    if (!house) return next(new ResourceNotFoundError("House not found"));

    res.status(200).json(toHouseDTO(house));
  } catch (err) {
    logger.error(err);
    next(handleSequelizeError(err, "House"));
  }
};

exports.getAllHouses = async (req, res, next) => {
  try {
    const houses = await houseService.getAllHouses();

    res.status(200).json(houses.map((house) => toHouseDTO(house)));
  } catch (err) {
    logger.error(err);
    next(handleSequelizeError(err, "House"));
  }
};

exports.deleteHouse = async (req, res, next) => {
  const id = req.params.id;
  try {
    const house = await houseService.deleteHouse(id);

    if (!house) return next(new ResourceNotFoundError("House not found"));

    res.status(200).json(toHouseDTO(house));
  } catch (err) {
    next(handleSequelizeError(err, "House"));
  }
};

exports.updateHouse = async (req, res, next) => {
  const id = req.params.id;
  try {
    const newHouseData = {
      ...(req.body.name ? { name: req.body.name } : {}),
      ...(req.body.animal ? { animal: req.body.animal } : {}),
      ...(req.body.element ? { element: req.body.element } : {}),
    };

    const newHouse = await houseService.updateHouse(id, newHouseData);

    if (!newHouse) return next(new ResourceNotFoundError("House not found"));

    res.status(200).json(toHouseDTO(newHouse));
  } catch (err) {
    logger.error(err);
    next(handleSequelizeError(err, "House"));
  }
};
