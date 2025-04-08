const express = require("express");
const router = express.Router();
const familyTreeController = require("../controllers/familyTreeController");
const { checkSchema, matchedData } = require("express-validator");
const { ValidationError } = require("../utils/errors");

const familyTreeSchema = {
  name: {
    trim: true,
    notEmpty: {
      errorMessage: "Name cannot be empty",
    },
    isString: {
      errorMessage: "Name must be a string",
    },
  },
  members: {
    isArray: true,
    optional: true,
  },
  "members.*": {
    trim: true,
    notEmpty: {
      errorMessage: "Family member cannot be empty",
    },
    isString: {
      errorMessage: "Family member must be a string",
    },
  },
  adminId: {
    trim: true,
    notEmpty: {
      errorMessage: "AdminId cannot be empty",
    },
    isString: {
      errorMessage: "AdminId must be a string",
    },
  },
};

const validateFamilyTreeData = async (req, _res, next) => {
  const result = (
    await checkSchema(
      req.method == "POST" && req.params.id
        ? Object.fromEntries(
            Object.entries(familyTreeSchema).map(([field, value]) => [
              field,
              {
                ...value,
                optional: true,
              },
            ])
          )
        : familyTreeSchema,
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
  "/familyTree",
  validateFamilyTreeData,
  familyTreeController.createFamilyTree
);
router.get("/familyTree/:id", familyTreeController.getFamilyTree);
router.delete("/familyTree/:id", familyTreeController.deleteFamilyTree);
router.post(
  "/familyTree/:id",
  validateFamilyTreeData,
  familyTreeController.updateFamilyTree
);
module.exports = router;
