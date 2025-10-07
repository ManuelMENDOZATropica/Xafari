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
      include: [Activity, Clue],
    }
  );

  return xecreto;
};

exports.getXecreto = async (id) => {
  let xecreto = await Xecreto.findByPk(id, {
    include: [Activity, Clue],
  });

  return xecreto;
};

exports.getAllXecretos = async () => {
  const xecretos = await Xecreto.findAll({
    include: [Activity, Clue],
  });

  return xecretos;
};

exports.deleteXecreto = async (id) => {
  const xecreto = await this.getXecreto(id);

  if (xecreto == null) throw new ResourceNotFoundError("Resource not found");

  const destroyed = await xecreto.destroy();
  return destroyed;
};

exports.updateXecreto = async (id, newData) => {
  const xecreto = await this.getXecreto(id);

  if (xecreto == null) throw new ResourceNotFoundError("Resource not found");

  if (newData.clues) {
    for (const clue of xecreto.clues) {
      await clue.destroy();
    }
  }

  const updated = await xecreto.update(newData);

  await xecreto.activity.update(newData);

  return updated;
};
