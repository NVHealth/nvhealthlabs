import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { VerificationDB } from "@/lib/verification-db"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

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
        email_verified: true,
        phone_verified: true,
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
        email_verified: true,
        phone_verified: true,
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
        email_verified: true,
        phone_verified: true,
        is_active: true,
      }
      role = "center_admin"
    } else {
      // Try to get user from database for real accounts
      const dbUser = await VerificationDB.getUserByEmail(email)
      if (!dbUser || !dbUser.is_active) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      }
      user = dbUser
      role = email.includes("admin") ? "admin" : "nvcustomer"
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
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role || role,
        center_id: user.center_id,
        center_name: user.center_name,
        emailVerified: user.email_verified,
        phoneVerified: user.phone_verified,
        isActive: user.is_active,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
