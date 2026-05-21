const userService = require("../services/userService");
const User = require("../models/user");
const {
  handleSequelizeError,
  ResourceNotFoundError,
} = require("../utils/errors");
const { toUserDTO } = require("../dto/user.dto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "xafari-dev-secret-change-in-prod";
const BCRYPT_ROUNDS = 10;

function signToken(userId) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });
}

exports.createUser = async (req, res, next) => {
  const {
    name,
    lastname,
    email,
    password,
    birthdate,
    reservationNumber,
    pronouns,
    casa,
    avatar,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = await userService.createUser({
      name,
      lastname,
      email,
      password: hashedPassword,
      birthdate,
      reservationNumber,
      pronouns,
      casa,
      avatar: avatar ? JSON.stringify(avatar) : null,
    });

    const userDTO = toUserDTO(user);
    res.status(200).json({
      token: signToken(user.id),
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
    if (req.body.casa !== undefined) newUserData.casa = req.body.casa;
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

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const userDTO = toUserDTO(user);
    res.status(200).json({
      token: signToken(user.id),
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
    if (req.body.casa !== undefined) newUserData.casa = req.body.casa;
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
