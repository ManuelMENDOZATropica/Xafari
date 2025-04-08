const { toFamilyTreeDTO } = require("../dto/familyTree.dto");
const familyTreeService = require("../services/familyTreeService");
const userService = require("../services/userService");
const {
  ResourceNotFoundError,
  BadRequestError,
  handleSequelizeError,
} = require("../utils/errors");

exports.createFamilyTree = async (req, res, next) => {
  const { adminId, name, members } = req.body;

  try {
    const admin = await userService.getUser(adminId);

    if (!admin) return next(new ResourceNotFoundError("Admin not found"));

    if (admin.familyTree != null)
      return next(new BadRequestError("User already belongs to a family tree"));

    const familyTree = await familyTreeService.createFamilyTree({
      name,
      admin,
      members,
    });

    res.json(toFamilyTreeDTO(familyTree));
  } catch (err) {
    if (err instanceof BadRequestError) {
      return next(err);
    }
    next(handleSequelizeError(err, "FamilyTree"));
  }
};

exports.getFamilyTree = async (req, res, next) => {
  const id = req.params.id;

  try {
    const familyTree = await familyTreeService.getFamilyTree(id);

    if (!familyTree)
      return next(new ResourceNotFoundError("FamilyTree not found"));

    res.json(toFamilyTreeDTO(familyTree));
  } catch (err) {
    next(handleSequelizeError(err, "FamilyTree"));
  }
};

exports.deleteFamilyTree = async (req, res, next) => {
  const id = req.params.id;

  try {
    const familyTree = await familyTreeService.deleteFamilyTree(id);

    if (!familyTree)
      return next(new ResourceNotFoundError("FamilyTree not found"));

    res.json(toFamilyTreeDTO(familyTree));
  } catch (err) {
    next(handleSequelizeError(err, "FamilyTree"));
  }
};

exports.updateFamilyTree = async (req, res, next) => {
  const id = req.params.id;

  try {
    const newFamilyData = {
      ...(req.body.adminId ? { adminId: req.body.adminId } : {}),
      ...(req.body.name ? { name: req.body.name } : {}),
      ...(req.body.members ? { members: req.body.members } : {}),
    };

    const newFamilyTree = await familyTreeService.updateFamilyTree(
      id,
      newFamilyData
    );

    if (!newFamilyTree)
      return next(new ResourceNotFoundError("FamilyTree not found"));

    res.json(toFamilyTreeDTO(newFamilyTree));
  } catch (err) {
    if (
      err instanceof BadRequestError ||
      err instanceof ResourceNotFoundError
    ) {
      return next(err);
    }
    next(handleSequelizeError(err, "FamilyTree"));
  }
};
