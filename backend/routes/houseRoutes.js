const express = require("express");
const router = express.Router();
const { checkSchema, matchedData } = require("express-validator");

const houseController = require("../controllers/houseController");
const { ValidationError } = require("../utils/errors");

const HouseSchema = {
  name: {
    trim: true,
    notEmpty: {
      errorMessage: "Name cannot be empty",
    },
    isString: {
      errorMessage: "Name must be a string",
    },
  },
  animal: {
    trim: true,
    notEmpty: {
      errorMessage: "Animal cannot be empty",
    },
    isString: {
      errorMessage: "Animal must be a string",
    },
  },
  element: {
    trim: true,
    notEmpty: {
      errorMessage: "Element cannot be empty",
    },
    isString: {
      errorMessage: "Element must be a string",
    },
  },
};

const validateHouseData = async (req, res, next) => {
  const result = (
    await checkSchema(
      req.method == "POST" && req.params.id
        ? Object.fromEntries(
            Object.entries(HouseSchema).map(([field, value]) => [
              field,
              {
                ...value,
                optional: true,
              },
            ])
          )
        : HouseSchema,
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

router.post("/house", validateHouseData, houseController.createHouse);
router.get("/house/:id", houseController.getHouse);
router.delete("/house/:id", houseController.deleteHouse);
router.post("/house/:id", validateHouseData, houseController.updateHouse);

// router.get("/casa/:id", casaController.getCasa); // done
// router.get("/casas", casaController.getAllCasas); // done
// router.get("/casa/:id/xecretos", casaController.getAllXecretos); // done
// router.get("/casa/:id/xelfies", casaController.getAllXelfies); // done
// router.get("/casa/:id/xperiencias", casaController.getAllXperiencias); // done

// router.delete("/casa/:id", casaController.deleteCasa); // done

// router.post("/casa", casaController.addCasa); // done
// router.post("/casa/:id/xecretos", casaController.addXecreto); // done
// router.post("/casa/:id/xelfies", casaController.addXelfie);// done
// router.post("/casa/:id/xperiencias", casaController.addXperiencia);

module.exports = router;
