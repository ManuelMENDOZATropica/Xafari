const xelfieService = require("../services/xelfieService");

exports.getXelfie = async (req, res) => {
  const id = req.params.id;
  const xelfie = await xelfieService.getXelfieById(id);

  res.json({
    xelfie: {
      name: xelfie.name,
      description: xelfie.description,
      familiar: xelfie.familiar,
      min_age: xelfie.min_age,
      max_age: xelfie.max_age,
    },
  });
};

exports.getAllXelfies = async (req, res) => {
  const xelfies = await xelfieService.getAllXelfies();
  res.json({
    xelfies: xelfies.map((xelfie) => xelfie.id),
  });
};

exports.deleteXelfie = async (req, res) => {
  const id = req.params.id;

  await xelfieService.deleteXelfie(id);

  res.json({
    xelfie: {
      id,
    },
  });
};

exports.addXelfie = async (req, res) => {
  const { name, description, familiar, min_age, max_age, casa_id } = req.body;

  const xelfie = await casaService.addXelfie(
    casa_id,
    name,
    description,
    familiar,
    min_age,
    max_age
  );

  res.json({
    xelfie: {
      id: xelfie.id,
    },
  });
};
