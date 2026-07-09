import * as authService from './auth.service.js';
import { successResponse, createdResponse } from '../../utils/response.js';

export const registerCandidate = async (req, res) => {
  const { email, password, fullName, phone } = req.body;
  
  const result = await authService.registerCandidate({
    email,
    password,
    fullName,
    phone
  });
  
  return createdResponse(res, result, 'Registration successful');
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  
  const result = await authService.login(email, password);
  
  return successResponse(res, result, 'Login successful');
};

export const logout = async (req, res) => {
  return successResponse(res, null, 'Logout successful');
};

export const getCurrentUser = async (req, res) => {
  const user = await authService.getUserProfile(req.user.id);
  
  return successResponse(res, user);
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  await authService.forgotPassword(email);
  
  return successResponse(res, null, 'Password reset instructions sent to your email');
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  
  await authService.resetPassword(token, newPassword);
  
  return successResponse(res, null, 'Password reset successful');
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  
  const result = await authService.refreshToken(refreshToken);
  
  return successResponse(res, result, 'Token refreshed');
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  await authService.changePassword(req.user.id, currentPassword, newPassword);
  
  return successResponse(res, null, 'Password changed successfully');
};
