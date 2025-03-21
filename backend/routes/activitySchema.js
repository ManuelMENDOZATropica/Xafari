module.exports = {
  name: {
    notEmpty: {
      errorMessage: "Name cannot be empty",
    },
  },
  description: {
    notEmpty: {
      errorMessage: "Description cannot be empty",
    },
  },
  location: {
    notEmpty: {
      errorMessage: "Location cannot be empty",
    },
  },
  isActive: {
    isBoolean: true,
    optional: true,
    errorMessage: "isActive invalid value",
  },
  minAge: {
    isInt: true,
    optional: { checkFalsy: true },
    errorMessage: "Age limits are not valid",
  },
  maxAge: {
    isInt: true,
    optional: {
      checkFalsy: true,
    },
    errorMessage: "Age limits are not valid",
  },
};
