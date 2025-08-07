"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/logo"
import { LogoutButton } from "@/components/logout-button"
import { useAuth } from "@/components/auth-provider"
import { Microscope, Shield, Clock, Phone, Mail, Users, Heart, Activity, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo iconSize={50} textClassName="text-xl sm:text-2xl" />

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              <Link href="/tests" className="text-primary-600 hover:text-primary-700 font-medium">
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
            

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Desktop Auth Buttons */}
              <div className="hidden sm:flex items-center space-x-2 sm:space-x-4">
                {isAuthenticated ? (
                  <>
                    <span className="text-sm text-primary-600 font-medium">
                      Welcome, {user?.firstName}!
                    </span>
                    <LogoutButton variant="outline" size="sm" />
                  </>
                ) : (
                  <>
                    <Link href="/auth/login">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-primary-600 text-primary-600 hover:bg-primary-50 bg-transparent text-xs sm:text-sm"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm">
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-primary-600 hover:text-primary-700 transition-colors duration-200"
                aria-label="Toggle mobile menu"
              >
                <div className="relative w-6 h-6">
                  <Menu 
                    className={`w-6 h-6 absolute transition-all duration-300 ${
                      mobileMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
                    }`} 
                  />
                  <X 
                    className={`w-6 h-6 absolute transition-all duration-300 ${
                      mobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
                    }`} 
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen 
              ? 'max-h-screen opacity-100' 
              : 'max-h-0 opacity-0'
          }`}>
            <div className="mt-4 pb-6 border-t border-gray-200 pt-4">
              <nav className="flex flex-col space-y-4">
                <Link
                  href="/tests"
                  className="text-primary-600 hover:text-primary-700 font-medium py-2 transform transition-all duration-200 hover:translate-x-1 hover:bg-primary-50 px-3 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tests
                </Link>
                <Link
                  href="/packages"
                  className="text-primary-600 hover:text-primary-700 font-medium py-2 transform transition-all duration-200 hover:translate-x-1 hover:bg-primary-50 px-3 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Packages
                </Link>
                <Link
                  href="/centers"
                  className="text-primary-600 hover:text-primary-700 font-medium py-2 transform transition-all duration-200 hover:translate-x-1 hover:bg-primary-50 px-3 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Centers
                </Link>
                <Link
                  href="/about"
                  className="text-primary-600 hover:text-primary-700 font-medium py-2 transform transition-all duration-200 hover:translate-x-1 hover:bg-primary-50 px-3 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="text-primary-600 hover:text-primary-700 font-medium py-2 transform transition-all duration-200 hover:translate-x-1 hover:bg-primary-50 px-3 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>

                {/* Mobile Auth Buttons */}
                <div className="flex flex-col space-y-3 pt-4 pb-2 sm:hidden animate-in slide-in-from-bottom-2 duration-300">
                  {isAuthenticated ? (
                    <>
                      <div className="text-center text-primary-600 font-medium py-2">
                        Welcome, {user?.firstName}!
                      </div>
                      <LogoutButton 
                        variant="outline" 
                        className="border-primary-600 text-primary-600 hover:bg-primary-50 bg-transparent w-full transition-all duration-200 hover:scale-105"
                        size="default"
                      />
                    </>
                  ) : (
                    <>
                      <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button
                          variant="outline"
                          className="border-primary-600 text-primary-600 hover:bg-primary-50 bg-transparent w-full transition-all duration-200 hover:scale-105"
                        >
                          Login
                        </Button>
                      </Link>
                      <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="bg-primary-600 hover:bg-primary-700 text-white w-full transition-all duration-200 hover:scale-105">
                          Register
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 sm:mb-6 bg-green-100 text-green-800 border-green-200 text-xs sm:text-sm">
              Trusted Healthcare Partner
            </Badge>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-700 mb-4 sm:mb-6 leading-tight">
              Advanced Diagnostic Solutions for Better Health
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-primary-500 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Experience precision healthcare with our state-of-the-art laboratory services, comprehensive health
              packages, and nationwide network of certified centers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link href="/tests">
                <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white px-6 sm:px-8 w-full sm:w-auto">
                  Browse Tests
                </Button>
              </Link>
              <Link href="/packages">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-600 text-primary-600 hover:bg-primary-50 px-6 sm:px-8 bg-transparent w-full sm:w-auto"
                >
                  Health Packages
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-700 mb-4">Why Choose NVHealth Labs?</h2>
            <p className="text-primary-500 max-w-2xl mx-auto px-4 text-sm sm:text-base">
              We combine cutting-edge technology with compassionate care to deliver accurate, reliable, and timely
              diagnostic services.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="border-primary-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Microscope className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-primary-700 mb-3 sm:mb-4">Advanced Technology</h3>
                <p className="text-primary-500 text-sm sm:text-base">
                  State-of-the-art equipment and cutting-edge diagnostic techniques for precise results.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-primary-700 mb-3 sm:mb-4">Quality Assurance</h3>
                <p className="text-primary-500 text-sm sm:text-base">
                  NABL accredited labs with stringent quality control measures and certified professionals.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary-100 hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-primary-700 mb-3 sm:mb-4">Quick Results</h3>
                <p className="text-primary-500 text-sm sm:text-base">
                  Fast turnaround times with digital reports delivered securely to your dashboard.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div className="space-y-2">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-700">500+</div>
              <div className="text-primary-500 text-sm sm:text-base">Diagnostic Tests</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-700">50+</div>
              <div className="text-primary-500 text-sm sm:text-base">Service Centers</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-700">100K+</div>
              <div className="text-primary-500 text-sm sm:text-base">Happy Customers</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-700">99.9%</div>
              <div className="text-primary-500 text-sm sm:text-base">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-700 mb-4">Our Services</h2>
            <p className="text-primary-500 max-w-2xl mx-auto px-4 text-sm sm:text-base">
              Comprehensive healthcare solutions tailored to meet your diagnostic needs.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="border-primary-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 mb-4" />
                <h3 className="text-lg font-semibold text-primary-700 mb-3">Cardiac Care</h3>
                <p className="text-primary-500 mb-4 text-sm sm:text-base">
                  Comprehensive heart health assessments including ECG, Echo, and cardiac markers.
                </p>
                <Link href="/tests?category=cardiac" className="text-primary-600 hover:text-primary-700 font-medium text-sm sm:text-base">
                  Learn More →
                </Link>
              </CardContent>
            </Card>

            <Card className="border-primary-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Activity className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 mb-4" />
                <h3 className="text-lg font-semibold text-primary-700 mb-3">Preventive Health</h3>
                <p className="text-primary-500 mb-4 text-sm sm:text-base">
                  Regular health checkups and screenings to prevent diseases before they start.
                </p>
                <Link href="/packages" className="text-primary-600 hover:text-primary-700 font-medium text-sm sm:text-base">
                  Learn More →
                </Link>
              </CardContent>
            </Card>

            <Card className="border-primary-100 hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
              <CardContent className="p-6">
                <Users className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 mb-4" />
                <h3 className="text-lg font-semibold text-primary-700 mb-3">Corporate Health</h3>
                <p className="text-primary-500 mb-4 text-sm sm:text-base">
                  Customized health packages for organizations and employee wellness programs.
                </p>
                <Link href="/contact" className="text-primary-600 hover:text-primary-700 font-medium text-sm sm:text-base">
                  Learn More →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-primary-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Take Control of Your Health?</h2>
          <p className="text-primary-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-4 text-sm sm:text-base">
            Book your diagnostic tests today and get accurate results delivered to your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link href="/auth/register">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-50 px-6 sm:px-8 w-full sm:w-auto">
                Get Started
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-primary-700 px-6 sm:px-8 bg-transparent w-full sm:w-auto"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <Logo iconSize={32} textClassName="text-lg sm:text-xl text-white" href="/" />
              <p className="text-gray-400 mt-4 text-sm sm:text-base">
                Advanced diagnostic solutions for better health outcomes. Trusted by thousands of patients nationwide.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li>
                  <Link href="/tests" className="hover:text-white transition-colors">
                    Diagnostic Tests
                  </Link>
                </li>
                <li>
                  <Link href="/packages" className="hover:text-white transition-colors">
                    Health Packages
                  </Link>
                </li>
                <li>
                  <Link href="/centers" className="hover:text-white transition-colors">
                    Service Centers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2 text-gray-400 text-sm sm:text-base">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>+91 1800-123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="break-all">info@nvhealthlabs.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 NVHealth Labs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
