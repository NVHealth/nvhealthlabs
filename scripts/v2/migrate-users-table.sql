-- Migration script to clean up legacy verification columns from users table
-- Run this after ensuring the verification_codes table is working properly

-- Remove legacy verification columns that are now handled by verification_codes table
ALTER TABLE users DROP COLUMN IF EXISTS phone_verification_code;
ALTER TABLE users DROP COLUMN IF EXISTS phone_verification_expires;
ALTER TABLE users DROP COLUMN IF EXISTS verification_attempts;
ALTER TABLE users DROP COLUMN IF EXISTS last_verification_attempt;
ALTER TABLE users DROP COLUMN IF EXISTS email_verified;
ALTER TABLE users DROP COLUMN IF EXISTS phone_verified;

-- Add two_factor_enabled column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE;

-- Ensure the updated_at trigger exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Recreate the trigger to ensure it works
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
