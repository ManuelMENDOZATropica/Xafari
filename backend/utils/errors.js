class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = 400;
  }
}

class AgeRestrictionError extends Error {
  constructor(message) {
    super(message);
    this.name = "AgeRestrictionError";
    this.statusCode = 403;
  }
}

module.exports = { NotFoundError, BadRequestError, AgeRestrictionError };
