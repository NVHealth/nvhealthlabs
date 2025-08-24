import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/lib/user-service'
import { EmailService } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })

    const user = await UserService.getUserByEmail(email)
    if (!user) return NextResponse.json({ success: true, message: 'If the email exists, an OTP has been sent' })

    const code = await UserService.generateOTPCode(user.id, 'email', 'password_reset')
    await EmailService.sendVerificationEmail(email, user.firstName || 'User', code)

    return NextResponse.json({ success: true, message: 'OTP sent to your email' })
  } catch (error) {
    console.error('Forgot password request error:', error)
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}
