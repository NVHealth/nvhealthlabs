import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '../services/user.service'
import { 
  ErrorHandler,
  ValidationError,
  asyncHandler,
  ResponseHelper
} from '../utils/errorHandler'
import { 
  updateUserSchema,
  adminUpdateUserSchema,
  userQuerySchema,
  validateSchema
} from '../schemas/user.schema'
import { AuthMiddleware } from '../middlewares/auth.middleware'
import { RoleMiddleware } from '../middlewares/role.middleware'
import { MESSAGES } from '../config/constants'

export class UserController {
  /**
   * GET /api/users/me
   */
  static getCurrentUser = AuthMiddleware.requireAuth(async (request, user) => {
    const userData = await UserService.getUserById(user.userId)
    return ResponseHelper.success(userData)
  })

  /**
   * PUT /api/users/me
   */
  static updateCurrentUser = AuthMiddleware.requireAuth(async (request, user) => {
    const body = await request.json()
    
    // Validate input
    const updateData = validateSchema(updateUserSchema, body)
    
    // Update user
    const updatedUser = await UserService.updateUser(user.userId, updateData)
    
    // Log profile update
    AuthMiddleware.logSecurityEvent(
      'PROFILE_UPDATED',
      request,
      user,
      { updatedFields: Object.keys(updateData) }
    )

    return ResponseHelper.success(
      updatedUser,
      MESSAGES.SUCCESS.PROFILE_UPDATED
    )
  })

  /**
   * GET /api/users (Admin only)
   */
  static listUsers = RoleMiddleware.requireAdmin()(async (request, user) => {
    const { searchParams } = new URL(request.url)
    
    // Convert search params to object for validation with explicit filtering
    const queryParams: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      if (value !== null && value !== undefined && value !== '') {
        queryParams[key] = value
      }
    })
    
    const query = validateSchema(userQuerySchema, queryParams)
    
    const result = await UserService.listUsers(query)
    
    return ResponseHelper.paginated(
      result.users,
      result.total,
      result.page,
      result.limit,
      'Users retrieved successfully'
    )
  })

  /**
   * GET /api/users/[id] (Admin only)
   */
  static getUserById = RoleMiddleware.requireAdmin()(async (request, user, { params }) => {
    const userId = params.id
    
    if (!userId) {
      throw new ValidationError('User ID is required')
    }

    const userData = await UserService.getUserById(userId)
    
    // Log admin user access
    AuthMiddleware.logSecurityEvent(
      'ADMIN_USER_ACCESS',
      request,
      user,
      { targetUserId: userId }
    )

    return ResponseHelper.success(userData)
  })

  /**
   * PUT /api/users/[id] (Admin only)
   */
  static updateUser = RoleMiddleware.requireAdmin()(async (request, user, { params }) => {
    const userId = params.id
    const body = await request.json()
    
    if (!userId) {
      throw new ValidationError('User ID is required')
    }

    // Validate input (admin can update more fields)
    const updateData = validateSchema(adminUpdateUserSchema, body)
    
    // Update user
    const updatedUser = await UserService.updateUser(userId, updateData)
    
    // Log admin user update
    AuthMiddleware.logSecurityEvent(
      'ADMIN_USER_UPDATE',
      request,
      user,
      { 
        targetUserId: userId,
        updatedFields: Object.keys(updateData)
      }
    )

    return ResponseHelper.success(
      updatedUser,
      MESSAGES.SUCCESS.USER_UPDATED
    )
  })

  /**
   * DELETE /api/users/[id] (Admin only - soft delete)
   */
  static deleteUser = RoleMiddleware.requireAdmin()(async (request, user, { params }) => {
    const userId = params.id
    
    if (!userId) {
      throw new ValidationError('User ID is required')
    }

    // Prevent admin from deleting themselves
    if (userId === user.userId) {
      throw new ValidationError('Cannot delete your own account')
    }

    await UserService.deleteUser(userId)
    
    // Log admin user deletion
    AuthMiddleware.logSecurityEvent(
      'ADMIN_USER_DELETE',
      request,
      user,
      { targetUserId: userId }
    )

    return ResponseHelper.success(
      null,
      MESSAGES.SUCCESS.USER_DELETED
    )
  })

  /**
   * POST /api/users/[id]/verify (Admin only)
   */
  static verifyUser = RoleMiddleware.requireAdmin()(async (request, user, { params }) => {
    const userId = params.id
    
    if (!userId) {
      throw new ValidationError('User ID is required')
    }

    const { UserService } = await import('../services/user.service')
    const verifiedUser = await UserService.verifyEmail(userId)
    
    // Log admin verification
    AuthMiddleware.logSecurityEvent(
      'ADMIN_USER_VERIFY',
      request,
      user,
      { targetUserId: userId }
    )

    return ResponseHelper.success(
      verifiedUser,
      'User verified successfully'
    )
  })

  /**
   * GET /api/users/search (Admin only)
   */
  static searchUsers = RoleMiddleware.requireAdmin()(async (request, user) => {
    const { searchParams } = new URL(request.url)
    const searchTerm = searchParams.get('q')
    
    if (!searchTerm) {
      throw new ValidationError('Search term is required')
    }

    // Use the same list function with search parameter
    const query = validateSchema(userQuerySchema, {
      search: searchTerm,
      limit: '20' // Return more results for search
    })
    
    const result = await UserService.listUsers(query)
    
    return ResponseHelper.success(
      result.users,
      `Found ${result.total} users matching "${searchTerm}"`
    )
  })

  /**
   * GET /api/users/stats (Admin only)
   */
  static getUserStats = RoleMiddleware.requireAdmin()(async (request, user) => {
    // Get user statistics
    const allUsersResult = await UserService.listUsers({
      page: 1,
      limit: 1000, // Get all users for stats
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })

    const stats = {
      total: allUsersResult.total,
      active: allUsersResult.users.filter(u => u.isActive).length,
      verified: allUsersResult.users.filter(u => u.isVerified).length,
      byRole: {
        patient: allUsersResult.users.filter(u => u.role === 'patient').length,
        center_admin: allUsersResult.users.filter(u => u.role === 'center_admin').length,
        platform_admin: allUsersResult.users.filter(u => u.role === 'platform_admin').length,
      },
      recentRegistrations: allUsersResult.users
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10)
    }

    return ResponseHelper.success(stats, 'User statistics retrieved successfully')
  })

  /**
   * PUT /api/users/[id]/status (Admin only)
   */
  static updateUserStatus = RoleMiddleware.requireAdmin()(async (request, user, { params }) => {
    const userId = params.id
    const { isActive } = await request.json()
    
    if (!userId) {
      throw new ValidationError('User ID is required')
    }

    if (typeof isActive !== 'boolean') {
      throw new ValidationError('Status (isActive) must be a boolean')
    }

    // Prevent admin from deactivating themselves
    if (userId === user.userId && !isActive) {
      throw new ValidationError('Cannot deactivate your own account')
    }

    const updatedUser = await UserService.updateUser(userId, { isActive })
    
    // Log status change
    AuthMiddleware.logSecurityEvent(
      'ADMIN_USER_STATUS_CHANGE',
      request,
      user,
      { 
        targetUserId: userId,
        newStatus: isActive ? 'active' : 'inactive'
      }
    )

    return ResponseHelper.success(
      updatedUser,
      `User ${isActive ? 'activated' : 'deactivated'} successfully`
    )
  })
}
