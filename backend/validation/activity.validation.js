const { body, param } = require("express-validator");

exports.createActivityValidation = [
  body("name").isString().withMessage("Name is required"),
  body("description").isString().withMessage("Description is required"),
  body("location").isString().withMessage("Location is required"),
  body("isActive").optional().isBoolean().withMessage("isActive is required"),
  body("minAge")
    .optional({ checkFalsy: true })
    .isInt({ min: 0 })
    .withMessage("Age limits are not valid")
    .custom((value, { req }) => {
      const maxAge = req.body.maxAge;
      if (value !== null && maxAge !== null && Number(value) > Number(maxAge)) {
        throw new Error("Age limits are not valid");
      }
      return true;
    })
    .withMessage("Age limits are not valid"),
  body("maxAge")
    .optional({ checkFalsy: true })
    .isInt()
    .withMessage("Age limits are not valid"),
];

exports.updateActivityValidation = [
  body("name").optional().isString().withMessage("Name is required"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description is required"),
  body("location").optional().isString().withMessage("Location is required"),
  body("isActive").optional().isBoolean().withMessage("isActive is required"),
  body("minAge")
    .optional({ checkFalsy: true })
    .isInt({ min: 0 })
    .withMessage("Age limits are not valid")
    .custom((value, { req }) => {
      const maxAge = req.body.maxAge;
      if (value !== null && maxAge !== null && Number(value) > Number(maxAge)) {
        throw new Error("Age limits are not valid");
      }
      return true;
    })
    .withMessage("Age limits are not valid"),
  body("maxAge")
    .optional({ checkFalsy: true })
    .isInt()
    .withMessage("Age limits are not valid"),
];
