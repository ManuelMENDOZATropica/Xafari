const { body } = require("express-validator");

function ageRange(value, { req }) {
  const { minAge, maxAge } = req.body;
  if (minAge != null && maxAge != null && Number(minAge) > Number(maxAge)) {
    throw new Error("Age limits are not valid");
  }
  return true;
}

const common = (required) => {
  const f = (name) => (required ? body(name) : body(name).optional());
  return [
    f("name").isString().trim().notEmpty().withMessage("Name is required"),
    f("description").isString().withMessage("Description is required"),
    f("location").isString().trim().notEmpty().withMessage("Location is required"),
    body("isActive").optional().isBoolean().withMessage("isActive must be boolean").toBoolean(),
    body("minAge").optional({ values: "null" }).isInt({ min: 0 }).withMessage("Age limits are not valid").toInt().custom(ageRange),
    body("maxAge").optional({ values: "null" }).isInt({ min: 1 }).withMessage("Age limits are not valid").toInt().custom(ageRange),
    body("houseId").optional({ values: "null" }).isUUID().withMessage("Valid house ID is required"),
  ];
};

exports.createActivityValidation = common(true);
exports.updateActivityValidation = common(false);
