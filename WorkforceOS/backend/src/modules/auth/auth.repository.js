import { supabase, throwIfDbError, flattenUserWithProfile } from '../../config/db.js';

const userWithProfileSelect = `
  *,
  user_profiles (
    full_name,
    phone,
    profile_picture_url
  )
`;

export const findUserByEmail = async (email) => {
  const { data, error } = await supabase
    .from('users')
    .select(userWithProfileSelect)
    .eq('email', email)
    .maybeSingle();

  throwIfDbError(error);
  return flattenUserWithProfile(data);
};

export const findUserById = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select(userWithProfileSelect)
    .eq('id', userId)
    .maybeSingle();

  throwIfDbError(error);
  return flattenUserWithProfile(data);
};

export const createUser = async ({
  email,
  passwordHash = null,
  userType,
  authProvider = 'email',
  providerUserId = null,
  isEmailVerified = false,
}) => {
  const { data, error } = await supabase
    .from('users')
    .insert({
      email,
      password_hash: passwordHash,
      user_type: userType,
      is_active: true,
      is_email_verified: isEmailVerified,
      auth_provider: authProvider,
      provider_user_id: providerUserId,
    })
    .select('id, email, user_type, is_active, created_at, auth_provider')
    .single();

  throwIfDbError(error);
  return data;
};

export const createUserProfile = async ({ userId, fullName, phone }) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert({
      user_id: userId,
      full_name: fullName,
      phone,
    })
    .select('id, user_id, full_name, phone')
    .single();

  throwIfDbError(error);
  return data;
};

export const createCandidate = async ({ userId, candidateCode }) => {
  const { data, error } = await supabase
    .from('candidates')
    .insert({
      user_id: userId,
      candidate_code: candidateCode,
      status: 'draft',
      is_profile_complete: false,
      profile_completion_percentage: 0,
    })
    .select('id, user_id, candidate_code, status')
    .single();

  throwIfDbError(error);
  return data;
};

export const deleteUserById = async (userId) => {
  const { error } = await supabase.from('users').delete().eq('id', userId);
  throwIfDbError(error);
};

export const updateLastLogin = async (userId) => {
  const { error } = await supabase
    .from('users')
    .update({ last_login_at: new Date().toISOString() })
    .eq('id', userId);

  throwIfDbError(error);
};

export const getUserRoles = async (userId) => {
  const { data, error } = await supabase
    .from('user_roles')
    .select('roles ( name )')
    .eq('user_id', userId);

  throwIfDbError(error);
  return (data || [])
    .map((row) => row.roles?.name)
    .filter(Boolean);
};

export const getUserOrganizationId = async (userId, userType) => {
  if (userType === 'employee') {
    const { data, error } = await supabase
      .from('employees')
      .select('organization_id')
      .eq('user_id', userId)
      .eq('is_active', true)
      .maybeSingle();

    throwIfDbError(error);
    return data?.organization_id || null;
  }

  if (userType === 'candidate') {
    const { data, error } = await supabase
      .from('candidates')
      .select('organization_id')
      .eq('user_id', userId)
      .maybeSingle();

    throwIfDbError(error);
    return data?.organization_id || null;
  }

  return null;
};

export const updatePassword = async (userId, passwordHash) => {
  const { error } = await supabase
    .from('users')
    .update({
      password_hash: passwordHash,
      password_changed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      password_reset_token: null,
      password_reset_expires_at: null,
    })
    .eq('id', userId);

  throwIfDbError(error);
};

export const setPasswordResetToken = async (userId, token, expiresAt) => {
  const { error } = await supabase
    .from('users')
    .update({
      password_reset_token: token,
      password_reset_expires_at: expiresAt.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  throwIfDbError(error);
};

export const findUserByResetToken = async (token) => {
  const { data, error } = await supabase
    .from('users')
    .select(userWithProfileSelect)
    .eq('password_reset_token', token)
    .maybeSingle();

  throwIfDbError(error);
  return flattenUserWithProfile(data);
};

export const findUserByProvider = async (authProvider, providerUserId) => {
  const { data, error } = await supabase
    .from('users')
    .select(userWithProfileSelect)
    .eq('auth_provider', authProvider)
    .eq('provider_user_id', providerUserId)
    .maybeSingle();

  throwIfDbError(error);
  return flattenUserWithProfile(data);
};

export const linkOAuthProvider = async (userId, authProvider, providerUserId) => {
  const { data, error } = await supabase
    .from('users')
    .update({
      auth_provider: authProvider,
      provider_user_id: providerUserId,
      is_email_verified: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select('id, email, user_type, is_active')
    .single();

  throwIfDbError(error);
  return data;
};

export const upsertUserProfile = async ({ userId, fullName, phone = null, profilePictureUrl = null }) => {
  const { data: existing, error: findError } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  throwIfDbError(findError);

  if (existing) {
    const updates = { updated_at: new Date().toISOString() };
    if (fullName) updates.full_name = fullName;
    if (phone) updates.phone = phone;
    if (profilePictureUrl) updates.profile_picture_url = profilePictureUrl;

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select('id, user_id, full_name, phone')
      .single();

    throwIfDbError(error);
    return data;
  }

  return createUserProfile({ userId, fullName: fullName || 'User', phone });
};

export const assignRoleToUser = async (userId, roleId, organizationId = null) => {
  const { data, error } = await supabase
    .from('user_roles')
    .upsert(
      {
        user_id: userId,
        role_id: roleId,
        organization_id: organizationId,
        assigned_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,role_id,organization_id', ignoreDuplicates: true }
    )
    .select('id')
    .maybeSingle();

  throwIfDbError(error);
  return data;
};
