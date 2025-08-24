import { type NextRequest, NextResponse } from "next/server"
import { UserService } from "@/lib/user-service"
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { userId, type, contact } = await request.json()

    if (!userId || !type || !contact) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate type
    if (!['email', 'sms'].includes(type)) {
      return NextResponse.json({ error: "Invalid verification type" }, { status: 400 })
    }

    // Get user from database
    const user = await UserService.getUserById(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Generate verification code using UserService
    const code = await UserService.generateOTPCode(userId, type as 'email' | 'sms')

    // Send verification code via email if type is email
    if (type === 'email') {
      try {
        // Create transporter (only if email credentials are configured)
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
          const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          })

          // Send email
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: contact,
            subject: 'Your Verification Code - NVHealth Labs',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Email Verification</h2>
                <p>Hello ${user.firstName},</p>
                <p>Please use the following verification code to complete your email verification:</p>
                <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
                  <h1 style="color: #333; letter-spacing: 3px; margin: 0;">${code}</h1>
                </div>
                <p>This code will expire in 10 minutes.</p>
                <p>If you didn't request this verification, please ignore this email.</p>
                <br>
                <p>Best regards,<br>NVHealth Labs Team</p>
              </div>
            `,
          })

          console.log(`Verification code sent to email: ${contact}`)
        } else {
          console.log(`Email credentials not configured. Verification code: ${code}`)
        }
      } catch (emailError) {
        console.error('Email sending failed:', emailError)
        // Don't fail the request if email sending fails in development
        if (process.env.NODE_ENV === 'production') {
          return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 })
        }
        console.log('Continuing without email in development mode...')
      }
    }

    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${type === "email" ? "email" : "phone"}`,
      // For demo purposes, return the code in development (remove in production)
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
