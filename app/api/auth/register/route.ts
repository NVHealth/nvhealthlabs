import { type NextRequest, NextResponse } from "next/server"
import { UserService } from "@/lib/user-service"

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, phone } = await request.json()

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await UserService.getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 400 })
    }

    // Create user in database
    const newUser = await UserService.createUser({
      email,
      phone,
      first_name: firstName,
      last_name: lastName,
      password,
    })

    // Return success response (don't include sensitive data)
    return NextResponse.json({
      success: true,
      message: "Registration successful!.",
      userId: newUser.id.toString(),
      user: {
        id: newUser.id,
        email: newUser.email,
        phone: newUser.phone,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        isVerified: newUser.is_verified,
        isActive: newUser.is_active,
        twoFactorEnabled: newUser.two_factor_enabled,
      },
      requiresVerification: true,
    })
  } catch (error) {
    console.error("Registration error:", error)
    
    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('duplicate key')) {
        return NextResponse.json({ error: "User already exists with this email" }, { status: 400 })
      }
    }
    
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 })
  }
}
