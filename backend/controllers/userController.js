const userService = require("../services/userService");
const {
  handleSequelizeError,
  ResourceNotFoundError,
} = require("../utils/errors");

exports.createUser = async (req, res, next) => {
  const { name, email, password, age, reservationNumber } = req.body;

  try {
    const user = await userService.createUser({
      name,
      email,
      password,
      age,
      reservationNumber,
    });

    res.json({
      user: user.dataValues,
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

    res.json({
      user: user.dataValues,
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

    res.json({
      user: user.dataValues,
    });
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
      ...(req.body.age ? { age: req.body.age } : {}),
      ...(req.body.reservationNumber
        ? { reservationNumber: req.body.reservationNumber }
        : {}),
    };

    const newUser = await userService.updateUser(id, newUserData);

    if (!newUser) return next(new ResourceNotFoundError("User not found"));

    res.json({
      user: newUser.dataValues,
    });
  } catch (err) {
    next(handleSequelizeError(err, "User"));
  }
};

// exports.getAllCasas = async (req, res) => {
//   const id = req.params.id;
//   const casas = await userService.getAllCasas(id);

//   res.json({
//     user: {
//       id: id,
//       casas: casas.map((casa) => casa.id),
//     },
//   });
// };

// exports.getAllXecretos = async (req, res) => {
//   const id = req.params.id;
//   const xecretos = await userService.getAllXecretos(id);

//   res.json({
//     user: {
//       id: id,
//       xecretos: xecretos.map((xecreto) => xecreto.id),
//     },
//   });
// };

// exports.getAllXelfies = async (req, res) => {
//   const id = req.params.id;
//   const xelfies = await userService.getAllXelfies(id);

//   res.json({
//     user: {
//       id: id,
//       xelfies: xelfies.map((xelfie) => xelfie.id),
//     },
//   });
// };

// exports.getAllXperiencias = async (req, res) => {
//   const id = req.params.id;
//   const xperiencias = await userService.getAllXperiencias(id);

//   res.json({
//     user: {
//       id: id,
//       xperiencias: xperiencias.map((xperiencia) => xperiencia.id),
//     },
//   });
// };

// exports.addXecreto = async (req, res) => {
//   const id = req.params.id;

//   const xecreto_id = req.body.id;
//   const xecreto_url = req.body.url;

//   await userService.addXecreto(id, xecreto_id, xecreto_url);

//   res.json({
//     user: {
//       id: id,
//       xecreto: xecreto_id,
//     },
//   });
// };

// exports.addXelfie = async (req, res) => {
//   const id = req.params.id;

//   const xelfie_id = req.body.id;
//   const xelfie_url = req.body.url;

//   await userService.addXelfie(id, xelfie_id, xelfie_url);

//   res.json({
//     user: {
//       id: id,
//       xelfie: xelfie_id,
//     },
//   });
// };

// exports.addXperiencia = async (req, res) => {
//   const id = req.params.id;

//   const xperiencia_id = req.body.id;
//   const xperiencia_url = req.body.url;

//   await userService.addXperiencia(id, xperiencia_id, xperiencia_url);

//   res.json({
//     user: {
//       id: id,
//       xperiencia: xperiencia_id,
//     },
//   });
// };

// exports.addUser = async (req, res) => {
//   const name = req.body.name;
//   const age = parseInt(Number(req.body.age));
//   const num_brazalete = parseInt(Number(req.body.num_brazalete));
//   const qr_iptv = req.body.qr_iptv;

//   const user = await userService.addUser(name, age, num_brazalete, qr_iptv);
//   res.json({
//     user: {
//       id: user.id,
//       name: user.name,
//       age: user.age,
//       num_brazalete: user.num_brazalete,
//       qr_iptv: user.qr_iptv,
//     },
//   });
// };

// exports.deleteUser = async (req, res) => {
//   const id = req.params.id;

//   await userService.deleteUser(id);
//   res.json({
//     user: {
//       id: id,
//     },
//   });
// };
