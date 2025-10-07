const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const {
  eventIdParam,
  createEventValidation,
  updateEventValidation,
} = require("../validation/event.validation");
const { validateRequest } = require("../middleware/validateRequest");
const {
  createActivityValidation,
  updateActivityValidation,
} = require("../validation/activity.validation");

//router.get("/", eventController.getAllEvents);
router.get("/:id", eventIdParam, validateRequest, eventController.getEvent);
router.post(
  "/",
  createActivityValidation,
  createEventValidation,
  validateRequest,
  eventController.createEvent
);
router.put(
  "/:id",
  eventIdParam,
  updateActivityValidation,
  updateEventValidation,
  validateRequest,
  eventController.updateEvent
);
router.delete("/:id", eventIdParam, eventController.deleteEvent);

module.exports = router;
