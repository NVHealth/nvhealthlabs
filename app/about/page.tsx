import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Logo } from "@/components/logo"
import { Users, Award, Target, Eye, Phone, Mail, Linkedin, Twitter } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
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
              <Link href="/about" className="text-primary-700 font-semibold">
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
            <h1 className="text-5xl font-bold text-primary-700 mb-6">About NVHealth Labs</h1>
            <p className="text-xl text-primary-500 mb-8 max-w-2xl mx-auto">
              Leading the future of diagnostic healthcare with innovation, precision, and compassionate care for over a
              decade.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-600">Our Mission</h2>
                </div>
                <p className="text-green-700 text-lg leading-relaxed">
                  To democratize healthcare by providing accessible, accurate, and affordable diagnostic services that
                  empower individuals and healthcare providers to make informed decisions for better health outcomes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Eye className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-600">Our Vision</h2>
                </div>
                <p className="text-green-700 text-lg leading-relaxed">
                  To be the most trusted and innovative diagnostic healthcare partner, setting new standards in quality,
                  technology, and patient care while contributing to a healthier society for all.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-primary-700 mb-8 text-center">Our Story</h2>
            <div className="prose prose-lg max-w-none text-primary-600">
              <p className="mb-6">
                Founded in 2010, NVHealth Labs began with a simple yet powerful vision: to make quality healthcare
                diagnostics accessible to everyone. What started as a single laboratory in Bangalore has now grown into
                a nationwide network of over 50 service centers, serving more than 100,000 patients annually.
              </p>
              <p className="mb-6">
                Our journey has been marked by continuous innovation and an unwavering commitment to excellence. We were
                among the first diagnostic labs in India to implement fully automated testing systems, ensuring
                consistent accuracy and faster turnaround times. Today, we offer over 500 different diagnostic tests,
                from routine blood work to specialized genetic testing.
              </p>
              <p>
                At NVHealth Labs, we believe that early detection and prevention are the keys to better health outcomes.
                Our comprehensive health packages and preventive care programs have helped thousands of individuals take
                proactive steps towards maintaining their health.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary-700 mb-4">Leadership Team</h2>
            <p className="text-primary-500 max-w-2xl mx-auto">
              Meet the visionary leaders driving innovation and excellence in healthcare diagnostics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <Card className="border-primary-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-32 h-32 bg-primary-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Users className="w-16 h-16 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-primary-700 mb-2">Nish Avala</h3>
                <p className="text-green-600 font-semibold mb-4">Chief Executive Officer</p>
                <p className="text-primary-500 mb-4">
                  Nish brings over 15 years of experience in technology innovation and business operations. His
                  expertise in scaling healthcare technology platforms has been instrumental in NVHealth Labs' digital
                  transformation and nationwide expansion.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button variant="outline" size="sm" className="border-primary-600 text-primary-600 bg-transparent">
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-primary-600 text-primary-600 bg-transparent">
                    <Twitter className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary-100 hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-32 h-32 bg-primary-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Award className="w-16 h-16 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-primary-700 mb-2">Dr. Vikranth</h3>
                <p className="text-green-600 font-semibold mb-4">Chief Operating Officer</p>
                <p className="text-primary-500 mb-4">
                  Dr. Vikranth combines deep medical expertise with strong operational leadership. With a background in
                  technology innovation and business operations, he ensures our diagnostic services maintain the highest
                  standards of quality and efficiency.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button variant="outline" size="sm" className="border-primary-600 text-primary-600 bg-transparent">
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-primary-600 text-primary-600 bg-transparent">
                    <Twitter className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary-700 mb-4">Our Values</h2>
            <p className="text-primary-500 max-w-2xl mx-auto">
              The principles that guide everything we do at NVHealth Labs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-primary-100 bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-primary-700 mb-4">Excellence</h3>
                <p className="text-primary-500">
                  We strive for the highest standards in everything we do, from testing accuracy to customer service.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary-100 bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-primary-700 mb-4">Compassion</h3>
                <p className="text-primary-500">
                  We treat every patient with empathy, respect, and understanding, recognizing the trust they place in
                  us.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary-100 bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-primary-700 mb-4">Innovation</h3>
                <p className="text-primary-500">
                  We continuously invest in cutting-edge technology and processes to improve healthcare outcomes.
                </p>
              </CardContent>
            </Card>
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
