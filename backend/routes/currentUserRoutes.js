// /user = alias del usuario del token
const express = require("express");
const userController = require("../controllers/userController");
const { validateRequest, asyncHandler } = require("../middleware/validateRequest");
const { updateProfileValidation, changePasswordValidation } = require("../validation/user.validation");

const router = express.Router();

router.get("/", asyncHandler(userController.getCurrentUser));
router.put("/", updateProfileValidation, validateRequest, asyncHandler(userController.updateProfile));
router.put("/password", changePasswordValidation, validateRequest, asyncHandler(userController.changePassword));
router.delete("/", asyncHandler(userController.deleteUser));

module.exports = router;
