"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Clock,
  TestTube,
  Heart,
  Bell,
  LogOut,
  User,
  Star,
  CheckCircle,
  XCircle,
} from "lucide-react"

interface LabTest {
  id: string
  name: string
  category: string
  subcategory: string
  description: string
  sample_type: string
  sample_volume: string
  container_type: string
  base_price: number
  currency: string
  reporting_time_hours: number
  fasting_required: boolean
  preparation_instructions: string
  clinical_significance: string
  reference_ranges: any
  methodology: string
  status: string
  is_popular: boolean
  display_order: number
  search_keywords: string[]
  created_at: string
  updated_at: string
}

export default function AdminTestsPage() {
  const [tests, setTests] = useState<LabTest[]>([])
  const [filteredTests, setFilteredTests] = useState<LabTest[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTest, setEditingTest] = useState<LabTest | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    subcategory: "",
    description: "",
    sample_type: "",
    sample_volume: "",
    container_type: "",
    base_price: "",
    currency: "USD",
    reporting_time_hours: "24",
    fasting_required: false,
    preparation_instructions: "",
    clinical_significance: "",
    methodology: "",
    status: "active",
    is_popular: false,
    display_order: "0",
    search_keywords: "",
  })

  const categories = [
    "Hematology",
    "Clinical Chemistry",
    "Endocrinology",
    "Immunology",
    "Microbiology",
    "Pathology",
    "Radiology",
    "Cardiology",
    "Oncology",
    "Genetics",
  ]

  useEffect(() => {
    fetchTests()
  }, [])

  useEffect(() => {
    filterTests()
  }, [tests, searchQuery, categoryFilter, statusFilter])

  const fetchTests = async () => {
    try {
      const response = await fetch("/api/admin/tests")
      if (response.ok) {
        const data = await response.json()
        setTests(data)
      }
    } catch (error) {
      console.error("Error fetching tests:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterTests = () => {
    let filtered = [...tests]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (test) =>
          test.name.toLowerCase().includes(query) ||
          test.category.toLowerCase().includes(query) ||
          test.search_keywords.some((keyword) => keyword.toLowerCase().includes(query)),
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((test) => test.category === categoryFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((test) => test.status === statusFilter)
    }

    setFilteredTests(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const testData = {
      ...formData,
      base_price: Number.parseFloat(formData.base_price),
      reporting_time_hours: Number.parseInt(formData.reporting_time_hours),
      display_order: Number.parseInt(formData.display_order),
      search_keywords: formData.search_keywords
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
    }

    try {
      const url = editingTest ? `/api/admin/tests/${editingTest.id}` : "/api/admin/tests"
      const method = editingTest ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testData),
      })

      if (response.ok) {
        await fetchTests()
        resetForm()
        setIsDialogOpen(false)
      }
    } catch (error) {
      console.error("Error saving test:", error)
    }
  }

  const handleEdit = (test: LabTest) => {
    setEditingTest(test)
    setFormData({
      name: test.name,
      category: test.category,
      subcategory: test.subcategory || "",
      description: test.description || "",
      sample_type: test.sample_type || "",
      sample_volume: test.sample_volume || "",
      container_type: test.container_type || "",
      base_price: test.base_price.toString(),
      currency: test.currency,
      reporting_time_hours: test.reporting_time_hours.toString(),
      fasting_required: test.fasting_required,
      preparation_instructions: test.preparation_instructions || "",
      clinical_significance: test.clinical_significance || "",
      methodology: test.methodology || "",
      status: test.status,
      is_popular: test.is_popular,
      display_order: test.display_order.toString(),
      search_keywords: test.search_keywords.join(", "),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this test?")) {
      try {
        const response = await fetch(`/api/admin/tests/${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          await fetchTests()
        }
      } catch (error) {
        console.error("Error deleting test:", error)
      }
    }
  }

  const resetForm = () => {
    setEditingTest(null)
    setFormData({
      name: "",
      category: "",
      subcategory: "",
      description: "",
      sample_type: "",
      sample_volume: "",
      container_type: "",
      base_price: "",
      currency: "USD",
      reporting_time_hours: "24",
      fasting_required: false,
      preparation_instructions: "",
      clinical_significance: "",
      methodology: "",
      status: "active",
      is_popular: false,
      display_order: "0",
      search_keywords: "",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success text-white"
      case "inactive":
        return "bg-gray-500 text-white"
      case "discontinued":
        return "bg-error text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />
      case "inactive":
        return <XCircle className="w-4 h-4" />
      case "discontinued":
        return <XCircle className="w-4 h-4" />
      default:
        return <XCircle className="w-4 h-4" />
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
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">NVHealth Labs Admin</span>
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/admin/dashboard" className="text-gray-700 hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link href="/admin/centers" className="text-gray-700 hover:text-primary transition-colors">
                Centers
              </Link>
              <Link href="/admin/tests" className="text-primary font-medium">
                Tests
              </Link>
              <Link href="/admin/bookings" className="text-gray-700 hover:text-primary transition-colors">
                Bookings
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
                <span className="text-sm font-medium">Admin</span>
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Lab Tests</h1>
            <p className="text-primary-600">Manage diagnostic tests, pricing, and information</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Test
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingTest ? "Edit Test" : "Add New Test"}</DialogTitle>
                <DialogDescription className="text-primary-600">
                  {editingTest ? "Update test information" : "Add a new diagnostic test to the platform"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Test Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Input
                      id="subcategory"
                      value={formData.subcategory}
                      onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="methodology">Methodology</Label>
                    <Input
                      id="methodology"
                      value={formData.methodology}
                      onChange={(e) => setFormData({ ...formData, methodology: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the test"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sample_type">Sample Type</Label>
                    <Select
                      value={formData.sample_type}
                      onValueChange={(value) => setFormData({ ...formData, sample_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select sample type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blood">Blood</SelectItem>
                        <SelectItem value="urine">Urine</SelectItem>
                        <SelectItem value="stool">Stool</SelectItem>
                        <SelectItem value="saliva">Saliva</SelectItem>
                        <SelectItem value="tissue">Tissue</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sample_volume">Sample Volume</Label>
                    <Input
                      id="sample_volume"
                      value={formData.sample_volume}
                      onChange={(e) => setFormData({ ...formData, sample_volume: e.target.value })}
                      placeholder="e.g., 5 mL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="container_type">Container Type</Label>
                    <Input
                      id="container_type"
                      value={formData.container_type}
                      onChange={(e) => setFormData({ ...formData, container_type: e.target.value })}
                      placeholder="e.g., EDTA Tube"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="base_price">Base Price *</Label>
                    <Input
                      id="base_price"
                      type="number"
                      step="0.01"
                      value={formData.base_price}
                      onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={formData.currency}
                      onValueChange={(value) => setFormData({ ...formData, currency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="INR">INR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reporting_time_hours">Reporting Time (Hours)</Label>
                    <Input
                      id="reporting_time_hours"
                      type="number"
                      value={formData.reporting_time_hours}
                      onChange={(e) => setFormData({ ...formData, reporting_time_hours: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preparation_instructions">Preparation Instructions</Label>
                  <Textarea
                    id="preparation_instructions"
                    value={formData.preparation_instructions}
                    onChange={(e) => setFormData({ ...formData, preparation_instructions: e.target.value })}
                    placeholder="Instructions for patient preparation"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clinical_significance">Clinical Significance</Label>
                  <Textarea
                    id="clinical_significance"
                    value={formData.clinical_significance}
                    onChange={(e) => setFormData({ ...formData, clinical_significance: e.target.value })}
                    placeholder="Clinical significance and interpretation"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="search_keywords">Search Keywords (comma-separated)</Label>
                  <Textarea
                    id="search_keywords"
                    value={formData.search_keywords}
                    onChange={(e) => setFormData({ ...formData, search_keywords: e.target.value })}
                    placeholder="Keywords for search optimization"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="discontinued">Discontinued</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.fasting_required}
                      onChange={(e) => setFormData({ ...formData, fasting_required: e.target.checked })}
                    />
                    <span className="text-sm">Fasting Required</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.is_popular}
                      onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                    />
                    <span className="text-sm">Popular Test</span>
                  </label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingTest ? "Update Test" : "Add Test"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by name, category, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="discontinued">Discontinued</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Tests ({filteredTests.length})</CardTitle>
            <CardDescription className="text-primary-600">
              Manage diagnostic tests and their information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Sample</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Reporting Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {test.name}
                            {test.is_popular && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                          </div>
                          <div className="text-sm text-primary-600">{test.subcategory}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{test.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <TestTube className="w-4 h-4 text-gray-400" />
                          <div className="text-sm">
                            <div>{test.sample_type}</div>
                            <div className="text-gray-600">{test.sample_volume}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{test.base_price.toFixed(2)}</span>
                          <span className="text-sm text-gray-600">{test.currency}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{test.reporting_time_hours}h</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(test.status)}>
                          {getStatusIcon(test.status)}
                          <span className="ml-1 capitalize">{test.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(test)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(test.id)}>
                            <Trash2 className="w-4 h-4" />
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
      </div>
    </div>
  )
}
