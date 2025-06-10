const express = require("express");
const router = express.Router();
const familyTreeController = require("../controllers/familyTreeController");
const { checkSchema, matchedData } = require("express-validator");
const { ValidationError } = require("../utils/errors");
const {
  familyTreeIdParam,
  createFamilyTreeValidation,
  updateFamilyTreeValidation,
} = require("../validation/familyTree.validation");
const { validateRequest } = require("../middleware/validateRequest");

router.get(
  "/:familyId",
  familyTreeIdParam,
  validateRequest,
  familyTreeController.getFamilyTree
);
router.post(
  "/",
  createFamilyTreeValidation,
  validateRequest,
  familyTreeController.createFamilyTree
);
router.post(
  "/:familyId",
  familyTreeIdParam,
  updateFamilyTreeValidation,
  validateRequest,
  familyTreeController.updateFamilyTree
);

router.delete(
  "/:familyId",
  familyTreeIdParam,
  validateRequest,
  familyTreeController.deleteFamilyTree
);

module.exports = router;
