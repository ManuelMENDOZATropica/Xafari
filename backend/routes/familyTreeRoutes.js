const express = require("express");
const c = require("../controllers/familyTreeController");
const v = require("../validation/familyTree.validation");
const { uuidParam } = require("../validation/common.validation");
const { validateRequest, asyncHandler } = require("../middleware/validateRequest");

const router = express.Router();
const id = uuidParam("familyId");

// Rutas fijas antes de /:familyId
router.post("/", v.nameValidation, validateRequest, asyncHandler(c.create));
router.post("/join", v.joinValidation, validateRequest, asyncHandler(c.join));
router.post("/leave", asyncHandler(c.leave));

router.get("/:familyId", id, validateRequest, asyncHandler(c.get));
router.post("/:familyId/invite", id, validateRequest, asyncHandler(c.invite));
router.put("/:familyId", id, v.nameValidation, validateRequest, asyncHandler(c.rename));
router.delete("/:familyId", id, validateRequest, asyncHandler(c.remove));

module.exports = router;
