import { NextRequest, NextResponse } from 'next/server'
import { SecureOTPService } from '@/lib/security/secure-otp-service'
import { AuditLogger } from '@/lib/audit/audit-logger'
import { RateLimiter, RateLimitError } from '@/lib/security/rate-limiter'

const rateLimiter = new RateLimiter()

/**
 * Send OTP for email verification
 * Enhanced with rate limiting and comprehensive audit logging
 */
export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  
  try {
    // Apply rate limiting for OTP requests
    await rateLimiter.checkLimit('otp_request', ip)

    const { email, purpose = 'email_verification' } = await request.json()

    // Validate input
    if (!email) {
      await AuditLogger.logOTP('verify_failed', undefined, 'email', {
        purpose,
        reason: 'missing_email',
        ip
      })
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      await AuditLogger.logOTP('verify_failed', undefined, 'email', {
        purpose,
        reason: 'invalid_email_format',
        email: maskEmail(email),
        ip
      })
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Validate purpose
    const validPurposes = ['email_verification', 'password_reset', 'login_2fa']
    if (!validPurposes.includes(purpose)) {
      return NextResponse.json({ error: 'Invalid purpose' }, { status: 400 })
    }

    // Find user by email
    const { prisma } = await import('@/lib/prisma')
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // Don't reveal whether user exists or not (security)
      await AuditLogger.logOTP('verify_failed', undefined, 'email', {
        purpose,
        reason: 'user_not_found',
        email: maskEmail(email),
        ip
      })
      return NextResponse.json(
        { 
          success: true, 
          message: 'If the email exists, an OTP will be sent' 
        }, 
        { status: 200 }
      )
    }

    // Generate and send OTP
    const result = await SecureOTPService.generateAndSend(user.id, email, purpose)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'OTP sent successfully',
        expiresAt: result.expiresAt,
        reference: result.reference
      })
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send OTP' },
        { status: 500 }
      )
    }

  } catch (error) {
    if (error instanceof RateLimitError) {
      await AuditLogger.logSecurity('rate_limit_exceeded', request, {
        limitType: 'otp_request',
        retryAfter: error.retryAfterMs
      })

      return NextResponse.json(
        {
          error: error.message,
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: Math.ceil(error.retryAfterMs / 1000)
        },
        { status: 429 }
      )
    }

    console.error('[OTP_SEND_ERROR]', error)

    await AuditLogger.log({
      action: 'otp_send_system_error',
      details: {
        error: error instanceof Error ? error.message : String(error),
        ip
      },
      severity: 'high'
    })

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Verify OTP code
 * Enhanced with rate limiting and security measures
 */
export async function PATCH(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'

  try {
    // Apply rate limiting for OTP verification
    await rateLimiter.checkLimit('otp_verify', ip)

    const { email, code, purpose = 'email_verification' } = await request.json()

    // Validate input
    if (!email || !code) {
      await AuditLogger.logOTP('verify_failed', undefined, 'email', {
        purpose,
        reason: 'missing_credentials',
        ip
      })
      return NextResponse.json(
        { error: 'Email and code are required' },
        { status: 400 }
      )
    }

    // Validate code format
    if (!/^\d{6}$/.test(code)) {
      await AuditLogger.logOTP('verify_failed', undefined, 'email', {
        purpose,
        reason: 'invalid_code_format',
        email: maskEmail(email),
        ip
      })
      return NextResponse.json(
        { error: 'Invalid code format' },
        { status: 400 }
      )
    }

    // Verify OTP
    const result = await SecureOTPService.verifyOTP(email, code, purpose)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'OTP verified successfully',
        userId: result.userId
      })
    } else {
      return NextResponse.json(
        { 
          error: result.error || 'Invalid or expired OTP',
          attemptsRemaining: result.attemptsRemaining
        },
        { status: 400 }
      )
    }

  } catch (error) {
    if (error instanceof RateLimitError) {
      await AuditLogger.logSecurity('rate_limit_exceeded', request, {
        limitType: 'otp_verify',
        retryAfter: error.retryAfterMs
      })

      return NextResponse.json(
        {
          error: error.message,
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: Math.ceil(error.retryAfterMs / 1000)
        },
        { status: 429 }
      )
    }

    console.error('[OTP_VERIFY_ERROR]', error)

    await AuditLogger.log({
      action: 'otp_verify_system_error',
      details: {
        error: error instanceof Error ? error.message : String(error),
        ip
      },
      severity: 'high'
    })

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to mask email for logging
function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@')
  if (localPart.length <= 2) {
    return `${localPart[0]}***@${domain}`
  }
  return `${localPart.substring(0, 2)}***@${domain}`
}
