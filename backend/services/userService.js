const User = require("../models/user");

const {
  Activity,
  House,
  Achievement,
  Xecreto,
  Xelfie,
  Xperiencia,
  Event,
} = require("../models");

exports.createUser = async ({
  name,
  email,
  password,
  age,
  reservationNumber,
}) => {
  const user = await User.create({
    name,
    email,
    password,
    age,
    reservationNumber,
  });

  return user;
};

exports.getUser = async (id) => {
  let user = await User.findByPk(id, {
    include: [
      Achievement,
      {
        model: Activity,
        include: [House, Xecreto, Xelfie, Xperiencia, Event],
      },
    ],
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
