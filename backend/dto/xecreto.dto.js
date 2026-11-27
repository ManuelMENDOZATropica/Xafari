const { flattenSubtype } = require("./activity.dto");

// Sin correctAnswer: para validar una pista usar POST /xecretos/:id/check.
exports.toXecretoDTO = (x) =>
  flattenSubtype(x, "Xecreto", {
    clues: (x.clues || [])
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((c) => ({ id: c.id, text: c.text, order: c.order })),
  });
