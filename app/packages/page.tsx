"use client"

import { useState } from "react"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Shield, Activity, Users, CheckCircle, Star, Clock, DollarSign } from "lucide-react"

interface HealthPackage {
  id: string
  name: string
  description: string
  category: string
  tests_included: string[]
  original_price: number
  discounted_price: number
  discount_percentage: number
  suitable_for: string[]
  popular: boolean
  recommended_frequency: string
}

const mockPackages: HealthPackage[] = [
  {
    id: "pkg-1",
    name: "Complete Health Checkup",
    description: "Comprehensive health screening covering all major body systems",
    category: "General Health",
    tests_included: [
      "Complete Blood Count",
      "Lipid Profile",
      "Liver Function Test",
      "Kidney Function Test",
      "Thyroid Profile",
      "Diabetes Panel",
      "Vitamin D",
      "Vitamin B12",
    ],
    original_price: 320,
    discounted_price: 199,
    discount_percentage: 38,
    suitable_for: ["Adults 25+", "Annual checkup", "Preventive care"],
    popular: true,
    recommended_frequency: "Annually",
  },
  {
    id: "pkg-2",
    name: "Heart Health Package",
    description: "Specialized tests to assess cardiovascular health and risk factors",
    category: "Cardiology",
    tests_included: [
      "Lipid Profile",
      "Cardiac Risk Markers",
      "ECG",
      "Blood Pressure Monitoring",
      "Homocysteine",
      "CRP",
    ],
    original_price: 180,
    discounted_price: 129,
    discount_percentage: 28,
    suitable_for: ["Adults 35+", "Family history of heart disease", "High cholesterol"],
    popular: true,
    recommended_frequency: "Every 6 months",
  },
  {
    id: "pkg-3",
    name: "Diabetes Management",
    description: "Essential tests for diabetes monitoring and management",
    category: "Endocrinology",
    tests_included: [
      "HbA1c",
      "Fasting Blood Sugar",
      "Post-meal Blood Sugar",
      "Insulin Levels",
      "Kidney Function Test",
      "Lipid Profile",
    ],
    original_price: 150,
    discounted_price: 99,
    discount_percentage: 34,
    suitable_for: ["Diabetic patients", "Pre-diabetic", "Family history"],
    popular: false,
    recommended_frequency: "Every 3 months",
  },
  {
    id: "pkg-4",
    name: "Women's Health Package",
    description: "Comprehensive health screening designed specifically for women",
    category: "Women's Health",
    tests_included: [
      "Complete Blood Count",
      "Thyroid Profile",
      "Iron Studies",
      "Vitamin D",
      "Calcium",
      "Hormonal Panel",
      "Pap Smear",
      "Mammography",
    ],
    original_price: 280,
    discounted_price: 189,
    discount_percentage: 33,
    suitable_for: ["Women 21+", "Annual screening", "Reproductive health"],
    popular: true,
    recommended_frequency: "Annually",
  },
  {
    id: "pkg-5",
    name: "Senior Citizen Package",
    description: "Tailored health screening for adults over 60",
    category: "Geriatrics",
    tests_included: [
      "Complete Blood Count",
      "Comprehensive Metabolic Panel",
      "Lipid Profile",
      "Thyroid Function",
      "Vitamin B12",
      "Vitamin D",
      "Bone Density",
      "Prostate Specific Antigen (Men)",
    ],
    original_price: 250,
    discounted_price: 169,
    discount_percentage: 32,
    suitable_for: ["Adults 60+", "Age-related health monitoring"],
    popular: false,
    recommended_frequency: "Every 6 months",
  },
  {
    id: "pkg-6",
    name: "Executive Health Package",
    description: "Premium health screening for busy professionals",
    category: "Executive",
    tests_included: [
      "Complete Health Checkup",
      "Stress Markers",
      "Advanced Cardiac Panel",
      "Tumor Markers",
      "Full Body Imaging",
      "Consultation with Specialist",
    ],
    original_price: 500,
    discounted_price: 349,
    discount_percentage: 30,
    suitable_for: ["Working professionals", "High-stress jobs", "Comprehensive screening"],
    popular: true,
    recommended_frequency: "Annually",
  },
]

const categoryIcons = {
  "General Health": Activity,
  Cardiology: Heart,
  Endocrinology: Activity,
  "Women's Health": Users,
  Geriatrics: Shield,
  Executive: Star,
}

export default function PackagesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showPopularOnly, setShowPopularOnly] = useState(false)

  const categories = [
    "all",
    "General Health",
    "Cardiology",
    "Endocrinology",
    "Women's Health",
    "Geriatrics",
    "Executive",
  ]

  const filteredPackages = mockPackages.filter((pkg) => {
    if (selectedCategory !== "all" && pkg.category !== selectedCategory) return false
    if (showPopularOnly && !pkg.popular) return false
    return true
  })

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
              <Link href="/packages" className="text-primary-700 font-semibold">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Packages</h1>
          <p className="text-gray-600">Comprehensive health screening packages at discounted prices</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === "all" ? "All Categories" : category}
                  </Button>
                ))}
              </div>
              <Button
                variant={showPopularOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowPopularOnly(!showPopularOnly)}
                className="flex items-center gap-2"
              >
                <Star className="w-4 h-4" />
                Popular Only
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPackages.map((pkg) => {
            const IconComponent = categoryIcons[pkg.category as keyof typeof categoryIcons] || Activity

            return (
              <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{pkg.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {pkg.category}
                          </Badge>
                          {pkg.popular && (
                            <Badge className="bg-accent text-white text-xs">
                              <Star className="w-3 h-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">${pkg.discounted_price}</div>
                      <div className="text-sm text-gray-500 line-through">${pkg.original_price}</div>
                      <Badge className="bg-success text-white text-xs">{pkg.discount_percentage}% OFF</Badge>
                    </div>
                  </div>
                  <CardDescription className="mt-2">{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Tests Included */}
                    <div>
                      <h4 className="font-medium mb-2">Tests Included ({pkg.tests_included.length}):</h4>
                      <div className="grid grid-cols-1 gap-1">
                        {pkg.tests_included.slice(0, 4).map((test, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-3 h-3 text-success" />
                            {test}
                          </div>
                        ))}
                        {pkg.tests_included.length > 4 && (
                          <div className="text-sm text-gray-600 mt-1">+{pkg.tests_included.length - 4} more tests</div>
                        )}
                      </div>
                    </div>

                    {/* Suitable For */}
                    <div>
                      <h4 className="font-medium mb-2">Suitable For:</h4>
                      <div className="flex flex-wrap gap-1">
                        {pkg.suitable_for.map((item, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Frequency */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Recommended: {pkg.recommended_frequency}</span>
                    </div>

                    {/* Savings */}
                    <div className="flex items-center gap-2 text-sm text-success">
                      <DollarSign className="w-4 h-4" />
                      <span>You save ${pkg.original_price - pkg.discounted_price}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t">
                      <Button variant="outline" className="flex-1 bg-transparent">
                        View Details
                      </Button>
                      <Link href={`/booking?package=${pkg.id}`} className="flex-1">
                        <Button className="w-full">Book Package</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredPackages.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No packages found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters</p>
              <Button
                onClick={() => {
                  setSelectedCategory("all")
                  setShowPopularOnly(false)
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
