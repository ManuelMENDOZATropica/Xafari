const database = require("../config/database");
const { User, FamilyTree, Activity, Achievement, UserPreference } = require("../models");
const {
  ResourceNotFoundError,
  ResourceConflictError,
  AuthenticationError,
} = require("../utils/errors");

const MEMBER_ATTRIBUTES = ["id", "name", "casa", "avatar", "familyTreeId"];
const ACTIVITY_ATTRIBUTES = ["id", "name", "type", "location", "houseId"];

exports.findByEmail = (email, { withPassword = false, transaction } = {}) => {
  const model = withPassword ? User.scope("withPassword") : User;
  return model.findAll({
    where: database.where(
      database.fn("lower", database.col("email")),
      String(email).trim().toLowerCase()
    ),
    order: [["createdAt", "ASC"]],
    transaction,
  });
};

exports.createUser = async (data) => {
  const existing = await exports.findByEmail(data.email);
  if (existing.length) throw new ResourceConflictError("User already exists");
  return User.create(data);
};

/** Usuario con todo su progreso: solo para el propio usuario. */
exports.getUserWithProgress = (id, transaction) =>
  User.findByPk(id, {
    include: [
      {
        model: FamilyTree,
        include: [{ model: User, attributes: MEMBER_ATTRIBUTES }],
      },
      {
        model: Activity,
        as: "activities",
        attributes: ACTIVITY_ATTRIBUTES,
        through: { attributes: ["id", "startedAt", "completedAt"] },
      },
      {
        model: Activity,
        as: "preferredActivities",
        attributes: ["id", "name", "type"],
        through: { model: UserPreference, attributes: ["id", "rating", "comment", "isFavorite"] },
      },
      {
        model: Achievement,
        attributes: ["id", "name", "type", "imageUrl"],
        through: { attributes: ["amount", "completedAt"] },
      },
    ],
    transaction,
  });

exports.updateProfile = async (id, data) =>
  database.transaction(async (transaction) => {
    const user = await User.findByPk(id, { transaction, lock: transaction.LOCK.UPDATE });
    if (!user) throw new ResourceNotFoundError("User not found");
    await user.update(data, { transaction });
    return user;
  });

exports.changePassword = async (id, currentPassword, newPassword) =>
  database.transaction(async (transaction) => {
    const user = await User.scope("withPassword").findByPk(id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!user) throw new ResourceNotFoundError("User not found");
    if (!(await user.checkPassword(currentPassword))) {
      throw new AuthenticationError("Contraseña actual incorrecta");
    }
    user.password = newPassword; // el hook beforeSave la hashea
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    await user.save({ transaction });
    return user;
  });

exports.deleteUser = async (id) =>
  database.transaction(async (transaction) => {
    const familyTreeService = require("./familyTreeService");
    const user = await User.findByPk(id, { transaction });
    if (!user) throw new ResourceNotFoundError("User not found");
    // Si administra un árbol, se reasigna o se borra antes de eliminarlo.
    await familyTreeService.removeMember(user, transaction);
    await user.destroy({ transaction });
    return user;
  });
