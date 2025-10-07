const express = require("express");
const router = express.Router();

const {
  createUserAvatarValidation
} = require("../validation/userAvatar.validation");

const userAvatarController = require("../controllers/userAvatarController");

const { validateRequest } = require("../middleware/validateRequest");

router.post(
  "/",
  createUserAvatarValidation,
  validateRequest,
  userAvatarController.addUserAvatar
);

module.exports = router;
