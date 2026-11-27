const express = require("express");
const { requireAdmin } = require("../middleware/authHandler");
const { validateRequest, asyncHandler } = require("../middleware/validateRequest");
const { uuidParam } = require("../validation/common.validation");

/**
 * GET / y GET /:id públicos (ver authHandler.isPublic);
 * POST /, PUT /:id y DELETE /:id solo admin.
 */
module.exports = function catalogRouter(controller, { createValidation = [], updateValidation = [], listMiddleware = [] } = {}) {
  const router = express.Router();
  const id = uuidParam("id");
  router.get("/", ...listMiddleware, asyncHandler(controller.list));
  router.get("/:id", id, validateRequest, asyncHandler(controller.get));
  router.post("/", requireAdmin, createValidation, validateRequest, asyncHandler(controller.create));
  router.put("/:id", requireAdmin, id, updateValidation, validateRequest, asyncHandler(controller.update));
  router.delete("/:id", requireAdmin, id, validateRequest, asyncHandler(controller.remove));
  return router;
};
