const express = require("express");
const router = express.Router();
const { checkSchema, matchedData } = require("express-validator");

const activitySchema = require("./activitySchema");

const eventController = require("../controllers/eventController");
const { ValidationError } = require("../utils/errors");

const EventSchema = {
  ...activitySchema,
  startDate: {
    trim: true,
    notEmpty: {
      errorMessage: "Start date cannot be empty",
    },
    isISO8601: {
      errorMessage: "Must be a valid ISO 8601 date",
    },
    custom: {
      errorMessage: "Date values are invalid",
      options: (value, { req }) => {
        const endDate = new Date(req.body.endDate);

        if (new Date(value) == "Invalid Date" || endDate < new Date(value)) {
          return false;
        }

        req.body.startDate = new Date(value);
        return true;
      },
    },
  },
  endDate: {
    trim: true,
    notEmpty: {
      errorMessage: "End date cannot be empty",
    },
    isISO8601: {
      errorMessage: "Must be a valid ISO 8601 date",
    },
    custom: {
      errorMessage: "Date values are invalid",
      options: (value, { req }) => {
        const endDate = new Date(value);

        if (endDate == "Invalid Date") {
          return false;
        }

        req.body.endDate = endDate;
        return true;
      },
    },
  },
};

const validateEventData = async (req, res, next) => {
  const result = (
    await checkSchema(
      req.method == "POST" && req.params.id
        ? Object.fromEntries(
            Object.entries(EventSchema).map(([field, value]) => [
              field,
              {
                ...value,
                optional: true,
              },
            ])
          )
        : EventSchema,
      ["body"]
    ).run(req)
  )
    .map((res) => res.array())
    .flat();
  if (result.length) {
    return next(new ValidationError(result[0].msg));
  }

  req.body = matchedData(req);

  next();
};

router.post("/event", validateEventData, eventController.createEvent);
router.get("/event/:id", eventController.getEvent);
router.delete("/event/:id", eventController.deleteEvent);

router.post("/event/:id", validateEventData, eventController.updateEvent);

module.exports = router;
