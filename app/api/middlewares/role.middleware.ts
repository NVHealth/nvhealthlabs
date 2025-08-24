import { NextRequest, NextResponse } from 'next/server'
import { JWTPayload } from '../utils/jwt'
import { AuthMiddleware } from './auth.middleware'
import { ForbiddenError } from '../utils/errorHandler'
import { UserRole, MESSAGES } from '../config/constants'

export class RoleMiddleware {
  /**
   * Require specific roles
   */
  static requireRoles(requiredRoles: UserRole | UserRole[]) {
    return (
      handler: (request: NextRequest, user: JWTPayload, context?: any) => Promise<NextResponse>
    ) => {
      return AuthMiddleware.requireAuth(async (request, user, context) => {
        const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
        
        if (!roles.includes(user.role as UserRole)) {
          AuthMiddleware.logSecurityEvent(
            'UNAUTHORIZED_ACCESS_ATTEMPT',
            request,
            user,
            { requiredRoles: roles, userRole: user.role }
          )
          
          throw new ForbiddenError(
            `Access denied. Required roles: ${roles.join(', ')}`
          )
        }

        return await handler(request, user, context)
      })
    }
  }

  /**
   * Require admin role (platform_admin)
   */
  static requireAdmin() {
    return this.requireRoles(UserRole.PLATFORM_ADMIN)
  }

  /**
   * Require center admin or platform admin
   */
  static requireCenterAdmin() {
    return this.requireRoles([UserRole.CENTER_ADMIN, UserRole.PLATFORM_ADMIN])
  }

  /**
   * Allow resource owner or admin access
   */
  static requireOwnershipOrAdmin(
    getUserIdFromRequest: (request: NextRequest, context?: any) => string,
    adminRoles: UserRole[] = [UserRole.PLATFORM_ADMIN]
  ) {
    return (
      handler: (request: NextRequest, user: JWTPayload, context?: any) => Promise<NextResponse>
    ) => {
      return AuthMiddleware.requireAuth(async (request, user, context) => {
        const resourceUserId = getUserIdFromRequest(request, context)
        
        // Check if user owns the resource or has admin privileges
        const hasAccess = user.userId === resourceUserId || 
                         adminRoles.includes(user.role as UserRole)

        if (!hasAccess) {
          AuthMiddleware.logSecurityEvent(
            'UNAUTHORIZED_RESOURCE_ACCESS',
            request,
            user,
            { resourceUserId, userRole: user.role }
          )
          
          throw new ForbiddenError('Access denied to this resource')
        }

        return await handler(request, user, context)
      })
    }
  }

  /**
   * Center-specific access control
   */
  static requireCenterAccess(
    getCenterIdFromRequest: (request: NextRequest, context?: any) => string
  ) {
    return (
      handler: (request: NextRequest, user: JWTPayload, context?: any) => Promise<NextResponse>
    ) => {
      return AuthMiddleware.requireAuth(async (request, user, context) => {
        const requestedCenterId = getCenterIdFromRequest(request, context)
        
        // Platform admin can access any center
        if (user.role === UserRole.PLATFORM_ADMIN) {
          return await handler(request, user, context)
        }

        // Center admin can only access their own center
        if (user.role === UserRole.CENTER_ADMIN) {
          if (user.centerId !== requestedCenterId) {
            AuthMiddleware.logSecurityEvent(
              'UNAUTHORIZED_CENTER_ACCESS',
              request,
              user,
              { requestedCenterId, userCenterId: user.centerId }
            )
            
            throw new ForbiddenError('Access denied to this center')
          }
          
          return await handler(request, user, context)
        }

        // Patients can only access centers they have bookings with
        // This would require additional database checks in a real implementation
        throw new ForbiddenError('Insufficient permissions to access center data')
      })
    }
  }

  /**
   * Role hierarchy check
   */
  static hasHigherRole(userRole: UserRole, comparedToRole: UserRole): boolean {
    const roleHierarchy: Record<UserRole, number> = {
      [UserRole.PATIENT]: 1,
      [UserRole.CENTER_ADMIN]: 2,
      [UserRole.PLATFORM_ADMIN]: 3,
    }

    return roleHierarchy[userRole] > roleHierarchy[comparedToRole]
  }

  /**
   * Prevent role escalation
   */
  static preventRoleEscalation() {
    return (
      handler: (request: NextRequest, user: JWTPayload, context?: any) => Promise<NextResponse>
    ) => {
      return AuthMiddleware.requireAuth(async (request, user, context) => {
        const body = await request.clone().json().catch(() => ({}))
        const targetRole = body.role as UserRole

        if (targetRole && user.role !== UserRole.PLATFORM_ADMIN) {
          // Only platform admin can assign platform admin role
          if (targetRole === UserRole.PLATFORM_ADMIN) {
            throw new ForbiddenError('Cannot assign platform admin role')
          }

          // Center admin cannot assign center admin role
          if (user.role === UserRole.CENTER_ADMIN && targetRole === UserRole.CENTER_ADMIN) {
            throw new ForbiddenError('Cannot assign center admin role')
          }

          // Users cannot escalate their own privileges
          if (!this.hasHigherRole(user.role as UserRole, targetRole)) {
            throw new ForbiddenError('Cannot assign higher privilege role')
          }
        }

        return await handler(request, user, context)
      })
    }
  }

  /**
   * API key validation (for external integrations)
   */
  static requireAPIKey(validApiKeys: string[] = []) {
    return (
      handler: (request: NextRequest, context?: any) => Promise<NextResponse>
    ) => {
      return async (request: NextRequest, context?: any): Promise<NextResponse> => {
        const apiKey = request.headers.get('x-api-key')
        
        if (!apiKey || !validApiKeys.includes(apiKey)) {
          AuthMiddleware.logSecurityEvent(
            'INVALID_API_KEY_ATTEMPT',
            request,
            undefined,
            { providedKey: apiKey ? 'present' : 'missing' }
          )
          
          return NextResponse.json(
            {
              success: false,
              error: 'Invalid API key',
            },
            { status: 401 }
          )
        }

        return await handler(request, context)
      }
    }
  }
}
