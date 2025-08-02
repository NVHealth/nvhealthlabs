"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Logo } from "@/components/logo"
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  FileText,
  CheckCircle,
  AlertCircle,
  Bell,
  LogOut,
  User,
  Download,
  Eye,
} from "lucide-react"

interface Booking {
  id: string
  booking_number: string
  appointment_date: string
  appointment_time: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  total_amount: number
  center_name: string
  center_address: string
  tests: string[]
  is_home_collection: boolean
  payment_status: "pending" | "paid" | "failed"
}

export default function PatientBookingsPage() {
  const [user, setUser] = useState<any | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Mock bookings data
    const mockBookings: Booking[] = [
      {
        id: "1",
        booking_number: "NVH001",
        appointment_date: "2024-01-15",
        appointment_time: "09:00",
        status: "completed",
        total_amount: 85.0,
        center_name: "HealthFirst Diagnostics",
        center_address: "123 Medical Plaza, Downtown, NY",
        tests: ["Complete Blood Count", "Lipid Profile"],
        is_home_collection: false,
        payment_status: "paid",
      },
      {
        id: "2",
        booking_number: "NVH002",
        appointment_date: "2024-01-25",
        appointment_time: "14:30",
        status: "confirmed",
        total_amount: 45.0,
        center_name: "MediCore Labs",
        center_address: "456 Health Street, Midtown, NY",
        tests: ["HbA1c"],
        is_home_collection: true,
        payment_status: "paid",
      },
      {
        id: "3",
        booking_number: "NVH003",
        appointment_date: "2024-01-30",
        appointment_time: "11:00",
        status: "pending",
        total_amount: 120.0,
        center_name: "QuickTest Center",
        center_address: "789 Wellness Ave, Uptown, NY",
        tests: ["Thyroid Profile", "Vitamin D"],
        is_home_collection: false,
        payment_status: "pending",
      },
      {
        id: "4",
        booking_number: "NVH004",
        appointment_date: "2024-01-10",
        appointment_time: "16:00",
        status: "cancelled",
        total_amount: 65.0,
        center_name: "HealthFirst Diagnostics",
        center_address: "123 Medical Plaza, Downtown, NY",
        tests: ["Liver Function Test"],
        is_home_collection: false,
        payment_status: "failed",
      },
    ]

    setBookings(mockBookings)
    setFilteredBookings(mockBookings)
    setLoading(false)
  }, [])

  useEffect(() => {
    filterBookings()
  }, [bookings, searchQuery, statusFilter])

  const filterBookings = () => {
    let filtered = [...bookings]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (booking) =>
          booking.booking_number.toLowerCase().includes(query) ||
          booking.center_name.toLowerCase().includes(query) ||
          booking.tests.some((test) => test.toLowerCase().includes(query)),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter)
    }

    setFilteredBookings(filtered)
  }

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
        return "bg-accent text-white"
      case "cancelled":
        return "bg-gray-500 text-white"
      default:
        return "bg-gray-500 text-white"
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
      case "cancelled":
        return <AlertCircle className="w-4 h-4" />
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
              <Link href="/nvcustomer/dashboard" className="text-primary-700 hover:text-accent transition-colors">
                Dashboard
              </Link>
              <Link href="/nvcustomer/bookings" className="text-accent font-medium">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-800 mb-2">My Bookings</h1>
          <p className="text-primary-600">View and manage your test appointments</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 border-secondary-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by booking number, center, or test name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-secondary-300 focus:border-accent"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <Card className="border-secondary-200">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-primary-800">No bookings found</h3>
              <p className="text-primary-600 mb-4">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search criteria"
                  : "You haven't made any bookings yet"}
              </p>
              <Link href="/tests">
                <Button className="bg-accent hover:bg-accent-600">Browse Tests</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow border-secondary-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-3">
                        <span className="text-primary-800">#{booking.booking_number}</span>
                        <Badge className={getStatusColor(booking.status)}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1 capitalize">{booking.status}</span>
                        </Badge>
                        {booking.is_home_collection && (
                          <Badge variant="secondary" className="bg-success-50 text-success">
                            Home Collection
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-2 text-primary-600">
                        Booked on {new Date(booking.appointment_date).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-accent">${booking.total_amount.toFixed(2)}</div>
                      <Badge
                        variant={booking.payment_status === "paid" ? "secondary" : "destructive"}
                        className={
                          booking.payment_status === "paid"
                            ? "bg-success text-white"
                            : booking.payment_status === "pending"
                              ? "bg-accent text-white"
                              : "bg-error text-white"
                        }
                      >
                        {booking.payment_status === "paid"
                          ? "Paid"
                          : booking.payment_status === "pending"
                            ? "Payment Pending"
                            : "Payment Failed"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2 text-primary-800">Appointment Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-primary-600">
                              {new Date(booking.appointment_date).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-primary-600">{booking.appointment_time}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                            <div>
                              <div className="text-primary-600">{booking.center_name}</div>
                              <p className="text-gray-600">{booking.center_address}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2 text-primary-800">Tests Included ({booking.tests.length})</h4>
                        <div className="space-y-1">
                          {booking.tests.map((test, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-3 h-3 text-success" />
                              <span className="text-primary-600">{test}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t">
                    {booking.status === "completed" && (
                      <Button size="sm" className="flex items-center gap-2 bg-primary hover:bg-primary-700">
                        <Eye className="w-4 h-4" />
                        View Results
                      </Button>
                    )}
                    {booking.status === "completed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
                      >
                        <Download className="w-4 h-4" />
                        Download Report
                      </Button>
                    )}
                    {booking.status === "pending" && booking.payment_status === "pending" && (
                      <Button size="sm" variant="outline" className="bg-accent text-white hover:bg-accent-600">
                        Complete Payment
                      </Button>
                    )}
                    {(booking.status === "pending" || booking.status === "confirmed") && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
                      >
                        Reschedule
                      </Button>
                    )}
                    {(booking.status === "pending" || booking.status === "confirmed") && (
                      <Button size="sm" variant="destructive">
                        Cancel Booking
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
                    >
                      <FileText className="w-4 h-4" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
