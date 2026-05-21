const { User, FamilyTree, Activity, Achievement, Xelfie } = require("../models");
const { ResourceNotFoundError } = require("../utils/errors");

exports.createUser = async ({
  name,
  lastname,
  email,
  password,
  birthdate,
  reservationNumber,
  pronouns,
  casa,
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
    casa,
    avatar,
  });

  return user;
};

exports.getUser = async (id, transaction) => {
  let user = await User.findByPk(id, {
    include: [
      {
        model: FamilyTree,
        include: [User],
      },
      {
        model: Activity,
        as: "activities",
        include: [Xelfie],
      },
      {
        model: Achievement,
      },
    ],
    transaction,
  });

  return user;
};

exports.deleteUser = async (id) => {
  const user = await exports.getUser(id);

  if (user == null) throw new ResourceNotFoundError("User not found");
  const destroyed = await user.destroy();
  return destroyed;
};

exports.updateUser = async (id, newData) => {
  const user = await exports.getUser(id);

  if (user == null) throw new ResourceNotFoundError("User not found");
  const updated = await user.update(newData);
  return updated;
};
