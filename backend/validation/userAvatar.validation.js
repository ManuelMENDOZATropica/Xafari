const { body } = require("express-validator");

exports.createUserAvatarValidation = [
  body("userId").isUUID().withMessage("Valid user ID is required"),
  body("props").isObject({strict: true}),
];
