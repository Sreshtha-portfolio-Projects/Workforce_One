import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import * as authRepository from './auth.repository.js';
import {
  ValidationError,
  AuthenticationError,
  DuplicateError,
} from '../../utils/errors.js';
import { USER_TYPES } from '../../config/constants.js';
import logger from '../../utils/logger.js';
import supabase from '../../config/supabase.js';

const generateToken = (userId, email, organizationId, roles) => {
  return jwt.sign(
    {
      userId,
      email,
      organizationId,
      roles,
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

const buildAuthResponse = async (user, fullNameOverride = null) => {
  const roles = await authRepository.getUserRoles(user.id);
  const organizationId = await authRepository.getUserOrganizationId(user.id, user.user_type);
  const effectiveRoles = roles.length ? roles : [user.user_type === 'candidate' ? 'candidate' : user.user_type];

  const token = generateToken(user.id, user.email, organizationId, effectiveRoles);
  const refreshToken = generateRefreshToken(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
      userType: user.user_type,
      fullName: fullNameOverride || user.full_name,
      roles: effectiveRoles,
      organizationId,
    },
    token,
    refreshToken,
  };
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
    authProvider: 'email',
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

  logger.info(`New candidate registered: ${email}`);
  return buildAuthResponse({ ...user, full_name: fullName }, fullName);
};

export const login = async (email, password) => {
  const user = await authRepository.findUserByEmail(email);

  if (!user) {
    throw new AuthenticationError('Invalid email or password');
  }

  if (!user.is_active) {
    throw new AuthenticationError('Account is inactive');
  }

  if (!user.password_hash) {
    throw new AuthenticationError(
      `This account uses ${user.auth_provider || 'social'} login. Please continue with Google or LinkedIn.`
    );
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);

  if (!isValidPassword) {
    throw new AuthenticationError('Invalid email or password');
  }

  await authRepository.updateLastLogin(user.id);
  logger.info(`User logged in: ${email}`);
  return buildAuthResponse(user);
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
    lastLoginAt: user.last_login_at,
  };
};

export const forgotPassword = async (email) => {
  const user = await authRepository.findUserByEmail(email);

  // Always return success to avoid email enumeration
  if (!user) {
    logger.warn(`Password reset requested for non-existent email: ${email}`);
    return { resetToken: null };
  }

  if (!user.password_hash && user.auth_provider && user.auth_provider !== 'email') {
    throw new ValidationError(
      `This account uses ${user.auth_provider} login. Password reset is not available.`
    );
  }

  const resetToken = uuidv4();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await authRepository.setPasswordResetToken(user.id, resetToken, expiresAt);
  logger.info(`Password reset token generated for: ${email}`);

  // Dev-friendly: return token so FE can complete reset without email provider yet
  const payload = {
    message: 'If an account exists, password reset instructions were generated.',
  };

  if (process.env.NODE_ENV !== 'production') {
    payload.resetToken = resetToken;
    payload.resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
  }

  return payload;
};

export const resetPassword = async (token, newPassword) => {
  const user = await authRepository.findUserByResetToken(token);

  if (!user) {
    throw new ValidationError('Invalid or expired reset token');
  }

  if (!user.password_reset_expires_at || new Date(user.password_reset_expires_at) < new Date()) {
    throw new ValidationError('Invalid or expired reset token');
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await authRepository.updatePassword(user.id, passwordHash);

  logger.info(`Password reset completed for user: ${user.id}`);
  return { success: true };
};

export const refreshToken = async (tokenValue) => {
  try {
    if (!tokenValue) {
      throw new AuthenticationError('Invalid or expired refresh token');
    }

    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);

    if (decoded.type !== 'refresh') {
      throw new AuthenticationError('Invalid refresh token');
    }

    const user = await authRepository.findUserById(decoded.userId);

    if (!user || !user.is_active) {
      throw new AuthenticationError('Invalid refresh token');
    }

    return buildAuthResponse(user);
  } catch (error) {
    if (error instanceof AuthenticationError) throw error;
    throw new AuthenticationError('Invalid or expired refresh token');
  }
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await authRepository.findUserById(userId);

  if (!user) {
    throw new AuthenticationError('User not found');
  }

  if (!user.password_hash) {
    throw new ValidationError('Password login is not set for this account');
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

/**
 * Sync Supabase OAuth session into WorkforceOS users and issue app JWT.
 * Frontend completes Google/LinkedIn via Supabase Auth, then posts access_token here.
 */
export const loginWithSupabaseOAuth = async (accessToken) => {
  if (!accessToken) {
    throw new ValidationError('Supabase access token is required');
  }

  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data?.user) {
    throw new AuthenticationError('Invalid social login session');
  }

  const oauthUser = data.user;
  const email = oauthUser.email?.toLowerCase();
  const provider = oauthUser.app_metadata?.provider || oauthUser.identities?.[0]?.provider || 'oauth';
  const providerUserId = oauthUser.id;
  const fullName =
    oauthUser.user_metadata?.full_name ||
    oauthUser.user_metadata?.name ||
    email?.split('@')[0] ||
    'User';
  const avatarUrl = oauthUser.user_metadata?.avatar_url || oauthUser.user_metadata?.picture || null;

  if (!email) {
    throw new ValidationError('Social account did not provide an email address');
  }

  let user = await authRepository.findUserByEmail(email);

  if (!user) {
    user = await authRepository.createUser({
      email,
      passwordHash: null,
      userType: USER_TYPES.CANDIDATE,
      authProvider: provider,
      providerUserId,
      isEmailVerified: true,
    });

    try {
      await authRepository.createUserProfile({
        userId: user.id,
        fullName,
        phone: null,
      });

      if (avatarUrl) {
        await authRepository.upsertUserProfile({
          userId: user.id,
          fullName,
          profilePictureUrl: avatarUrl,
        });
      }

      await authRepository.createCandidate({
        userId: user.id,
        candidateCode: `CAND-${Date.now()}`,
      });
    } catch (createError) {
      await authRepository.deleteUserById(user.id);
      throw createError;
    }
  } else {
    await authRepository.linkOAuthProvider(user.id, provider, providerUserId);
    await authRepository.upsertUserProfile({
      userId: user.id,
      fullName: user.full_name || fullName,
      profilePictureUrl: avatarUrl,
    });
  }

  await authRepository.updateLastLogin(user.id);
  const freshUser = await authRepository.findUserById(user.id);

  logger.info(`OAuth login via ${provider}: ${email}`);
  return buildAuthResponse(freshUser, freshUser.full_name || fullName);
};
