"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ForgotPasswordPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [code, setCode] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [step, setStep] = useState<'request' | 'verify'>('request')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const requestCode = async () => {
        setLoading(true); setError(''); setMessage('')
        try {
            const res = await fetch('/api/auth/forgot-password/request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to send code')
            setMessage('We have sent an OTP to your email')
            setStep('verify')
        } catch (e: any) {
            setError(e.message)
        } finally { setLoading(false) }
    }

    const resetPassword = async () => {
        setLoading(true); setError(''); setMessage('')
        try {
            const res = await fetch('/api/auth/forgot-password/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, code, newPassword }) })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to reset password')
            setMessage('Password reset successfully. Redirecting to login...')
            // Give a brief moment to show the success message, then redirect
            setTimeout(() => {
                router.replace('/auth/login')
            }, 1500)
        } catch (e: any) {
            setError(e.message)
        } finally { setLoading(false) }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary-50 to-white">
            <div className="w-full max-w-md">
                <Card className="border-primary-100 shadow-lg">
                    <CardHeader>
                        <CardTitle>Forgot Password</CardTitle>
                        <CardDescription>Reset your password using an email OTP</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {step === 'request' && (
                            <>
                                <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                                <Button onClick={requestCode} disabled={loading || !email}>Send OTP</Button>
                            </>
                        )}
                        {step === 'verify' && (
                            <>
                                <Input type="text" placeholder="Enter OTP" value={code} onChange={e => setCode(e.target.value)} />
                                <Input type="password" placeholder="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                                <div className="flex gap-2">
                                    <Button onClick={resetPassword} disabled={loading || !code || !newPassword}>Reset Password</Button>
                                    <Button variant="outline" onClick={requestCode} disabled={loading}>Resend OTP</Button>
                                </div>
                            </>
                        )}
                        {message && <p className="text-green-600 text-sm">{message}</p>}
                        {error && <p className="text-red-600 text-sm">{error}</p>}
                        <div className="pt-2 text-sm">
                            <Link href="/auth/login" className="text-primary-600">Back to Login</Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
