exports.toUserDTO = (user) => {
  return {
    id: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl,
    roomNumber: user.roomNumber,
  };
};
