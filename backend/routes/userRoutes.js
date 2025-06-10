const express = require("express");
const router = express.Router();

const {
  createUserValidation,
  updateUserValidation,
  userIdParam,
} = require("../validation/user.validation");

const userController = require("../controllers/userController");

const { validateRequest } = require("../middleware/validateRequest");

router.get("/:id", userController.getUser);

console.debug(validateRequest);

router.post(
  "/",
  createUserValidation,
  validateRequest,
  userController.createUser
);

router.put(
  "/:id",
  ...updateUserValidation,
  validateRequest,
  userController.updateUser
);
router.delete("/:id", userIdParam, userController.deleteUser);

module.exports = router;
