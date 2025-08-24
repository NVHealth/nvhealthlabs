import { z } from 'zod'

// Environment validation schema
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DIRECT_URL: z.string().min(1, 'DIRECT_URL is required'),

  // JWT Configuration
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters long'),
  JWT_EXPIRES_IN: z.string().default('24h'),

  // Email Configuration
  SMTP_HOST: z.string().min(1, 'SMTP_HOST is required'),
  SMTP_PORT: z.string().regex(/^\d+$/, 'SMTP_PORT must be a number').transform(Number),
  SMTP_SECURE: z.string().transform(val => val === 'true').default('false'),
  GMAIL_USER: z.string().email('GMAIL_USER must be a valid email'),
  GMAIL_APP_PASSWORD: z.string().min(1, 'GMAIL_APP_PASSWORD is required'),
  EMAIL_FROM: z.string().min(1, 'EMAIL_FROM is required'),

  // Security Configuration
  BCRYPT_SALT_ROUNDS: z.string().regex(/^\d+$/).transform(Number).default('12'),
  OTP_EXPIRY_MINUTES: z.string().regex(/^\d+$/).transform(Number).default('30'),
  MAX_LOGIN_ATTEMPTS: z.string().regex(/^\d+$/).transform(Number).default('5'),

  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().regex(/^\d+$/).transform(Number).default('3000'),

  // Optional: External services
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
})

export type Environment = z.infer<typeof envSchema>

/**
 * Validates and returns typed environment variables
 * Throws error if validation fails
 */
export function validateEnvironment(): Environment {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join('\n')
      throw new Error(`Environment validation failed:\n${missingVars}`)
    }
    throw error
  }
}

/**
 * Get validated environment variables
 */
export const env = validateEnvironment()

/**
 * HIPAA Security Configuration
 */
export const HIPAA_CONFIG = {
  // Audit logging requirements
  AUDIT_RETENTION_DAYS: 2555, // 7 years for HIPAA compliance
  AUDIT_LOG_LEVEL: 'info',
  
  // Session management
  SESSION_TIMEOUT_MINUTES: env.NODE_ENV === 'production' ? 30 : 480,
  ABSOLUTE_SESSION_TIMEOUT_HOURS: 8,
  
  // Password requirements
  PASSWORD_MIN_LENGTH: 12,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBERS: true,
  PASSWORD_REQUIRE_SPECIAL: true,
  PASSWORD_HISTORY_COUNT: 12, // Remember last 12 passwords
  
  // Account lockout
  MAX_FAILED_ATTEMPTS: 5,
  LOCKOUT_DURATION_MINUTES: 30,
  
  // OTP Configuration
  OTP_MAX_ATTEMPTS: 3,
  OTP_COOLDOWN_SECONDS: 300, // 5 minutes between OTP requests
  
  // Encryption
  ENCRYPTION_ALGORITHM: 'aes-256-gcm',
  
  // Data retention
  DATA_RETENTION_YEARS: 7,
  LOG_RETENTION_YEARS: 7,
  
  // Access controls
  REQUIRE_2FA_FOR_ADMIN: env.NODE_ENV === 'production',
  REQUIRE_2FA_FOR_SENSITIVE_DATA: env.NODE_ENV === 'production',
  
  // Network security
  ALLOWED_ORIGINS: env.NODE_ENV === 'production' ? ['https://nvhealthlabs.com'] : ['http://localhost:3000'],
  RATE_LIMIT_ENABLED: true,
  
  // File upload restrictions
  MAX_FILE_SIZE_MB: 10,
  ALLOWED_FILE_TYPES: ['pdf', 'jpg', 'jpeg', 'png', 'docx'],
  SCAN_UPLOADS_FOR_MALWARE: env.NODE_ENV === 'production'
} as const

/**
 * Database security configuration
 */
export const DB_CONFIG = {
  CONNECTION_TIMEOUT: 10000,
  QUERY_TIMEOUT: 30000,
  MAX_CONNECTIONS: env.NODE_ENV === 'production' ? 20 : 5,
  ENABLE_QUERY_LOGGING: env.NODE_ENV === 'development',
  ENABLE_SLOW_QUERY_LOGGING: true,
  SLOW_QUERY_THRESHOLD_MS: 1000
} as const

/**
 * Validate critical security settings on startup
 */
export function validateSecuritySettings(): void {
  const errors: string[] = []

  // Check JWT secret strength
  if (env.JWT_SECRET.length < 32) {
    errors.push('JWT_SECRET must be at least 32 characters long')
  }

  // Check database connection strings
  if (!env.DATABASE_URL.includes('postgres://')) {
    errors.push('DATABASE_URL must be a valid PostgreSQL connection string')
  }

  // Production-specific checks
  if (env.NODE_ENV === 'production') {
    if (!env.DATABASE_URL.includes('ssl=true') && !env.DATABASE_URL.includes('sslmode=require')) {
      console.warn('WARNING: Database connection should use SSL in production')
    }

    if (env.JWT_SECRET === 'your-secret-key') {
      errors.push('JWT_SECRET must be changed from default value in production')
    }
  }

  if (errors.length > 0) {
    throw new Error(`Security validation failed:\n${errors.join('\n')}`)
  }

  console.log('✅ Security settings validated successfully')
}

/**
 * Initialize security settings on application startup
 */
export function initializeSecurity(): void {
  try {
    validateSecuritySettings()
    
    // Additional security initialization
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error)
      // In production, you might want to gracefully shutdown
      if (env.NODE_ENV === 'production') {
        process.exit(1)
      }
    })

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason)
      // In production, you might want to gracefully shutdown
    })

    console.log('✅ Security initialization complete')
    
  } catch (error) {
    console.error('❌ Security initialization failed:', error)
    process.exit(1)
  }
}
