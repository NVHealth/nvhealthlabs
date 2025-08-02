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
import {
  Search,
  Upload,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Bell,
  LogOut,
  User,
  Download,
  Eye,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TestResult {
  id: string
  booking_number: string
  patient_name: string
  patient_email: string
  test_name: string
  test_id: string
  status: "pending" | "uploaded" | "delivered"
  result_file_name?: string
  result_file_url?: string
  upload_date?: string
  notes?: string
  appointment_date: string
}

export default function CenterResults() {
  const [user, setUser] = useState<any | null>(null)
  const [results, setResults] = useState<TestResult[]>([])
  const [filteredResults, setFilteredResults] = useState<TestResult[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [uploadDialog, setUploadDialog] = useState(false)
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadNotes, setUploadNotes] = useState("")

  const { toast } = useToast()

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    fetchResults()
  }, [])

  useEffect(() => {
    filterResults()
  }, [results, searchQuery, statusFilter])

  const fetchResults = async () => {
    try {
      // Mock data - replace with actual API call
      const mockResults: TestResult[] = [
        {
          id: "1",
          booking_number: "NVH001",
          patient_name: "John Doe",
          patient_email: "john.doe@email.com",
          test_name: "Complete Blood Count (CBC)",
          test_id: "1",
          status: "pending",
          appointment_date: "2024-01-15",
        },
        {
          id: "2",
          booking_number: "NVH001",
          patient_name: "John Doe",
          patient_email: "john.doe@email.com",
          test_name: "Lipid Profile",
          test_id: "2",
          status: "uploaded",
          result_file_name: "lipid_profile_nvh001.pdf",
          result_file_url: "/results/lipid_profile_nvh001.pdf",
          upload_date: "2024-01-16T10:30:00Z",
          notes: "All parameters within normal limits",
          appointment_date: "2024-01-15",
        },
        {
          id: "3",
          booking_number: "NVH002",
          patient_name: "Jane Smith",
          patient_email: "jane.smith@email.com",
          test_name: "HbA1c",
          test_id: "3",
          status: "pending",
          appointment_date: "2024-01-15",
        },
        {
          id: "4",
          booking_number: "NVH003",
          patient_name: "Mike Johnson",
          patient_email: "mike.johnson@email.com",
          test_name: "Thyroid Profile",
          test_id: "4",
          status: "uploaded",
          result_file_name: "thyroid_profile_nvh003.pdf",
          result_file_url: "/results/thyroid_profile_nvh003.pdf",
          upload_date: "2024-01-17T14:15:00Z",
          notes: "TSH slightly elevated, recommend follow-up",
          appointment_date: "2024-01-14",
        },
        {
          id: "5",
          booking_number: "NVH003",
          patient_name: "Mike Johnson",
          patient_email: "mike.johnson@email.com",
          test_name: "Vitamin D",
          test_id: "5",
          status: "delivered",
          result_file_name: "vitamin_d_nvh003.pdf",
          result_file_url: "/results/vitamin_d_nvh003.pdf",
          upload_date: "2024-01-17T14:20:00Z",
          notes: "Vitamin D deficiency detected",
          appointment_date: "2024-01-14",
        },
      ]

      setResults(mockResults)
    } catch (error) {
      console.error("Error fetching results:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterResults = () => {
    let filtered = [...results]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (result) =>
          result.booking_number.toLowerCase().includes(query) ||
          result.patient_name.toLowerCase().includes(query) ||
          result.test_name.toLowerCase().includes(query),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((result) => result.status === statusFilter)
    }

    setFilteredResults(filtered)
  }

  const handleResultUpload = async () => {
    if (!selectedResult || !uploadFile) return

    try {
      // Mock file upload - replace with actual implementation
      const formData = new FormData()
      formData.append("file", uploadFile)
      formData.append("notes", uploadNotes)
      formData.append("result_id", selectedResult.id)

      // Simulate upload
      const updatedResults = results.map((result) =>
        result.id === selectedResult.id
          ? {
              ...result,
              status: "uploaded" as const,
              result_file_name: uploadFile.name,
              result_file_url: `/results/${uploadFile.name}`,
              upload_date: new Date().toISOString(),
              notes: uploadNotes,
            }
          : result,
      )

      setResults(updatedResults)
      setUploadDialog(false)
      setSelectedResult(null)
      setUploadFile(null)
      setUploadNotes("")

      toast({
        title: "Result Uploaded",
        description: `Test result uploaded for ${selectedResult.test_name}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload result",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-success text-white"
      case "uploaded":
        return "bg-primary text-white"
      case "pending":
        return "bg-accent text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4" />
      case "uploaded":
        return <FileText className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    window.location.href = "/"
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
              <Link href="/center/orders" className="text-gray-700 hover:text-primary transition-colors">
                Orders
              </Link>
              <Link href="/center/results" className="text-primary font-medium">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Results Management</h1>
          <p className="text-primary-600">Upload and manage test results for customer orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Results</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{results.filter((r) => r.status === "pending").length}</div>
              <p className="text-xs text-primary-600">Awaiting upload</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uploaded Today</CardTitle>
              <Upload className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{results.filter((r) => r.status === "uploaded").length}</div>
              <p className="text-xs text-primary-600">Ready for delivery</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{results.filter((r) => r.status === "delivered").length}</div>
              <p className="text-xs text-primary-600">Sent to customers</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by booking number, patient name, or test..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="uploaded">Uploaded</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card>
          <CardHeader>
            <CardTitle>Test Results ({filteredResults.length})</CardTitle>
            <CardDescription className="text-primary-600">
              Upload and manage test results for completed orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order & Customer</TableHead>
                    <TableHead>Test Details</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Result File</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">#{result.booking_number}</div>
                          <div className="text-sm text-gray-600">{result.patient_name}</div>
                          <div className="text-sm text-primary-600">{result.patient_email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{result.test_name}</div>
                          <div className="text-sm text-gray-600">
                            Appointment: {new Date(result.appointment_date).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(result.status)}>
                          {getStatusIcon(result.status)}
                          <span className="ml-1 capitalize">{result.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {result.result_file_name ? (
                          <div>
                            <div className="text-sm font-medium">{result.result_file_name}</div>
                            {result.notes && <div className="text-xs text-gray-500 mt-1">{result.notes}</div>}
                          </div>
                        ) : (
                          <span className="text-gray-400">No file uploaded</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {result.upload_date ? (
                          <div className="text-sm">
                            {new Date(result.upload_date).toLocaleDateString()}
                            <div className="text-xs text-gray-500">
                              {new Date(result.upload_date).toLocaleTimeString()}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {result.status === "pending" && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedResult(result)
                                setUploadDialog(true)
                              }}
                            >
                              <Upload className="w-4 h-4 mr-1" />
                              Upload
                            </Button>
                          )}
                          {result.result_file_url && (
                            <>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Upload Result Dialog */}
        <Dialog open={uploadDialog} onOpenChange={setUploadDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Test Result</DialogTitle>
              <DialogDescription>
                Upload result file for {selectedResult?.test_name} - {selectedResult?.patient_name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="result-file">Result File (PDF, JPG, PNG)</Label>
                <Input
                  id="result-file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setUploadFile(file)
                    }
                  }}
                />
                {uploadFile && (
                  <div className="text-sm text-gray-600">
                    Selected: {uploadFile.name} ({(uploadFile.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="upload-notes">Result Notes</Label>
                <Textarea
                  id="upload-notes"
                  placeholder="Add any notes about the test results..."
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setUploadDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleResultUpload} disabled={!uploadFile}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Result
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
