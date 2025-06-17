const Activity = require("../models/activity");
const Xelfie = require("../models/xelfie");

exports.createXelfie = async ({ ...activityParams }) => {
  const xelfie = await Xelfie.create(
    {
      activity: activityParams,
    },
    {
      include: [Activity],
    }
  );

  return xelfie;
};

exports.getXelfie = async (id, transaction) => {
  let xelfie = await Xelfie.findByPk(id, {
    include: [Activity],
    transaction,
  });

  return xelfie;
};

exports.getAllXelfies = async () => {
  const xelfies = await Xelfie.findAll({
    include: [Activity],
  });

  return xelfies;
};

exports.deleteXelfie = async (id) => {
  const xelfie = await this.getXelfie(id);

  if (xelfie == null) throw new ResourceNotFoundError("Resource not found");

  const destroyed = await xelfie.destroy();
  return destroyed;
};

exports.updateXelfie = async (id, newData) => {
  const xelfie = await this.getXelfie(id);

  if (xelfie == null) throw new ResourceNotFoundError("Resource not found");

  const updated = await xelfie.update(newData);

  if (updated != null) {
    await xelfie.activity.update(newData);
  }
  return updated;
};
