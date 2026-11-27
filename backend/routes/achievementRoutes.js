const catalogRouter = require("./catalogRouter");
const makeController = require("../controllers/catalogController");
const service = require("../services/achievementService");
const { toAchievementDTO } = require("../dto/achievement.dto");
const v = require("../validation/achievement.validation");

const controller = makeController({
  service,
  toDTO: toAchievementDTO,
  key: "achievement",
  label: "Achievement",
  fields: ["name", "description", "type", "imageUrl", "activityId", "houseId"],
});

module.exports = catalogRouter(controller, {
  createValidation: v.createAchievementValidation,
  updateValidation: v.updateAchievementValidation,
});
