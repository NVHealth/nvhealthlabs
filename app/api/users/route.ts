import { NextRequest } from 'next/server'
import { UserController } from '../controllers/user.controller'

// GET /api/users - List all users (Admin only)
export async function GET(request: NextRequest) {
  return UserController.listUsers(request)
}
