import { type NextRequest, NextResponse } from "next/server"
import { VerificationDB } from "@/lib/verification-db"

export async function POST(request: NextRequest) {
  try {
    const { userId, code, type } = await request.json()

    if (!userId || !code || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get user from database
    const user = await VerificationDB.getUserById(Number.parseInt(userId))
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Find verification code
    const verificationCode = await VerificationDB.getVerificationCode(code, type as "email" | "phone")
    if (!verificationCode) {
      return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 })
    }

    // Check if code belongs to user
    if (verificationCode.user_id !== user.id) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 })
    }

    // Check attempt limit
    if (verificationCode.attempts >= 3) {
      return NextResponse.json({ error: "Too many failed attempts. Please request a new code." }, { status: 400 })
    }

    // Mark code as used
    await VerificationDB.updateVerificationCode(verificationCode.id, {
      is_used: true,
      attempts: verificationCode.attempts + 1,
    })

    // Update user verification status
    const updates: any = {}
    if (type === "email") {
      updates.email_verified = true
    } else if (type === "phone") {
      updates.phone_verified = true
    }

    // Activate account if at least one contact method is verified
    if (type === "email" || user.phone_verified) {
      updates.is_active = true
    }
    if (type === "phone" || user.email_verified) {
      updates.is_active = true
    }

    const updatedUser = await VerificationDB.updateUser(user.id, updates)

    // Clean up expired codes
    await VerificationDB.cleanupExpiredCodes()

    return NextResponse.json({
      success: true,
      message: "Verification successful",
      user: {
        id: updatedUser!.id,
        email: updatedUser!.email,
        phone: updatedUser!.phone,
        firstName: updatedUser!.first_name,
        lastName: updatedUser!.last_name,
        emailVerified: updatedUser!.email_verified,
        phoneVerified: updatedUser!.phone_verified,
        isActive: updatedUser!.is_active,
      },
    })
  } catch (error) {
    console.error("Verify code error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
