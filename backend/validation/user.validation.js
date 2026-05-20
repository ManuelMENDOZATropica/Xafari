const { body, param } = require("express-validator");

exports.createUserValidation = [
  body("name").trim().notEmpty().withMessage("Name cannot be empty"),
  body("lastname").optional().isString(),
  body("email").trim().isEmail().withMessage("Email is not valid"),
  body("password")
    .notEmpty()
    .withMessage("Password cannot be empty"),
  body("birthdate")
    .trim()
    .isISO8601()
    .toDate()
    .withMessage("Birthdate must be a valid ISO 8601 date"),
  body("reservationNumber")
    .trim()
    .notEmpty()
    .withMessage("Reservation number cannot be empty"),
  body("pronouns").optional().isString(),
  body("avatar").optional().isObject(),
];

exports.updateUserValidation = [
  param("id").notEmpty().withMessage("Valid user ID is required"),
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
  body("lastname").optional().isString(),
  body("email").optional().trim().isEmail().withMessage("Email is not valid"),
  body("password").optional().notEmpty().withMessage("Password cannot be empty"),
  body("birthdate").optional().trim().isISO8601().toDate().withMessage("Birthdate must be a valid ISO 8601 date"),
  body("reservationNumber").optional().trim().notEmpty().withMessage("Reservation number cannot be empty"),
  body("pronouns").optional().isString(),
  body("avatar").optional().isObject(),
];

exports.userIdParam = [
  param("id").notEmpty().withMessage("Valid user ID is required"),
];
