import { type NextRequest, NextResponse } from "next/server"
import { EmailService } from "@/lib/email-service"
import { UserService } from "@/lib/user-service"

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, userId } = await request.json()

    // Validate required fields
    if (!email || !firstName) {
      return NextResponse.json({ error: "Email and firstName are required" }, { status: 400 })
    }

    // Check if user exists
    const user = await UserService.getUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: "User not found with this email" }, { status: 404 })
    }

    // Generate and store OTP
    const otpCode = await UserService.generateOTPCode(user.id, 'email')
    console.log('Generated OTP:', otpCode);
    
    // Send OTP email
    const emailSent = await EmailService.sendVerificationEmail(
      email,
      firstName,
      otpCode
    )
    if (!emailSent) {
      return NextResponse.json({ error: "Failed to send OTP email" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully to your email!",
      email: email,
      otpCode: process.env.NODE_ENV === 'development' ? otpCode : undefined, // Only show OTP in development
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error("Send OTP error:", error)
    return NextResponse.json({ error: "Failed to send OTP. Please try again." }, { status: 500 })
  }
}

// Optional: GET method to check email service status
export async function GET() {
  try {
    return NextResponse.json({
      status: "OTP Email service is running",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    })
  } catch (error) {
    return NextResponse.json({ error: "OTP Email service unavailable" }, { status: 500 })
  }
}
