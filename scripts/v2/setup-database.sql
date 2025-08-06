-- NVHealth Labs Database Schema
-- HIPAA-compliant design with proper indexing and constraints

-- Users table (patients, admins, diagnostic center admins)
-- Updated to match existing database structure but with improvements
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NULL, -- Optional: can be NULL during signup
    password_hash VARCHAR(255) NOT NULL,
    
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NULL, -- Only if required; consider offset/hashing
    gender VARCHAR(10) NULL CHECK (gender IN ('male', 'female', 'other')),

    role VARCHAR(20) NOT NULL DEFAULT 'patient' CHECK (role IN ('patient', 'platform_admin', 'center_admin')),

    -- Status Flags (consolidated verification)
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,  -- All identity checks passed
    is_active BOOLEAN NOT NULL DEFAULT TRUE,     -- Account not locked/suspended
    
    -- Timestamps (UTC recommended)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,

    -- Constraints & Indexes
    CONSTRAINT users_email_key UNIQUE (email),
    CONSTRAINT users_phone_key UNIQUE (phone)
);

-- Create indexes for users table
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_is_verified ON users(is_verified);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_updated_at ON users(updated_at);

-- Verification codes table for OTP-based authentication
CREATE TABLE IF NOT EXISTS verification_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    
    channel VARCHAR(10) NOT NULL CHECK (channel IN ('email', 'sms')), -- How was OTP delivered?
    purpose VARCHAR(20) NOT NULL CHECK (purpose IN ('signup', 'login', 'password_reset')), -- Why was it sent?

    code_hash CHAR(60) NOT NULL, -- bcrypt hash of the 6-digit OTP (never store plaintext!)
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE, -- Prevent reuse
    attempts SMALLINT NOT NULL DEFAULT 0, -- Rate limiting
    last_attempt_at TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign Key
    CONSTRAINT verification_codes_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for verification_codes table
CREATE INDEX IF NOT EXISTS idx_verification_codes_user_id ON verification_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_codes_channel ON verification_codes(channel);
CREATE INDEX IF NOT EXISTS idx_verification_codes_purpose ON verification_codes(purpose);
CREATE INDEX IF NOT EXISTS idx_verification_codes_expires_at ON verification_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_verification_codes_used ON verification_codes(used);
CREATE INDEX IF NOT EXISTS idx_verification_codes_created_at ON verification_codes(created_at);
CREATE INDEX IF NOT EXISTS idx_verification_codes_last_attempt_at ON verification_codes(last_attempt_at);

-- Composite index for common queries (finding active OTP for user)
CREATE INDEX IF NOT EXISTS idx_verification_codes_user_purpose_active ON verification_codes(user_id, purpose, used, expires_at);

-- Create trigger function for updating updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();


-- Audit log table for security and compliance (HIPAA)
CREATE TABLE IF NOT EXISTS user_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID, -- Nullable: for pre-login events like failed login
    action VARCHAR(50) NOT NULL CHECK (
        action IN (
            'user_created',
            'login_attempt',
            'login_success',
            'login_failure',
            'logout',
            'password_reset_request',
            'password_reset_complete',
            'profile_updated',
            '2fa_enabled',
            '2fa_disabled',
            'account_locked',
            'account_unlocked',
            'data_access_patient',
            'session_expired'
        )
    ),
    details JSONB, -- Structured data: IP, user agent, metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance and compliance queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON user_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON user_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON user_audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_action ON user_audit_logs(user_id, action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at_desc ON user_audit_logs(created_at DESC);