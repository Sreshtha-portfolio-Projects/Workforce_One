import supabase from './supabase.js';

export { supabase };

/**
 * All database access goes through Supabase (PostgREST + service role).
 * No direct PostgreSQL connection / DATABASE_URL required.
 */
export const throwIfDbError = (error) => {
  if (!error) return;

  const err = new Error(error.message || 'Database operation failed');
  err.code = error.code;
  err.details = error.details;
  err.hint = error.hint;
  throw err;
};

export const checkSupabaseConnection = async () => {
  const { error } = await supabase.from('users').select('id').limit(1);

  if (error) {
    if (error.code === '42P01' || error.message?.includes('does not exist')) {
      const migrationError = new Error(
        'Supabase tables are missing. Run database/schema/*.sql in Supabase SQL Editor.'
      );
      migrationError.code = 'SCHEMA_NOT_READY';
      throw migrationError;
    }
    throwIfDbError(error);
  }

  return true;
};

export const flattenUserWithProfile = (row) => {
  if (!row) return null;

  const profile = Array.isArray(row.user_profiles)
    ? row.user_profiles[0]
    : row.user_profiles;

  const { user_profiles, ...user } = row;

  return {
    ...user,
    full_name: profile?.full_name ?? null,
    phone: profile?.phone ?? null,
    profile_picture_url: profile?.profile_picture_url ?? null,
  };
};
