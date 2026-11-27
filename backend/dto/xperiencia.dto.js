const { flattenSubtype } = require("./activity.dto");

// correctAnswer nunca sale; hasAnswer indica si el servidor valida la trivia.
exports.toXperienciaDTO = (x) =>
  flattenSubtype(x, "Xperiencia", { isValidable: x.isValidable, hasAnswer: !!x.correctAnswer });
