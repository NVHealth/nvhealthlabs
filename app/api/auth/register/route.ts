import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { VerificationDB } from "@/lib/verification-db"

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, phone, dateOfBirth, gender } = await request.json()

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await VerificationDB.getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user in database
    const newUser = await VerificationDB.createUser({
      email,
      phone,
      first_name: firstName,
      last_name: lastName,
      // Note: In a real implementation, you'd store the hashed password
      // password: hashedPassword,
      // date_of_birth: dateOfBirth,
      // gender,
    })

    // Return user data for verification step
    return NextResponse.json({
      success: true,
      message: "User registered successfully. Please verify your account.",
      user: {
        id: newUser.id,
        email: newUser.email,
        phone: newUser.phone,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        emailVerified: newUser.email_verified,
        phoneVerified: newUser.phone_verified,
        isActive: newUser.is_active,
      },
      requiresVerification: true,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
