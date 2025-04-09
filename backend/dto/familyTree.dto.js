exports.toFamilyTreeDTO = (tree) => {
  return {
    id: tree.id,
    adminId: tree.adminId.toString(),
    members: tree.members.map((m) => ({
      userId: m.userId.toString(),
      progress: m.progress,
    })),
  };
};
