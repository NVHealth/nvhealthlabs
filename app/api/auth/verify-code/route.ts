import { type NextRequest, NextResponse } from "next/server"
import { UserService } from "@/lib/user-service"

export async function POST(request: NextRequest) {
  try {
  const { userId, code, method } = await request.json()

    if (!userId || !code || !method) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get user from database
    const user = await UserService.getUserById(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    let verified = false

    if (method === "email") {
      verified = await UserService.verifyOTPCode(user.email, code, 'signup', 'email')
    } else if (method === "sms") {
      verified = await UserService.verifyOTPCode(user.email, code, 'signup', 'sms')
    }

    if (verified) {
      return NextResponse.json({
        success: true,
        message: "Verification successful! Your account is now active.",
      })
    } else {
      return NextResponse.json({
        error: "Invalid or expired verification code. Please try again.",
      }, { status: 400 })
    }

  } catch (error) {
    console.error("Verification error:", error)
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 500 })
  }
}
