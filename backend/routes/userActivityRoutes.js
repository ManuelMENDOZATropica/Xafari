const express = require("express");
const router = express.Router();

const userActivityController = require("../controllers/userActivityController");
const {
  createUserActivityValidation,
  userActivityIdParam,
  updateUserActivityValidation,
} = require("../validation/userActivity.validation");
const { validateRequest } = require("../middleware/validateRequest");
const { userIdParam } = require("../validation/user.validation");

router.get("/:id", userIdParam, userActivityController.getUserActivity);

router.post(
  "/",
  createUserActivityValidation,
  validateRequest,
  userActivityController.addUserActivity
);

router.put(
  "/:id",
  userActivityIdParam,
  updateUserActivityValidation,
  validateRequest,
  userActivityController.updateUserActivity
);

router.delete(
  "/:id",
  userActivityIdParam,
  validateRequest,
  userActivityController.deleteUserActivity
);

module.exports = router;
