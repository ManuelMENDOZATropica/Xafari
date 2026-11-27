const { param } = require("express-validator");

// Ids no-UUID → 400 (antes daban 500 en Postgres).
exports.uuidParam = (name = "id") => [
  param(name).isUUID().withMessage(`${name} must be a valid UUID`),
];
