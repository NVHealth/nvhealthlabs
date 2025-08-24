import bcrypt from 'bcryptjs'
import { prisma } from '../models/prisma'
import { 
  NotFoundError, 
  ConflictError,
  ValidationError
} from '../utils/errorHandler'
import { env } from '../config/env'
import { UserRole, PAGINATION } from '../config/constants'
import type { 
  RegisterInput, 
  UpdateUserInput, 
  AdminUpdateUserInput, 
  UserQuery 
} from '../schemas/user.schema'

export interface UserResponse {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: UserRole
  gender?: 'male' | 'female' | 'other'
  dateOfBirth?: string
  isActive: boolean
  isVerified: boolean
  centerId?: string
  createdAt: string
  updatedAt: string
}

export interface PaginatedUsers {
  users: UserResponse[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export class UserService {
  /**
   * Create a new user
   */
  static async createUser(userData: RegisterInput): Promise<UserResponse> {
    // Check if user already exists
    const existingUser = await this.findUserByEmail(userData.email)
    if (existingUser) {
      throw new ConflictError('User with this email already exists')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, env.BCRYPT_SALT_ROUNDS)

    // For demo purposes, create mock user
    // In production, replace with actual Prisma user creation
    const user = await this.createMockUser({
      ...userData,
      password: hashedPassword
    })

    return this.formatUserResponse(user)
  }

  /**
   * Get user by ID
   */
  static async getUserById(id: string): Promise<UserResponse> {
    // Try demo users first
    const demoUser = this.getDemoUser(null, id)
    if (demoUser) {
      return this.formatUserResponse(demoUser)
    }

    // Try database
    try {
      const user = await prisma.user.findUnique({
        where: { id }
      })

      if (!user) {
        throw new NotFoundError('User not found')
      }

      return this.formatUserResponse(user)
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      throw new NotFoundError('User not found')
    }
  }

  /**
   * Update user
   */
  static async updateUser(id: string, updateData: UpdateUserInput | AdminUpdateUserInput): Promise<UserResponse> {
    const existingUser = await this.getUserById(id)

    // For demo users, return updated mock data
    if (this.getDemoUser(null, id)) {
      return {
        ...existingUser,
        ...updateData,
        dateOfBirth: updateData.dateOfBirth ? 
          (typeof updateData.dateOfBirth === 'string' ? updateData.dateOfBirth : updateData.dateOfBirth.toISOString()) 
          : existingUser.dateOfBirth,
        updatedAt: new Date().toISOString()
      }
    }

    // Update in database
    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          ...updateData,
          dateOfBirth: updateData.dateOfBirth ? new Date(updateData.dateOfBirth) : undefined,
          updatedAt: new Date()
        }
      })

