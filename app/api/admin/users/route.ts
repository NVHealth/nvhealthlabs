import { NextRequest } from 'next/server'
import { AuthMiddleware, requirePlatformAdmin } from '@/lib/security/auth-middleware'
import { AuditLogger } from '@/lib/audit/audit-logger'
import { UserService } from '@/lib/user-service'

/**
 * Platform Admin only endpoint - Get all users
 * This demonstrates RBAC with audit logging
 */
export const GET = AuthMiddleware.withAuth(async (request: NextRequest, user) => {
  try {
    // Log data access
    await AuditLogger.logDataAccess('view', request, user.id, 'users', undefined, {
      action: 'list_all_users'
    })

    // Get pagination parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100) // Max 100 per page

    // Get users with pagination
    const { users, total } = await UserService.getAllUsers(page, limit)

    // Remove sensitive data for response
    const sanitizedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    }))

    return Response.json({
      success: true,
      users: sanitizedUsers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    await AuditLogger.log({
      userId: user.id,
      action: 'admin_users_list_error',
      details: { 
        error: error instanceof Error ? error.message : String(error)
      },
      severity: 'medium'
    })

    return Response.json(
      { error: 'Failed to retrieve users' },
      { status: 500 }
    )
  }
}, requirePlatformAdmin())

/**
 * Platform Admin only endpoint - Update user role/status
 */
export const PATCH = AuthMiddleware.withAuth(async (request: NextRequest, user) => {
  try {
    const { userId, updates } = await request.json()

    if (!userId) {
      return Response.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Validate allowed updates
    const allowedFields = ['role', 'isActive', 'isVerified']
    const updateData: any = {}
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        updateData[key] = value
      }
    }

    if (Object.keys(updateData).length === 0) {
      return Response.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    // Log before update for audit trail
    await AuditLogger.logDataAccess('update', request, user.id, 'users', userId, {
      adminAction: 'update_user',
      updates: updateData,
      targetUserId: userId
    })

    // Update user
    const updatedUser = await UserService.updateUserProfile(userId, updateData)

    if (!updatedUser) {
      return Response.json(
        { error: 'Failed to update user' },
        { status: 500 }
      )
    }

    return Response.json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
        isActive: updatedUser.isActive,
        isVerified: updatedUser.isVerified
      }
    })

  } catch (error) {
    await AuditLogger.log({
      userId: user.id,
      action: 'admin_user_update_error',
      details: {
        error: error instanceof Error ? error.message : String(error)
      },
      severity: 'high'
    })

    return Response.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}, requirePlatformAdmin())
