import nodemailer from 'nodemailer'

export class EmailService {
    private static transporter: nodemailer.Transporter

    // Generate 6-digit OTP
    static generateOTP(): string {
        return Math.floor(100000 + Math.random() * 900000).toString()
    }

    // Initialize email service
    static async initialize() {
        console.log('🔧 Initializing email service...')

        // Use Gmail - most reliable option
        const gmailUser = process.env.GMAIL_USER
        const gmailPass = process.env.GMAIL_APP_PASSWORD

        if (!gmailUser || !gmailPass) {
            console.error('❌ Missing Gmail credentials!')
            console.log('Please set GMAIL_USER and GMAIL_APP_PASSWORD in your .env.local file')
            console.log('Example: GMAIL_USER=yourname@gmail.com')
            console.log('Example: GMAIL_APP_PASSWORD=abcdefghijklmnop')
            throw new Error('Gmail credentials not configured')
        }

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: gmailUser,
                pass: gmailPass
            }
        })

        // Test the connection
        try {
            await this.transporter.verify()
            console.log('✅ Email service ready!')
            console.log(`📧 Will send emails from: ${gmailUser}`)
        } catch (error) {
            console.error('❌ Email connection failed:', error)
            throw error
        }
    }

    // Send OTP email
    static async sendVerificationEmail(
        email: string,
        firstName: string,
        otpCode: string
    ): Promise<boolean> {
        try {
            console.log(`📧 Preparing to send OTP to: ${email}`)

            if (!this.transporter) {
                await this.initialize()
            }

            const mailOptions = {
                from: process.env.GMAIL_USER,
                to: email,
                subject: '🔐 Your NVHealth Labs OTP Code',
                html: `
                <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                    <div style="background: #667eea; color: white; padding: 20px; text-align: center;">
                        <h1>NVHealth Labs</h1>
                        <p>Email Verification</p>
                    </div>
                    <div style="padding: 30px; background: #f9f9f9;">
                        <h2>Hello ${firstName}!</h2>
                        <p>Your verification code is:</p>
                        <div style="text-align: center; margin: 20px 0;">
                            <span style="background: #667eea; color: white; padding: 15px 30px; font-size: 24px; font-weight: bold; border-radius: 5px; letter-spacing: 5px;">
                                ${otpCode}
                            </span>
                        </div>
                        <p>This code expires in 10 minutes.</p>
                        <p style="color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
                    </div>
                </div>
                `,
                text: `Hello ${firstName}! Your NVHealth Labs verification code is: ${otpCode}. This code expires in 10 minutes.`
            }

            console.log('Sending email...')
            const result = await this.transporter.sendMail(mailOptions)

            console.log('✅ Email sent successfully!')
            console.log(`📧 Message ID: ${result.messageId}`)
            console.log(`📧 To: ${email}`)
            console.log(`🔐 OTP: ${otpCode}`)

            return true

        } catch (error) {
            console.error('❌ Failed to send email:', error)
            return false
        }
    }

    // Send password reset email
    static async sendPasswordResetEmail(
        email: string,
        firstName: string,
        resetToken: string
    ): Promise<boolean> {
        try {
            if (!this.transporter) {
                await this.initialize()
            }

            const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`

            const mailOptions = {
                from: process.env.GMAIL_USER,
                to: email,
                subject: '🔐 Password Reset - NVHealth Labs',
                html: `
                <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
                    <div style="background: #667eea; color: white; padding: 20px; text-align: center;">
                        <h1>NVHealth Labs</h1>
                        <p>Password Reset</p>
                    </div>
                    <div style="padding: 30px; background: #f9f9f9;">
                        <h2>Hello ${firstName}!</h2>
                        <p>You requested a password reset. Click the button below:</p>
                        <div style="text-align: center; margin: 20px 0;">
                            <a href="${resetUrl}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                                Reset Password
                            </a>
                        </div>
                        <p>This link expires in 1 hour.</p>
                        <p style="color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
                    </div>
                </div>
                `
            }

            const result = await this.transporter.sendMail(mailOptions)
            console.log('✅ Password reset email sent!')
            console.log(`📧 Message ID: ${result.messageId}`)

            return true

        } catch (error) {
            console.error('❌ Failed to send password reset email:', error)
            return false
        }
    }
}
