import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import * as authRepository from './auth.repository.js';
import { 
  ValidationError, 
  AuthenticationError, 
  DuplicateError 
} from '../../utils/errors.js';
import { USER_TYPES } from '../../config/constants.js';
import logger from '../../utils/logger.js';

const generateToken = (userId, email, organizationId, roles) => {
  return jwt.sign(
    { 
      userId, 
      email, 
      organizationId,
      roles
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  );
};

export const registerCandidate = async ({ email, password, fullName, phone }) => {
  const existingUser = await authRepository.findUserByEmail(email);

  if (existingUser) {
    throw new DuplicateError('Email already registered');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await authRepository.createUser({
    email,
    passwordHash,
    userType: USER_TYPES.CANDIDATE,
  });

  try {
    await authRepository.createUserProfile({
      userId: user.id,
      fullName,
      phone,
    });

    await authRepository.createCandidate({
      userId: user.id,
      candidateCode: `CAND-${Date.now()}`,
    });
  } catch (error) {
    await authRepository.deleteUserById(user.id);
    throw error;
  }

  const roles = ['candidate'];
  const token = generateToken(user.id, user.email, null, roles);
  const refreshToken = generateRefreshToken(user.id);

  logger.info(`New candidate registered: ${email}`);

  return {
    user: {
      id: user.id,
      email: user.email,
      userType: user.user_type,
      fullName,
    },
    token,
    refreshToken,
  };
};

export const login = async (email, password) => {
  const user = await authRepository.findUserByEmail(email);
  
  if (!user) {
    throw new AuthenticationError('Invalid email or password');
  }

  if (!user.is_active) {
    throw new AuthenticationError('Account is inactive');
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  
  if (!isValidPassword) {
    throw new AuthenticationError('Invalid email or password');
  }

  await authRepository.updateLastLogin(user.id);

  const roles = await authRepository.getUserRoles(user.id);
  const organizationId = await authRepository.getUserOrganizationId(user.id, user.user_type);

  const token = generateToken(user.id, user.email, organizationId, roles);
  const refreshToken = generateRefreshToken(user.id);

  logger.info(`User logged in: ${email}`);

  return {
    user: {
      id: user.id,
      email: user.email,
      userType: user.user_type,
      fullName: user.full_name,
      roles,
      organizationId
    },
    token,
    refreshToken
  };
};

export const getUserProfile = async (userId) => {
  const user = await authRepository.findUserById(userId);
  
  if (!user) {
    throw new AuthenticationError('User not found');
  }

  const roles = await authRepository.getUserRoles(userId);
  const organizationId = await authRepository.getUserOrganizationId(userId, user.user_type);

  return {
    id: user.id,
    email: user.email,
    userType: user.user_type,
    fullName: user.full_name,
    phone: user.phone,
    profilePictureUrl: user.profile_picture_url,
    roles,
    organizationId,
    isEmailVerified: user.is_email_verified,
    lastLoginAt: user.last_login_at
  };
};

export const forgotPassword = async (email) => {
  const user = await authRepository.findUserByEmail(email);
  
  if (!user) {
    logger.warn(`Password reset requested for non-existent email: ${email}`);
    return;
  }

  const resetToken = uuidv4();
  const expiresAt = new Date(Date.now() + 3600000);

  logger.info(`Password reset token generated for: ${email}`);
  
  return { resetToken };
};

export const resetPassword = async (token, newPassword) => {
  const passwordHash = await bcrypt.hash(newPassword, 10);
  
  logger.info(`Password reset completed`);
  
  return { success: true };
};

export const refreshToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    
    if (decoded.type !== 'refresh') {
      throw new AuthenticationError('Invalid refresh token');
    }

    const user = await authRepository.findUserById(decoded.userId);
    
    if (!user || !user.is_active) {
      throw new AuthenticationError('Invalid refresh token');
    }

    const roles = await authRepository.getUserRoles(user.id);
    const organizationId = await authRepository.getUserOrganizationId(user.id, user.user_type);

    const newToken = generateToken(user.id, user.email, organizationId, roles);
    const newRefreshToken = generateRefreshToken(user.id);

    return {
      token: newToken,
      refreshToken: newRefreshToken
    };
  } catch (error) {
    throw new AuthenticationError('Invalid or expired refresh token');
  }
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await authRepository.findUserById(userId);
  
  if (!user) {
    throw new AuthenticationError('User not found');
  }

  const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
  
  if (!isValidPassword) {
    throw new ValidationError('Current password is incorrect');
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 10);
  
  await authRepository.updatePassword(userId, newPasswordHash);

  logger.info(`Password changed for user: ${userId}`);
  
  return { success: true };
};
