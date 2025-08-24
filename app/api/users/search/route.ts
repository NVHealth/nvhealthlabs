import { NextRequest } from 'next/server'
import { UserController } from '../../controllers/user.controller'

// GET /api/users/search - Search users (Admin only)
export async function GET(request: NextRequest) {
  return UserController.searchUsers(request)
}
