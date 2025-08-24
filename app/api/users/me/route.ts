import { NextRequest } from 'next/server'
import { UserController } from '../../controllers/user.controller'

// GET /api/users/me - Get current user profile
export async function GET(request: NextRequest) {
  return UserController.getCurrentUser(request)
}

// PUT /api/users/me - Update current user profile
export async function PUT(request: NextRequest) {
  return UserController.updateCurrentUser(request)
}
