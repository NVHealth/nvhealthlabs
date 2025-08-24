import { z } from 'zod'
import { VALIDATION, UserRole } from '../config/constants'
import { ValidationError } from '../utils/errorHandler'
import { validateAndFormatPhone } from '@/lib/phone'

// Base user schema
export const userSchema = z.object({
  id: z.string().uuid().optional(),
  email: z
    .string()
    .email('Invalid email format')
    .min(1, 'Email is required'),
  firstName: z
    .string()
    .min(VALIDATION.NAME_MIN_LENGTH, `First name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`)
    .max(VALIDATION.NAME_MAX_LENGTH, `First name must be at most ${VALIDATION.NAME_MAX_LENGTH} characters`)
    .regex(/^[a-zA-Z\s'-]+$/, "First name can only contain letters, spaces, apostrophes, and hyphens"),
  lastName: z
    .string()
    .min(VALIDATION.NAME_MIN_LENGTH, `Last name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`)
    .max(VALIDATION.NAME_MAX_LENGTH, `Last name must be at most ${VALIDATION.NAME_MAX_LENGTH} characters`)
    .regex(/^[a-zA-Z\s'-]+$/, "Last name can only contain letters, spaces, apostrophes, and hyphens"),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .refine((val) => VALIDATION.PHONE_REGEX.test(val) || !!validateAndFormatPhone(val).isValid, 'Invalid phone number format')
    .optional(),
  role: z.nativeEnum(UserRole).default(UserRole.PATIENT),
  gender: z.enum(['male', 'female', 'other']).optional(),
  dateOfBirth: z
    .string()
    .datetime()
    .optional()
    .or(z.date().optional()),
  isActive: z.boolean().default(true),
  isVerified: z.boolean().default(false),
  centerId: z.string().uuid().optional(),
})

// User registration schema
export const registerSchema = userSchema.omit({ 
  id: true, 
  isActive: true, 
  isVerified: true 
}).extend({
  password: z
    .string()
    .min(VALIDATION.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  confirmPassword: z.string(),
  // Optional country ISO2 for better phone validation; not persisted
  countryIso2: z.string().regex(/^[A-Z]{2}$/).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

// Normalize phone to E.164 after validation where provided
export const registerSchemaWithTransform = registerSchema.transform((data) => {
  if (data.phone) {
    const parsed = validateAndFormatPhone(data.phone, data.countryIso2)
    if (parsed.isValid && parsed.e164) {
      return { ...data, phone: parsed.e164 }
    }
  }
  return data
})

// User login schema
export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(1, 'Password is required'),
})

// User update schema (for profile updates)
export const updateUserSchema = userSchema
  .omit({ id: true, email: true, role: true })
  .partial()

// Admin user update schema (can update role)
export const adminUpdateUserSchema = userSchema
  .omit({ id: true })
  .partial()
  .extend({
    email: z.string().email().optional(),
  })

// Password reset schema
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z
    .string()
    .min(VALIDATION.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

// Change password schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(VALIDATION.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'New password must be different from current password',
  path: ['newPassword'],
})

// Query parameters schema for user listing
export const userQuerySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  search: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
  isActive: z.coerce.boolean().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'firstName', 'lastName', 'email']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
}).transform((data) => ({
  ...data,
  page: data.page || 1,
  limit: data.limit || 10,
  sortBy: data.sortBy || 'createdAt' as const,
  sortOrder: data.sortOrder || 'desc' as const
}))

// Type inference helpers
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type AdminUpdateUserInput = z.infer<typeof adminUpdateUserSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type UserQuery = z.infer<typeof userQuerySchema>

// Validation helper function
export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join(', ')
  // Throw a typed validation error so the global handler returns 400
  throw new ValidationError(errorMessage)
    }
    throw error
  }
}

// Safe validation that returns success/error result
export function safeValidateSchema<T>(
  schema: z.ZodSchema<T>, 
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data)
  
  if (result.success) {
    return { success: true, data: result.data }
  }
  
  const errors = result.error.errors.map(
    err => `${err.path.join('.')}: ${err.message}`
  )
  
  return { success: false, errors }
}
