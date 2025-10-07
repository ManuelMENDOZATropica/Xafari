exports.toFamilyTreeDTO = (tree) => {
  return {
    id: tree.id,
    adminId: tree.adminId,
    name: tree.name,
    members: tree.users.map((m) => m.id),
  };
};
