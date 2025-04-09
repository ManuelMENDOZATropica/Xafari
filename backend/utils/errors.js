const {
  ValidationError: SequelizeValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
  DatabaseError: SequelizeDatabaseError,
  ConnectionError,
} = require("sequelize");
const logger = require("./logger");

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthenticationError";
    this.statusCode = 401;
  }
}

class ResourceNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "ResourceNotFoundError";
    this.statusCode = 404;
  }
}

class ResourceConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "ResourceConflictError";
    this.statusCode = 409;
  }
}

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = "BadRequestError";
    this.statusCode = 400;
  }
}

class DatabaseError extends Error {
  constructor(message) {
    super(message);
    this.name = "DatabaseError";
    this.statusCode = 500;
  }
}

function handleSequelizeError(error, resource) {
  logger.error(error);
  if (error instanceof UniqueConstraintError) {
    // Violación de restricción única
    return new ValidationError(`${resource || "Record"} already exists`);
  } else if (error instanceof ForeignKeyConstraintError) {
    // Violación de clave foránea
    return new ValidationError("Invalid reference on database");
  } else if (error instanceof SequelizeDatabaseError) {
    // Errores de base de datos
    return new DatabaseError("Database Error");
  } else if (error instanceof ConnectionError) {
    // Errores de conexión
    return new DatabaseError("Database Connection error");
  } else {
    return new DatabaseError(`Internal server error: "${error.message}". `);
  }
}

module.exports = {
  handleSequelizeError,
  ValidationError,
  AuthenticationError,
  ResourceNotFoundError,
  ResourceConflictError,
  BadRequestError,
  DatabaseError,
};
