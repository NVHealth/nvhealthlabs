import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/lib/user-service'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, code } = body

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and code are required' },
        { status: 400 }
      )
    }

    // Verify the OTP code
    const isValid = await UserService.verifyOTPCode(email, code)

    if (isValid) {
      return NextResponse.json({
        success: true,
        message: 'OTP verified successfully!',
        email,
        timestamp: new Date().toISOString()
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid or expired OTP code' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error verifying OTP:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
