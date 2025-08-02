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
  Download,
  Eye,
  Share2,
  Calendar,
  FileText,
  Bell,
  LogOut,
  User,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react"

interface TestResult {
  id: string
  booking_number: string
  test_name: string
  result_date: string
  status: "normal" | "abnormal" | "critical"
  report_url: string
  center_name: string
  key_findings: {
    parameter: string
    value: string
    reference_range: string
    status: "normal" | "high" | "low"
  }[]
}

export default function PatientResultsPage() {
  const [user, setUser] = useState<any | null>(null)
  const [results, setResults] = useState<TestResult[]>([])
  const [filteredResults, setFilteredResults] = useState<TestResult[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Mock results data
    const mockResults: TestResult[] = [
      {
        id: "1",
        booking_number: "NVH001",
        test_name: "Complete Blood Count (CBC)",
        result_date: "2024-01-16",
        status: "normal",
        report_url: "/reports/nvh001-cbc.pdf",
        center_name: "HealthFirst Diagnostics",
        key_findings: [
          { parameter: "Hemoglobin", value: "14.2", reference_range: "12.0-15.5 g/dL", status: "normal" },
          { parameter: "White Blood Cells", value: "7.8", reference_range: "4.0-11.0 K/uL", status: "normal" },
          { parameter: "Platelets", value: "285", reference_range: "150-450 K/uL", status: "normal" },
        ],
      },
      {
        id: "2",
        booking_number: "NVH001",
        test_name: "Lipid Profile",
        result_date: "2024-01-16",
        status: "abnormal",
        report_url: "/reports/nvh001-lipid.pdf",
        center_name: "HealthFirst Diagnostics",
        key_findings: [
          { parameter: "Total Cholesterol", value: "245", reference_range: "<200 mg/dL", status: "high" },
          { parameter: "LDL Cholesterol", value: "165", reference_range: "<100 mg/dL", status: "high" },
          { parameter: "HDL Cholesterol", value: "42", reference_range: ">40 mg/dL", status: "normal" },
          { parameter: "Triglycerides", value: "190", reference_range: "<150 mg/dL", status: "high" },
        ],
      },
      {
        id: "3",
        booking_number: "NVH002",
        test_name: "HbA1c",
        result_date: "2024-01-21",
        status: "normal",
        report_url: "/reports/nvh002-hba1c.pdf",
        center_name: "MediCore Labs",
        key_findings: [{ parameter: "HbA1c", value: "5.4", reference_range: "<5.7%", status: "normal" }],
      },
    ]

    setResults(mockResults)
    setFilteredResults(mockResults)
    setLoading(false)
  }, [])

  useEffect(() => {
    filterResults()
  }, [results, searchQuery])

  const filterResults = () => {
    let filtered = [...results]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (result) =>
          result.test_name.toLowerCase().includes(query) ||
          result.booking_number.toLowerCase().includes(query) ||
          result.center_name.toLowerCase().includes(query),
      )
    }

    setFilteredResults(filtered)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    window.location.href = "/"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-success text-white"
      case "abnormal":
        return "bg-accent text-white"
      case "critical":
        return "bg-error text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal":
        return <CheckCircle className="w-4 h-4" />
      case "abnormal":
        return <AlertTriangle className="w-4 h-4" />
      case "critical":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getParameterIcon = (status: string) => {
    switch (status) {
      case "high":
        return <TrendingUp className="w-3 h-3 text-error" />
      case "low":
        return <TrendingDown className="w-3 h-3 text-error" />
      default:
        return <CheckCircle className="w-3 h-3 text-success" />
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
              <Link href="/nvcustomer/bookings" className="text-primary-700 hover:text-accent transition-colors">
                My Bookings
              </Link>
              <Link href="/nvcustomer/results" className="text-accent font-medium">
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
          <h1 className="text-3xl font-bold text-primary-800 mb-2">Test Results</h1>
          <p className="text-primary-600">View and download your lab test reports</p>
        </div>

        {/* Search */}
        <Card className="mb-8 border-secondary-200">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by test name, booking number, or center..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-secondary-300 focus:border-accent"
              />
            </div>
          </CardContent>
        </Card>

        {/* Results List */}
        {filteredResults.length === 0 ? (
          <Card className="border-secondary-200">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-primary-800">No results found</h3>
              <p className="text-primary-600 mb-4">
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : "Your test results will appear here once they're ready"}
              </p>
              <Link href="/tests">
                <Button className="bg-accent hover:bg-accent-600">Book New Tests</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredResults.map((result) => (
              <Card key={result.id} className="hover:shadow-lg transition-shadow border-secondary-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-3">
                        <span className="text-primary-800">{result.test_name}</span>
                        <Badge className={getStatusColor(result.status)}>
                          {getStatusIcon(result.status)}
                          <span className="ml-1 capitalize">{result.status}</span>
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-2 text-primary-600">
                        <div className="flex items-center gap-4 text-sm">
                          <span>#{result.booking_number}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(result.result_date).toLocaleDateString()}
                          </span>
                          <span>{result.center_name}</span>
                        </div>
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                      <Button size="sm" className="flex items-center gap-2 bg-primary hover:bg-primary-700">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
                      >
                        <Share2 className="w-4 h-4" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-medium mb-3 text-primary-800">Key Findings</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.key_findings.map((finding, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            {getParameterIcon(finding.status)}
                            <div>
                              <p className="font-medium text-sm text-primary-800">{finding.parameter}</p>
                              <p className="text-xs text-primary-600">Ref: {finding.reference_range}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${finding.status === "normal" ? "text-success" : "text-error"}`}>
                              {finding.value}
                            </p>
                            <p className="text-xs text-gray-600 capitalize">{finding.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {result.status === "abnormal" && (
                    <div className="mt-4 p-4 bg-accent-50 border border-accent-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-accent mt-0.5" />
                        <div>
                          <p className="font-medium text-accent-800">Abnormal Results Detected</p>
                          <p className="text-sm text-accent-700 mt-1">
                            Some parameters are outside the normal range. Please consult with your healthcare provider
                            to discuss these results and any necessary follow-up actions.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {result.status === "critical" && (
                    <div className="mt-4 p-4 bg-error-50 border border-error-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-error mt-0.5" />
                        <div>
                          <p className="font-medium text-error-800">Critical Results - Immediate Attention Required</p>
                          <p className="text-sm text-error-700 mt-1">
                            These results require immediate medical attention. Please contact your healthcare provider
                            or visit the nearest emergency facility immediately.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
