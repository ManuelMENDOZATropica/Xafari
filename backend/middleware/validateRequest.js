const { validationResult } = require("express-validator");
const { ValidationError } = require("../utils/errors");
const logger = require("../utils/logger");


exports.validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array().map((err) => ({
      field: err.param,
      issue: err.msg,
    }));
    
    logger.error(JSON.stringify(details))
    return next(new ValidationError("Validation failed", details));
  }
  next();
};
