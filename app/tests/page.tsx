"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Heart, Activity, Droplet, Shield, Zap, Clock, Star, ShoppingCart } from "lucide-react"
import { Logo } from "@/components/logo"

interface Test {
  id: string
  name: string
  description: string
  category: string
  preparation_instructions: string
  sample_type: string
  reporting_time: string
  is_popular: boolean
  min_price: number
  max_price: number
}

const categoryIcons = {
  "Blood Tests": Droplet,
  "Heart Health": Heart,
  Diabetes: Activity,
  "Liver Function": Shield,
  "Kidney Function": Droplet,
  Thyroid: Zap,
}

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([])
  const [filteredTests, setFilteredTests] = useState<Test[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showPopularOnly, setShowPopularOnly] = useState(false)
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<string[]>([])

  useEffect(() => {
    fetchTests()
  }, [])

  useEffect(() => {
    filterTests()
  }, [tests, searchQuery, selectedCategory, showPopularOnly])

  const fetchTests = async () => {
    try {
      const response = await fetch("/api/tests")
      const data = await response.json()
      if (data.success) {
        setTests(data.tests)
        setFilteredTests(data.tests)
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
          test.description.toLowerCase().includes(query) ||
          test.category.toLowerCase().includes(query),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((test) => test.category.toLowerCase() === selectedCategory.toLowerCase())
    }

    if (showPopularOnly) {
      filtered = filtered.filter((test) => test.is_popular)
    }

    setFilteredTests(filtered)
  }

  const addToCart = (testId: string) => {
    if (!cart.includes(testId)) {
      setCart([...cart, testId])
    }
  }

  const removeFromCart = (testId: string) => {
    setCart(cart.filter((id) => id !== testId))
  }

  const categories = ["all", "Blood Tests", "Heart Health", "Diabetes", "Liver Function", "Kidney Function", "Thyroid"]

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo iconSize={48} textClassName="text-2xl" />
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/tests" className="text-primary-700 font-semibold">
                Tests
              </Link>
              <Link href="/packages" className="text-primary-600 hover:text-primary-700 font-medium">
                Packages
              </Link>
              <Link href="/centers" className="text-primary-600 hover:text-primary-700 font-medium">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Diagnostic Tests</h1>
          <p className="text-gray-600">Browse our comprehensive collection of lab tests and health packages</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for tests, conditions, or symptoms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant={showPopularOnly ? "default" : "outline"}
                onClick={() => setShowPopularOnly(!showPopularOnly)}
                className="flex items-center gap-2"
              >
                <Star className="w-4 h-4" />
                Popular Only
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredTests.length} test{filteredTests.length !== 1 ? "s" : ""}
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory !== "all" && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Tests Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
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
        ) : filteredTests.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No tests found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria or browse all tests</p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setShowPopularOnly(false)
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test) => {
              const IconComponent = categoryIcons[test.category as keyof typeof categoryIcons] || Activity
              const isInCart = cart.includes(test.id)

              return (
                <Card key={test.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg leading-tight">{test.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {test.category}
                            </Badge>
                            {test.is_popular && <Badge className="bg-accent text-white text-xs">Popular</Badge>}
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="mt-2">{test.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Sample:</span>
                          <p className="font-medium">{test.sample_type}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Reporting:</span>
                          <p className="font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {test.reporting_time}
                          </p>
                        </div>
                      </div>

                      {test.preparation_instructions && (
                        <div className="text-sm">
                          <span className="text-gray-500">Preparation:</span>
                          <p className="text-gray-700">{test.preparation_instructions}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="text-lg font-semibold text-primary">
                          ${test.min_price}
                          {test.max_price !== test.min_price && ` - $${test.max_price}`}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={isInCart ? "secondary" : "outline"}
                            onClick={() => (isInCart ? removeFromCart(test.id) : addToCart(test.id))}
                          >
                            {isInCart ? "Remove" : "Add to Cart"}
                          </Button>
                          <Link href={`/booking?test=${test.id}`}>
                            <Button size="sm">Book Now</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="fixed bottom-6 right-6">
            <Card className="shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  <span className="font-medium">
                    {cart.length} test{cart.length !== 1 ? "s" : ""} selected
                  </span>
                  <Link href="/booking">
                    <Button size="sm">Proceed to Book</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
