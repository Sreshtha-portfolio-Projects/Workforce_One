import { ERROR_CODES } from '../config/constants.js';

export class AppError extends Error {
  constructor(message, code, statusCode = 500, details = null) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, ERROR_CODES.VALIDATION_ERROR, 400, details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, ERROR_CODES.AUTHENTICATION_REQUIRED, 401);
  }
}

export class PermissionError extends AppError {
  constructor(message = 'Permission denied') {
    super(message, ERROR_CODES.PERMISSION_DENIED, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, ERROR_CODES.NOT_FOUND, 404);
  }
}

export class DuplicateError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, ERROR_CODES.DUPLICATE_ENTRY, 409);
  }
}

export class InvalidStateError extends AppError {
  constructor(message = 'Invalid state for this operation') {
    super(message, ERROR_CODES.INVALID_STATE, 400);
  }
}

export class FileUploadError extends AppError {
  constructor(message = 'File upload failed') {
    super(message, ERROR_CODES.FILE_UPLOAD_ERROR, 400);
  }
}
