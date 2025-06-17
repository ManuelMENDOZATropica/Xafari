const User = require("../models/user");

exports.createUser = async ({
  name,
  lastname,
  email,
  password,
  birthdate,
  reservationNumber,
  pronouns,
  avatar
}) => {
  const user = await User.create({
    name,
    lastname,
    email,
    password,
    birthdate,
    reservationNumber,
    pronouns,
    avatar,
  });

  return user;
};

exports.getUser = async (id, transaction) => {
  let user = await User.findByPk(id, {
    transaction,
  });

  return user;
};

exports.deleteUser = async (id) => {
  const user = await exports.getUser(id);

  if (user == null) throw new ResourceNotFoundError("Resource not found");
  const destroyed = await user.destroy();
  return destroyed;
};

exports.updateUser = async (id, newData) => {
  const user = await exports.getUser(id);

  if (user == null) throw new ResourceNotFoundError("Resource not found");
  const updated = await user.update(newData);
  return updated;
};
