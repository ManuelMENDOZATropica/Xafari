const { body } = require("express-validator");

const PASSWORD_MIN = 8;

const profileFields = [
  body("name").optional({ values: "null" }).isString().trim().notEmpty().withMessage("Name cannot be empty").isLength({ max: 100 }),
  body("lastname").optional({ values: "null" }).isString().trim().isLength({ max: 100 }),
  body("pronouns").optional({ values: "null" }).isString().isLength({ max: 50 }),
  body("reservationNumber").optional({ values: "null" }).isString().trim().isLength({ max: 50 }),
  body("birthdate").optional({ values: "null" }).isISO8601({ strict: true }).withMessage("Birthdate must be a valid ISO 8601 date").toDate(),
  body("avatar").optional({ values: "null" }).isObject().withMessage("Avatar must be an object"),
];

exports.PASSWORD_MIN = PASSWORD_MIN;

exports.createUserValidation = [
  body("name").isString().trim().notEmpty().withMessage("Name cannot be empty").isLength({ max: 100 }),
  body("email").isString().trim().isEmail().withMessage("Email is not valid").customSanitizer((v) => v.toLowerCase()),
  body("password")
    .isString()
    .isLength({ min: PASSWORD_MIN, max: 200 })
    .withMessage(`Password must have at least ${PASSWORD_MIN} characters`),
  body("birthdate").isISO8601({ strict: true }).withMessage("Birthdate must be a valid ISO 8601 date").toDate(),
  body("casa").optional({ values: "null" }).isString().isLength({ max: 50 }),
  body("parentalConsent").optional({ values: "null" }).isBoolean({ strict: true }).withMessage("parentalConsent must be boolean"),
  ...profileFields.filter((_, i) => i !== 0 && i !== 4),
];

exports.updateProfileValidation = profileFields;

exports.loginValidation = [
  body("email").isString().withMessage("Email is required").bail().trim().notEmpty().withMessage("Email is required"),
  body("password").isString().withMessage("Password is required").bail().notEmpty().withMessage("Password is required"),
];

exports.changePasswordValidation = [
  body("currentPassword").isString().notEmpty().withMessage("currentPassword is required"),
  body("newPassword")
    .isString()
    .isLength({ min: PASSWORD_MIN, max: 200 })
    .withMessage(`Password must have at least ${PASSWORD_MIN} characters`),
];
