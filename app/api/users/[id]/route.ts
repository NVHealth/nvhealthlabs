import { NextRequest } from 'next/server'
import { UserController } from '../../controllers/user.controller'

// GET /api/users/[id] - Get user by ID (Admin only)
export async function GET(
  request: NextRequest, 
  context: { params: { id: string } }
) {
  return UserController.getUserById(request, context)
}

// PUT /api/users/[id] - Update user (Admin only)
export async function PUT(
  request: NextRequest, 
  context: { params: { id: string } }
) {
  return UserController.updateUser(request, context)
}

// DELETE /api/users/[id] - Delete user (Admin only)
export async function DELETE(
  request: NextRequest, 
  context: { params: { id: string } }
) {
  return UserController.deleteUser(request, context)
}
