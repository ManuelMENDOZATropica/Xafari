const express = require("express");
const router = express.Router();

const userXelfieController = require("../controllers/userXelfieController");
const {
  createUserXelfieValidation,
  userXelfieParamValidation,
  updateUserXelfieValidation,
} = require("../validation/userXelfie.validation");
const { validateRequest } = require("../middleware/validateRequest");

router.post(
  "/",
  createUserXelfieValidation,
  validateRequest,
  userXelfieController.addXelfie
);

router.delete(
  "/:id",
  userXelfieParamValidation,
  validateRequest,
  userXelfieController.deleteXelfie
);

router.put(
  "/:id",
  userXelfieParamValidation,
  updateUserXelfieValidation,
  validateRequest,
  userXelfieController.updateXelfie
);

module.exports = router;
