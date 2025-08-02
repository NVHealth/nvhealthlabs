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
  MapPin,
  Phone,
  Mail,
  Heart,
  Bell,
  LogOut,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"

interface DiagnosticCenter {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip_code: string
  country: string
  operating_hours: any
  services_offered: string[]
  certifications: string[]
  integration_type: string
  api_endpoint?: string
  webhook_url?: string
  home_collection_available: boolean
  online_reports: boolean
  emergency_services: boolean
  status: string
  contact_person_name: string
  contact_person_phone: string
  contact_person_email: string
  license_number: string
  established_year: number
  created_at: string
  updated_at: string
}

export default function AdminCentersPage() {
  const [centers, setCenters] = useState<DiagnosticCenter[]>([])
  const [filteredCenters, setFilteredCenters] = useState<DiagnosticCenter[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCenter, setEditingCenter] = useState<DiagnosticCenter | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    country: "United States",
    services_offered: "",
    certifications: "",
    integration_type: "manual",
    api_endpoint: "",
    webhook_url: "",
    home_collection_available: false,
    online_reports: true,
    emergency_services: false,
    status: "active",
    contact_person_name: "",
    contact_person_phone: "",
    contact_person_email: "",
    license_number: "",
    established_year: new Date().getFullYear(),
  })

  useEffect(() => {
    fetchCenters()
  }, [])

  useEffect(() => {
    filterCenters()
  }, [centers, searchQuery, statusFilter])

  const fetchCenters = async () => {
    try {
      const response = await fetch("/api/admin/centers")
      if (response.ok) {
        const data = await response.json()
        setCenters(data)
      }
    } catch (error) {
      console.error("Error fetching centers:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterCenters = () => {
    let filtered = [...centers]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (center) =>
          center.name.toLowerCase().includes(query) ||
          center.city.toLowerCase().includes(query) ||
          center.email.toLowerCase().includes(query),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((center) => center.status === statusFilter)
    }

    setFilteredCenters(filtered)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const centerData = {
      ...formData,
      services_offered: formData.services_offered
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
      certifications: formData.certifications
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
    }

    try {
      const url = editingCenter ? `/api/admin/centers/${editingCenter.id}` : "/api/admin/centers"
      const method = editingCenter ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(centerData),
      })

      if (response.ok) {
        await fetchCenters()
        resetForm()
        setIsDialogOpen(false)
      }
    } catch (error) {
      console.error("Error saving center:", error)
    }
  }

  const handleEdit = (center: DiagnosticCenter) => {
    setEditingCenter(center)
    setFormData({
      name: center.name,
      email: center.email,
      phone: center.phone,
      address: center.address,
      city: center.city,
      state: center.state,
      zip_code: center.zip_code,
      country: center.country,
      services_offered: center.services_offered.join(", "),
      certifications: center.certifications.join(", "),
      integration_type: center.integration_type,
      api_endpoint: center.api_endpoint || "",
      webhook_url: center.webhook_url || "",
      home_collection_available: center.home_collection_available,
      online_reports: center.online_reports,
      emergency_services: center.emergency_services,
      status: center.status,
      contact_person_name: center.contact_person_name,
      contact_person_phone: center.contact_person_phone,
      contact_person_email: center.contact_person_email,
      license_number: center.license_number,
      established_year: center.established_year,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this center?")) {
      try {
        const response = await fetch(`/api/admin/centers/${id}`, {
          method: "DELETE",
        })
        if (response.ok) {
          await fetchCenters()
        }
      } catch (error) {
        console.error("Error deleting center:", error)
      }
    }
  }

  const resetForm = () => {
    setEditingCenter(null)
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      country: "United States",
      services_offered: "",
      certifications: "",
      integration_type: "manual",
      api_endpoint: "",
      webhook_url: "",
      home_collection_available: false,
      online_reports: true,
      emergency_services: false,
      status: "active",
      contact_person_name: "",
      contact_person_phone: "",
      contact_person_email: "",
      license_number: "",
      established_year: new Date().getFullYear(),
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success text-white"
      case "inactive":
        return "bg-gray-500 text-white"
      case "suspended":
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
      case "suspended":
        return <AlertCircle className="w-4 h-4" />
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
              <Link href="/admin/centers" className="text-primary font-medium">
                Centers
              </Link>
              <Link href="/admin/tests" className="text-gray-700 hover:text-primary transition-colors">
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Diagnostic Centers</h1>
            <p className="text-primary-600">Manage diagnostic centers and their integration settings</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Center
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingCenter ? "Edit Center" : "Add New Center"}</DialogTitle>
                <DialogDescription className="text-primary-600">
                  {editingCenter ? "Update center information" : "Add a new diagnostic center to the platform"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Center Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="license_number">License Number</Label>
                    <Input
                      id="license_number"
                      value={formData.license_number}
                      onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip_code">ZIP Code *</Label>
                    <Input
                      id="zip_code"
                      value={formData.zip_code}
                      onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="integration_type">Integration Type</Label>
                    <Select
                      value={formData.integration_type}
                      onValueChange={(value) => setFormData({ ...formData, integration_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="api">API Integration</SelectItem>
                        <SelectItem value="webhook">Webhook</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.integration_type === "api" && (
                  <div className="space-y-2">
                    <Label htmlFor="api_endpoint">API Endpoint</Label>
                    <Input
                      id="api_endpoint"
                      value={formData.api_endpoint}
                      onChange={(e) => setFormData({ ...formData, api_endpoint: e.target.value })}
                      placeholder="https://api.center.com/v1"
                    />
                  </div>
                )}

                {formData.integration_type === "webhook" && (
                  <div className="space-y-2">
                    <Label htmlFor="webhook_url">Webhook URL</Label>
                    <Input
                      id="webhook_url"
                      value={formData.webhook_url}
                      onChange={(e) => setFormData({ ...formData, webhook_url: e.target.value })}
                      placeholder="https://center.com/webhook"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="services_offered">Services Offered (comma-separated)</Label>
                  <Textarea
                    id="services_offered"
                    value={formData.services_offered}
                    onChange={(e) => setFormData({ ...formData, services_offered: e.target.value })}
                    placeholder="Blood Tests, Urine Tests, Radiology, Pathology"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certifications">Certifications (comma-separated)</Label>
                  <Textarea
                    id="certifications"
                    value={formData.certifications}
                    onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                    placeholder="NABL Accredited, ISO 15189, CAP Certified"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_person_name">Contact Person</Label>
                    <Input
                      id="contact_person_name"
                      value={formData.contact_person_name}
                      onChange={(e) => setFormData({ ...formData, contact_person_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_person_phone">Contact Phone</Label>
                    <Input
                      id="contact_person_phone"
                      value={formData.contact_person_phone}
                      onChange={(e) => setFormData({ ...formData, contact_person_phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_person_email">Contact Email</Label>
                    <Input
                      id="contact_person_email"
                      type="email"
                      value={formData.contact_person_email}
                      onChange={(e) => setFormData({ ...formData, contact_person_email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.home_collection_available}
                      onChange={(e) => setFormData({ ...formData, home_collection_available: e.target.checked })}
                    />
                    <span className="text-sm">Home Collection Available</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.online_reports}
                      onChange={(e) => setFormData({ ...formData, online_reports: e.target.checked })}
                    />
                    <span className="text-sm">Online Reports</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.emergency_services}
                      onChange={(e) => setFormData({ ...formData, emergency_services: e.target.checked })}
                    />
                    <span className="text-sm">Emergency Services</span>
                  </label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingCenter ? "Update Center" : "Add Center"}</Button>
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
                  placeholder="Search by name, city, or email..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Centers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Centers ({filteredCenters.length})</CardTitle>
            <CardDescription className="text-primary-600">Manage diagnostic centers and their settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Center</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Integration</TableHead>
                    <TableHead>Services</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCenters.map((center) => (
                    <TableRow key={center.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{center.name}</div>
                          <div className="text-sm text-gray-600">{center.license_number}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div className="text-sm">
                            <div>
                              {center.city}, {center.state}
                            </div>
                            <div className="text-primary-600">{center.zip_code}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span>{center.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span>{center.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {center.integration_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {center.home_collection_available && (
                            <Badge variant="outline" className="text-xs">
                              Home Collection
                            </Badge>
                          )}
                          {center.online_reports && (
                            <Badge variant="outline" className="text-xs">
                              Online Reports
                            </Badge>
                          )}
                          {center.emergency_services && (
                            <Badge variant="outline" className="text-xs">
                              Emergency
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(center)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(center.id)}>
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
