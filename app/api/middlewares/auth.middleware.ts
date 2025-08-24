import { NextRequest, NextResponse } from 'next/server'
import { JWTUtils, type JWTPayload } from '../utils/jwt'
import { UnauthorizedError, ForbiddenError } from '../utils/errorHandler'
import { MESSAGES } from '../config/constants'

export class AuthMiddleware {
  /**
   * Verify JWT token from request
   */
  static async verifyToken(request: NextRequest): Promise<JWTPayload> {
    const authHeader = request.headers.get('authorization')
    const token = JWTUtils.extractTokenFromHeader(authHeader)

    if (!token) {
      throw new UnauthorizedError('No token provided')
    }

    try {
      return JWTUtils.verifyToken(token)
    } catch (error) {
      throw new UnauthorizedError(
        error instanceof Error ? error.message : 'Invalid token'
      )
    }
  }

  /**
   * Extract user info from token without throwing errors
   */
  static async extractUser(request: NextRequest): Promise<JWTPayload | null> {
    try {
      return await this.verifyToken(request)
    } catch {
      return null
    }
  }

  /**
   * Middleware wrapper for protected routes
   */
  static requireAuth(
    handler: (request: NextRequest, user: JWTPayload, context?: any) => Promise<NextResponse>
  ) {
    return async (request: NextRequest, context?: any): Promise<NextResponse> => {
      try {
        const user = await this.verifyToken(request)
        return await handler(request, user, context)
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          return NextResponse.json(
            {
              success: false,
              error: error.message,
            },
            { status: error.statusCode }
          )
        }
        throw error
      }
    }
  }

  /**
   * Check if user has required role
   */
  static hasRole(user: JWTPayload, requiredRoles: string | string[]): boolean {
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
    return roles.includes(user.role)
  }

  /**
   * Check if user can access resource (owns it or is admin)
   */
  static canAccessResource(
    user: JWTPayload, 
    resourceUserId: string, 
    adminRoles: string[] = ['platform_admin']
  ): boolean {
    return user.userId === resourceUserId || this.hasRole(user, adminRoles)
  }

  /**
   * Rate limiting storage (in-memory for demo - use Redis in production)
   */
  private static rateLimitStore = new Map<string, { count: number; resetTime: number }>()

  /**
   * Simple rate limiting
   */
  static rateLimit(
    identifier: string,
    maxRequests: number = 100,
    windowMs: number = 15 * 60 * 1000 // 15 minutes
  ): boolean {
    const now = Date.now()
    const record = this.rateLimitStore.get(identifier)

    if (!record) {
      this.rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      })
      return true
    }

    if (now > record.resetTime) {
      // Reset the rate limit window
      this.rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      })
      return true
    }

    if (record.count >= maxRequests) {
      return false
    }

    record.count++
    return true
  }

  /**
   * Get client IP address
   */
  static getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    
    if (forwarded) {
      return forwarded.split(',')[0].trim()
    }
    
    if (realIp) {
      return realIp
    }

    return 'unknown'
  }

  /**
   * Log security events
   */
  static logSecurityEvent(
    event: string,
    request: NextRequest,
    user?: JWTPayload,
    details?: Record<string, any>
  ) {
    const logData = {
      timestamp: new Date().toISOString(),
      event,
      ip: this.getClientIP(request),
      userAgent: request.headers.get('user-agent') || 'unknown',
      userId: user?.userId,
      userEmail: user?.email,
      userRole: user?.role,
      url: request.url,
      method: request.method,
      ...details,
    }

    console.log(`[SECURITY] ${event}:`, JSON.stringify(logData, null, 2))
  }
}

/**
 * Decorator for async route handlers with automatic error handling
 */
export function withAuth(
  handler: (request: NextRequest, user: JWTPayload, context?: any) => Promise<NextResponse>
) {
  return AuthMiddleware.requireAuth(handler)
}
