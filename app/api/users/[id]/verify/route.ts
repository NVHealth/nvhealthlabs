import { NextRequest } from 'next/server'
import { UserController } from '../../../controllers/user.controller'

// POST /api/users/[id]/verify - Verify user (Admin only)
export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return UserController.verifyUser(request, context)
}
