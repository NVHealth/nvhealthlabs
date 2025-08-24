"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/logo"
import {
  Search,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Bell,
  LogOut,
  Activity,
  Droplet,
  User,
} from "lucide-react"

interface Booking {
  id: string
  booking_number: string
  appointment_date: string
  appointment_time: string
  status: string
  total_amount: number
  center_name: string
  tests: string[]
}

export default function PatientDashboard() {
  const [user, setUser] = useState<any | null>(null)
  const [recentBookings, setRecentBookings] = useState<Booking[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Mock recent bookings data
    const mockBookings: Booking[] = [
      {
        id: "1",
        booking_number: "NVH001",
        appointment_date: "2024-01-15",
        appointment_time: "09:00",
        status: "completed",
        total_amount: 85.0,
        center_name: "HealthFirst Diagnostics",
        tests: ["Complete Blood Count", "Lipid Profile"],
      },
      {
        id: "2",
        booking_number: "NVH002",
        appointment_date: "2024-01-20",
        appointment_time: "14:30",
        status: "confirmed",
        total_amount: 45.0,
        center_name: "MediCore Labs",
        tests: ["HbA1c"],
      },
      {
        id: "3",
        booking_number: "NVH003",
        appointment_date: "2024-01-10",
        appointment_time: "11:00",
        status: "pending",
        total_amount: 120.0,
        center_name: "QuickTest Center",
        tests: ["Thyroid Profile", "Vitamin D"],
      },
    ]

    setRecentBookings(mockBookings)
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    window.location.href = "/"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success text-white"
      case "confirmed":
        return "bg-primary text-white"
      case "pending":
        return "bg-warning text-white"
      default:
        return "bg-secondary-500 text-white"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "confirmed":
        return <Calendar className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
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
          <div className="flex justify-between items-center h-20">
            <Logo iconSize={48} textClassName="text-2xl" />
            <nav className="hidden md:flex space-x-8">
              <Link href="/nvcustomer/dashboard" className="text-accent font-medium">
                Dashboard
              </Link>
              <Link href="/nvcustomer/bookings" className="text-primary-700 hover:text-accent transition-colors">
                My Bookings
              </Link>
              <Link href="/nvcustomer/results" className="text-primary-700 hover:text-accent transition-colors">
                Test Results
              </Link>
              <Link href="/nvcustomer/profile" className="text-primary-700 hover:text-accent transition-colors">
                Profile
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-accent" />
                </div>
                <span className="text-sm font-medium text-primary-800">
                  {(user?.firstName || user?.first_name) || ''} {(user?.lastName || user?.last_name) || ''}
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-800 mb-2">Welcome back, {(user?.firstName || user?.first_name) || 'Patient'}!</h1>
          <p className="text-primary-600">Manage your health tests and track your wellness journey</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-secondary-200 hover:border-accent-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-accent-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2 text-primary-800">Book New Test</h3>
              <p className="text-sm text-primary-600 mb-4">Search and book lab tests</p>
              <Link href="/tests">
                <Button size="sm" className="w-full bg-accent hover:bg-accent-600">
                  Browse Tests
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-secondary-200 hover:border-accent-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-semibold mb-2 text-primary-800">My Appointments</h3>
              <p className="text-sm text-primary-600 mb-4">View upcoming bookings</p>
              <Link href="/nvcustomer/bookings">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
                >
                  View All
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-secondary-200 hover:border-accent-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-primary-800">Test Results</h3>
              <p className="text-sm text-primary-600 mb-4">Access your reports</p>
              <Link href="/nvcustomer/results">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
                >
                  View Results
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-secondary-200 hover:border-accent-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-secondary-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-6 h-6 text-secondary-600" />
              </div>
              <h3 className="font-semibold mb-2 text-primary-800">Health Packages</h3>
              <p className="text-sm text-primary-600 mb-4">Comprehensive checkups</p>
              <Link href="/packages">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
                >
                  Explore
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="mb-8 border-secondary-200">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for tests, packages, or health conditions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-secondary-300 focus:border-accent"
                />
              </div>
              <Button className="bg-accent hover:bg-accent-600">Search</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <Card className="border-secondary-200">
              <CardHeader>
                <CardTitle className="text-primary-800">Recent Bookings</CardTitle>
                <CardDescription className="text-primary-600">
                  Your latest test appointments and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-accent-50 rounded-full flex items-center justify-center">
                          {getStatusIcon(booking.status)}
                        </div>
                        <div>
                          <div className="font-medium text-primary-800">#{booking.booking_number}</div>
                          <div className="text-sm text-primary-600">
                            {booking.appointment_date} at {booking.appointment_time}
                          </div>
                          <div className="text-sm text-primary-600">{booking.center_name}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {booking.tests.map((test, index) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-primary-50 text-primary-700">
                                {test}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                        <div className="text-sm font-medium mt-1 text-accent">${booking.total_amount.toFixed(2)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Link href="/nvcustomer/bookings">
                    <Button
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
                    >
                      View All Bookings
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Health Summary & Quick Links */}
          <div className="space-y-6">
            {/* Health Summary */}
            <Card className="border-secondary-200">
              <CardHeader>
                <CardTitle className="text-primary-800">Health Summary</CardTitle>
                <CardDescription className="text-primary-600">Your recent health metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Droplet className="w-4 h-4 text-error" />
                      <span className="text-sm text-primary-700">Last Blood Test</span>
                    </div>
                    <span className="text-sm text-primary-600">Jan 15, 2024</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-accent" />
                      <span className="text-sm text-primary-700">Cholesterol</span>
                    </div>
                    <span className="text-sm font-medium text-success">Normal</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-primary" />
                      <span className="text-sm text-primary-700">Blood Sugar</span>
                    </div>
                    <span className="text-sm font-medium text-success">Normal</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
                >
                  View Full Report
                </Button>
              </CardContent>
            </Card>

            {/* Popular Tests */}
            <Card className="border-secondary-200">
              <CardHeader>
                <CardTitle className="text-primary-800">Popular Tests</CardTitle>
                <CardDescription className="text-primary-600">Frequently booked by customers like you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-primary-700">Complete Blood Count</span>
                    <span className="text-sm font-medium text-accent">$18-25</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-primary-700">Lipid Profile</span>
                    <span className="text-sm font-medium text-accent">$35-48</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-primary-700">Thyroid Profile</span>
                    <span className="text-sm font-medium text-accent">$42-58</span>
                  </div>
                </div>
                <Link href="/tests">
                  <Button
                    variant="outline"
                    className="w-full mt-4 border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
                  >
                    Browse All Tests
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="border-secondary-200">
              <CardHeader>
                <CardTitle className="text-primary-800">Need Help?</CardTitle>
                <CardDescription className="text-primary-600">We're here to assist you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Help Center
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Contact Support
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
