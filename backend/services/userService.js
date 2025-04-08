const User = require("../models/user");

const {
  Activity,
  House,
  Achievement,
  Xecreto,
  Xelfie,
  Xperiencia,
  Event,
  FamilyTree,
  UserXelfie,
} = require("../models");

exports.createUser = async ({
  name,
  email,
  password,
  birthdate,
  reservationNumber,
}) => {
  const user = await User.create({
    name,
    email,
    password,
    birthdate,
    reservationNumber,
  });

  return user;
};

exports.getUser = async (id, transaction) => {
  let user = await User.findByPk(id, {
    include: [
      Achievement,
      FamilyTree,

      {
        model: Activity,
        include: [
          House,
          Xecreto,
          {
            model: Xelfie,
            include: [UserXelfie],
          },
          Xperiencia,
          Event,
        ],
      },
    ],
    transaction,
  });

  return user;
};

exports.deleteUser = async (id) => {
  const user = await this.getUser(id);

  if (user == null) return null;
  const destroyed = await user.destroy();
  return destroyed;
};

exports.updateUser = async (id, newData) => {
  const user = await this.getUser(id);

  if (user == null) return null;
  const updated = await user.update(newData);
  return updated;
};
