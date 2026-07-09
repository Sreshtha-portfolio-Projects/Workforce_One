import { validationResult } from 'express-validator';
import { ValidationError } from '../utils/errors.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value
    }));

    throw new ValidationError('Validation failed', formattedErrors);
  }
  
  next();
};

export const validateBody = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (error) {
      const details = error.details?.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        type: detail.type
      }));
      
      next(new ValidationError('Validation failed', details));
    }
  };
};

export const validateQuery = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.query, { abortEarly: false });
      next();
    } catch (error) {
      const details = error.details?.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        type: detail.type
      }));
      
      next(new ValidationError('Query validation failed', details));
    }
  };
};

export const validateParams = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.params, { abortEarly: false });
      next();
    } catch (error) {
      const details = error.details?.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        type: detail.type
      }));
      
      next(new ValidationError('Params validation failed', details));
    }
  };
};
