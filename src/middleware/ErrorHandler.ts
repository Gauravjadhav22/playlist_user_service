class UnauthorizedError extends Error {
  statusCode: number;
  constructor(message?: string) {
    super(message || "Unauthorized");
    this.name = "UnauthorizedError";
    this.statusCode = 401;
  }
}

class InvalidTokenError extends Error {
  statusCode: number;
  constructor(message?: string) {
    super(message || "Invalid token");
    this.name = "InvalidTokenError";
    this.statusCode = 401;
  }
}
class BadRequestError extends Error {
  statusCode: number;
  constructor(message?: string) {
    super(message || "Bad request");
    this.name = "BadRequestError";
    this.statusCode = 400;
  }
}
class InternalServerError extends Error {
  statusCode: number;
  constructor(message?: string) {
    super(message || "Internal server error");
    this.name = "InternalServerError";
    this.statusCode = 500;
  }
}

class ForbiddenError extends Error {
  statusCode: number;
  constructor(message?: string) {
    super(message || "Forbidden");
    this.name = "ForbiddenError";
    this.statusCode = 403;
  }
}

const errorHandler = (err, req, res, next) => {
  if (
    err instanceof UnauthorizedError ||
    err instanceof InvalidTokenError ||
    err instanceof ForbiddenError ||
    err instanceof BadRequestError ||
    err instanceof InternalServerError
  ) {
    res.status(err.statusCode).json({ message: err.message });
  } else {
    res.status(500).json({ message: "Internal server error" });
  }
};
class NotFoundError extends Error {
  statusCode: number;
  constructor(message?: string) {
    super(message || "Not found");
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

class CustomError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
      super(message);
      this.name = this.constructor.name;
      this.statusCode = statusCode;
    }
  }
  
export {
  ForbiddenError,
  BadRequestError,
  InternalServerError,
  errorHandler,
  NotFoundError,
  CustomError,InvalidTokenError,UnauthorizedError
};
