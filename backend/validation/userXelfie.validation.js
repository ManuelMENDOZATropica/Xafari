const { body } = require("express-validator");

const url = body("xelfieUrl").isURL({ protocols: ["https", "http"], require_protocol: true }).withMessage("Valid image url is required");

exports.createUserXelfieValidation = [body("xelfieId").isUUID().withMessage("Valid xelfie ID is required"), url];
exports.updateUserXelfieValidation = [url];
