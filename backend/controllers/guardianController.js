const guardianService = require("../services/guardianService");

exports.createGuardian = async (req, res) => {
  const name = req.params.name;
  const description = req.params.description;

  if (!name || !description) {
    res
      .status(400)
      .json({ message: "Not enough parameters or bad parameters" });
  } else {
    const guardianId = await guardianService.createGuardian(name, description);

    if (guardianId === null) {
      res.status(409).json({ message: "Guardian already registered" });
    } else {
      res.status(200).json({ guardian: { id: guardianId } });
    }
  }
};

exports.getGuardian = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    res
      .status(400)
      .json({ message: "Not enough parameters or bad parameters" });
  } else {
    const guardian = await guardianService.getGuardianById(id);

    if (guardian === null) {
      res.status(404).json({ message: "Guardian not found" });
    } else {
      res.json({ guardian });
    }
  }
};

exports.deleteGuardian = async (req, res) => {};
