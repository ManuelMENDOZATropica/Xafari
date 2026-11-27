exports.toFamilyTreeDTO = (tree) => {
  const { toMemberDTO } = require("./user.dto");
  const users = tree.users ? tree.users.map((u) => toMemberDTO(u)) : [];
  return {
    id: tree.id,
    name: tree.name,
    adminId: tree.admin,
    admin: tree.admin,
    members: users.map((u) => u.id),
    users,
  };
};
