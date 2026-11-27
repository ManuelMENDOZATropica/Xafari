const service = require("../services/familyTreeService");
const { toFamilyTreeDTO } = require("../dto/familyTree.dto");
const { signFamilyInvite, verifyFamilyInvite } = require("../utils/tokens");
const { ResourceNotFoundError, ForbiddenError } = require("../utils/errors");

const send = (res, status, tree) => {
  const dto = toFamilyTreeDTO(tree);
  res.status(status).json({ familyTree: dto, ...dto });
};

exports.create = async (req, res) => send(res, 201, await service.create(req.user.id, req.body.name));

exports.get = async (req, res) => {
  service.assertMember(req.user, req.params.familyId);
  const tree = await service.getWithMembers(req.params.familyId);
  if (!tree) throw new ResourceNotFoundError("FamilyTree not found");
  send(res, 200, tree);
};

exports.invite = async (req, res) => {
  if (req.user.familyTreeId !== req.params.familyId) throw new ForbiddenError("No perteneces a esta familia");
  res.status(200).json(signFamilyInvite(req.params.familyId));
};

exports.join = async (req, res) => {
  let treeId;
  try {
    treeId = verifyFamilyInvite(req.body.inviteToken);
  } catch (_) {
    throw new ForbiddenError("invalid_invite");
  }
  send(res, 200, await service.join(req.user.id, treeId));
};

exports.leave = async (req, res) => res.status(200).json(await service.leave(req.user.id));

exports.rename = async (req, res) => send(res, 200, await service.rename(req.user, req.params.familyId, req.body.name));

exports.remove = async (req, res) => {
  const tree = await service.remove(req.user, req.params.familyId);
  res.status(200).json({ message: "Family tree deleted successfully", id: tree.id });
};
