"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Smartphone, Shield, RefreshCw } from "lucide-react"

interface TwoFactorVerificationProps {
  email: string
  phone: string
  userId: string
  onSuccess: () => void
}

export function TwoFactorVerification({ email, phone, userId, onSuccess }: TwoFactorVerificationProps) {
  const [currentMethod, setCurrentMethod] = useState<"email" | "sms">("email")
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const sendVerificationCode = async (method: "email" | "sms") => {
    setIsSending(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          method,
          email,
          phone,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(`Verification code sent to your ${method === "email" ? "email" : "phone"}`)
        setCurrentMethod(method)
      } else {
        setError(data.error || "Failed to send verification code")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  const verifyCode = async () => {
    if (!verificationCode.trim()) {
      setError("Please enter the verification code")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          code: verificationCode,
          method: currentMethod,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        onSuccess()
      } else {
        setError(data.error || "Invalid verification code")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = () => {
    setVerificationCode("")
    sendVerificationCode(currentMethod)
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-700">{success}</AlertDescription>
        </Alert>
      )}

      {/* Verification Method Selection */}
      <div className="space-y-4">
        <Label className="text-primary-700 font-medium">Choose verification method:</Label>

        <div className="grid gap-3">
          <Button
            type="button"
            variant={currentMethod === "email" ? "default" : "outline"}
            className={`justify-start h-auto p-4 ${
              currentMethod === "email"
                ? "bg-primary-600 hover:bg-primary-700 text-white"
                : "border-primary-200 text-primary-600 hover:bg-primary-50"
            }`}
            onClick={() => sendVerificationCode("email")}
            disabled={isSending}
          >
            <Mail className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">Email Verification</div>
              <div className="text-sm opacity-80">{email}</div>
            </div>
          </Button>

          <Button
            type="button"
            variant={currentMethod === "sms" ? "default" : "outline"}
            className={`justify-start h-auto p-4 ${
              currentMethod === "sms"
                ? "bg-primary-600 hover:bg-primary-700 text-white"
                : "border-primary-200 text-primary-600 hover:bg-primary-50"
            }`}
            onClick={() => sendVerificationCode("sms")}
            disabled={isSending}
          >
            <Smartphone className="w-5 h-5 mr-3" />
            <div className="text-left">
              <div className="font-medium">SMS Verification</div>
              <div className="text-sm opacity-80">{phone}</div>
            </div>
          </Button>
        </div>
      </div>

      {/* Code Input */}
      {success && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verificationCode" className="text-primary-700">
              Enter Verification Code
            </Label>
            <Input
              id="verificationCode"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              className="border-primary-200 focus:border-primary-500 text-center text-lg tracking-widest"
              maxLength={6}
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={verifyCode}
              disabled={isLoading || !verificationCode.trim()}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Verify Code
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleResendCode}
              disabled={isSending}
              className="border-primary-600 text-primary-600 hover:bg-primary-50 bg-transparent"
            >
              {isSending ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Resend"}
            </Button>
          </div>

          <p className="text-sm text-primary-500 text-center">
            Didn't receive the code? Check your spam folder or try the other verification method.
          </p>
        </div>
      )}
    </div>
  )
}
