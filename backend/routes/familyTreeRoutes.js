const express = require("express");
const router = express.Router();
const familyTreeController = require("../controllers/familyTreeController");
const {
  familyTreeIdParam,
  createFamilyTreeValidation,
  updateFamilyTreeValidation,
} = require("../validation/familyTree.validation");
const { validateRequest } = require("../middleware/validateRequest");

// ── Rutas fijas primero (antes de /:familyId) ─────────────────────────────
router.post("/leave", familyTreeController.leaveFamilyTree);

router.post(
  "/",
  createFamilyTreeValidation,
  validateRequest,
  familyTreeController.createFamilyTree
);

// ── Rutas con parámetro ───────────────────────────────────────────────────
router.get(
  "/:familyId",
  familyTreeIdParam,
  validateRequest,
  familyTreeController.getFamilyTree
);

router.post(
  "/:familyId/join",
  familyTreeIdParam,
  validateRequest,
  familyTreeController.joinFamilyTree
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
