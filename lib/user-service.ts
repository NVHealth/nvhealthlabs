import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import { User, Role, Gender } from './generated/prisma'

export interface CreateUserData {
    email: string
    phone?: string
    firstName: string
    lastName: string
    password: string
    role?: Role
    gender?: Gender
    dateOfBirth?: Date
}

export interface AuditLogData {
    userId?: string
    action: string
    details?: Record<string, any>
    ipAddress?: string
    userAgent?: string
}

export class UserService {
    // Create a new user
    static async createUser(userData: CreateUserData): Promise<User> {
        try {
            // Hash password
            const passwordHash = await bcrypt.hash(userData.password, 12)

            // Create user
            const user = await prisma.user.create({
                data: {
                    email: userData.email,
                    phone: userData.phone,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    passwordHash,
                    role: userData.role || 'patient',
                    gender: userData.gender,
                    dateOfBirth: userData.dateOfBirth,
                    isVerified: false,
                    isActive: false, // Will be true after email verification
                }
            })

            // Log user creation
            await this.createAuditLog({
                userId: user.id,
                action: 'user_created',
                details: {
                    email: userData.email,
                    role: user.role
                }
            })

            return user

        } catch (error) {
            throw error
        }
    }

    // Get user by email
    static async getUserByEmail(email: string): Promise<User | null> {
        try {
            const user = await prisma.user.findUnique({
                where: { email }
            })
            return user
        } catch (error) {
            throw new Error(`Failed to get user by email: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    // Get user by ID
    static async getUserById(id: string): Promise<User | null> {
        try {
            const user = await prisma.user.findUnique({
                where: { id }
            })
            return user
        } catch (error) {
            throw new Error(`Failed to get user by ID: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    // Create audit log entry (simplified for now since we only have User table)
    static async createAuditLog(auditData: AuditLogData): Promise<void> {
        try {
            // For now, just log to console
            // You can extend this to use a separate audit log table later
            console.log('Audit Log:', {
                userId: auditData.userId,
                action: auditData.action,
                details: auditData.details,
                timestamp: new Date().toISOString()
            })
        } catch (error) {
            console.error('Failed to create audit log:', error)
            // Don't throw error to prevent breaking main functionality
        }
    }

    // Authenticate user with email and password
    static async authenticateUser(email: string, password: string): Promise<User | null> {
        try {
            const user = await this.getUserByEmail(email)
            
            if (!user) {
                return null
            }

            const isValidPassword = await bcrypt.compare(password, user.passwordHash)
            
            if (!isValidPassword) {
                // Log failed login attempt
                await this.createAuditLog({
                    userId: user.id,
                    action: 'login_failed',
                    details: { reason: 'invalid_password' }
                })
                return null
            }

            // Check if user is active
            if (!user.isActive) {
                await this.createAuditLog({
                    userId: user.id,
                    action: 'login_failed',
                    details: { reason: 'account_inactive' }
                })
                return null
            }

            // Update last login
            const updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: { 
                    lastLogin: new Date(),
                    updatedAt: new Date()
                }
            })

            // Log successful login
            await this.createAuditLog({
                userId: user.id,
                action: 'login_success',
                details: { email: user.email }
            })

            return updatedUser

        } catch (error) {
            console.error('Authentication error:', error)
            return null
        }
    }

    // Update user password
    static async updatePassword(userId: string, newPassword: string): Promise<boolean> {
        try {
            const passwordHash = await bcrypt.hash(newPassword, 12)

            await prisma.user.update({
                where: { id: userId },
                data: { 
                    passwordHash,
                    updatedAt: new Date()
                }
            })

            // Log password update
            await this.createAuditLog({
                userId,
                action: 'password_updated'
            })

            return true

        } catch (error) {
            console.error('Password update error:', error)
            return false
        }
    }

    // Update user profile
    static async updateUserProfile(userId: string, profileData: Partial<User>): Promise<User | null> {
        try {
            // Remove fields that shouldn't be updated directly
            const updateData = { ...profileData }
            delete updateData.id
            delete updateData.passwordHash
            delete updateData.createdAt
            updateData.updatedAt = new Date()

            const user = await prisma.user.update({
                where: { id: userId },
                data: updateData
            })

            // Log profile update
            await this.createAuditLog({
                userId,
                action: 'profile_updated',
                details: { fields: Object.keys(updateData) }
            })

            return user

        } catch (error) {
            console.error('Profile update error:', error)
            return null
        }
    }

    // Verify user (mark as verified and active)
    static async verifyUser(userId: string): Promise<User | null> {
        try {
            const user = await prisma.user.update({
                where: { id: userId },
                data: {
                    isVerified: true,
                    isActive: true,
                    updatedAt: new Date()
                }
            })

            // Log successful verification
            await this.createAuditLog({
                userId,
                action: 'user_verified',
                details: { method: 'email_verification' }
            })

            return user

        } catch (error) {
            console.error('User verification error:', error)
            return null
        }
    }

    // Get all users (for admin)
    static async getAllUsers(page: number = 1, limit: number = 10): Promise<{ users: User[], total: number }> {
        try {
            const skip = (page - 1) * limit

            const [users, total] = await Promise.all([
                prisma.user.findMany({
                    skip,
                    take: limit,
                    orderBy: { createdAt: 'desc' }
                }),
                prisma.user.count()
            ])

            return { users, total }

        } catch (error) {
            console.error('Get all users error:', error)
            return { users: [], total: 0 }
        }
    }

    // Generate OTP code and store hashed copy
    static async generateOTPCode(
        userId: string,
        channel: 'email' | 'sms' = 'email',
        purpose: 'signup' | 'login' | 'password_reset' = 'signup'
    ): Promise<string> {
        try {
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
            const codeHash = await bcrypt.hash(otpCode, 10)

            const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

            await prisma.verificationCode.create({
                data: {
                    userId,
                    channel,
                    purpose,
                    codeHash,
                    expiresAt,
                    used: false,
                    attempts: 0,
                    createdAt: new Date(),
                }
            })

            await this.createAuditLog({
                userId,
                action: 'otp_generated',
                details: { channel, purpose }
            })

            // Return plain code to caller (do not log in production)
            return otpCode

        } catch (error) {
            console.error('OTP generation error:', error)
            throw new Error('Failed to generate OTP code')
        }
    }

    // Verify OTP code using stored verification_codes
    static async verifyOTPCode(
        email: string,
        code: string,
        purpose: 'signup' | 'login' | 'password_reset' = 'signup',
        channel?: 'email' | 'sms'
    ): Promise<boolean> {
        try {
            const user = await this.getUserByEmail(email)
            if (!user) {
                console.log(`Verification failed: User not found for email ${email}`)
                return false
            }

            // Get most recent, un-used, un-expired code for this user/purpose/channel
            const where: any = {
                userId: user.id,
                used: false,
                purpose,
                expiresAt: { gt: new Date() },
            }
            if (channel) where.channel = channel

            const vc = await prisma.verificationCode.findFirst({
                where,
                orderBy: { createdAt: 'desc' }
            })

            if (!vc) {
                await this.createAuditLog({
                    userId: user.id,
                    action: 'otp_verification_failed',
                    details: { reason: 'no_active_code', purpose, channel }
                })
                return false
            }

            const isMatch = await bcrypt.compare(code, vc.codeHash)
            if (!isMatch) {
                await prisma.verificationCode.update({
                    where: { id: vc.id },
                    data: { attempts: vc.attempts + 1, lastAttemptAt: new Date() }
                })
                await this.createAuditLog({
                    userId: user.id,
                    action: 'otp_verification_failed',
                    details: { reason: 'mismatch', purpose, channel }
                })
                return false
            }

            // Mark code as used
            await prisma.verificationCode.update({
                where: { id: vc.id },
                data: { used: true, lastAttemptAt: new Date() }
            })

            // For signup purpose, verify/activate the user
            if (purpose === 'signup') {
                await this.verifyUser(user.id)
            }

            await this.createAuditLog({
                userId: user.id,
                action: 'otp_verified',
                details: { purpose, channel }
            })

            return true

        } catch (error) {
            console.error('OTP verification error:', error)
            return false
        }
    }

    // Update last login timestamp
    static async updateLastLogin(userId: string): Promise<boolean> {
        try {
            await prisma.user.update({
                where: { id: userId },
                data: { 
                    lastLogin: new Date(),
                    updatedAt: new Date()
                }
            })

            // Log last login update
            await this.createAuditLog({
                userId,
                action: 'last_login_updated',
                details: { timestamp: new Date().toISOString() }
            })

            return true

        } catch (error) {
            console.error('Update last login error:', error)
            return false
        }
    }
}
