const express = require("express");
const router = express.Router();
const userPreferenceController = require("../controllers/userPreferenceController");

const { validateRequest } = require("../middleware/validateRequest");
const {
  createUserPreferenceValidation,
  userPreferenceParamValidation,
  updateUserPreferenceValidation,
} = require("../validation/userPreference.validation");

router.post(
  "/",
  createUserPreferenceValidation,
  validateRequest,
  userPreferenceController.addPreference
);

router.delete(
  "/:id",
  userPreferenceParamValidation,
  validateRequest,
  userPreferenceController.deletePreference
);

router.put(
  "/:id",
  updateUserPreferenceValidation,
  validateRequest,
  userPreferenceController.updatePreference
);

module.exports = router;
