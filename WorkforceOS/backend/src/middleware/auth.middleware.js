import jwt from 'jsonwebtoken';
import { AuthenticationError, PermissionError } from '../utils/errors.js';
import logger from '../utils/logger.js';
import { query } from '../config/database.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('No token provided');
    }

    const token = authHeader.substring(7);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const result = await query(
      `SELECT u.*, up.full_name 
       FROM users u
       LEFT JOIN user_profiles up ON up.user_id = u.id
       WHERE u.id = $1 AND u.is_active = true`,
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      throw new AuthenticationError('Invalid token');
    }

    const user = result.rows[0];
    
    const rolesResult = await query(
      `SELECT r.name, r.display_name
       FROM user_roles ur
       JOIN roles r ON r.id = ur.role_id
       WHERE ur.user_id = $1`,
      [user.id]
    );

    const roles = rolesResult.rows.map(r => r.name);

    req.user = {
      id: user.id,
      email: user.email,
      userType: user.user_type,
      fullName: user.full_name,
      roles,
      organizationId: decoded.organizationId
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AuthenticationError('Invalid token'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AuthenticationError('Token expired'));
    }
    next(error);
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    await authenticate(req, res, next);
  } catch (error) {
    next();
  }
};

export const requireUserType = (...allowedTypes) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AuthenticationError());
    }

    if (!allowedTypes.includes(req.user.userType)) {
      return next(new PermissionError('Access denied for this user type'));
    }

    next();
  };
};

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AuthenticationError());
    }

    const hasRole = allowedRoles.some(role => req.user.roles.includes(role));
    
    if (!hasRole) {
      logger.warn(`Access denied for user ${req.user.id}. Required roles: ${allowedRoles.join(', ')}`);
      return next(new PermissionError('Insufficient role privileges'));
    }

    next();
  };
};

export const requireOrganization = async (req, res, next) => {
  if (!req.user) {
    return next(new AuthenticationError());
  }

  if (!req.user.organizationId) {
    return next(new PermissionError('User not assigned to any organization'));
  }

  next();
};
