const User = require("../models/user");

exports.getUserById = async (id) => {
  return await User.findByPk(id);
};

exports.createUser = async (name, age, suiteNumber) => {
  return await User.create({
    name,
    age,
    suiteNumber,
  });
};

exports.deleteUser = async (id) => {
  const user = this.getUser(id);

  if (!user) return null;

  return await user.destroy();
};
