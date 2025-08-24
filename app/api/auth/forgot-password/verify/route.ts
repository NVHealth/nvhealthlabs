import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/lib/user-service'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, code, newPassword } = await request.json()
    if (!email || !code || !newPassword) {
      return NextResponse.json({ error: 'Email, code and newPassword are required' }, { status: 400 })
    }

    const valid = await UserService.verifyOTPCode(email, code, 'password_reset', 'email')
    if (!valid) return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 })

    const user = await UserService.getUserByEmail(email)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const passwordHash = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash, updatedAt: new Date() } })

    return NextResponse.json({ success: true, message: 'Password has been reset' })
  } catch (error) {
    console.error('Forgot password verify error:', error)
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 })
  }
}
