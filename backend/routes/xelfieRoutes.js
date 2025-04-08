const express = require("express");
const router = express.Router();
const { checkSchema, matchedData } = require("express-validator");

const activitySchema = require("./activitySchema");

const xelfieController = require("../controllers/xelfieController");
const { ValidationError } = require("../utils/errors");

const XelfieSchema = {
  ...activitySchema,
};

const validateXelfieData = async (req, res, next) => {
  const result = (
    await checkSchema(
      req.method == "POST" && req.params.id
        ? Object.fromEntries(
            Object.entries(XelfieSchema).map(([field, value]) => [
              field,
              {
                ...value,
                optional: true,
              },
            ])
          )
        : XelfieSchema,
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

router.post("/xelfie", validateXelfieData, xelfieController.createXelfie);
router.get("/xelfie/:id", xelfieController.getXelfie);
router.delete("/xelfie/:id", xelfieController.deleteXelfie);

router.post("/xelfie/:id", validateXelfieData, xelfieController.updateXelfie);

module.exports = router;
