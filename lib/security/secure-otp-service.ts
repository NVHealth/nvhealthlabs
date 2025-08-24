import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import { AuditLogger } from '../audit/audit-logger'

export interface OTPConfig {
  purpose: 'email_verification' | 'password_reset' | 'login_2fa'
  channel: 'email' | 'sms'
  expiryMinutes: number
  length: number
  maxAttempts: number
}

export interface OTPSendResult {
  success: boolean
  reference: string
  expiresAt: Date
  error?: string
}

export interface OTPVerifyResult {
  success: boolean
  userId?: string
  error?: string
  attemptsRemaining?: number
}

export class SecureOTPService {
  private static readonly DEFAULT_CONFIGS: Record<string, OTPConfig> = {
    email_verification: {
      purpose: 'email_verification',
      channel: 'email',
      expiryMinutes: 30,
      length: 6,
      maxAttempts: 5
    },
    password_reset: {
      purpose: 'password_reset',
      channel: 'email', 
      expiryMinutes: 15,
      length: 6,
      maxAttempts: 3
    },
    login_2fa: {
      purpose: 'login_2fa',
      channel: 'email',
      expiryMinutes: 10,
      length: 6,
      maxAttempts: 3
    }
  }

  private static emailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  })

  /**
   * Generate and send OTP
   * @param userId - User ID
   * @param email - User email address
   * @param purpose - Purpose of OTP
   * @returns OTP send result
   */
  static async generateAndSend(
    userId: string,
    email: string,
    purpose: keyof typeof SecureOTPService.DEFAULT_CONFIGS
  ): Promise<OTPSendResult> {
    const config = this.DEFAULT_CONFIGS[purpose]
    
    try {
      // Check for recent OTP requests to prevent spam
      await this.checkRecentRequests(userId, purpose)

      // Invalidate existing OTPs for this purpose
      await this.invalidateExistingOTPs(userId, purpose)

      // Generate cryptographically secure OTP
      const otpCode = this.generateSecureOTP(config.length)
      const otpHash = await bcrypt.hash(otpCode, 12)
      
      // Calculate expiry time
      const expiresAt = new Date(Date.now() + config.expiryMinutes * 60 * 1000)
      
      // Store OTP in database
      const verificationCode = await prisma.verificationCode.create({
        data: {
          userId,
          channel: config.channel,
          purpose,
          codeHash: otpHash,
          expiresAt,
          used: false,
          attempts: 0
        }
      })

      // Send OTP based on channel
      let sendResult: boolean = false
      if (config.channel === 'email') {
        sendResult = await this.sendEmailOTP(email, otpCode, purpose)
      } else if (config.channel === 'sms') {
        // SMS implementation would go here
        // sendResult = await this.sendSMSOTP(phone, otpCode, purpose)
        throw new Error('SMS OTP not yet implemented')
      }

      if (!sendResult) {
        // Clean up if sending failed
        await prisma.verificationCode.delete({
          where: { id: verificationCode.id }
        })
        
        await AuditLogger.logOTP('verify_failed', userId, config.channel, {
          purpose,
          reason: 'delivery_failed'
        })

        return {
          success: false,
          reference: '',
          expiresAt: new Date(),
          error: 'Failed to send OTP'
        }
      }

      // Log successful OTP generation
      await AuditLogger.logOTP('generate', userId, config.channel, {
        purpose,
        expiresAt: expiresAt.toISOString()
      })

      await AuditLogger.logOTP('send', userId, config.channel, {
        purpose,
        destination: this.maskEmail(email)
      })

      return {
        success: true,
        reference: verificationCode.id,
        expiresAt
      }

    } catch (error) {
      await AuditLogger.logOTP('verify_failed', userId, 'email', {
        purpose,
        error: error instanceof Error ? error.message : String(error)
      })

      return {
        success: false,
        reference: '',
        expiresAt: new Date(),
        error: error instanceof Error ? error.message : 'Failed to generate OTP'
      }
    }
  }

  /**
   * Verify OTP code
   * @param email - User email
   * @param code - OTP code to verify
   * @param purpose - Purpose of OTP
   * @returns Verification result
   */
  static async verifyOTP(
    email: string,
    code: string,
    purpose: keyof typeof SecureOTPService.DEFAULT_CONFIGS
  ): Promise<OTPVerifyResult> {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email }
      })

      if (!user) {
        await AuditLogger.logOTP('verify_failed', undefined, 'email', {
          purpose,
          reason: 'user_not_found',
          email: this.maskEmail(email)
        })
        return { success: false, error: 'Invalid verification code' }
      }

      // Find valid OTP
      const verificationCode = await prisma.verificationCode.findFirst({
        where: {
          userId: user.id,
          purpose,
          used: false,
          expiresAt: { gt: new Date() }
        },
        orderBy: { createdAt: 'desc' }
      })

      if (!verificationCode) {
        await AuditLogger.logOTP('verify_failed', user.id, 'email', {
          purpose,
          reason: 'code_not_found_or_expired'
        })
        return { success: false, error: 'Invalid or expired verification code' }
      }

      // Check attempt limits
      if (verificationCode.attempts >= this.DEFAULT_CONFIGS[purpose].maxAttempts) {
        await AuditLogger.logOTP('verify_failed', user.id, 'email', {
          purpose,
          reason: 'max_attempts_exceeded'
        })
        return { success: false, error: 'Maximum verification attempts exceeded' }
      }

      // Verify OTP code
      const isValid = await bcrypt.compare(code, verificationCode.codeHash)
      
      if (!isValid) {
        // Increment attempt counter
        await prisma.verificationCode.update({
          where: { id: verificationCode.id },
          data: { 
            attempts: { increment: 1 },
            lastAttemptAt: new Date()
          }
        })

        const remainingAttempts = this.DEFAULT_CONFIGS[purpose].maxAttempts - verificationCode.attempts - 1

        await AuditLogger.logOTP('verify_failed', user.id, 'email', {
          purpose,
          reason: 'invalid_code',
          attemptsRemaining: remainingAttempts
        })

        return { 
          success: false, 
          error: 'Invalid verification code',
          attemptsRemaining: remainingAttempts
        }
      }

      // Mark OTP as used
      await prisma.verificationCode.update({
        where: { id: verificationCode.id },
        data: { used: true }
      })

      // Activate user account for email verification
      if (purpose === 'email_verification') {
        await prisma.user.update({
          where: { id: user.id },
          data: { 
            isVerified: true,
            isActive: true
          }
        })
      }

      await AuditLogger.logOTP('verify_success', user.id, 'email', {
        purpose
      })

      return {
        success: true,
        userId: user.id
      }

    } catch (error) {
      await AuditLogger.logOTP('verify_failed', undefined, 'email', {
        purpose,
        error: error instanceof Error ? error.message : String(error)
      })

      return {
        success: false,
        error: 'Verification failed'
      }
    }
  }

  /**
   * Clean up expired OTP codes
   */
  static async cleanupExpiredCodes(): Promise<number> {
    const result = await prisma.verificationCode.deleteMany({
      where: {
        expiresAt: { lt: new Date() }
      }
    })

    console.log(`[OTP_CLEANUP] Removed ${result.count} expired OTP codes`)
    return result.count
  }

  private static generateSecureOTP(length: number): string {
    const digits = '0123456789'
    let otp = ''
    
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, digits.length)
      otp += digits[randomIndex]
    }
    
    return otp
  }

  private static async sendEmailOTP(
    email: string,
    otpCode: string,
    purpose: string
  ): Promise<boolean> {
    try {
      const subjects = {
        email_verification: 'Verify Your NVHealth Labs Account',
        password_reset: 'Password Reset Verification',
        login_2fa: 'Login Verification Code'
      }

      const templates = {
        email_verification: `
          <h2>Verify Your Account</h2>
          <p>Your verification code is: <strong>${otpCode}</strong></p>
          <p>This code will expire in 30 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `,
        password_reset: `
          <h2>Password Reset</h2>
          <p>Your password reset code is: <strong>${otpCode}</strong></p>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request this, please secure your account immediately.</p>
        `,
        login_2fa: `
          <h2>Login Verification</h2>
          <p>Your login verification code is: <strong>${otpCode}</strong></p>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't try to login, please secure your account.</p>
        `
      }

      await this.emailTransporter.sendMail({
        from: process.env.EMAIL_FROM || 'NVHealth Labs <noreply@nvhealthlabs.com>',
        to: email,
        subject: subjects[purpose as keyof typeof subjects] || 'Verification Code',
        html: templates[purpose as keyof typeof templates] || `Your verification code is: <strong>${otpCode}</strong>`
      })

      return true
    } catch (error) {
      console.error('[OTP_EMAIL_ERROR]', error)
      return false
    }
  }

  private static async checkRecentRequests(userId: string, purpose: string): Promise<void> {
    // Check if there was a recent OTP request (within last 2 minutes)
    const recentCode = await prisma.verificationCode.findFirst({
      where: {
        userId,
        purpose,
        createdAt: { gt: new Date(Date.now() - 2 * 60 * 1000) }
      }
    })

    if (recentCode) {
      throw new Error('OTP requested too recently. Please wait before requesting another.')
    }
  }

  private static async invalidateExistingOTPs(userId: string, purpose: string): Promise<void> {
    await prisma.verificationCode.updateMany({
      where: {
        userId,
        purpose,
        used: false
      },
      data: { used: true }
    })
  }

  private static maskEmail(email: string): string {
    const [localPart, domain] = email.split('@')
    if (localPart.length <= 2) {
      return `${localPart[0]}***@${domain}`
    }
    return `${localPart.substring(0, 2)}***@${domain}`
  }
}
