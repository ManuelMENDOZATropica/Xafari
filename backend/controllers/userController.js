const userService = require("../services/userService");
const {
  handleSequelizeError,
  ResourceNotFoundError,
} = require("../utils/errors");
const { toUserDTO } = require("../dto/user.dto");

exports.createUser = async (req, res, next) => {
  const {
    name,
    lastname,
    email,
    password,
    birthdate,
    reservationNumber,
    pronouns,
    avatar,
  } = req.body;

  try {
    const user = await userService.createUser({
      name,
      lastname,
      email,
      password,
      birthdate,
      reservationNumber,
      pronouns,
      avatar: JSON.stringify(avatar),
    });

    res.status(200).json(toUserDTO(user));
  } catch (err) {
    next(handleSequelizeError(err, "User"));
  }
};

exports.getUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await userService.getUser(id);

    if (!user) return next(new ResourceNotFoundError("User not found"));

    res.status(200).json(toUserDTO(user));
  } catch (err) {
    next(handleSequelizeError(err, "User"));
  }
};

exports.deleteUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await userService.deleteUser(id);

    if (!user) return next(new ResourceNotFoundError("User not found"));

    res.status(200).json(toUserDTO(user));
  } catch (err) {
    next(handleSequelizeError(err, "User"));
  }
};

exports.updateUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const newUserData = {
      ...(req.body.name ? { name: req.body.name } : {}),
      ...(req.body.email ? { email: req.body.email } : {}),
      ...(req.body.password ? { password: req.body.password } : {}),
      ...(req.body.birthdate ? { birthdate: req.body.birthdate } : {}),
      ...(req.body.reservationNumber
        ? { reservationNumber: req.body.reservationNumber }
        : {}),
    };

    const newUser = await userService.updateUser(id, newUserData);

    if (!newUser) return next(new ResourceNotFoundError("User not found"));

    res.status(200).json(toUserDTO(newUser));
  } catch (err) {
    next(handleSequelizeError(err, "User"));
  }
};
