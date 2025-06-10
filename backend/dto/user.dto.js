exports.toUserDTO = (user) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    birthdate: user.birthdate,
    avatarUrl: user.avatarUrl,
  };
};
