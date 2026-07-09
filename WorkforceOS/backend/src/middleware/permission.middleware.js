import { PermissionError } from '../utils/errors.js';
import { query } from '../config/database.js';
import logger from '../utils/logger.js';

const permissionCache = new Map();

export const hasPermission = async (userId, permissionName) => {
  const cacheKey = `${userId}:${permissionName}`;
  
  if (permissionCache.has(cacheKey)) {
    return permissionCache.get(cacheKey);
  }

  const result = await query(
    `SELECT EXISTS (
      SELECT 1
      FROM user_roles ur
      JOIN role_permissions rp ON rp.role_id = ur.role_id
      JOIN permissions p ON p.id = rp.permission_id
      WHERE ur.user_id = $1 AND p.name = $2
    ) as has_permission`,
    [userId, permissionName]
  );

  const hasAccess = result.rows[0].has_permission;
  
  permissionCache.set(cacheKey, hasAccess);
  setTimeout(() => permissionCache.delete(cacheKey), 300000);

  return hasAccess;
};

export const requirePermission = (...permissions) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return next(new PermissionError('Authentication required'));
      }

      if (req.user.roles && req.user.roles.includes('super_admin')) {
        return next();
      }

      for (const permission of permissions) {
        const allowed = await hasPermission(req.user.id, permission);
        
        if (allowed) {
          return next();
        }
      }

      logger.warn(`Permission denied for user ${req.user.id}. Required permissions: ${permissions.join(', ')}`);
      return next(new PermissionError(`Required permissions: ${permissions.join(' or ')}`));
      
    } catch (error) {
      next(error);
    }
  };
};

export const requireAllPermissions = (...permissions) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return next(new PermissionError('Authentication required'));
      }

      if (req.user.roles && req.user.roles.includes('super_admin')) {
        return next();
      }

      for (const permission of permissions) {
        const allowed = await hasPermission(req.user.id, permission);
        
        if (!allowed) {
          logger.warn(`Permission denied for user ${req.user.id}. Missing permission: ${permission}`);
          return next(new PermissionError(`Missing permission: ${permission}`));
        }
      }

      next();
      
    } catch (error) {
      next(error);
    }
  };
};

export const clearPermissionCache = (userId = null) => {
  if (userId) {
    for (const key of permissionCache.keys()) {
      if (key.startsWith(`${userId}:`)) {
        permissionCache.delete(key);
      }
    }
  } else {
    permissionCache.clear();
  }
};
