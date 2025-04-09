const express = require("express");
const router = express.Router();
const { checkSchema, matchedData } = require("express-validator");

const userController = require("../controllers/userController");
const { ValidationError } = require("../utils/errors");

const UserSchemas = {
  name: {
    trim: true,
    notEmpty: {
      errorMessage: "Name cannot be empty",
    },
    isString: {
      errorMessage: "Name cannot be empty",
    },
  },
  email: {
    trim: true,
    isEmail: {
      errorMessage: "Email is not valid",
    },
    notEmpty: {
      errorMessage: "Email cannot be empty",
    },
    isString: {
      errorMessage: "Email must be a string",
    },
  },
  password: {
    trim: true,
    notEmpty: {
      errorMessage: "Password cannot be empty",
    },
    isString: {
      errorMessage: "Password must be a string",
    },
  },
  birthdate: {
    trim: true,
    notEmpty: {
      errorMessage: "Birthdate cannot be empty",
    },
    isISO8601: {
      errorMessage: "Birthdate must be a valid ISO 8601 date",
    },
    custom: {
      errorMessage: "Birthdate value is invalid",
      options: (value, { req }) => {
        if (new Date(value) == "Invalid Date") return false;

        req.body.birthday = new Date(value);
        return true;
      },
    },
  },
  reservationNumber: {
    trim: true,
    notEmpty: {
      errorMessage: "Reservation number cannot be empty",
    },
    isString: {
      errorMessage: "Reservation number must be a string",
    },
  },
};

const validateUserData = async (req, _res, next) => {
  const result = (
    await checkSchema(
      req.method == "POST" && req.params.id
        ? Object.fromEntries(
            Object.entries(UserSchemas).map(([field, value]) => [
              field,
              {
                ...value,
                optional: true,
              },
            ])
          )
        : UserSchemas,
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

router.post("/user", validateUserData, userController.createUser);
router.get("/user/:id", userController.getUser);
router.delete("/user/:id", userController.deleteUser);
router.post("/user/:id", validateUserData, userController.updateUser);


module.exports = router;
