import { AppError } from '../utils/errors.js';
import { errorResponse } from '../utils/response.js';
import logger from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error(err);

  if (err instanceof AppError) {
    return errorResponse(res, {
      code: err.code,
      message: err.message,
      details: err.details
    }, err.statusCode);
  }

  if (err.name === 'ValidationError') {
    return errorResponse(res, {
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: err.errors || err.details
    }, 400);
  }

  if (err.code === '23505') {
    return errorResponse(res, {
      code: 'DUPLICATE_ENTRY',
      message: 'Resource already exists',
      details: err.detail
    }, 409);
  }

  if (err.code === '23503') {
    return errorResponse(res, {
      code: 'FOREIGN_KEY_VIOLATION',
      message: 'Referenced resource does not exist',
      details: err.detail
    }, 400);
  }

  if (err.code === '23502') {
    return errorResponse(res, {
      code: 'NOT_NULL_VIOLATION',
      message: 'Required field is missing',
      details: err.detail
    }, 400);
  }

  return errorResponse(res, {
    code: 'INTERNAL_ERROR',
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message,
    details: process.env.NODE_ENV === 'development' ? err.stack : null
  }, 500);
};

export const notFoundHandler = (req, res) => {
  return errorResponse(res, {
    code: 'NOT_FOUND',
    message: `Route ${req.originalUrl} not found`
  }, 404);
};

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
