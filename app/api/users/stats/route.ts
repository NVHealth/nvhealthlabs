import { NextRequest } from 'next/server'
import { UserController } from '../../controllers/user.controller'

// GET /api/users/stats - Get user statistics (Admin only)
export async function GET(request: NextRequest) {
  return UserController.getUserStats(request)
}
