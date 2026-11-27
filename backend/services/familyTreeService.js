const { Op } = require("sequelize");
const database = require("../config/database");
const { FamilyTree, User, Activity } = require("../models");
const {
  ResourceNotFoundError,
  ResourceConflictError,
  ForbiddenError,
  BadRequestError,
} = require("../utils/errors");

const MAX_MEMBERS = 6;
const MEMBER_ATTRIBUTES = ["id", "name", "casa", "avatar", "familyTreeId", "createdAt"];

/** Árbol con sus miembros y el progreso de cada uno (sin datos sensibles). */
exports.getWithMembers = (id, transaction) =>
  FamilyTree.findByPk(id, {
    include: [
      {
        model: User,
        attributes: MEMBER_ATTRIBUTES,
        include: [
          {
            model: Activity,
            as: "activities",
            attributes: ["id", "name", "type", "location", "houseId"],
            through: { attributes: ["id", "startedAt", "completedAt"] },
          },
        ],
      },
    ],
    order: [[User, "createdAt", "ASC"]],
    transaction,
  });

/**
 * Saca al usuario de su árbol y libera la administración que tenga:
 * si era admin se reasigna al miembro más antiguo; si el árbol queda vacío, se borra.
 * También limpia árboles "huérfanos" donde sigue como admin sin ser miembro (bug anterior).
 */
exports.removeMember = async (user, transaction) => {
  const trees = await FamilyTree.findAll({
    where: {
      [Op.or]: [{ admin: user.id }, ...(user.familyTreeId ? [{ id: user.familyTreeId }] : [])],
    },
    transaction,
    lock: transaction.LOCK.UPDATE,
  });

  if (user.familyTreeId) {
    await User.update({ familyTreeId: null }, { where: { id: user.id }, transaction });
    user.familyTreeId = null;
  }

  for (const tree of trees) {
    if (tree.admin !== user.id) continue;
    const next = await User.findOne({
      where: { familyTreeId: tree.id, id: { [Op.ne]: user.id } },
      order: [["createdAt", "ASC"]],
      attributes: ["id"],
      transaction,
    });
    if (next) await tree.update({ admin: next.id }, { transaction });
    else await tree.destroy({ transaction });
  }
};

exports.create = (userId, name) =>
  database.transaction(async (transaction) => {
    const user = await User.findByPk(userId, { attributes: ["id", "familyTreeId"], transaction, lock: transaction.LOCK.UPDATE });
    if (!user) throw new ResourceNotFoundError("User not found");
    if (user.familyTreeId) throw new ResourceConflictError("User already belongs to a family tree");
    // Libera administraciones colgadas de versiones anteriores.
    await exports.removeMember(user, transaction);
    const tree = await FamilyTree.create({ name, admin: user.id }, { transaction });
    await User.update({ familyTreeId: tree.id }, { where: { id: user.id }, transaction });
    return exports.getWithMembers(tree.id, transaction);
  });

exports.assertMember = (user, treeId) => {
  if (user.role === "admin") return;
  if (user.familyTreeId !== treeId) throw new ForbiddenError("No perteneces a esta familia");
};

exports.join = (userId, treeId) =>
  database.transaction(async (transaction) => {
    // Lock del árbol: serializa uniones simultáneas para respetar el máximo.
    const tree = await FamilyTree.findByPk(treeId, { transaction, lock: transaction.LOCK.UPDATE });
    if (!tree) throw new ResourceNotFoundError("FamilyTree not found");

    const user = await User.findByPk(userId, { attributes: ["id", "familyTreeId"], transaction, lock: transaction.LOCK.UPDATE });
    if (!user) throw new ResourceNotFoundError("User not found");
    if (user.familyTreeId === tree.id) return exports.getWithMembers(tree.id, transaction);

    const count = await User.count({ where: { familyTreeId: tree.id }, transaction });
    if (count >= MAX_MEMBERS) throw new ResourceConflictError(`Family is full (max ${MAX_MEMBERS} members)`);

    // Si estaba en otra familia, sale (con reasignación de admin).
    await exports.removeMember(user, transaction);
    await User.update({ familyTreeId: tree.id }, { where: { id: user.id }, transaction });
    return exports.getWithMembers(tree.id, transaction);
  });

exports.leave = (userId) =>
  database.transaction(async (transaction) => {
    const user = await User.findByPk(userId, { attributes: ["id", "familyTreeId"], transaction, lock: transaction.LOCK.UPDATE });
    if (!user) throw new ResourceNotFoundError("User not found");
    if (!user.familyTreeId) throw new BadRequestError("User is not in a family");
    await exports.removeMember(user, transaction);
    return { message: "Left family successfully" };
  });

exports.rename = (user, treeId, name) =>
  database.transaction(async (transaction) => {
    const tree = await FamilyTree.findByPk(treeId, { transaction, lock: transaction.LOCK.UPDATE });
    if (!tree) throw new ResourceNotFoundError("FamilyTree not found");
    if (tree.admin !== user.id && user.role !== "admin") throw new ForbiddenError("Solo el admin de la familia");
    await tree.update({ name }, { transaction });
    return exports.getWithMembers(tree.id, transaction);
  });

exports.remove = (user, treeId) =>
  database.transaction(async (transaction) => {
    const tree = await FamilyTree.findByPk(treeId, { transaction, lock: transaction.LOCK.UPDATE });
    if (!tree) throw new ResourceNotFoundError("FamilyTree not found");
    if (tree.admin !== user.id && user.role !== "admin") throw new ForbiddenError("Solo el admin de la familia");
    await User.update({ familyTreeId: null }, { where: { familyTreeId: tree.id }, transaction });
    await tree.destroy({ transaction });
    return tree;
  });

exports.MAX_MEMBERS = MAX_MEMBERS;
