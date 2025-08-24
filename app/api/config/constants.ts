// Application Constants
export const APP_CONFIG = {
  name: 'NVHealth Labs',
  version: '1.0.0',
  description: 'Healthcare Laboratory Management System',
} as const

// User Roles
export enum UserRole {
  PATIENT = 'patient',
  CENTER_ADMIN = 'center_admin',
  PLATFORM_ADMIN = 'platform_admin',
}

// API Response Messages
export const MESSAGES = {
  SUCCESS: {
    USER_CREATED: 'User created successfully',
    USER_UPDATED: 'User updated successfully',
    USER_DELETED: 'User deleted successfully',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    PROFILE_UPDATED: 'Profile updated successfully',
  },
  ERROR: {
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Insufficient permissions',
    NOT_FOUND: 'Resource not found',
    VALIDATION_ERROR: 'Validation failed',
    INTERNAL_ERROR: 'Internal server error',
    USER_EXISTS: 'User already exists',
    INVALID_CREDENTIALS: 'Invalid email or password',
    TOKEN_EXPIRED: 'Token has expired',
    ACCOUNT_INACTIVE: 'Account is inactive',
    EMAIL_NOT_VERIFIED: 'Email not verified',
  },
} as const

// HTTP Status Codes
export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const

// Rate Limiting
export const RATE_LIMITS = {
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many authentication attempts, please try again later',
  },
  GENERAL: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later',
  },
} as const

// Security Headers
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
} as const

// Database
export const DB_CONFIG = {
  MAX_CONNECTIONS: 20,
  IDLE_TIMEOUT: 30000,
  CONNECTION_TIMEOUT: 60000,
} as const

// JWT
export const JWT_CONFIG = {
  ALGORITHM: 'HS256' as const,
  ISSUER: APP_CONFIG.name,
  AUDIENCE: APP_CONFIG.name,
} as const

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const

// Validation
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  // E.164: up to 15 digits, leading + optional in our validation
  PHONE_REGEX: /^\+?[1-9]\d{7,14}$/,
} as const
