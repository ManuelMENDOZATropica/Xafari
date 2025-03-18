const userService = require("../services/userService");

exports.getUser = async (req, res) => {
  const id = req.params.id;
  const user = await userService.getUserById(id);

  res.json({
    user: {
      name: user.name,
      age: user.age,
      num_brazalete: user.num_brazalete,
      qr_iptv: user.qr_iptv,
    },
  });
};

exports.getAllCasas = async (req, res) => {
  const id = req.params.id;
  const casas = await userService.getAllCasas(id);

  res.json({
    user: {
      id: id,
      casas: casas.map((casa) => casa.id),
    },
  });
};

exports.getAllXecretos = async (req, res) => {
  const id = req.params.id;
  const xecretos = await userService.getAllXecretos(id);

  res.json({
    user: {
      id: id,
      xecretos: xecretos.map((xecreto) => xecreto.id),
    },
  });
};

exports.getAllXelfies = async (req, res) => {
  const id = req.params.id;
  const xelfies = await userService.getAllXelfies(id);

  res.json({
    user: {
      id: id,
      xelfies: xelfies.map((xelfie) => xelfie.id),
    },
  });
};

exports.getAllXperiencias = async (req, res) => {
  const id = req.params.id;
  const xperiencias = await userService.getAllXperiencias(id);

  res.json({
    user: {
      id: id,
      xperiencias: xperiencias.map((xperiencia) => xperiencia.id),
    },
  });
};

exports.addXecreto = async (req, res) => {
  const id = req.params.id;

  const xecreto_id = req.body.id;
  const xecreto_url = req.body.url;

  await userService.addXecreto(id, xecreto_id, xecreto_url);

  res.json({
    user: {
      id: id,
      xecreto: xecreto_id,
    },
  });
};

exports.addXelfie = async (req, res) => {
  const id = req.params.id;

  const xelfie_id = req.body.id;
  const xelfie_url = req.body.url;

  await userService.addXelfie(id, xelfie_id, xelfie_url);

  res.json({
    user: {
      id: id,
      xelfie: xelfie_id,
    },
  });
};

exports.addXperiencia = async (req, res) => {
  const id = req.params.id;

  const xperiencia_id = req.body.id;
  const xperiencia_url = req.body.url;

  await userService.addXperiencia(id, xperiencia_id, xperiencia_url);

  res.json({
    user: {
      id: id,
      xperiencia: xperiencia_id,
    },
  });
};

exports.addUser = async (req, res) => {
  const name = req.body.name;
  const age = parseInt(Number(req.body.age));
  const num_brazalete = parseInt(Number(req.body.num_brazalete));
  const qr_iptv = req.body.qr_iptv;

  const user = await userService.addUser(name, age, num_brazalete, qr_iptv);
  res.json({
    user: {
      id: user.id,
      name: user.name,
      age: user.age,
      num_brazalete: user.num_brazalete,
      qr_iptv: user.qr_iptv,
    },
  });
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;

  await userService.deleteUser(id);
  res.json({
    user: {
      id: id,
    },
  });
};
