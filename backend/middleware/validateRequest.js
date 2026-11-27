const { validationResult } = require("express-validator");
const { ValidationError } = require("../utils/errors");

exports.validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  const all = errors.array();
  const details = all.map((err) => ({ field: err.path, issue: err.msg }));
  return next(new ValidationError(all[0].msg || "Validation failed", details));
};

// Envuelve handlers async para que cualquier excepción llegue a next().
exports.asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Copia solo las claves permitidas (y definidas) de un objeto.
exports.pick = (obj, keys) => {
  const out = {};
  for (const k of keys) {
    if (obj && obj[k] !== undefined) out[k] = obj[k];
  }
  return out;
};
