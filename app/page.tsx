import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Logo } from "@/components/logo"
import { Microscope, Shield, Clock, Phone, Mail, Users, Heart, Activity } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-green-100 text-green-800 border-green-200">Trusted Healthcare Partner</Badge>
            <h1 className="text-5xl font-bold text-primary-700 mb-6">
              Advanced Diagnostic Solutions for Better Health
            </h1>
            <p className="text-xl text-primary-500 mb-8 max-w-2xl mx-auto">
              Experience precision healthcare with our state-of-the-art laboratory services, comprehensive health
              packages, and nationwide network of certified centers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tests">
                <Button size="lg" className="bg-primary-600 hover:bg-primary-700 text-white px-8">
                  Browse Tests
                </Button>
              </Link>
              <Link href="/packages">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-600 text-primary-600 hover:bg-primary-50 px-8 bg-transparent"
                >
                  Health Packages
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary-700 mb-4">Why Choose NVHealth Labs?</h2>
            <p className="text-primary-500 max-w-2xl mx-auto">
              We combine cutting-edge technology with compassionate care to deliver accurate, reliable, and timely
              diagnostic services.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-primary-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Microscope className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-primary-700 mb-4">Advanced Technology</h3>
                <p className="text-primary-500">
                  State-of-the-art equipment and cutting-edge diagnostic techniques for precise results.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-primary-700 mb-4">Quality Assurance</h3>
                <p className="text-primary-500">
                  NABL accredited labs with stringent quality control measures and certified professionals.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-primary-700 mb-4">Quick Results</h3>
                <p className="text-primary-500">
                  Fast turnaround times with digital reports delivered securely to your dashboard.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-700 mb-2">500+</div>
              <div className="text-primary-500">Diagnostic Tests</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-700 mb-2">50+</div>
              <div className="text-primary-500">Service Centers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-700 mb-2">100K+</div>
              <div className="text-primary-500">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-700 mb-2">99.9%</div>
              <div className="text-primary-500">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary-700 mb-4">Our Services</h2>
            <p className="text-primary-500 max-w-2xl mx-auto">
              Comprehensive healthcare solutions tailored to meet your diagnostic needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-primary-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Heart className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-lg font-semibold text-primary-700 mb-3">Cardiac Care</h3>
                <p className="text-primary-500 mb-4">
                  Comprehensive heart health assessments including ECG, Echo, and cardiac markers.
                </p>
                <Link href="/tests?category=cardiac" className="text-primary-600 hover:text-primary-700 font-medium">
                  Learn More →
                </Link>
              </CardContent>
            </Card>

            <Card className="border-primary-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Activity className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-lg font-semibold text-primary-700 mb-3">Preventive Health</h3>
                <p className="text-primary-500 mb-4">
                  Regular health checkups and screenings to prevent diseases before they start.
                </p>
                <Link href="/packages" className="text-primary-600 hover:text-primary-700 font-medium">
                  Learn More →
                </Link>
              </CardContent>
            </Card>

            <Card className="border-primary-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Users className="w-12 h-12 text-green-600 mb-4" />
                <h3 className="text-lg font-semibold text-primary-700 mb-3">Corporate Health</h3>
                <p className="text-primary-500 mb-4">
                  Customized health packages for organizations and employee wellness programs.
                </p>
                <Link href="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
                  Learn More →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Take Control of Your Health?</h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Book your diagnostic tests today and get accurate results delivered to your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-50 px-8">
                Get Started
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-primary-700 px-8 bg-transparent"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Logo iconSize={40} textClassName="text-xl text-white" href="/" />
              <p className="text-gray-400 mt-4">
                Advanced diagnostic solutions for better health outcomes. Trusted by thousands of patients nationwide.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/tests" className="hover:text-white">
                    Diagnostic Tests
                  </Link>
                </li>
                <li>
                  <Link href="/packages" className="hover:text-white">
                    Health Packages
                  </Link>
                </li>
                <li>
                  <Link href="/centers" className="hover:text-white">
                    Service Centers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+91 1800-123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>info@nvhealthlabs.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 NVHealth Labs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
