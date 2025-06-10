const { body, param } = require("express-validator");

exports.createUserXelfieValidation = [
  param("userId").isUUID().withMessage("Valid user ID is required"),
  body("xelfieId").isUUID().withMessage("Valid xelfie ID is required"),
  body("xelfieUrl").isURL().withMessage("Valid image url is required"),
];

exports.updateUserXelfieValidation = [
  body("xelfieUrl")
    .optional()
    .isURL()
    .withMessage("Valid image url is required"),
];

exports.userXelfieParamValidation = [
  param("id").isUUID().withMessage("Valid user xelfie ID is required"),
];
