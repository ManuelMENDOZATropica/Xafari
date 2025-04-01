const Activity = require("../models/xelfie");
const Xelfie = require("../models/xelfie");
const xperiencia = require("../models/xperiencia");

exports.createXelfie = async ({ ...activityParams }) => {
  const xelfie = await Xelfie.create(
    {
      activity: activityParams,
    },
    {
      include: [
        {
          association: Xelfie.Activity,
        },
      ],
    }
  );

  return xelfie;
};

exports.getXelfie = async (id) => {
  let xelfie = await Xelfie.findByPk(id, {
    include: [
      {
        model: Activity,
        as: "activity",
      },
    ],
  });

  return xelfie;
};

exports.deleteXelfie = async (id) => {
  const xelfie = await this.getXelfie(id);

  if (xelfie == null) return null;

  const destroyed = await xelfie.destroy();
  return destroyed;
};

exports.updateXelfie = async (id, newData) => {
  const xelfie = await this.getXelfie(id);

  if (xelfie == null) return null;

  const updated = await xelfie.update(newData);
  if (updated != null) {
    await xelfie.activity.update(newData);
  }
  return updated;
};
