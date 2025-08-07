import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { UserService } from "@/lib/user-service"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Get audit details from request
    const ip_address = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const user_agent = request.headers.get('user-agent') || 'unknown'
    const auditDetails = { ip_address, user_agent }

    // Demo login logic
    let user: any = null
    let role = "nvcustomer"

    if (email === "customer@test.com" && password === "demo123") {
      user = {
        id: "customer-1",
        email: "customer@test.com",
        first_name: "Demo",
        last_name: "Customer",
        role: "nvcustomer",
        is_verified: true,
        is_active: true,
      }
      role = "nvcustomer"
    } else if (email === "admin@nvhealth.com" && password === "admin123") {
      user = {
        id: "admin-1",
        email: "admin@nvhealth.com",
        first_name: "Platform",
        last_name: "Admin",
        role: "platform_admin",
        is_verified: true,
        is_active: true,
      }
      role = "platform_admin"
    } else if (email === "center@test.com" && password === "center123") {
      user = {
        id: "center-1",
        email: "center@test.com",
        first_name: "Center",
        last_name: "Admin",
        role: "center_admin",
        center_id: "center-1",
        center_name: "HealthFirst Diagnostics",
        is_verified: true,
        is_active: true,
      }
      role = "center_admin"
    } else {
      // Try to authenticate user from database
      const authenticatedUser = await UserService.authenticateUser(email, password)
      if (!authenticatedUser) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      }

      user = authenticatedUser
      role = authenticatedUser.role || "patient"
    }

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role || role,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    )

    // Return user data and token
    return NextResponse.json({
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
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
