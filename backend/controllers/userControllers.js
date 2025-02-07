const userService = require("../services/userService");

exports.getUser = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    res
      .status(400)
      .json({ message: "Not enough parameters or bad parameters" });
  } else {
    const user = await userService.getUserById(id);

    if (user === null) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.json({ user });
    }
  }
};

exports.createUser = async (req, res) => {
  const name = req.params.name;
  const age = parseInt(Number(req.params.age));
  const suiteNumber = parseInt(req.params.suiteNumber);

  if (!name || isNaN(age) || isNaN(suiteNumber)) {
    res
      .status(400)
      .json({ message: "Not enough parameters or bad parameters" });
  } else {
    const userId = await userService.createUser(name, age, suiteNumber);

    if (userId === null) {
      res.status(409).json({ message: "User already exists" });
    } else {
      res.status(200).json({ user: { id: userId } });
    }
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    res
      .status(400)
      .json({ message: "Not enough parameters or bad parameters" });
  } else {
    const a = await userService.deleteUser(userId);

    if (!(await userService.deleteUser(userId))) {
      res.status(404).json({ message: "User not deleted", id: userId });
    } else {
      res.status(200).json({ user: { id: userId } });
    }
  }
};
