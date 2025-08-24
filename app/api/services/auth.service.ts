import bcrypt from 'bcryptjs'
import { prisma } from '../models/prisma'
import { JWTUtils, type JWTPayload } from '../utils/jwt'
import { 
  UnauthorizedError, 
  ConflictError, 
  NotFoundError,
  ValidationError
} from '../utils/errorHandler'
import { env } from '../config/env'
import { MESSAGES, UserRole } from '../config/constants'
import type { LoginInput, RegisterInput } from '../schemas/user.schema'

export interface AuthResponse {
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    role: string
    isVerified: boolean
    isActive: boolean
    centerId?: string
  }
  token: string
  refreshToken?: string
}

export interface DemoUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  isVerified: boolean
  isActive: boolean
  centerId?: string
  centerName?: string
}

export class AuthService {
  /**
   * Register a new user
   */
  static async register(userData: RegisterInput): Promise<AuthResponse> {
    // Disallow demo emails
    const existingDemoUser = this.getDemoUser(userData.email)
    if (existingDemoUser) {
      throw new ConflictError(MESSAGES.ERROR.USER_EXISTS)
    }

    // Check if user exists in DB
    const exists = await prisma.user.findUnique({ where: { email: userData.email } })
    if (exists) {
      throw new ConflictError(MESSAGES.ERROR.USER_EXISTS)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, env.BCRYPT_SALT_ROUNDS)

    // Create real user in DB
  const dbUser = await prisma.user.create({
      data: {
        email: userData.email,
        phone: userData.phone,
        firstName: userData.firstName,
        lastName: userData.lastName,
        passwordHash: hashedPassword,
        role: userData.role || UserRole.PATIENT,
        isVerified: false,
        isActive: false, // activated after verification
      },
    })

    // Generate tokens
    const token = JWTUtils.generateToken({
      userId: dbUser.id,
      email: dbUser.email,
      role: dbUser.role,
    })

    const refreshToken = JWTUtils.generateRefreshToken({
      userId: dbUser.id,
      email: dbUser.email,
      role: dbUser.role,
    })

    return {
      user: {
        id: dbUser.id,
        email: dbUser.email,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        role: dbUser.role,
        isVerified: dbUser.isVerified,
        isActive: dbUser.isActive,
  // no centerId for standard users
      },
      token,
      refreshToken
    }
  }

  /**
   * Login user
   */
  static async login(credentials: LoginInput): Promise<AuthResponse> {
    const { email, password } = credentials

    // Try demo users first
    const demoUser = this.getDemoUser(email)
    if (demoUser) {
      const isValidPassword = await this.validateDemoPassword(email, password)
      if (!isValidPassword) {
        throw new UnauthorizedError(MESSAGES.ERROR.INVALID_CREDENTIALS)
      }

      const token = JWTUtils.generateToken({
        userId: demoUser.id,
        email: demoUser.email,
        role: demoUser.role,
        centerId: demoUser.centerId
      })

      return {
        user: {
          id: demoUser.id,
          email: demoUser.email,
          firstName: demoUser.firstName,
          lastName: demoUser.lastName,
          role: demoUser.role,
          isVerified: demoUser.isVerified,
          isActive: demoUser.isActive,
          centerId: demoUser.centerId
        },
        token
      }
    }

    // DB-backed users
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      throw new UnauthorizedError(MESSAGES.ERROR.INVALID_CREDENTIALS)
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      throw new UnauthorizedError(MESSAGES.ERROR.INVALID_CREDENTIALS)
    }

    if (!user.isActive) {
      throw new UnauthorizedError(MESSAGES.ERROR.ACCOUNT_INACTIVE)
    }

    const token = JWTUtils.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isVerified: user.isVerified,
        isActive: user.isActive,
        centerId: (user as any).centerId,
      },
      token,
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken: string): Promise<{ token: string }> {
    try {
      const payload = JWTUtils.verifyToken(refreshToken)
      
      // Verify user still exists and is active
      const user = await this.getUserById(payload.userId)
      if (!user.isActive) {
        throw new UnauthorizedError('Account is inactive')
      }

      const newToken = JWTUtils.generateToken({
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        centerId: payload.centerId
      })

      return { token: newToken }
    } catch (error) {
      throw new UnauthorizedError('Invalid refresh token')
    }
  }

  /**
   * Change user password
   */
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.getUserById(userId)
    
    // For demo users, skip password verification
    if (this.getDemoUser(user.email)) {
      console.log(`[DEMO] Password changed for user: ${user.email}`)
      return
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password || '')
    if (!isValid) {
      throw new UnauthorizedError('Current password is incorrect')
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, env.BCRYPT_SALT_ROUNDS)

    // Update password in database
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedPassword }
    })
  }

  /**
   * Logout user (invalidate tokens)
   */
  static async logout(token: string): Promise<void> {
    // In a production app, you would:
    // 1. Add token to blacklist
    // 2. Clear refresh tokens from database
    // 3. Log the logout event
    
    try {
      const payload = JWTUtils.verifyToken(token)
      console.log(`[LOGOUT] User ${payload.email} logged out`)
    } catch {
      // Token is already invalid
    }
  }

  /**
   * Get user by ID (helper method)
   */
  private static async getUserById(userId: string): Promise<any> {
    // Try demo users first
    const demoUsers = this.getDemoUsers()
    const demoUser = demoUsers.find(u => u.id === userId)
    if (demoUser) {
      return {
        ...demoUser,
        password: null // Don't return password
      }
    }

    // For non-demo users, return error since no database is configured
    throw new NotFoundError('User not found')
  }

  /**
   * Demo users for development/testing
   */
  private static getDemoUsers(): DemoUser[] {
    return [
      {
        id: 'patient-1',
        email: 'demo@patient.com',
        firstName: 'Demo',
        lastName: 'Patient',
        role: UserRole.PATIENT,
        isVerified: true,
        isActive: true
      },
      {
        id: 'admin-1',
        email: 'demo@admin.com',
        firstName: 'Platform',
        lastName: 'Admin',
        role: UserRole.PLATFORM_ADMIN,
        isVerified: true,
        isActive: true
      },
      {
        id: 'center-1',
        email: 'demo@center.com',
        firstName: 'Center',
        lastName: 'Admin',
        role: UserRole.CENTER_ADMIN,
        centerId: 'center-1',
        centerName: 'HealthFirst Diagnostics',
        isVerified: true,
        isActive: true
      }
    ]
  }

  /**
   * Get demo user by email
   */
  private static getDemoUser(email: string): DemoUser | null {
    return this.getDemoUsers().find(user => user.email === email) || null
  }

  /**
   * Validate demo user password
   */
  private static async validateDemoPassword(email: string, password: string): Promise<boolean> {
    const demoPasswords: Record<string, string> = {
      'demo@patient.com': 'demo123',
      'demo@admin.com': 'demo123',
      'demo@center.com': 'demo123'
    }

    return demoPasswords[email] === password
  }

  /**
   * Create mock user (for demo purposes)
   */
  private static async createMockUser(userData: any): Promise<DemoUser> {
    // In production, this would create a real user in the database
    // For now, we'll just return a mock user
    
    const userId = `user-${Date.now()}`
    
    return {
      id: userId,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role || UserRole.PATIENT,
      isVerified: false, // New users start unverified
      isActive: true,
      centerId: userData.centerId
    }
  }
}
