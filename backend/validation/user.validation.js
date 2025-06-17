const { body, param } = require("express-validator");

exports.createUserValidation = [
  body("name").isString().notEmpty().withMessage("Name is required"),
  body("lastname").isString().notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("birthdate")
    .isISO8601()
    .toDate()
    .withMessage("Valid birthdate is required"),
  body("reservationNumber")
    .isString()
    .withMessage("Reservation number is required"),
  body("pronouns").isString().withMessage("Valid pronouns is required"),
  body("avatar").optional().isObject(),
];

exports.updateUserValidation = [
  param("id").isUUID().withMessage("Valid user ID is required"),
  body("name").optional().isString(),
  body("lastname").optional().isString(),
  body("email").optional().isEmail(),
  body("password").optional().isLength({ min: 6 }),
  body("birthdate").optional().isISO8601().toDate(),
  body("reservationNumber").optional().isString(),
  body("pronouns").optional().isString(),
  body("avatar").optional().isObject(),
];

exports.userIdParam = [
  param("id").isUUID().withMessage("Valid user ID is required"),
];
