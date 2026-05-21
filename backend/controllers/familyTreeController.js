const familyTreeService = require("../services/familyTreeService");
const userService = require("../services/userService");
const { ResourceNotFoundError, BadRequestError } = require("../utils/errors");
const { toFamilyTreeDTO } = require("../dto/familyTree.dto");

exports.createFamilyTree = async (req, res, next) => {
  const { adminId, name, members } = req.body;
  try {
    const admin = await userService.getUser(adminId);

    if (!admin) return next(new ResourceNotFoundError("Admin not found"));

    if (admin.familyTreeId != null)
      return next(new BadRequestError("User already belongs to a family tree"));

    const familyTree = await familyTreeService.createFamilyTree({
      name,
      admin,
      members,
    });

    const familyTreeDTO = toFamilyTreeDTO(familyTree);
    res.status(201).json({
      familyTree: familyTreeDTO,
      ...familyTreeDTO
    });
  } catch (err) {
    next(err);
  }
};

exports.getFamilyTree = async (req, res, next) => {
  const { familyId } = req.params;
  try {
    const familyTree = await familyTreeService.getFamilyTree(familyId);
    if (!familyTree) {
      return next(new ResourceNotFoundError("FamilyTree not found"));
    }
    const familyTreeDTO = toFamilyTreeDTO(familyTree);
    res.status(200).json({
      familyTree: familyTreeDTO,
      ...familyTreeDTO
    });
  } catch (err) {
    next(err);
  }
};

exports.updateFamilyTree = async (req, res, next) => {
  const { familyId } = req.params;
  try {
    const familyTree = await familyTreeService.updateFamilyTree(familyId, req.body);
    if (!familyTree) {
      return next(new ResourceNotFoundError("FamilyTree not found"));
    }
    const familyTreeDTO = toFamilyTreeDTO(familyTree);
    res.status(200).json({
      familyTree: familyTreeDTO,
      ...familyTreeDTO
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteFamilyTree = async (req, res, next) => {
  const { familyId } = req.params;
  try {
    const familyTree = await familyTreeService.deleteFamilyTree(familyId);
    if (!familyTree) {
      return next(new ResourceNotFoundError("FamilyTree not found"));
    }
    const familyTreeDTO = toFamilyTreeDTO(familyTree);
    res.status(200).json({
      message: "Family tree deleted successfully",
      familyTree: familyTreeDTO,
      ...familyTreeDTO
    });
  } catch (err) {
    next(err);
  }
};

exports.joinFamilyTree = async (req, res, next) => {
  const { familyId } = req.params;
  const { userId } = req.body;
  try {
    if (!userId) return next(new BadRequestError("userId is required"));
    const familyTree = await familyTreeService.joinFamilyTree(familyId, userId);
    const dto = toFamilyTreeDTO(familyTree);
    res.status(200).json({ familyTree: dto, ...dto });
  } catch (err) {
    next(err);
  }
};

exports.leaveFamilyTree = async (req, res, next) => {
  const { userId } = req.body;
  try {
    if (!userId) return next(new BadRequestError("userId is required"));
    const result = await familyTreeService.leaveFamilyTree(userId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
