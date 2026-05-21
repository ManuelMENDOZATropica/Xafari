const database = require("../config/database");

const FamilyTree = require("../models/familyTree");
const User = require("../models/user");
const { ResourceNotFoundError, BadRequestError } = require("../utils/errors");

const Sequelize = require("sequelize");

exports.createFamilyTree = async ({ name, admin, members }) => {
  const transaction = await database.transaction();

  try {
    const familyTree = await FamilyTree.create(
      {
        name,
        admin: admin.id,
      },
      {
        transaction,
      }
    );

    const updatedAdmin = await admin.setFamilyTree(familyTree, {
      transaction,
    });

    await updatedAdmin.reload({
      include: [FamilyTree],
      transaction,
    });

    if (members) {
      const memberIds = members.filter((m) => m != admin.id);

      const users = await User.findAll({
        where: { id: memberIds, familyTreeId: null },
        transaction,
      });

      if (users.length != members.filter((m) => m != admin.id).length) {
        throw new BadRequestError(
          "Some users not found or belong to other families"
        );
      }

      if (users.length > 5) {
        throw new BadRequestError("Family cannot exceed 6 members");
      }

      await User.update(
        {
          familyTreeId: familyTree.id,
        },
        {
          where: { id: memberIds },
          transaction,
        }
      );
    }

    await transaction.commit();

    return await FamilyTree.findByPk(familyTree.id, {
      include: [User],
    });
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

exports.getFamilyTree = async (id, transaction) => {
  const familyTree = await FamilyTree.findByPk(id, {
    include: [User],
    transaction,
  });

  return familyTree;
};

exports.deleteFamilyTree = async (id) => {
  const familyTree = await this.getFamilyTree(id);

  if (familyTree == null) throw new ResourceNotFoundError("FamilyTree not found");
  const destroyed = await familyTree.destroy();
  return destroyed;
};

exports.updateFamilyTree = async (id, newData) => {
  const transaction = await database.transaction();

  try {
    const familyTree = await this.getFamilyTree(id, transaction);

    if (!familyTree) {
      throw new ResourceNotFoundError("FamilyTree not found");
    }

    // Update basic info
    await familyTree.update(newData, { transaction });

    if (newData.adminId && newData.adminId !== familyTree.admin) {
      const newAdmin = await User.findByPk(newData.adminId, {
        include: [FamilyTree],
        transaction,
      });

      if (!newAdmin)
        throw new ResourceNotFoundError("New admin user not found");
      if (newAdmin.familyTreeId !== familyTree.id) {
        throw new BadRequestError("New admin must be a family member");
      }

      await familyTree.update({ admin: newAdmin.id }, { transaction });
    }

    // Handle member updates if provided
    if (newData.members) {
      const enforcedMembers = [
        ...new Set([
          familyTree.admin, // Always include admin
          ...newData.members, // Plus requested members
        ]),
      ];

      if (enforcedMembers.length > 6) {
        throw new BadRequestError("Family cannot exceed 6 members");
      }

      // Verify all members exist and are available
      const existingUsers = await User.findAll({
        where: {
          id: enforcedMembers,
          [Sequelize.Op.or]: [
            { familyTreeId: null },
            { familyTreeId: id }, // already in this family
          ],
        },
        transaction,
      });

      if (existingUsers.length !== enforcedMembers.length) {
        throw new BadRequestError(
          "Some users not found or belong to other families"
        );
      }

      const currentMemberIds = familyTree.users.map((u) => u.id);
      const membersToAdd = enforcedMembers.filter(
        (id) => !currentMemberIds.includes(id)
      );
      const membersToRemove = currentMemberIds.filter(
        (id) => id !== familyTree.adminId && !enforcedMembers.includes(id)
      );

      if (membersToAdd.length > 0) {
        await User.update(
          { familyTreeId: id },
          { where: { id: membersToAdd }, transaction }
        );
      }

      if (membersToRemove.length > 0) {
        await User.update(
          { familyTreeId: null },
          { where: { id: membersToRemove }, transaction }
        );
      }
    }

    const updatedFamily = await this.getFamilyTree(id, transaction);

    await transaction.commit();

    return updatedFamily;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};
exports.joinFamilyTree = async (familyId, userId) => {
  const transaction = await database.transaction();
  try {
    const familyTree = await FamilyTree.findByPk(familyId, {
      include: [User],
      transaction,
    });
    if (!familyTree) throw new ResourceNotFoundError("FamilyTree not found");

    const user = await User.findByPk(userId, { transaction });
    if (!user) throw new ResourceNotFoundError("User not found");

    // Leave current family if any
    if (user.familyTreeId && user.familyTreeId !== familyId) {
      await user.update({ familyTreeId: null }, { transaction });
    }

    if (user.familyTreeId === familyId) {
      // Already a member — no-op
      await transaction.commit();
      return await FamilyTree.findByPk(familyId, { include: [User] });
    }

    if (familyTree.users.length >= 6) {
      throw new BadRequestError("Family is full (max 6 members)");
    }

    await user.update({ familyTreeId: familyId }, { transaction });
    await transaction.commit();
    return await FamilyTree.findByPk(familyId, { include: [User] });
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

exports.leaveFamilyTree = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new ResourceNotFoundError("User not found");
  if (!user.familyTreeId) throw new BadRequestError("User is not in a family");
  await user.update({ familyTreeId: null });
  return { message: "Left family successfully" };
};
