"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Phone, Clock, Star, CheckCircle, Award, Users, Calendar } from "lucide-react"
import { Logo } from "@/components/logo"

interface Center {
  id: string
  name: string
  description: string
  address: string
  city: string
  state: string
  phone: string
  email: string
  rating: number
  total_reviews: number
  operating_hours: Record<string, string>
  certifications: string[]
  home_collection: boolean
}

export default function CentersPage() {
  const [centers, setCenters] = useState<Center[]>([])
  const [filteredCenters, setFilteredCenters] = useState<Center[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [homeCollectionOnly, setHomeCollectionOnly] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCenters()
  }, [])

  useEffect(() => {
    filterCenters()
  }, [centers, searchQuery, homeCollectionOnly])

  const fetchCenters = async () => {
    try {
      const response = await fetch("/api/centers")
      const data = await response.json()
      if (data.success) {
        setCenters(data.centers)
        setFilteredCenters(data.centers)
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
          center.description.toLowerCase().includes(query),
      )
    }

    if (homeCollectionOnly) {
      filtered = filtered.filter((center) => center.home_collection)
    }

    setFilteredCenters(filtered)
  }

  const formatOperatingHours = (hours: Record<string, string>) => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
    const todayHours = hours[today]
    return todayHours === "closed" ? "Closed today" : `Open today: ${todayHours}`
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo iconSize={48} textClassName="text-2xl" />
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/tests" className="text-primary-600 hover:text-primary-700 font-medium">
                Tests
              </Link>
              <Link href="/packages" className="text-primary-600 hover:text-primary-700 font-medium">
                Packages
              </Link>
              <Link href="/centers" className="text-primary-700 font-semibold">
                Centers
              </Link>
              <Link href="/about" className="text-primary-600 hover:text-primary-700 font-medium">
                About
              </Link>
              <Link href="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
                Contact
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  className="border-primary-600 text-primary-600 hover:bg-primary-50 bg-transparent"
                >
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-primary-600 hover:bg-primary-700 text-white">Register</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Diagnostic Centers</h1>
          <p className="text-gray-600">Find trusted diagnostic centers near you with certified professionals</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by center name, city, or services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant={homeCollectionOnly ? "default" : "outline"}
                onClick={() => setHomeCollectionOnly(!homeCollectionOnly)}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Home Collection Only
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredCenters.length} diagnostic center{filteredCenters.length !== 1 ? "s" : ""}
            {searchQuery && ` for "${searchQuery}"`}
            {homeCollectionOnly && " with home collection"}
          </p>
        </div>

        {/* Centers Grid */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCenters.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No centers found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setHomeCollectionOnly(false)
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCenters.map((center) => (
              <Card key={center.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{center.name}</CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{center.rating}</span>
                          <span className="text-gray-600">({center.total_reviews} reviews)</span>
                        </div>
                      </div>
                      <CardDescription>{center.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Contact Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {center.address}, {center.city}, {center.state}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        {center.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {formatOperatingHours(center.operating_hours)}
                      </div>
                    </div>

                    {/* Certifications */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Certifications:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {center.certifications.map((cert, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2">
                      {center.home_collection && (
                        <Badge className="bg-success text-white text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Home Collection
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        <Users className="w-3 h-3 mr-1" />
                        {center.total_reviews}+ Reviews
                      </Badge>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t">
                      <Link href={`/centers/${center.id}`} className="flex-1">
                        <Button variant="outline" className="w-full bg-transparent">
                          View Details
                        </Button>
                      </Link>
                      <Link href={`/booking?center=${center.id}`} className="flex-1">
                        <Button className="w-full">
                          <Calendar className="w-4 h-4 mr-2" />
                          Book Tests
                        </Button>
                      </Link>
                    </div>
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
