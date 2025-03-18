const xperienciaService = require("../services/xperienciaService")

exports.getXperiencia = async (req, res) => {
  const id = req.params.id;
  const xperiencia = await xperienciaService.getXperienciaById(id);

  res.json({
    xperiencia: {
      name: xperiencia.name,
      description: xperiencia.description,
      familiar: xperiencia.familiar,
      min_age: xperiencia.min_age,
      max_age: xperiencia.max_age,
    },
  });
};

exports.getAllXperiencias = async (req, res) => {
  const xperiencias = await xperienciaService.getAllXperiencias();
  res.json({
    xperiencias: xperiencias.map((xperiencia) => xperiencia.id),
  });
};

exports.deleteXperiencia = async (req, res) => {
  const id = req.params.id;

  await xperienciaService.deleteXperiencia(id);

  res.json({
    xperiencia: {
      id: id,
    },
  });
};

exports.addXperiencia = async (req, res) => {
  const { name, description, familiar, min_age, max_age, casa_id } = req.body;

  const xperiencia = await casaService.addXperiencia(
    casa_id,
    name,
    description,
    familiar,
    min_age,
    max_age
  );

  res.json({
    xperiencia: {
      id: xperiencia.id,
    },
  });
};
