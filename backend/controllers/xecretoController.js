const xecretoService = require("../services/xecretoService");

exports.getXecreto = async (req, res) => {
  const id = req.params.id;
  const xecreto = await xecretoService.getXecretoById(id);

  res.json({
    xecreto: {
      name: xecreto.name,
      description: xecreto.description,
      familiar: xecreto.familiar,
      min_age: xecreto.min_age,
      max_age: xecreto.max_age,
    },
  });
};

exports.getAllXecretos = async (req, res) => {
  const xecretos = await xecretoService.getAllXecretos();
  res.json({
    xecretos: xecretos.map((xecreto) => xecreto.id),
  });
};

exports.deleteXecreto = async (req, res) => {
  const id = req.params.id;

  await xecretoService.deleteXecreto(id);

  res.json({
    xecreto: {
      id: id,
    },
  });
};

exports.addXecreto = async (req, res) => {
  const { name, description, familiar, min_age, max_age, casa_id } = req.body;

  const xecreto = await casaService.addXecreto(
    casa_id,
    name,
    description,
    familiar,
    min_age,
    max_age
  );

  res.json({
    xecreto: {
      id: xecreto.id,
    },
  });
};
