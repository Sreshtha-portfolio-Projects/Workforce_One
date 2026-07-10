-- Add password reset + OAuth provider fields to users
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(255),
  ADD COLUMN IF NOT EXISTS password_reset_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(50) DEFAULT 'email',
  ADD COLUMN IF NOT EXISTS provider_user_id VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_users_password_reset_token
  ON users(password_reset_token)
  WHERE password_reset_token IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_users_provider
  ON users(auth_provider, provider_user_id);
