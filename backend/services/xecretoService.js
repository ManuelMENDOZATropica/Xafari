const Clue = require("../models/clue");
const Activity = require("../models/activity");
const Xecreto = require("../models/xecreto");

exports.createXecreto = async ({ clues, ...activityParams }) => {
  const xecreto = await Xecreto.create(
    {
      clues,
      activity: activityParams,
    },
    {
      include: [
        {
          association: Xecreto.Activity,
        },
        {
          association: Xecreto.Clues,
        },
      ],
    }
  );

  return xecreto;
};

exports.getXecreto = async (id) => {
  let xecreto = await Xecreto.findByPk(id, {
    include: [
      {
        model: Activity,
        as: "activity",
      },
      {
        model: Clue,
        as: "clues",
      },
    ],
  });

  return xecreto;
};

exports.deleteXecreto = async (id) => {
  const xecreto = await this.getXecreto(id);

  if (xecreto == null) return null;

  const destroyed = await xecreto.destroy();
  return destroyed;
};

exports.updateXecreto = async (id, newData) => {
  const xecreto = await this.getXecreto(id);

  if (xecreto == null) return null;
  const updated = await xecreto.update(newData);
  if (updated != null) {
    await xecreto.activity.update(newData);
    await xecreto.clues.update(newData);
  }
  return updated;
};
