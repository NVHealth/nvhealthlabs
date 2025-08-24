"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Logo } from "@/components/logo"
import { TwoFactorVerification } from "@/components/two-factor-verification"
import { Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import { countries, flagEmoji } from "@/lib/countries"
import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState<"register" | "verify" | "success">("register")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [countryIso2, setCountryIso2] = useState<string>("US")
  // country can be changed anytime
  const [phoneLocal, setPhoneLocal] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const [verificationData, setVerificationData] = useState<{
    email: string
    phone: string
    userId: string
  } | null>(null)

  // Compose E.164 using selected country's dial code and the local number input
  const normalizePhone = (): string => {
    const selected = countries.find(c => c.iso2 === countryIso2)
    const dial = selected ? selected.dialCode : '1'
    const localDigits = (phoneLocal || "").replace(/\D/g, "")
    const candidate = `+${dial}${localDigits}`
    const parsed = parsePhoneNumberFromString(candidate)
    return parsed?.isValid() ? parsed.number : candidate
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setPhoneError("")

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const normalizedPhone = normalizePhone()
      // Client-side robust check
      const parsed = parsePhoneNumberFromString(normalizedPhone)
      if (!parsed || !parsed.isValid()) {
        setIsLoading(false)
        setPhoneError("Enter a valid international phone number")
        return
      }
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: normalizedPhone,
          countryIso2,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setVerificationData({
          email: formData.email,
          phone: normalizedPhone,
          userId: data.data?.user?.id ?? data.userId,
        })
        setCurrentStep("verify")
      } else {
        setError(data.error || "Registration failed")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleLocalPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setPhoneError("")
    // Use AsYouType formatting for the selected country, then store digits only for local state
    const typer = new AsYouType(countryIso2 as any)
    const formatted = typer.input(val)
    setPhoneLocal(formatted.replace(/[^\d]/g, ""))
  }

  // When country changes, if phone starts with +, replace country code to selected; else, keep user input digits
  const handleCountryChange = (iso2: string) => {
    setCountryIso2(iso2)
    // Re-validate the composed phone against new country
    if (phoneLocal) {
      const selected = countries.find(c => c.iso2 === iso2)
      const dial = selected ? selected.dialCode : '1'
      const candidate = `+${dial}${phoneLocal}`
      const parsed = parsePhoneNumberFromString(candidate)
      if (!parsed || !parsed.isValid()) {
        setPhoneError('Number may not be valid for selected country')
      } else {
        setPhoneError("")
        // Normalize local to parsed national number (drops/keeps leading zeros properly)
        setPhoneLocal(parsed.nationalNumber)
      }
    }
  }

  const handleVerificationSuccess = () => {
    setCurrentStep("success")
  }

  if (currentStep === "verify" && verificationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>

          <Card className="border-primary-100 shadow-lg">
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-6">
                <Logo iconSize={60} textClassName="text-2xl" href="/" />
              </div>
              <CardTitle className="text-2xl font-bold text-primary-700">Verify Your Account</CardTitle>
              <CardDescription className="text-primary-500">
                Complete the verification process to secure your account
              </CardDescription>
            </CardHeader>

            <CardContent>
              <TwoFactorVerification
                email={verificationData.email}
                phone={verificationData.phone}
                userId={verificationData.userId}
                firstName={formData.firstName}
                onSuccess={handleVerificationSuccess}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (currentStep === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-primary-100 shadow-lg">
            <CardHeader className="text-center pb-8">
              <div className="flex justify-center mb-6">
                <Logo iconSize={60} textClassName="text-2xl" href="/" />
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-primary-700">Registration Complete!</CardTitle>
              <CardDescription className="text-primary-500">
                Your account has been successfully created and verified
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center">
              <p className="text-primary-600 mb-6">
                Welcome to NVHealth Labs! You can now access all our diagnostic services.
              </p>
              <Link href="/auth/login">
                <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white">
                  Sign In to Your Account
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card className="border-primary-100 shadow-lg">
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-6">
              <Logo iconSize={60} textClassName="text-2xl" href="/" />
            </div>
            <CardTitle className="text-2xl font-bold text-primary-700">Create Account</CardTitle>
            <CardDescription className="text-primary-500">
              Join NVHealth Labs for comprehensive diagnostic services
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-primary-700">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="border-primary-200 focus:border-primary-500"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-primary-700">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="border-primary-200 focus:border-primary-500"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-primary-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="border-primary-200 focus:border-primary-500"
                  placeholder="john.doe@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-primary-700">
                  Phone Number
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <Label htmlFor="country" className="sr-only">Country</Label>
                    <select
                      id="country"
                      className="w-full h-10 border rounded-md px-2 border-primary-200 focus:border-primary-500 bg-white"
                      value={countryIso2}
                      onChange={(e) => handleCountryChange(e.target.value)}
                    >
                      {countries.map((c) => (
                        <option key={c.iso2} value={c.iso2}>
                          {flagEmoji(c.iso2)} +{c.dialCode} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 pr-2 flex items-center pointer-events-none text-primary-600">
                        +{countries.find(c => c.iso2 === countryIso2)?.dialCode}
                      </div>
                      <Input
                        id="phone"
                        type="tel"
                        inputMode="numeric"
                        value={phoneLocal}
                        onChange={handleLocalPhoneChange}
                        required
                        className="border-primary-200 focus:border-primary-500 pl-16"
                        placeholder="Local number"
                      />
                    </div>
                    {phoneError && (
                      <p className="text-xs text-red-600 mt-1">{phoneError}</p>
                    )}
                  </div>
                </div>
                {/* <p className="text-xs text-primary-500">We’ll format to international (E.164) using your selected country.</p> */}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-primary-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="border-primary-200 focus:border-primary-500 pr-10"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-500 hover:text-primary-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-primary-700">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="border-primary-200 focus:border-primary-500 pr-10"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-500 hover:text-primary-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-primary-500">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
