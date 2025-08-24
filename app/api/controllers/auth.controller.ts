import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '../services/auth.service'
import { 
  ErrorHandler,
  ValidationError,
  asyncHandler,
  ResponseHelper
} from '../utils/errorHandler'
import { 
  loginSchema,
  registerSchema,
  changePasswordSchema,
  validateSchema
} from '../schemas/user.schema'
import { UserRole, MESSAGES, STATUS_CODES } from '../config/constants'
import { AuthMiddleware } from '../middlewares/auth.middleware'

export class AuthController {
  /**
   * POST /api/auth/register
   */
  static register = asyncHandler(async (request: NextRequest): Promise<NextResponse> => {
    const body = await request.json()
    
    // Validate input
    const userData = validateSchema(registerSchema, body)
    
    // Ensure role is set
    const userDataWithRole = {
      ...userData,
      role: userData.role || UserRole.PATIENT
    }
    
    // Register user
    const result = await AuthService.register(userDataWithRole)
    
    // Log registration
    AuthMiddleware.logSecurityEvent(
      'USER_REGISTRATION',
      request,
      undefined,
      { 
        email: result.user.email,
        role: result.user.role 
      }
    )

    return ResponseHelper.success(
      result,
      MESSAGES.SUCCESS.USER_CREATED,
      STATUS_CODES.CREATED
    )
  })

  /**
   * POST /api/auth/login
   */
  static login = asyncHandler(async (request: NextRequest): Promise<NextResponse> => {
    const body = await request.json()
    
    // Validate input
    const credentials = validateSchema(loginSchema, body)
    
    // Rate limiting check
    const clientIP = AuthMiddleware.getClientIP(request)
    if (!AuthMiddleware.rateLimit(`auth:${clientIP}`, 5, 15 * 60 * 1000)) {
      AuthMiddleware.logSecurityEvent(
        'RATE_LIMIT_EXCEEDED',
        request,
        undefined,
        { type: 'auth', ip: clientIP }
      )
      
      return NextResponse.json(
        {
          success: false,
          error: 'Too many login attempts. Please try again later.',
        },
        { status: STATUS_CODES.TOO_MANY_REQUESTS }
      )
    }

    try {
      // Attempt login
      const result = await AuthService.login(credentials)
      
      // Log successful login
      AuthMiddleware.logSecurityEvent(
        'USER_LOGIN_SUCCESS',
        request,
        {
          userId: result.user.id,
          email: result.user.email,
          role: result.user.role
        }
      )

      return ResponseHelper.success(
        result,
        MESSAGES.SUCCESS.LOGIN_SUCCESS
      )
    } catch (error) {
      // Log failed login attempt
      AuthMiddleware.logSecurityEvent(
        'USER_LOGIN_FAILED',
        request,
        undefined,
        { 
          email: credentials.email,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      )
      
      throw error
    }
  })

  /**
   * POST /api/auth/refresh
   */
  static refresh = asyncHandler(async (request: NextRequest): Promise<NextResponse> => {
    const { refreshToken } = await request.json()
    
    if (!refreshToken) {
      throw new ValidationError('Refresh token is required')
    }

    const result = await AuthService.refreshToken(refreshToken)
    
    return ResponseHelper.success(result, 'Token refreshed successfully')
  })

  /**
   * POST /api/auth/logout
   */
  static logout = asyncHandler(async (request: NextRequest): Promise<NextResponse> => {
    const user = await AuthMiddleware.extractUser(request)
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (token) {
      await AuthService.logout(token)
    }

    // Log logout event
    if (user) {
      AuthMiddleware.logSecurityEvent(
        'USER_LOGOUT',
        request,
        user
      )
    }

    return ResponseHelper.success(
      null,
      MESSAGES.SUCCESS.LOGOUT_SUCCESS
    )
  })

  /**
   * POST /api/auth/change-password
   */
  static changePassword = asyncHandler(async (request: NextRequest): Promise<NextResponse> => {
    const user = await AuthMiddleware.verifyToken(request)
    const body = await request.json()
    
    // Validate input
    const passwordData = validateSchema(changePasswordSchema, body)
    
    // Change password
    await AuthService.changePassword(
      user.userId,
      passwordData.currentPassword,
      passwordData.newPassword
    )

    // Log password change
    AuthMiddleware.logSecurityEvent(
      'PASSWORD_CHANGED',
      request,
      user
    )

    return ResponseHelper.success(
      null,
      'Password changed successfully'
    )
  })

  /**
   * GET /api/auth/me
   */
  static getCurrentUser = asyncHandler(async (request: NextRequest): Promise<NextResponse> => {
    const user = await AuthMiddleware.verifyToken(request)
    
    // Get full user details (without sensitive information)
    const { UserService } = await import('../services/user.service')
    const userData = await UserService.getUserById(user.userId)

    return ResponseHelper.success(userData)
  })

  /**
   * POST /api/auth/verify-email
   */
  static verifyEmail = asyncHandler(async (request: NextRequest): Promise<NextResponse> => {
    const { token } = await request.json()
    
    if (!token) {
      throw new ValidationError('Verification token is required')
    }

    // In a real implementation, you would:
    // 1. Decode/verify the email verification token
    // 2. Mark the user as verified in the database
    // 3. Send a welcome email
    
    // For demo purposes, we'll just return success
    AuthMiddleware.logSecurityEvent(
      'EMAIL_VERIFIED',
      request,
      undefined,
      { token: 'present' }
    )

    return ResponseHelper.success(
      null,
      'Email verified successfully'
    )
  })

  /**
   * POST /api/auth/forgot-password
   */
  static forgotPassword = asyncHandler(async (request: NextRequest): Promise<NextResponse> => {
    const { email } = await request.json()
    
    if (!email) {
      throw new ValidationError('Email is required')
    }

    // In a real implementation, you would:
    // 1. Check if user exists
    // 2. Generate password reset token
    // 3. Send password reset email
    // 4. Store reset token in database with expiration
    
    // For demo purposes, we'll just log the attempt
    AuthMiddleware.logSecurityEvent(
      'PASSWORD_RESET_REQUESTED',
      request,
      undefined,
      { email }
    )

    return ResponseHelper.success(
      null,
      'If an account with this email exists, you will receive a password reset link'
    )
  })

  /**
   * POST /api/auth/reset-password
   */
  static resetPassword = asyncHandler(async (request: NextRequest): Promise<NextResponse> => {
    const { token, newPassword } = await request.json()
    
    if (!token || !newPassword) {
      throw new ValidationError('Reset token and new password are required')
    }

    // In a real implementation, you would:
    // 1. Verify the reset token
    // 2. Check if token is not expired
    // 3. Update user password
    // 4. Invalidate the reset token
    
    // For demo purposes, we'll just log the attempt
    AuthMiddleware.logSecurityEvent(
      'PASSWORD_RESET_COMPLETED',
      request,
      undefined,
      { token: 'present' }
    )

    return ResponseHelper.success(
      null,
      'Password has been reset successfully'
    )
  })
}
