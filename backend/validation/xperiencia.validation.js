const { body, param } = require("express-validator");

exports.createXperienciaValidation = [
  body("qrCode").optional().isString(),
  body("isValidable").isBoolean().withMessage("isValidable is required"),
];

exports.updateXperienciaValidation = [
  param("id").isUUID().withMessage("Valid xperiencia ID is required"),
  body("qrCode").optional().isString(),
  body("isValidable")
    .optional()
    .isBoolean()
    .withMessage("isValidable is required"),
];

exports.xperienciaIdParam = [
  param("id").isUUID().withMessage("Valid xperiencia ID is required"),
];
