import { NextRequest } from 'next/server'
import { UserController } from '../../../controllers/user.controller'

// PUT /api/users/[id]/status - Update user status (Admin only)
export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return UserController.updateUserStatus(request, context)
}
