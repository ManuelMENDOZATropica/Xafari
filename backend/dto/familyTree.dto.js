exports.toFamilyTreeDTO = (tree) => {
  const { toUserDTO } = require("./user.dto");
  return {
    id: tree.id,
    adminId: tree.admin || tree.adminId,
    admin: tree.admin || tree.adminId,
    name: tree.name,
    members: tree.users ? tree.users.map((m) => m.id) : [],
    users: tree.users ? tree.users.map((u) => toUserDTO(u)) : [],
  };
};
