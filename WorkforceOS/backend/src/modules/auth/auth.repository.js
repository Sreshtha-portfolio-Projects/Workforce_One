import { query } from '../../config/database.js';

export const findUserByEmail = async (email) => {
  const result = await query(
    `SELECT u.*, up.full_name, up.phone, up.profile_picture_url
     FROM users u
     LEFT JOIN user_profiles up ON up.user_id = u.id
     WHERE u.email = $1`,
    [email]
  );
  
  return result.rows[0] || null;
};

export const findUserById = async (userId) => {
  const result = await query(
    `SELECT u.*, up.full_name, up.phone, up.profile_picture_url
     FROM users u
     LEFT JOIN user_profiles up ON up.user_id = u.id
     WHERE u.id = $1`,
    [userId]
  );
  
  return result.rows[0] || null;
};

export const createUser = async ({ email, passwordHash, userType }) => {
  const result = await query(
    `INSERT INTO users (email, password_hash, user_type, is_active, is_email_verified, created_at, updated_at)
     VALUES ($1, $2, $3, true, false, NOW(), NOW())
     RETURNING id, email, user_type, is_active, created_at`,
    [email, passwordHash, userType]
  );
  
  return result.rows[0];
};

export const createUserProfile = async ({ userId, fullName, phone }) => {
  const result = await query(
    `INSERT INTO user_profiles (user_id, full_name, phone, created_at, updated_at)
     VALUES ($1, $2, $3, NOW(), NOW())
     RETURNING id, user_id, full_name, phone`,
    [userId, fullName, phone]
  );
  
  return result.rows[0];
};

export const createCandidate = async ({ userId, candidateCode }) => {
  const result = await query(
    `INSERT INTO candidates (user_id, candidate_code, status, is_profile_complete, profile_completion_percentage, created_at, updated_at)
     VALUES ($1, $2, 'draft', false, 0, NOW(), NOW())
     RETURNING id, user_id, candidate_code, status`,
    [userId, candidateCode]
  );
  
  return result.rows[0];
};

export const updateLastLogin = async (userId) => {
  await query(
    `UPDATE users SET last_login_at = NOW() WHERE id = $1`,
    [userId]
  );
};

export const getUserRoles = async (userId) => {
  const result = await query(
    `SELECT r.name
     FROM user_roles ur
     JOIN roles r ON r.id = ur.role_id
     WHERE ur.user_id = $1`,
    [userId]
  );
  
  return result.rows.map(row => row.name);
};

export const getUserOrganizationId = async (userId, userType) => {
  if (userType === 'employee') {
    const result = await query(
      `SELECT organization_id FROM employees WHERE user_id = $1 AND is_active = true`,
      [userId]
    );
    return result.rows[0]?.organization_id || null;
  }
  
  if (userType === 'candidate') {
    const result = await query(
      `SELECT organization_id FROM candidates WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0]?.organization_id || null;
  }
  
  return null;
};

export const updatePassword = async (userId, passwordHash) => {
  await query(
    `UPDATE users SET password_hash = $1, password_changed_at = NOW(), updated_at = NOW()
     WHERE id = $2`,
    [passwordHash, userId]
  );
};

export const assignRoleToUser = async (userId, roleId, organizationId = null) => {
  const result = await query(
    `INSERT INTO user_roles (user_id, role_id, organization_id, assigned_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (user_id, role_id, organization_id) DO NOTHING
     RETURNING id`,
    [userId, roleId, organizationId]
  );
  
  return result.rows[0];
};
