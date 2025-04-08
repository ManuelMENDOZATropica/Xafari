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
    isInt: {
      options: { min: 0 },
      errorMessage: "Age limits are not valid",
    },
    optional: { checkFalsy: true },
    errorMessage: "Age limits are not valid",
    custom: {
      errorMessage: "Age limits are not valid",
      options: (value, { req }) => {
        const maxAge = req.body.maxAge;
        if (
          value !== null &&
          maxAge !== null &&
          Number(value) > Number(maxAge)
        ) {
          return false;
        }
        return true;
      },
    },
  },
  maxAge: {
    isInt: true,
    optional: {
      checkFalsy: true,
    },
    errorMessage: "Age limits are not valid",
  },
};
