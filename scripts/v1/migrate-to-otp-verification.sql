-- Migration to remove email verification tokens and use OTP-based verification
-- Run this after implementing the OTP verification system

-- Remove email verification token fields (no longer needed with OTP)
ALTER TABLE users DROP COLUMN IF EXISTS email_verification_token;
ALTER TABLE users DROP COLUMN IF EXISTS email_verification_expires;
ALTER TABLE users DROP COLUMN IF EXISTS phone_verification_token;

-- Ensure verification_codes table exists with correct structure
CREATE TABLE IF NOT EXISTS verification_codes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    code VARCHAR(10) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('email', 'phone')),
    expires_at TIMESTAMP NOT NULL,
    attempts INTEGER DEFAULT 0,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_verification_codes_user_id ON verification_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_codes_code ON verification_codes(code);
CREATE INDEX IF NOT EXISTS idx_verification_codes_expires_at ON verification_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_verification_codes_type ON verification_codes(type);

-- Clean up any existing unused verification codes
DELETE FROM verification_codes WHERE expires_at < NOW() OR is_used = true;

-- Update any users who were partially verified to require new verification
UPDATE users SET 
    email_verified = false,
    is_active = false
WHERE email_verified = false AND is_active = true;
