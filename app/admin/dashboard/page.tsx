"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/logo"
import {
  UserIcon,
  Building2,
  TestTube,
  DollarSign,
  Calendar,
  Bell,
  LogOut,
  BarChart3,
  Settings,
  Shield,
} from "lucide-react"

interface DashboardStats {
  totalUsers: number
  totalCenters: number
  totalTests: number
  monthlyRevenue: number
  recentBookings: number
  activeUsers: number
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalCenters: 0,
    totalTests: 0,
    monthlyRevenue: 0,
    recentBookings: 0,
    activeUsers: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Mock dashboard stats
    const mockStats: DashboardStats = {
      totalUsers: 1247,
      totalCenters: 23,
      totalTests: 156,
      monthlyRevenue: 45231.89,
      recentBookings: 89,
      activeUsers: 342,
    }

    setStats(mockStats)
    setLoading(false)
  }, [])

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
              <Logo iconSize={48} textClassName="text-2xl" />
              <Badge variant="secondary" className="ml-4">
                Admin Panel
              </Badge>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/admin/dashboard" className="text-accent font-medium">
                Dashboard
              </Link>
              <Link href="/admin/users" className="text-primary-700 hover:text-accent transition-colors">
                Users
              </Link>
              <Link href="/admin/centers" className="text-primary-700 hover:text-accent transition-colors">
                Centers
              </Link>
              <Link href="/admin/tests" className="text-primary-700 hover:text-accent transition-colors">
                Tests
              </Link>
              <Link href="/admin/bookings" className="text-primary-700 hover:text-accent transition-colors">
                Bookings
              </Link>
              <Link href="/admin/analytics" className="text-primary-700 hover:text-accent transition-colors">
                Analytics
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-accent" />
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-800 mb-2">Platform Dashboard</h1>
          <p className="text-primary-600">Monitor and manage the NVHealth Labs platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-secondary-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary-800">Total Users</CardTitle>
              <UserIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-800">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-primary-600">
                <span className="text-success">+12%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-secondary-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary-800">Diagnostic Centers</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-800">{stats.totalCenters}</div>
              <p className="text-xs text-primary-600">
                <span className="text-success">+2</span> new this month
              </p>
            </CardContent>
          </Card>

          <Card className="border-secondary-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary-800">Available Tests</CardTitle>
              <TestTube className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-800">{stats.totalTests}</div>
              <p className="text-xs text-primary-600">
                <span className="text-success">+8</span> added this month
              </p>
            </CardContent>
          </Card>

          <Card className="border-secondary-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-primary-800">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-800">${stats.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-primary-600">
                <span className="text-success">+18%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-secondary-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary-800">
                <UserIcon className="w-5 h-5 text-accent" />
                User Management
              </CardTitle>
              <CardDescription className="text-primary-600">
                Manage customer accounts and access controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-primary-700">Active Users</span>
                  <span className="font-medium text-primary-800">{stats.activeUsers}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-primary-700">New This Week</span>
                  <span className="font-medium text-primary-800">23</span>
                </div>
              </div>
              <Link href="/admin/users">
                <Button className="w-full bg-accent hover:bg-accent-600">Manage Users</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-secondary-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary-800">
                <Building2 className="w-5 h-5 text-accent" />
                Center Management
              </CardTitle>
              <CardDescription className="text-primary-600">
                Oversee diagnostic centers and their services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-primary-700">Active Centers</span>
                  <span className="font-medium text-primary-800">{stats.totalCenters}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-primary-700">Pending Approval</span>
                  <span className="font-medium text-primary-800">3</span>
                </div>
              </div>
              <Link href="/admin/centers">
                <Button className="w-full bg-accent hover:bg-accent-600">Manage Centers</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-secondary-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary-800">
                <TestTube className="w-5 h-5 text-accent" />
                Test Management
              </CardTitle>
              <CardDescription className="text-primary-600">Add, edit, and organize diagnostic tests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-primary-700">Total Tests</span>
                  <span className="font-medium text-primary-800">{stats.totalTests}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-primary-700">Popular Tests</span>
                  <span className="font-medium text-primary-800">12</span>
                </div>
              </div>
              <Link href="/admin/tests">
                <Button className="w-full bg-accent hover:bg-accent-600">Manage Tests</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-secondary-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary-800">
                <Calendar className="w-5 h-5 text-accent" />
                Booking Management
              </CardTitle>
              <CardDescription className="text-primary-600">Monitor and manage all test bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-primary-700">Recent Bookings</span>
                  <span className="font-medium text-primary-800">{stats.recentBookings}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-primary-700">Today's Appointments</span>
                  <span className="font-medium text-primary-800">15</span>
                </div>
              </div>
              <Link href="/admin/bookings">
                <Button className="w-full bg-accent hover:bg-accent-600">View Bookings</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-secondary-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary-800">
                <BarChart3 className="w-5 h-5 text-accent" />
                Analytics & Reports
              </CardTitle>
              <CardDescription className="text-primary-600">
                View detailed analytics and generate reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-primary-700">Revenue Growth</span>
                  <span className="font-medium text-success">+18%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-primary-700">User Growth</span>
                  <span className="font-medium text-success">+12%</span>
                </div>
              </div>
              <Link href="/admin/analytics">
                <Button className="w-full bg-accent hover:bg-accent-600">View Analytics</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer border-secondary-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary-800">
                <Settings className="w-5 h-5 text-accent" />
                System Settings
              </CardTitle>
              <CardDescription className="text-primary-600">
                Configure platform settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-primary-700">System Status</span>
                  <Badge variant="secondary" className="bg-success text-white">
                    Online
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-primary-700">Last Backup</span>
                  <span className="font-medium text-primary-800">2 hours ago</span>
                </div>
              </div>
              <Link href="/admin/settings">
                <Button className="w-full bg-accent hover:bg-accent-600">System Settings</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-secondary-200">
            <CardHeader>
              <CardTitle className="text-primary-800">Recent Activity</CardTitle>
              <CardDescription className="text-primary-600">Latest platform activities and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-primary-800">New diagnostic center approved</p>
                    <p className="text-xs text-primary-600">MediCore Labs - 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-primary-800">23 new user registrations</p>
                    <p className="text-xs text-primary-600">Today</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-primary-800">System maintenance completed</p>
                    <p className="text-xs text-primary-600">Yesterday</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-primary-800">New test categories added</p>
                    <p className="text-xs text-primary-600">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-secondary-200">
            <CardHeader>
              <CardTitle className="text-primary-800">System Health</CardTitle>
              <CardDescription className="text-primary-600">Platform performance and system status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary-700">Server Status</span>
                  <Badge className="bg-success text-white">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary-700">Database</span>
                  <Badge className="bg-success text-white">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary-700">Payment Gateway</span>
                  <Badge className="bg-success text-white">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary-700">Email Service</span>
                  <Badge className="bg-success text-white">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary-700">SMS Service</span>
                  <Badge className="bg-success text-white">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary-700">Storage</span>
                  <Badge variant="secondary">78% Used</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
