const activityService = require("../services/activityService");

exports.createActivity = async (req, res) => {
  const name = req.params.name;
  const description = req.params.description;
  const guardianId = req.params.guardian?.id

  if (!name || !description || !guardianId) {
    res
      .status(400)
      .json({ message: "Not enough parameters or bad parameters" });
  } else {
    const activityId = await activityService.createActivity(name, description, guardianId);

    if (activityId === null) {
      res.status(409).json({ message: "Activity already registered" });
    } else {
      res.status(200).json({ activity: { id: activityId } });
    }
  }
};

exports.getActivity = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    res
      .status(400)
      .json({ message: "Not enough parameters or bad parameters" });
  } else {
    const activity = await activityService.getActivityById(id);

    if (activity === null) {
      res.status(404).json({ message: "Activity not found" });
    } else {
      res.json({ activity });
    }
  }
};


