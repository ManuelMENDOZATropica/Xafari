const express = require("express");
const router = express.Router();
const { checkSchema, matchedData } = require("express-validator");

const userActivityController = require("../controllers/userActivityController");
const { ValidationError } = require("../utils/errors");

const userActivitySchema = {
  activityId: {
    trim: true,
    notEmpty: {
      errorMessage: "ActivityId cannot be empty",
    },
    isString: {
      errorMessage: "ActivityId must be a string",
    },
  },
  startedAt: {
    trim: true,
    optional: true,
    notEmpty: {
      errorMessage: "StartedAt date cannot be empty",
    },
    isISO8601: {
      errorMessage: "Must be a valid ISO 8601 date",
    },
    custom: {
      errorMessage: "Date values are invalid",
      options: (value, { req }) => {
        const completedAt = new Date(req.body.completedAt);

        if (
          new Date(value) == "Invalid Date" ||
          completedAt < new Date(value)
        ) {
          return false;
        }

        req.body.startDate = new Date(value);
        return true;
      },
    },
  },
  completedAt: {
    trim: true,
    optional: true,
    notEmpty: {
      errorMessage: "completedAt date cannot be empty",
    },
    isISO8601: {
      errorMessage: "Must be a valid ISO 8601 date",
    },
    custom: {
      errorMessage: "Date values are invalid",
      options: (value, { req }) => {
        const completedAt = new Date(value);

        if (completedAt == "Invalid Date") {
          return false;
        }

        req.body.completedAt = completedAt;
        return true;
      },
    },
  },
};

const validateUserActivity = async (req, _res, next) => {
  const result = (
    await checkSchema(
      req.method == "POST" && req.params.activityId
        ? Object.fromEntries(
            Object.entries(userActivitySchema).map(([field, value]) => [
              field,
              {
                ...value,
                optional: true,
              },
            ])
          )
        : userActivitySchema,
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

router.post(
  "/user/:id/activity/",
  validateUserActivity,
  userActivityController.addActivity
);

router.delete(
  "/user/:id/activity/:activityId",
  userActivityController.deleteActivity
);

router.post(
  "/user/:id/activity/:activityId",
  validateUserActivity,
  userActivityController.updateActivity
);

module.exports = router;
