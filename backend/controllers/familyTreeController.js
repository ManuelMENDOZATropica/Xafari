const familyTreeService = require("../services/familyTreeService");
const userService = require("../services/userService");
const { ResourceNotFoundError, BadRequestError } = require("../utils/errors");

exports.createFamilyTree = async (req, res, next) => {
  const { adminId } = req.body;
  const admin = await userService.getUser(adminId);

  if (!admin) return next(new ResourceNotFoundError("Admin not found"));

  if (admin.familyTreeId != null)
    return next(new BadRequestError("User already belongs to a family tree"));
};

exports.getFamilyTree = async (req, res, next) => {
  res.status(501).json({ error: "Not implemented" });
};

exports.updateFamilyTree = async (req, res, next) => {
  res.status(501).json({ error: "Not implemented" });
};

exports.deleteFamilyTree = async (req, res, next) => {
  res.status(501).json({ error: "Not implemented" });
};
