import express from 'express';
import { authLimiter } from '../../middleware/rateLimit.middleware.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { asyncHandler } from '../../middleware/error.middleware.js';
import * as authController from './auth.controller.js';
import * as authValidator from './auth.validator.js';

const router = express.Router();

router.post(
  '/register/candidate',
  authLimiter,
  authValidator.validateRegister,
  asyncHandler(authController.registerCandidate)
);

router.post(
  '/login',
  authLimiter,
  authValidator.validateLogin,
  asyncHandler(authController.login)
);

router.post(
  '/logout',
  authenticate,
  asyncHandler(authController.logout)
);

router.get(
  '/me',
  authenticate,
  asyncHandler(authController.getCurrentUser)
);

router.post(
  '/forgot-password',
  authLimiter,
  authValidator.validateForgotPassword,
  asyncHandler(authController.forgotPassword)
);

router.post(
  '/reset-password',
  authLimiter,
  authValidator.validateResetPassword,
  asyncHandler(authController.resetPassword)
);

router.post(
  '/refresh-token',
  asyncHandler(authController.refreshToken)
);

router.post(
  '/change-password',
  authenticate,
  authValidator.validateChangePassword,
  asyncHandler(authController.changePassword)
);

export default router;
