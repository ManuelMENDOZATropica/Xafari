const userService = require("../services/userService");
const User = require("../models/user");
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
      avatar: avatar ? JSON.stringify(avatar) : null,
    });

    const userDTO = toUserDTO(user);
    res.status(200).json({
      token: `mock-token-${user.id}`,
      user: userDTO,
      ...userDTO
    });
  } catch (err) {
    next(handleSequelizeError(err, "User"));
  }
};

exports.getUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await userService.getUser(id);

    if (!user) return next(new ResourceNotFoundError("User not found"));

    const userDTO = toUserDTO(user);
    res.status(200).json({
      user: userDTO,
      ...userDTO
    });
  } catch (err) {
    next(handleSequelizeError(err, "User"));
  }
};

exports.deleteUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await userService.deleteUser(id);

    if (!user) return next(new ResourceNotFoundError("User not found"));

    const userDTO = toUserDTO(user);
    res.status(200).json({
      user: userDTO,
      ...userDTO
    });
  } catch (err) {
    next(handleSequelizeError(err, "User"));
  }
};

exports.updateUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const newUserData = {};
    if (req.body.name !== undefined) newUserData.name = req.body.name;
    if (req.body.lastname !== undefined) newUserData.lastname = req.body.lastname;
    if (req.body.email !== undefined) newUserData.email = req.body.email;
    if (req.body.password !== undefined) newUserData.password = req.body.password;
    if (req.body.birthdate !== undefined) newUserData.birthdate = req.body.birthdate;
    if (req.body.reservationNumber !== undefined) newUserData.reservationNumber = req.body.reservationNumber;
    if (req.body.pronouns !== undefined) newUserData.pronouns = req.body.pronouns;
    if (req.body.avatar !== undefined) {
      newUserData.avatar = typeof req.body.avatar === "object"
        ? JSON.stringify(req.body.avatar)
        : req.body.avatar;
    }

    const newUser = await userService.updateUser(id, newUserData);

    if (!newUser) return next(new ResourceNotFoundError("User not found"));

    const userDTO = toUserDTO(newUser);
    res.status(200).json({
      user: userDTO,
      ...userDTO
    });
  } catch (err) {
    next(handleSequelizeError(err, "User"));
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.scope("withPassword").findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const userDTO = toUserDTO(user);
    res.status(200).json({
      token: `mock-token-${user.id}`,
      user: userDTO,
      ...userDTO
    });
  } catch (err) {
    next(handleSequelizeError(err, "User"));
  }
};

exports.updateCurrentUser = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "No autorizado" });
  }

  try {
    const newUserData = {};
    if (req.body.name !== undefined) newUserData.name = req.body.name;
    if (req.body.lastname !== undefined) newUserData.lastname = req.body.lastname;
    if (req.body.email !== undefined) newUserData.email = req.body.email;
    if (req.body.password !== undefined) newUserData.password = req.body.password;
    if (req.body.birthdate !== undefined) newUserData.birthdate = req.body.birthdate;
    if (req.body.reservationNumber !== undefined) newUserData.reservationNumber = req.body.reservationNumber;
    if (req.body.pronouns !== undefined) newUserData.pronouns = req.body.pronouns;
    if (req.body.avatar !== undefined) {
      newUserData.avatar = typeof req.body.avatar === "object"
        ? JSON.stringify(req.body.avatar)
        : req.body.avatar;
    }

    const updatedUser = await userService.updateUser(req.user.id, newUserData);
    const userDTO = toUserDTO(updatedUser);
    res.status(200).json({
      ...userDTO,
      user: userDTO
    });
  } catch (err) {
    next(handleSequelizeError(err, "User"));
  }
};