      return this.formatUserResponse(updatedUser)
    } catch (error) {
      throw new NotFoundError('User not found')
    }
  }

  /**
   * Delete user (soft delete)
   */
  static async deleteUser(id: string): Promise<void> {
    await this.getUserById(id) // Ensure user exists

    // For demo users, just log the action
    if (this.getDemoUser(null, id)) {
      console.log(`[DEMO] User ${id} would be deactivated`)
      return
    }

    // Soft delete in database
    try {
      await prisma.user.update({
        where: { id },
        data: { 
          isActive: false,
          updatedAt: new Date()
        }
      })
    } catch (error) {
      throw new NotFoundError('User not found')
    }
  }

  /**
   * List users with filtering and pagination
   */
  static async listUsers(query: Partial<UserQuery>): Promise<PaginatedUsers> {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      search,
      role,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = query

    const skip = (page - 1) * limit

    // For demo, return demo users with filtering
    let demoUsers = this.getDemoUsers()

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase()
      demoUsers = demoUsers.filter(user =>
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      )
    }

    if (role) {
      demoUsers = demoUsers.filter(user => user.role === role)
    }

    if (typeof isActive === 'boolean') {
      demoUsers = demoUsers.filter(user => user.isActive === isActive)
    }

    // Apply sorting
    demoUsers.sort((a, b) => {
      let aVal: any, bVal: any

      switch (sortBy) {
        case 'firstName':
          aVal = a.firstName
          bVal = b.firstName
          break
        case 'lastName':
          aVal = a.lastName
          bVal = b.lastName
          break
        case 'email':
          aVal = a.email
          bVal = b.email
          break
        default:
          aVal = new Date(a.createdAt || Date.now())
          bVal = new Date(b.createdAt || Date.now())
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    // Apply pagination
    const total = demoUsers.length
    const paginatedUsers = demoUsers.slice(skip, skip + limit)

    // Try database query in production
    try {
      const whereClause: any = {}

      if (search) {
        whereClause.OR = [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      }

      if (role) whereClause.role = role
      if (typeof isActive === 'boolean') whereClause.isActive = isActive

      const [dbUsers, dbTotal] = await Promise.all([
        prisma.user.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder }
        }),
        prisma.user.count({ where: whereClause })
      ])

      if (dbUsers.length > 0) {
        return {
          users: dbUsers.map(this.formatUserResponse),
          total: dbTotal,
          page,
          limit,
          totalPages: Math.ceil(dbTotal / limit)
        }
      }
    } catch (error) {
      // Fall back to demo users if database query fails
    }

    return {
      users: paginatedUsers.map(this.formatUserResponse),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  /**
   * Find user by email
   */
  static async findUserByEmail(email: string): Promise<UserResponse | null> {
    // Check demo users first
    const demoUser = this.getDemoUser(email)
    if (demoUser) {
      return this.formatUserResponse(demoUser)
    }

    // Check database
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      })

      return user ? this.formatUserResponse(user) : null
    } catch {
      return null
    }
  }

  /**
   * Verify user email
   */
  static async verifyEmail(userId: string): Promise<UserResponse> {
    // For demo users, just mark as verified
    const demoUser = this.getDemoUser(null, userId)
    if (demoUser) {
      return {
        ...this.formatUserResponse(demoUser),
        isVerified: true
      }
    }

    // Update database
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { 
          isVerified: true,
          updatedAt: new Date()
        }
      })

      return this.formatUserResponse(user)
    } catch (error) {
      throw new NotFoundError('User not found')
    }
  }

  /**
   * Get demo users for development
   */
  private static getDemoUsers() {
    return [
      {
        id: 'patient-1',
        email: 'demo@patient.com',
        firstName: 'Demo',
        lastName: 'Patient',
        phone: '+1234567890',
        role: UserRole.PATIENT,
        gender: 'male' as const,
        isVerified: true,
        isActive: true,
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date('2024-01-01').toISOString()
      },
      {
        id: 'admin-1',
        email: 'demo@admin.com',
        firstName: 'Platform',
        lastName: 'Admin',
        phone: '+1234567891',
        role: UserRole.PLATFORM_ADMIN,
        gender: 'female' as const,
        isVerified: true,
        isActive: true,
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date('2024-01-01').toISOString()
      },
      {
        id: 'center-1',
        email: 'demo@center.com',
        firstName: 'Center',
        lastName: 'Admin',
        phone: '+1234567892',
        role: UserRole.CENTER_ADMIN,
        gender: 'other' as const,
        centerId: 'center-1',
        isVerified: true,
        isActive: true,
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date('2024-01-01').toISOString()
      }
    ]
  }

  /**
   * Get demo user by email or ID
   */
  private static getDemoUser(email?: string | null, id?: string): any {
    const demoUsers = this.getDemoUsers()
    
    if (email) {
      return demoUsers.find(user => user.email === email) || null
    }
    
    if (id) {
      return demoUsers.find(user => user.id === id) || null
    }
    
    return null
  }

  /**
   * Create mock user (for demo)
   */
  private static async createMockUser(userData: any): Promise<any> {
    return {
      id: `user-${Date.now()}`,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      role: userData.role || UserRole.PATIENT,
      gender: userData.gender,
      dateOfBirth: userData.dateOfBirth,
      isVerified: false,
      isActive: true,
      centerId: userData.centerId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  /**
   * Format user response (remove sensitive data)
   */
  private static formatUserResponse(user: any): UserResponse {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString() : undefined,
      isActive: user.isActive,
      isVerified: user.isVerified,
      centerId: user.centerId,
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: user.updatedAt || new Date().toISOString()
    }
  }
}
