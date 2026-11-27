const {
  ValidationError: SequelizeValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
  DatabaseError: SequelizeDatabaseError,
  ConnectionError,
} = require("sequelize");

class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.statusCode = status;
    if (details) this.details = details;
  }
}

class ValidationError extends HttpError {
  constructor(message = "Validation failed", details = []) {
    super(400, message, details);
  }
}
class BadRequestError extends HttpError {
  constructor(message = "Bad Request", details) {
    super(400, message, details);
  }
}
class AuthenticationError extends HttpError {
  constructor(message = "No autorizado") {
    super(401, message);
  }
}
class ForbiddenError extends HttpError {
  constructor(message = "Prohibido") {
    super(403, message);
  }
}
class ResourceNotFoundError extends HttpError {
  constructor(message = "Not Found") {
    super(404, message);
  }
}
class ResourceConflictError extends HttpError {
  constructor(message = "Conflict") {
    super(409, message);
  }
}
class TooManyRequestsError extends HttpError {
  constructor(message = "Too many requests", extra = {}) {
    super(429, message);
    this.extra = extra;
  }
}
class DatabaseError extends HttpError {
  constructor(message = "Internal server error") {
    super(500, message);
  }
}

/**
 * Convierte cualquier error (Sequelize, body-parser, propio) en un HttpError.
 * Nunca expone mensajes internos de la base de datos.
 */
function handleSequelizeError(error, resource = "Record") {
  if (error instanceof HttpError) return error;

  if (error instanceof UniqueConstraintError) {
    return new ResourceConflictError(`${resource} already exists`);
  }
  if (error instanceof SequelizeValidationError) {
    const details = (error.errors || []).map((e) => ({
      field: e.path,
      issue: e.message,
    }));
    return new ValidationError(details[0]?.issue || "Validation failed", details);
  }
  if (error instanceof ForeignKeyConstraintError) {
    return new BadRequestError("Invalid reference");
  }
  if (error instanceof ConnectionError) {
    return new DatabaseError("Database unavailable");
  }
  if (error instanceof SequelizeDatabaseError) {
    // p. ej. "invalid input syntax for type uuid" en Postgres
    if (/invalid input syntax|invalid input value/i.test(error.message || "")) {
      return new BadRequestError("Invalid value");
    }
    return new DatabaseError();
  }
  // body-parser: JSON malformado o payload enorme
  if (error && error.type === "entity.parse.failed") {
    return new BadRequestError("Invalid JSON");
  }
  if (error && error.type === "entity.too.large") {
    return new HttpError(413, "Payload too large");
  }
  if (error && Number.isInteger(error.status) && error.status < 500) {
    return new HttpError(error.status, error.expose ? error.message : "Bad Request");
  }
  return new DatabaseError();
}

module.exports = {
  HttpError,
  ValidationError,
  BadRequestError,
  AuthenticationError,
  ForbiddenError,
  ResourceNotFoundError,
  ResourceConflictError,
  TooManyRequestsError,
  DatabaseError,
  handleSequelizeError,
};
