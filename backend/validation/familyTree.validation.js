const { body } = require("express-validator");

exports.nameValidation = [
  body("name").isString().trim().notEmpty().withMessage("Name cannot be empty").isLength({ max: 100 }),
];
exports.joinValidation = [
  body("inviteToken").isString().notEmpty().withMessage("inviteToken is required").isLength({ max: 1000 }),
];
