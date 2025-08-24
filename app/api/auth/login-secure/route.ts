import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { UserService } from "@/lib/user-service"
import { AuthMiddleware } from "@/lib/security/auth-middleware"
import { AuditLogger } from "@/lib/audit/audit-logger"
import { RateLimiter, RateLimitError } from "@/lib/security/rate-limiter"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const rateLimiter = new RateLimiter()

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'

  try {
    // Apply rate limiting
    await rateLimiter.checkLimit('login', ip)

    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      await AuditLogger.logAuth('login_failed', request, undefined, {
        reason: 'missing_credentials',
        email: email ? maskEmail(email) : undefined
      })
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Log login attempt
    await AuditLogger.logAuth('login_attempt', request, undefined, {
      email: maskEmail(email)
    })

    // Demo login logic (for development)
    let user: any = null
    let role = "patient"

    if (email === "customer@test.com" && password === "demo123") {
      user = {
        id: "customer-1",
        email: "customer@test.com",
        firstName: "Demo",
        lastName: "Customer",
        role: "patient",
        isVerified: true,
        isActive: true,
      }
    } else if (email === "admin@nvhealth.com" && password === "admin123") {
      user = {
        id: "admin-1",
        email: "admin@nvhealth.com",
        firstName: "Platform",
        lastName: "Admin",
        role: "platform_admin",
        isVerified: true,
        isActive: true,
      }
    } else if (email === "center@test.com" && password === "center123") {
      user = {
        id: "center-1",
        email: "center@test.com",
        firstName: "Center",
        lastName: "Admin",
        role: "center_admin",
        isVerified: true,
        isActive: true,
      }
    } else {
      // Try to authenticate user from database
      const authenticatedUser = await UserService.authenticateUser(email, password)
      if (!authenticatedUser) {
        await AuditLogger.logAuth('login_failed', request, undefined, {
          reason: 'invalid_credentials',
          email: maskEmail(email)
        })
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      }

      user = authenticatedUser
      role = authenticatedUser.role || "patient"
    }

    if (!user) {
      await AuditLogger.logAuth('login_failed', request, undefined, {
        reason: 'authentication_failed',
        email: maskEmail(email)
      })
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate JWT token with enhanced security
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role || role,
      // Add session info for better tracking
      sessionInfo: {
        ip: ip,
        userAgent: userAgent.substring(0, 200), // Truncate for storage
        loginTime: new Date().toISOString()
      }
    }

    // Type assertion to fix JWT library compatibility
    const token = jwt.sign(
      tokenPayload as any, 
      JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" } as any
    ) as string

    // Update last login timestamp
    if (user.id !== "customer-1" && user.id !== "admin-1" && user.id !== "center-1") {
      await UserService.updateLastLogin(user.id)
    }

    // Log successful login
    await AuditLogger.logAuth('login_success', request, user.id, {
      role: user.role || role
    })

    // Prepare response data
    const responseData = {
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName || user.first_name,
        lastName: user.lastName || user.last_name,
        role: user.role || role,
        center_id: user.center_id,
        center_name: user.center_name,
        isVerified: user.isVerified || user.is_verified,
        isActive: user.isActive || user.is_active,
      },
      // Security info for client (optional)
      security: {
        tokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        requiresMFA: false // Could be enhanced later
      }
    }

    // Set secure HTTP-only cookie as backup
    const response = NextResponse.json(responseData)
    
    if (process.env.NODE_ENV === 'production') {
      response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60, // 24 hours
        path: '/'
      })
    }

    return response

  } catch (error) {
    if (error instanceof RateLimitError) {
      await AuditLogger.logSecurity('rate_limit_exceeded', request, {
        limitType: 'login',
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

    console.error("Login error:", error)
    
    await AuditLogger.logAuth('login_failed', request, undefined, {
      reason: 'server_error',
      error: error instanceof Error ? error.message : String(error)
    })

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
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
