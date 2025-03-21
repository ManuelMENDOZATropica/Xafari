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
      errorMessage: "Name must be a string",
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
  age: {
    isInt: {
      errorMessage: "Age is not valid",
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

// router.get("/user/:id/casas", userController.getAllCasas);  // done
// router.get("/user/:id/xecretos", userController.getAllXecretos); // done
// router.get("/user/:id/xelfies", userController.getAllXelfies); // done
// router.get("/user/:id/xperiencias", userController.getAllXperiencias); // done

// router.delete("/user/:id", userController.deleteUser); // done

// router.post("/user", userController.addUser); // done
// router.post("/user/:id/xecretos", userController.addXecreto);
// router.post("/user/:id/xelfies", userController.addXelfie);
// router.post("/user/:id/xperiencias", userController.addXperiencia);

module.exports = router;
