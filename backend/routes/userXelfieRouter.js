const express = require("express");
const router = express.Router();
const { checkSchema, matchedData } = require("express-validator");

const userXelfieController = require("../controllers/userXelfieController");
const { ValidationError } = require("../utils/errors");

const userXelfieSchema = {
  xelfieUrl: {
    trim: true,
    isURL: true,
    notEmpty: {
      errorMessage: "xelfieUrl cannot be empty",
    },
    isString: {
      errorMessage: "xelfieUrl must be a string",
    },
  },
  xelfieId: {
    trim: true,
    notEmpty: {
      errorMessage: "xelfieId cannot be empty",
    },
    isString: {
      errorMessage: "xelfieId must be a string",
    },
  },
};

const validateUserXelfie = async (req, _res, next) => {
  const result = (
    await checkSchema(
      req.method == "POST" && req.params.xelfieId
        ? Object.fromEntries(
            Object.entries(userXelfieSchema).map(([field, value]) => [
              field,
              {
                ...value,
                optional: true,
              },
            ])
          )
        : userXelfieSchema,
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
  "/user/:userId/xelfie/",
  validateUserXelfie,
  userXelfieController.addXelfie
);

router.delete(
  "/user/:userId/xelfie/:xelfieId",
  userXelfieController.deleteXelfie
);

router.post(
  "/user/:userId/xelfie/:xelfieId",
  validateUserXelfie,
  userXelfieController.updateXelfie
);

module.exports = router;
