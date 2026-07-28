import { StatusCodes } from "http-status-codes";

export class CustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message, StatusCodes.NOT_FOUND);
    this.name = "NotFoundError";
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string) {
    super(message, StatusCodes.BAD_REQUEST);
    this.name = "BadRequestError";
  }
}

export class UnauthenticatedError extends CustomError {
  constructor(message: string) {
    super(message, StatusCodes.UNAUTHORIZED);
    this.name = "UnauthenticatedError";
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string) {
    super(message, StatusCodes.FORBIDDEN);
    this.name = "UnauthorizedError";
  }
}

export class ConflictError extends CustomError {
  constructor(message: string) {
    super(message, StatusCodes.CONFLICT);
    this.name = "ConflictError";
  }
}
