import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { UserService } from '@/lib/user-service'
import { AuditLogger } from '../audit/audit-logger'
import { RateLimiter } from './rate-limiter'
import { Role } from '@/lib/generated/prisma'

interface AuthenticatedUser {
  id: string
  email: string
  role: Role
  isActive: boolean
  isVerified: boolean
}

interface AuthOptions {
  allowedRoles?: Role[]
  requireVerification?: boolean
  requireActive?: boolean
  rateLimitKey?: string
  skipRateLimit?: boolean
}

export class AuthMiddleware {
  private static readonly JWT_SECRET = process.env.JWT_SECRET!
  private static readonly RATE_LIMITER = new RateLimiter()

  /**
   * Authenticate and authorize request
   * @param request - Next.js request object
   * @param options - Authentication options
   * @returns Authenticated user or throws error
   */
  static async authenticate(
    request: NextRequest,
    options: AuthOptions = {}
  ): Promise<AuthenticatedUser> {
    const {
      allowedRoles,
      requireVerification = true,
      requireActive = true,
      rateLimitKey,
      skipRateLimit = false
    } = options

    const ip = this.getClientIP(request)
    const userAgent = request.headers.get('user-agent') || 'unknown'

    try {
      // Rate limiting
      if (!skipRateLimit && rateLimitKey) {
        await this.RATE_LIMITER.checkLimit(rateLimitKey, ip)
      }

      // Extract JWT token
      const token = this.extractToken(request)
      if (!token) {
        await AuditLogger.log({
          action: 'auth_failed',
          details: { reason: 'missing_token', ip, userAgent },
          severity: 'medium'
        })
        throw new AuthError('Authentication required', 'MISSING_TOKEN', 401)
      }

      // Verify JWT
      const decoded = this.verifyToken(token)
      
      // Get user from database
      const user = await UserService.getUserById(decoded.userId)
      if (!user) {
        await AuditLogger.log({
          action: 'auth_failed',
          details: { reason: 'user_not_found', userId: decoded.userId, ip, userAgent },
          severity: 'high'
        })
        throw new AuthError('Invalid token', 'INVALID_TOKEN', 401)
      }

      // Validate user status
      this.validateUserStatus(user, requireActive, requireVerification)

      // Check role-based access
      if (allowedRoles && !allowedRoles.includes(user.role)) {
        await AuditLogger.log({
          action: 'auth_forbidden',
          userId: user.id,
          details: { 
            userRole: user.role, 
            requiredRoles: allowedRoles,
            ip, 
            userAgent 
          },
          severity: 'high'
        })
        throw new AuthError('Insufficient permissions', 'FORBIDDEN', 403)
      }

      // Log successful authentication
      await AuditLogger.log({
        action: 'auth_success',
        userId: user.id,
        details: { role: user.role, ip, userAgent },
        severity: 'low'
      })

      return user as AuthenticatedUser

    } catch (error) {
      if (error instanceof AuthError) {
        throw error
      }
      
      await AuditLogger.log({
        action: 'auth_error',
        details: { 
          error: error instanceof Error ? error.message : String(error), 
          ip, 
          userAgent 
        },
        severity: 'high'
      })
      
      throw new AuthError('Authentication failed', 'INTERNAL_ERROR', 500)
    }
  }

  /**
   * Create authentication middleware for API routes
   */
  static withAuth(
    handler: (request: NextRequest, user: AuthenticatedUser) => Promise<Response>,
    options: AuthOptions = {}
  ) {
    return async (request: NextRequest): Promise<Response> => {
      try {
        const user = await this.authenticate(request, options)
        return await handler(request, user)
      } catch (error) {
        if (error instanceof AuthError) {
          return NextResponse.json(
            { 
              error: error.message,
              code: error.code,
              timestamp: new Date().toISOString()
            },
            { status: error.statusCode }
          )
        }
        
        return NextResponse.json(
          { 
            error: 'Internal server error',
            code: 'INTERNAL_ERROR',
            timestamp: new Date().toISOString()
          },
          { status: 500 }
        )
      }
    }
  }

  private static extractToken(request: NextRequest): string | null {
    const authHeader = request.headers.get('authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7)
    }
    
    // Fallback to cookie for web sessions
    const cookieToken = request.cookies.get('auth_token')?.value
    return cookieToken || null
  }

  private static verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.JWT_SECRET)
    } catch (error) {
      throw new AuthError('Invalid token', 'INVALID_TOKEN', 401)
    }
  }

  private static validateUserStatus(
    user: any,
    requireActive: boolean,
    requireVerification: boolean
  ): void {
    if (requireActive && !user.isActive) {
      throw new AuthError('Account deactivated', 'ACCOUNT_INACTIVE', 401)
    }

    if (requireVerification && !user.isVerified) {
      throw new AuthError('Account not verified', 'ACCOUNT_UNVERIFIED', 401)
    }
  }

  private static getClientIP(request: NextRequest): string {
    return (
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') ||
      'unknown'
    )
  }
}

export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number
  ) {
    super(message)
    this.name = 'AuthError'
  }
}

// Role-based decorators for easier use
export const requirePatient = (options: Omit<AuthOptions, 'allowedRoles'> = {}) => ({
  ...options,
  allowedRoles: ['patient' as Role]
})

export const requireCenterAdmin = (options: Omit<AuthOptions, 'allowedRoles'> = {}) => ({
  ...options,
  allowedRoles: ['center_admin' as Role]
})

export const requirePlatformAdmin = (options: Omit<AuthOptions, 'allowedRoles'> = {}) => ({
  ...options,
  allowedRoles: ['platform_admin' as Role]
})

export const requireAdmin = (options: Omit<AuthOptions, 'allowedRoles'> = {}) => ({
  ...options,
  allowedRoles: ['center_admin' as Role, 'platform_admin' as Role]
})

export const requireAnyRole = (roles: Role[], options: Omit<AuthOptions, 'allowedRoles'> = {}) => ({
  ...options,
  allowedRoles: roles
})
