const Clue = require("../models/clue");
const Activity = require("../models/activity");
const Xecreto = require("../models/xecreto");
const { ResourceNotFoundError } = require("../utils/errors");

exports.createXecreto = async ({ clues, ...activityParams }) => {
  const xecreto = await Xecreto.create(
    {
      clues: clues || [],
      activity: activityParams,
    },
    {
      include: [Activity, Clue],
    }
  );

  await xecreto.reload({ include: [Activity, Clue] });
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

  if (xecreto == null) throw new ResourceNotFoundError("Xecreto not found");

  const destroyed = await xecreto.destroy();
  return destroyed;
};

exports.updateXecreto = async (id, newData) => {
  const xecreto = await this.getXecreto(id);

  if (xecreto == null) throw new ResourceNotFoundError("Xecreto not found");

  if (newData.clues) {
    const existingClues = xecreto.clues || [];
    let cluesChanged = false;
    if (existingClues.length !== newData.clues.length) {
      cluesChanged = true;
    } else {
      for (let i = 0; i < existingClues.length; i++) {
        if (
          existingClues[i].text !== newData.clues[i].text ||
          existingClues[i].correctAnswer !== newData.clues[i].correctAnswer
        ) {
          cluesChanged = true;
          break;
        }
      }
    }

    if (cluesChanged) {
      for (const clue of existingClues) {
        await clue.destroy();
      }
      const newClues = [];
      for (let i = 0; i < newData.clues.length; i++) {
        const clueData = newData.clues[i];
        const clue = await Clue.create({
          ...clueData,
          order: clueData.order !== undefined ? clueData.order : i,
          xecretoId: xecreto.id,
        });
        newClues.push(clue);
      }
      xecreto.clues = newClues;
    }
  }

  const updated = await xecreto.update(newData);

  if (xecreto.activity) {
    await xecreto.activity.update(newData);
  }

  await xecreto.reload({ include: [Activity, Clue] });

  return xecreto;
};
