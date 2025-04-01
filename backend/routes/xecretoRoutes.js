const express = require("express");
const router = express.Router();
const { checkSchema, matchedData } = require("express-validator");

const activitySchema = require("./activitySchema");

const xecretoController = require("../controllers/xecretoController");
const { ValidationError } = require("../utils/errors");

const XecretoSchema = {
  ...activitySchema,
  clues: {
    isArray: true,
    optional: true,
  },
  "clue.*.text": {
    trim: true,
    notEmpty: {
      errorMessage: "Clue text cannot be empty",
    },
    isString: {
      errorMessage: "Clue text must be a string",
    },
  },
  "clue.*.correctAnswer": {
    trim: true,
    notEmpty: {
      errorMessage: "Clue correct answer text cannot be empty",
    },
    isString: {
      errorMessage: "Clue correct answer must be a string",
    },
  },
};

const validateXecretoData = async (req, res, next) => {
  const result = (
    await checkSchema(
      req.method == "POST" && req.params.id
        ? Object.fromEntries(
            Object.entries(XecretoSchema).map(([field, value]) => [
              field,
              {
                ...value,
                optional: true,
              },
            ])
          )
        : XecretoSchema,
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

router.post("/xecreto", validateXecretoData, xecretoController.createXecreto);
router.get("/xecreto/:id", xecretoController.getXecreto);
router.delete("/xecreto/:id", xecretoController.deleteXecreto);

router.post(
  "/xecreto/:id",
  validateXecretoData,
  xecretoController.updateXecreto
);

// router.get("/xperiencias", xperienciaController.getAllXperiencias)

module.exports = router;
