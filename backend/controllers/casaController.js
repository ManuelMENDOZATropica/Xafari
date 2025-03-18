const casaService = require("../services/casaService");

exports.getCasa = async (req, res) => {
  const id = req.params.id;
  const casa = await casaService.getUserById(id);

  res.json({
    casa: {
      name: casa.name,
      elemento: casa.elemento,
      animal: casa.animal,
    },
  });
};

exports.getAllCasas = async (req, res) => {
  const id = req.params.id;
  const casas = await casaService.getAll();

  res.json({
    casas: casas.mp((casa) => casa.id),
  });
};

exports.getAllXecretos = async (req, res) => {
  const id = req.params.id;
  const xecretos = await casaService.getAllXecretos();

  res.json({
    casa: {
      id: id,
      xecretos: xecretos.map((xecreto) => xecreto.id),
    },
  });
};

exports.getAllXelfies = async (req, res) => {
  const id = req.params.id;
  const xelfies = await casaService.getAllXelfies(id);

  res.json({
    user: {
      id: id,
      xelfies: xelfies.map((xelfie) => xelfie.id),
    },
  });
};

exports.getAllXperiencias = async (req, res) => {
  const id = req.params.id;
  const xperiencias = await casaService.getAllXperiencias(id);

  res.json({
    user: {
      id: id,
      xperiencias: xperiencias.map((xperiencia) => xperiencia.id),
    },
  });
};

exports.addCasa = async (req, res) => {
  const id = req.params.id;

  const casa = await casaService.getCasaById(id);

  res.json({
    casa: {
      name: casa.name,
      elemento: casa.elemento,
      animal: casa.animal,
    },
  });
};

exports.addXecreto = async (req, res) => {
  const id = req.params.id;

  const { name, description, familiar, min_age, max_age } = req.body;

  const xecreto = await casaService.addXecreto(
    id,
    name,
    description,
    familiar,
    min_age,
    max_age
  );

  res.json({
    casa: {
      id: casa.id,
      xecreto: xecreto.id,
    },
  });
};

exports.addXelfie = async (req, res) => {
  const id = req.params.id;

  const { name, description, familiar, min_age, max_age } = req.body;

  const xelfie = await casaService.addXelfie(
    id,
    name,
    description,
    familiar,
    min_age,
    max_age
  );

  res.json({
    casa: {
      id: casa.id,
      xelfie: xelfie.id,
    },
  });
};

exports.addXperiencia = async (req, res) => {
  const id = req.params.id;

  const { name, description, familiar, min_age, max_age } = req.body;

  const xperiencia = await casaService.addXperiencia(
    id,
    name,
    description,
    familiar,
    min_age,
    max_age
  );

  res.json({
    casa: {
      id: casa.id,
      xperiencia: xperiencia.id,
    },
  });
};

exports.deleteCasa = async (req, res) => {
  const id = req.params.id;

  await casaService.deleteCasa(id);

  res.json({
    casa: {
      id: id,
    },
  });
};
