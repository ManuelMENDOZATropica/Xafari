const { Xecreto, Clue } = require("../models");
const make = require("./activitySubtypeService");
const { ResourceNotFoundError } = require("../utils/errors");

async function replaceClues(xecreto, data, transaction) {
  if (!Array.isArray(data.clues)) return;
  await Clue.destroy({ where: { xecretoId: xecreto.id }, transaction });
  await Clue.bulkCreate(
    data.clues.map((c, i) => ({
      text: c.text,
      correctAnswer: c.correctAnswer,
      order: i,
      xecretoId: xecreto.id,
    })),
    { transaction }
  );
}

const service = make({
  Model: Xecreto,
  type: "Xecreto",
  label: "Xecreto",
  include: [Clue],
  afterWrite: replaceClues,
});

const normalize = (s) =>
  String(s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase();

/** POST /xecretos/:id/check → {correct} sin revelar la respuesta. */
service.checkAnswer = async (xecretoId, clueId, answer) => {
  const clue = await Clue.findOne({ where: { id: clueId, xecretoId } });
  if (!clue) throw new ResourceNotFoundError("Clue not found");
  return normalize(answer) === normalize(clue.correctAnswer);
};

module.exports = service;
