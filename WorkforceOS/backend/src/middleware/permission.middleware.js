import { PermissionError } from '../utils/errors.js';
import { supabase, throwIfDbError } from '../config/db.js';
import logger from '../utils/logger.js';

const permissionCache = new Map();

const userHasPermission = (roleRows, permissionName) => {
  if (!roleRows?.length) return false;

  return roleRows.some((userRole) => {
    const role = userRole.roles;
    const rolePermissions = role?.role_permissions || [];

    return rolePermissions.some((rolePermission) => {
      const permission = rolePermission.permissions;
      return permission?.name === permissionName;
    });
  });
};

export const hasPermission = async (userId, permissionName) => {
  const cacheKey = `${userId}:${permissionName}`;

  if (permissionCache.has(cacheKey)) {
    return permissionCache.get(cacheKey);
  }

  const { data, error } = await supabase
    .from('user_roles')
    .select(`
      roles (
        role_permissions (
          permissions ( name )
        )
      )
    `)
    .eq('user_id', userId);

  throwIfDbError(error);

  const hasAccess = userHasPermission(data, permissionName);

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

      if (req.user.roles?.includes('super_admin')) {
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

      if (req.user.roles?.includes('super_admin')) {
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
