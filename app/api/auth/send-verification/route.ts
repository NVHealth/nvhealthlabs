import { type NextRequest, NextResponse } from "next/server"
import { VerificationDB } from "@/lib/verification-db"

// Generate random 6-digit code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const { userId, type, contact } = await request.json()

    if (!userId || !type || !contact) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get user from database
    const user = await VerificationDB.getUserById(Number.parseInt(userId))
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check rate limiting (prevent spam)
    if (user.last_verification_attempt) {
      const lastAttempt = new Date(user.last_verification_attempt)
      const now = new Date()
      const timeDiff = now.getTime() - lastAttempt.getTime()
      const cooldownPeriod = 60 * 1000 // 1 minute cooldown

      if (timeDiff < cooldownPeriod) {
        return NextResponse.json({ error: "Please wait before requesting another code" }, { status: 429 })
      }
    }

    // Generate verification code
    const code = generateVerificationCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Store verification code in database
    await VerificationDB.createVerificationCode({
      user_id: user.id,
      code,
      type: type as "email" | "phone",
      contact_info: contact,
      expires_at: expiresAt.toISOString(),
      attempts: 0,
      is_used: false,
    })

    // Update user's last verification attempt
    await VerificationDB.updateUser(user.id, {
      last_verification_attempt: new Date().toISOString(),
    })

    // In a real implementation, you would send the code via email/SMS
    console.log(`Verification code for ${contact}: ${code}`)

    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${type === "email" ? "email" : "phone"}`,
      // For demo purposes, return the code (remove in production)
      code: process.env.NODE_ENV === "development" ? code : undefined,
    })
  } catch (error) {
    console.error("Send verification error:", error)
    return NextResponse.json({ error: "Failed to send verification code" }, { status: 500 })
  }
}

// Add GET method for testing purposes
export async function GET() {
  return NextResponse.json({
    message: "Send verification endpoint is working",
    methods: ["POST"],
    description: "Use POST method to send verification codes",
  })
}
