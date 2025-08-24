"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Logo } from "@/components/logo"
import { useAuth, withAuth } from "@/components/auth-provider"
import {
  Search,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Upload,
  Eye,
  Edit,
  Bell,
  LogOut,
  User,
  Activity,
  TestTube,
  TrendingUp,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Booking {
  id: string
  booking_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  appointment_date: string
  appointment_time: string
  tests: Array<{
    id: string
    name: string
    price: number
  }>
  total_amount: number
  status: "pending" | "confirmed" | "sample_collected" | "processing" | "completed" | "cancelled"
  payment_status: "pending" | "paid" | "failed"
  collection_type: "lab_visit" | "home_collection"
  special_instructions?: string
  created_at: string
  updated_at: string
}

interface TestResult {
  id: string
  booking_id: string
  test_id: string
  test_name: string
  result_file?: File
  result_data: any
  status: "pending" | "completed"
  uploaded_at?: string
}

function CenterDashboard() {
  const { user, logout } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [statusUpdateDialog, setStatusUpdateDialog] = useState(false)
  const [resultUploadDialog, setResultUploadDialog] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [statusNotes, setStatusNotes] = useState("")
  const [uploadingResults, setUploadingResults] = useState<TestResult[]>([])

  const { toast } = useToast()

  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    filterBookings()
  }, [bookings, searchQuery, statusFilter, dateFilter])

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
          appointment_date: "2024-01-15",
          appointment_time: "09:00",
          tests: [
            { id: "1", name: "Complete Blood Count (CBC)", price: 25.0 },
            { id: "2", name: "Lipid Profile", price: 45.0 },
          ],
          total_amount: 70.0,
          status: "confirmed",
          payment_status: "paid",
          collection_type: "lab_visit",
          special_instructions: "Patient is fasting",
          created_at: "2024-01-10T10:00:00Z",
          updated_at: "2024-01-10T10:00:00Z",
        },
        {
          id: "2",
          booking_number: "NVH002",
          customer_name: "Jane Smith",
          customer_email: "jane.smith@email.com",
          customer_phone: "+1-555-0102",
          appointment_date: "2024-01-15",
          appointment_time: "10:30",
          tests: [{ id: "3", name: "HbA1c", price: 35.0 }],
          total_amount: 35.0,
          status: "pending",
          payment_status: "paid",
          collection_type: "home_collection",
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
            { id: "4", name: "Thyroid Profile", price: 65.0 },
            { id: "5", name: "Vitamin D", price: 40.0 },
          ],
          total_amount: 105.0,
          status: "sample_collected",
          payment_status: "paid",
          collection_type: "lab_visit",
          created_at: "2024-01-11T09:00:00Z",
          updated_at: "2024-01-14T15:00:00Z",
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
          booking.customer_email.toLowerCase().includes(query),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter)
    }

    if (dateFilter) {
      filtered = filtered.filter((booking) => booking.appointment_date === dateFilter)
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

  const handleResultUpload = async () => {
    if (!selectedBooking || uploadingResults.length === 0) return

    try {
      // Mock file upload - replace with actual implementation
      console.log("Uploading results:", uploadingResults)

      // Update booking status to completed
      const updatedBookings = bookings.map((booking) =>
        booking.id === selectedBooking.id
          ? { ...booking, status: "completed" as any, updated_at: new Date().toISOString() }
          : booking,
      )

      setBookings(updatedBookings)
      setResultUploadDialog(false)
      setUploadingResults([])
      setSelectedBooking(null)

      toast({
        title: "Results Uploaded",
        description: `Test results uploaded for booking ${selectedBooking.booking_number}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload results",
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

  const initializeResultUpload = (booking: Booking) => {
    const results = booking.tests.map((test) => ({
      id: `result-${test.id}`,
      booking_id: booking.id,
      test_id: test.id,
      test_name: test.name,
      result_data: {},
      status: "pending" as const,
    }))
    setUploadingResults(results)
    setSelectedBooking(booking)
    setResultUploadDialog(true)
  }

  const updateResultFile = (testId: string, file: File) => {
    setUploadingResults((prev) =>
      prev.map((result) => (result.test_id === testId ? { ...result, result_file: file } : result)),
    )
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
              <Logo iconSize={48} textClassName="text-2xl" />
              <Badge variant="secondary" className="ml-4">
                Diagnostic Center
              </Badge>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/center/dashboard" className="text-accent font-medium">
                Dashboard
              </Link>
              <Link href="/center/orders" className="text-primary-700 hover:text-accent transition-colors">
                Orders
              </Link>
              <Link href="/center/results" className="text-primary-700 hover:text-accent transition-colors">
                Results
              </Link>
              <Link href="/center/reports" className="text-primary-700 hover:text-accent transition-colors">
                Reports
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
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-secondary-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary-800">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-800">
                {filteredBookings.filter((b) => b.appointment_date === new Date().toISOString().split("T")[0]).length}
              </div>
              <p className="text-xs text-primary-600">Scheduled for today</p>
            </CardContent>
          </Card>

          <Card className="border-secondary-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary-800">Pending Orders</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-800">
                {filteredBookings.filter((b) => b.status === "pending").length}
              </div>
              <p className="text-xs text-primary-600">Awaiting confirmation</p>
            </CardContent>
          </Card>

          <Card className="border-secondary-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary-800">Processing</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-800">
                {filteredBookings.filter((b) => b.status === "sample_collected" || b.status === "processing").length}
              </div>
              <p className="text-xs text-primary-600">In progress</p>
            </CardContent>
          </Card>

          <Card className="border-secondary-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary-800">Completed Today</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-800">
                {filteredBookings.filter((b) => b.status === "completed").length}
              </div>
              <p className="text-xs text-primary-600">Results uploaded</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-secondary-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by booking number, customer name, or email..."
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
                  <SelectItem value="sample_collected">Sample Collected</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full md:w-48"
              />
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="border-secondary-200">
          <CardHeader>
            <CardTitle className="text-primary-800">Customer Orders</CardTitle>
            <CardDescription className="text-primary-600">
              Manage appointments, update status, and upload results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Appointment</TableHead>
                    <TableHead>Tests</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-primary-800">#{booking.booking_number}</div>
                          <div className="text-sm text-primary-600 capitalize">{booking.collection_type}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-primary-800">{booking.customer_name}</div>
                          <div className="text-sm text-primary-600">{booking.customer_email}</div>
                          <div className="text-sm text-gray-600">{booking.customer_phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-primary-800">
                            {new Date(booking.appointment_date).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-primary-600">{booking.appointment_time}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {booking.tests.map((test) => (
                            <div key={test.id} className="text-sm text-primary-600">
                              {test.name}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-primary-800">${booking.total_amount.toFixed(2)}</div>
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
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(booking.status)}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-1 capitalize">{booking.status.replace("_", " ")}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedBooking(booking)
                              setStatusUpdateDialog(true)
                            }}
                            className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {(booking.status === "sample_collected" || booking.status === "processing") && (
                            <Button
                              size="sm"
                              onClick={() => initializeResultUpload(booking)}
                              className="bg-accent hover:bg-accent-600"
                            >
                              <Upload className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
                          >
                            <Eye className="w-4 h-4" />
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

        {/* Status Update Dialog */}
        <Dialog open={statusUpdateDialog} onOpenChange={setStatusUpdateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-primary-800">Update Order Status</DialogTitle>
              <DialogDescription className="text-primary-600">
                Update the status for booking #{selectedBooking?.booking_number}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status" className="text-primary-700">
                  New Status
                </Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="sample_collected">Sample Collected</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-primary-700">
                  Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about this status update..."
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  className="border-secondary-300 focus:border-accent"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStatusUpdateDialog(false)}
                  className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
                >
                  Cancel
                </Button>
                <Button onClick={handleStatusUpdate} disabled={!newStatus} className="bg-accent hover:bg-accent-600">
                  Update Status
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Result Upload Dialog */}
        <Dialog open={resultUploadDialog} onOpenChange={setResultUploadDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-primary-800">Upload Test Results</DialogTitle>
              <DialogDescription className="text-primary-600">
                Upload results for booking #{selectedBooking?.booking_number} - {selectedBooking?.customer_name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {uploadingResults.map((result) => (
                <Card key={result.test_id} className="border-secondary-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-primary-800">{result.test_name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`file-${result.test_id}`} className="text-primary-700">
                        Upload Result File (PDF)
                      </Label>
                      <Input
                        id={`file-${result.test_id}`}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            updateResultFile(result.test_id, file)
                          }
                        }}
                        className="border-secondary-300 focus:border-accent"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`notes-${result.test_id}`} className="text-primary-700">
                        Result Notes
                      </Label>
                      <Textarea
                        id={`notes-${result.test_id}`}
                        placeholder="Add any notes about the test results..."
                        onChange={(e) => {
                          setUploadingResults((prev) =>
                            prev.map((r) =>
                              r.test_id === result.test_id
                                ? { ...r, result_data: { ...r.result_data, notes: e.target.value } }
                                : r,
                            ),
                          )
                        }}
                        className="border-secondary-300 focus:border-accent"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setResultUploadDialog(false)}
                className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={handleResultUpload}
                disabled={uploadingResults.some((r) => !r.result_file)}
                className="bg-accent hover:bg-accent-600"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Results
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// Export with role-based authentication protection
export default withAuth(CenterDashboard, ['center_admin', 'platform_admin'])
