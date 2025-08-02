"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Bell, LogOut, User, Mail, Phone, CheckCircle, AlertCircle, Shield, Edit, Save, X } from "lucide-react"

export default function PatientProfilePage() {
  const [user, setUser] = useState<any | null>(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setFormData({
        firstName: parsedUser.first_name || "",
        lastName: parsedUser.last_name || "",
        email: parsedUser.email || "",
        phone: parsedUser.phone || "",
        dateOfBirth: parsedUser.date_of_birth || "",
        gender: parsedUser.gender || "",
      })
    }
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    window.location.href = "/"
  }

  const handleSave = () => {
    // In production, save to backend
    const updatedUser = {
      ...user,
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      date_of_birth: formData.dateOfBirth,
      gender: formData.gender,
    }
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
    setEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      firstName: user?.first_name || "",
      lastName: user?.last_name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      dateOfBirth: user?.date_of_birth || "",
      gender: user?.gender || "",
    })
    setEditing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">NVHealth Labs</span>
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/nvcustomer/dashboard" className="text-gray-700 hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link href="/nvcustomer/bookings" className="text-gray-700 hover:text-primary transition-colors">
                My Bookings
              </Link>
              <Link href="/nvcustomer/results" className="text-gray-700 hover:text-primary transition-colors">
                Test Results
              </Link>
              <Link href="/nvcustomer/profile" className="text-primary font-medium">
                Profile
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium">
                  {user?.first_name} {user?.last_name}
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-primary-600">Manage your account information and security settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription className="text-primary-600">
                      Update your personal details and contact information
                    </CardDescription>
                  </div>
                  {!editing ? (
                    <Button onClick={() => setEditing(true)} variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSave} size="sm">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm">
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      {editing ? (
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                      ) : (
                        <p className="text-sm font-medium py-2">{user?.first_name || "Not provided"}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      {editing ? (
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        />
                      ) : (
                        <p className="text-sm font-medium py-2">{user?.last_name || "Not provided"}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    {editing ? (
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium py-2">{user?.email || "Not provided"}</p>
                        {user?.email_verified && <CheckCircle className="w-4 h-4 text-success" />}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    {editing ? (
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium py-2">{user?.phone || "Not provided"}</p>
                        {user?.phone_verified && <CheckCircle className="w-4 h-4 text-success" />}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      {editing ? (
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        />
                      ) : (
                        <p className="text-sm font-medium py-2">
                          {user?.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : "Not provided"}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      {editing ? (
                        <Select
                          value={formData.gender}
                          onValueChange={(value) => setFormData({ ...formData, gender: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm font-medium py-2 capitalize">{user?.gender || "Not provided"}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security & Verification */}
          <div className="space-y-6">
            {/* Verification Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Account Security
                </CardTitle>
                <CardDescription className="text-primary-600">Your account verification status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">Email Verified</span>
                    </div>
                    {user?.email_verified ? (
                      <Badge className="bg-success text-white">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Unverified
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">Phone Verified</span>
                    </div>
                    {user?.phone_verified ? (
                      <Badge className="bg-success text-white">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Not Set
                      </Badge>
                    )}
                  </div>

                  {(!user?.email_verified || !user?.phone_verified) && (
                    <div className="pt-4 border-t">
                      <Button size="sm" className="w-full">
                        Complete Verification
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Download My Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    Privacy Settings
                  </Button>
                  <Button variant="destructive" className="w-full justify-start">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
