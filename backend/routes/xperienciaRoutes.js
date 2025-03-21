const express = require("express");
const router = express.Router();
const { checkSchema, matchedData } = require("express-validator");

const activitySchema = require("./activitySchema");

const xperienciaController = require("../controllers/xperienciaController");
const { ValidationError } = require("../utils/errors");

const XperienciaSchema = {
  ...activitySchema,
  qrCode: {
    notEmpty: true,
    optional: true,
  },
  isValidable: {
    isBoolean: true,
  },
};

const validateXperienciaData = async (req, res, next) => {
  const result = (
    await checkSchema(
      req.method == "POST" && req.params.id
        ? Object.fromEntries(
            Object.entries(XperienciaSchema).map(([field, value]) => [
              field,
              {
                ...value,
                optional: true,
              },
            ])
          )
        : XperienciaSchema,
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
  "/xperiencia",
  validateXperienciaData,
  xperienciaController.createXperiencia
);
router.get("/xperiencia/:id", xperienciaController.getXperiencia);
router.delete("/xperiencia/:id", xperienciaController.deleteXperiencia);

router.post(
  "/xperiencia/:id",
  validateXperienciaData,
  xperienciaController.updateXperiencia
);

// router.get("/xperiencias", xperienciaController.getAllXperiencias)

module.exports = router;
