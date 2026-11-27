const express = require("express");
const userController = require("../controllers/userController");
const { registerLimiter } = require("../middleware/rateLimits");
const { requireSelf } = require("../middleware/authHandler");
const { validateRequest, asyncHandler } = require("../middleware/validateRequest");
const { createUserValidation, updateProfileValidation } = require("../validation/user.validation");
const { uuidParam } = require("../validation/common.validation");

const router = express.Router();

// Registro (público)
router.post("/", registerLimiter, createUserValidation, validateRequest, asyncHandler(userController.createUser));

// Por id: solo el propio usuario (admin puede leer/borrar cualquiera)
router.get("/:id", uuidParam("id"), validateRequest, requireSelf("id", { allowAdmin: true }), asyncHandler(userController.getUser));
router.put("/:id", uuidParam("id"), requireSelf("id"), updateProfileValidation, validateRequest, asyncHandler(userController.updateProfile));
router.delete("/:id", uuidParam("id"), validateRequest, requireSelf("id", { allowAdmin: true }), asyncHandler(userController.deleteUser));

module.exports = router;
