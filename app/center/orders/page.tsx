"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth, withAuth } from "@/components/auth-provider"
import {
  Search,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Edit,
  Bell,
  LogOut,
  User,
  TestTube,
  Activity,
  MapPin,
  Phone,
  Mail,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Booking {
  id: string
  booking_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address?: string
  appointment_date: string
  appointment_time: string
  tests: Array<{
    id: string
    name: string
    price: number
    preparation_instructions?: string
  }>
  total_amount: number
  status: "pending" | "confirmed" | "sample_collected" | "processing" | "completed" | "cancelled"
  payment_status: "pending" | "paid" | "failed"
  collection_type: "lab_visit" | "home_collection"
  special_instructions?: string
  created_at: string
  updated_at: string
}

function CenterOrders() {
  const { user, logout } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")
  const [collectionTypeFilter, setCollectionTypeFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [detailsDialog, setDetailsDialog] = useState(false)
  const [statusUpdateDialog, setStatusUpdateDialog] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [statusNotes, setStatusNotes] = useState("")

  const { toast } = useToast()

  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    filterBookings()
  }, [bookings, searchQuery, statusFilter, dateFilter, collectionTypeFilter])

  const fetchBookings = async () => {
    try {
      // Mock data - replace with actual API call
      const mockBookings: Booking[] = [
        {
          id: "1",
          booking_number: "NVH001",
          customer_name: "John Doe",
          customer_email: "john.doe@email.com",
          customer_phone: "+1-555-0101",
          customer_address: "123 Main St, New York, NY 10001",
          appointment_date: "2024-01-15",
          appointment_time: "09:00",
          tests: [
            {
              id: "1",
              name: "Complete Blood Count (CBC)",
              price: 25.0,
              preparation_instructions: "No special preparation required",
            },
            {
              id: "2",
              name: "Lipid Profile",
              price: 45.0,
              preparation_instructions: "12-hour fasting required",
            },
          ],
          total_amount: 70.0,
          status: "confirmed",
          payment_status: "paid",
          collection_type: "lab_visit",
          special_instructions: "Patient is fasting for lipid profile",
          created_at: "2024-01-10T10:00:00Z",
          updated_at: "2024-01-10T10:00:00Z",
        },
        {
          id: "2",
          booking_number: "NVH002",
          customer_name: "Jane Smith",
          customer_email: "jane.smith@email.com",
          customer_phone: "+1-555-0102",
          customer_address: "456 Oak Ave, Brooklyn, NY 11201",
          appointment_date: "2024-01-15",
          appointment_time: "10:30",
          tests: [
            {
              id: "3",
              name: "HbA1c",
              price: 35.0,
              preparation_instructions: "No fasting required",
            },
          ],
          total_amount: 35.0,
          status: "pending",
          payment_status: "paid",
          collection_type: "home_collection",
          special_instructions: "Please call before arriving",
          created_at: "2024-01-12T14:00:00Z",
          updated_at: "2024-01-12T14:00:00Z",
        },
        {
          id: "3",
          booking_number: "NVH003",
          customer_name: "Mike Johnson",
          customer_email: "mike.johnson@email.com",
          customer_phone: "+1-555-0103",
          appointment_date: "2024-01-14",
          appointment_time: "14:00",
          tests: [
            {
              id: "4",
              name: "Thyroid Profile",
              price: 65.0,
              preparation_instructions: "Morning collection preferred",
            },
            {
              id: "5",
              name: "Vitamin D",
              price: 40.0,
              preparation_instructions: "No special preparation required",
            },
          ],
          total_amount: 105.0,
          status: "sample_collected",
          payment_status: "paid",
          collection_type: "lab_visit",
          created_at: "2024-01-11T09:00:00Z",
          updated_at: "2024-01-14T15:00:00Z",
        },
        {
          id: "4",
          booking_number: "NVH004",
          customer_name: "Sarah Wilson",
          customer_email: "sarah.wilson@email.com",
          customer_phone: "+1-555-0104",
          customer_address: "789 Pine St, Queens, NY 11375",
          appointment_date: "2024-01-16",
          appointment_time: "11:00",
          tests: [
            {
              id: "6",
              name: "Comprehensive Metabolic Panel",
              price: 55.0,
              preparation_instructions: "8-hour fasting required",
            },
          ],
          total_amount: 55.0,
          status: "processing",
          payment_status: "paid",
          collection_type: "home_collection",
          special_instructions: "Patient has mobility issues",
          created_at: "2024-01-13T16:00:00Z",
          updated_at: "2024-01-16T12:00:00Z",
        },
        {
          id: "5",
          booking_number: "NVH005",
          customer_name: "David Brown",
          customer_email: "david.brown@email.com",
          customer_phone: "+1-555-0105",
          appointment_date: "2024-01-13",
          appointment_time: "15:30",
          tests: [
            {
              id: "7",
              name: "PSA Test",
              price: 30.0,
              preparation_instructions: "No ejaculation 48 hours before test",
            },
          ],
          total_amount: 30.0,
          status: "completed",
          payment_status: "paid",
          collection_type: "lab_visit",
          created_at: "2024-01-12T11:00:00Z",
          updated_at: "2024-01-13T17:00:00Z",
        },
      ]

      setBookings(mockBookings)
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterBookings = () => {
    let filtered = [...bookings]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (booking) =>
          booking.booking_number.toLowerCase().includes(query) ||
          booking.customer_name.toLowerCase().includes(query) ||
          booking.customer_email.toLowerCase().includes(query) ||
          booking.customer_phone.toLowerCase().includes(query),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter)
    }

    if (dateFilter) {
      filtered = filtered.filter((booking) => booking.appointment_date === dateFilter)
    }

    if (collectionTypeFilter !== "all") {
      filtered = filtered.filter((booking) => booking.collection_type === collectionTypeFilter)
    }

    setFilteredBookings(filtered)
  }

  const handleStatusUpdate = async () => {
    if (!selectedBooking || !newStatus) return

    try {
      // Mock API call - replace with actual implementation
      const updatedBookings = bookings.map((booking) =>
        booking.id === selectedBooking.id
          ? { ...booking, status: newStatus as any, updated_at: new Date().toISOString() }
          : booking,
      )

      setBookings(updatedBookings)
      setStatusUpdateDialog(false)
      setNewStatus("")
      setStatusNotes("")
      setSelectedBooking(null)

      toast({
        title: "Status Updated",
        description: `Booking ${selectedBooking.booking_number} status updated to ${newStatus}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success text-white"
      case "confirmed":
        return "bg-primary text-white"
      case "sample_collected":
        return "bg-blue-500 text-white"
      case "processing":
        return "bg-orange-500 text-white"
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
      case "sample_collected":
        return <TestTube className="w-4 h-4" />
      case "processing":
        return <Activity className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "cancelled":
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const handleLogout = () => {
    logout()
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
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/nvhealth-logo.png"
                  alt="NVHealth Labs"
                  width={240}
                  height={60}
                  className="h-14 w-auto"
                  priority
                />
              </Link>
              <Badge variant="secondary" className="ml-4">
                Diagnostic Center
              </Badge>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/center/dashboard" className="text-gray-700 hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link href="/center/orders" className="text-primary font-medium">
                Orders
              </Link>
              <Link href="/center/results" className="text-gray-700 hover:text-primary transition-colors">
                Results
              </Link>
              <Link href="/center/reports" className="text-gray-700 hover:text-primary transition-colors">
                Reports
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
                  {user?.firstName} {user?.lastName}
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Orders</h1>
          <p className="text-primary-600">Review, confirm, and manage all customer test orders</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="sample_collected">Sample Collected</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={collectionTypeFilter} onValueChange={setCollectionTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Collection Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="lab_visit">Lab Visit</SelectItem>
                  <SelectItem value="home_collection">Home Collection</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                placeholder="Filter by date"
              />
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orders ({filteredBookings.length})</CardTitle>
            <CardDescription>Detailed view of all customer orders and their current status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order Details</TableHead>
                    <TableHead>Customer Information</TableHead>
                    <TableHead>Appointment</TableHead>
                    <TableHead>Tests & Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-lg">#{booking.booking_number}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className={
                                booking.collection_type === "home_collection"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-green-50 text-green-700 border-green-200"
                              }
                            >
                              {booking.collection_type === "home_collection" ? "Home Collection" : "Lab Visit"}
                            </Badge>
                          </div>
                          <div className="text-xs text-primary-500 mt-1">
                            Created: {new Date(booking.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{booking.customer_name}</div>
                          <div className="flex items-center gap-1 text-sm text-primary-600">
                            <Mail className="w-3 h-3" />
                            {booking.customer_email}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Phone className="w-3 h-3" />
                            {booking.customer_phone}
                          </div>
                          {booking.customer_address && booking.collection_type === "home_collection" && (
                            <div className="flex items-start gap-1 text-sm text-gray-600">
                              <MapPin className="w-3 h-3 mt-0.5" />
                              <span className="text-xs">{booking.customer_address}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {new Date(booking.appointment_date).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="text-sm text-gray-600">{booking.appointment_time}</div>
                          {booking.special_instructions && (
                            <div className="text-xs text-amber-600 mt-1 bg-amber-50 px-2 py-1 rounded">
                              Note: {booking.special_instructions}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          {booking.tests.map((test) => (
                            <div key={test.id} className="text-sm">
                              <div className="font-medium">{test.name}</div>
                              <div className="text-primary-600">${test.price.toFixed(2)}</div>
                              {test.preparation_instructions && (
                                <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded mt-1">
                                  {test.preparation_instructions}
                                </div>
                              )}
                            </div>
                          ))}
                          <div className="border-t pt-2 mt-2">
                            <div className="font-medium">Total: ${booking.total_amount.toFixed(2)}</div>
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
                              {booking.payment_status}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(booking.status)}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1 capitalize">{booking.status.replace("_", " ")}</span>
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">
                          Updated: {new Date(booking.updated_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedBooking(booking)
                              setDetailsDialog(true)
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedBooking(booking)
                              setNewStatus(booking.status)
                              setStatusUpdateDialog(true)
                            }}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Update
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Order Details Dialog */}
        <Dialog open={detailsDialog} onOpenChange={setDetailsDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Order Details - #{selectedBooking?.booking_number}</DialogTitle>
              <DialogDescription>Complete information for this customer order</DialogDescription>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Customer Information</h4>
                    <div className="space-y-1 text-sm">
                      <div>Name: {selectedBooking.customer_name}</div>
                      <div>Email: {selectedBooking.customer_email}</div>
                      <div>Phone: {selectedBooking.customer_phone}</div>
                      {selectedBooking.customer_address && <div>Address: {selectedBooking.customer_address}</div>}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Appointment Details</h4>
                    <div className="space-y-1 text-sm">
                      <div>Date: {new Date(selectedBooking.appointment_date).toLocaleDateString()}</div>
                      <div>Time: {selectedBooking.appointment_time}</div>
                      <div>Type: {selectedBooking.collection_type.replace("_", " ")}</div>
                      <div>Status: {selectedBooking.status.replace("_", " ")}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Ordered Tests</h4>
                  <div className="space-y-2">
                    {selectedBooking.tests.map((test) => (
                      <div key={test.id} className="border rounded p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{test.name}</div>
                            {test.preparation_instructions && (
                              <div className="text-sm text-blue-600 mt-1">
                                Preparation: {test.preparation_instructions}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${test.price.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-2 flex justify-between items-center">
                      <span className="font-medium">Total Amount:</span>
                      <span className="font-bold text-lg">${selectedBooking.total_amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {selectedBooking.special_instructions && (
                  <div>
                    <h4 className="font-medium mb-2">Special Instructions</h4>
                    <div className="bg-amber-50 border border-amber-200 rounded p-3 text-sm">
                      {selectedBooking.special_instructions}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Status Update Dialog */}
        <Dialog open={statusUpdateDialog} onOpenChange={setStatusUpdateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Order Status</DialogTitle>
              <DialogDescription>Update the status for booking #{selectedBooking?.booking_number}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">New Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="sample_collected">Sample Collected</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Status Update Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about this status update..."
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setStatusUpdateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleStatusUpdate} disabled={!newStatus}>
                  Update Status
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// Export with role-based authentication protection
export default withAuth(CenterOrders, ['center_admin', 'platform_admin'])
