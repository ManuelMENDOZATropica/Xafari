const { body } = require("express-validator");

const TYPES = ["Amuleto", "Follaje"];
const v = (required) => {
  const f = (name) => (required ? body(name) : body(name).optional());
  return [
    f("name").isString().trim().notEmpty().withMessage("Name is required"),
    f("description").isString().notEmpty().withMessage("Description is required"),
    f("type").isIn(TYPES).withMessage(`Type must be "Amuleto" or "Follaje"`),
    f("imageUrl").isURL().withMessage("ImageUrl is not valid"),
    f("activityId").isUUID().withMessage("Valid activity ID is required"),
    f("houseId").isUUID().withMessage("Valid house ID is required"),
  ];
};

exports.createAchievementValidation = v(true);
exports.updateAchievementValidation = v(false);
