import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Logo } from "@/components/logo"
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
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
              <Link href="/contact" className="text-primary-700 font-semibold">
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
            <h1 className="text-5xl font-bold text-primary-700 mb-6">Get in Touch</h1>
            <p className="text-xl text-primary-500 mb-8 max-w-2xl mx-auto">
              Have questions about our services? Need support with your tests? We're here to help you every step of the
              way.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-primary-700 mb-8">Send us a Message</h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-primary-700">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      className="border-primary-200 focus:border-primary-500"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-primary-700">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      className="border-primary-200 focus:border-primary-500"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-primary-700">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="border-primary-200 focus:border-primary-500"
                    placeholder="john.doe@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-primary-700">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="border-primary-200 focus:border-primary-500"
                    placeholder="+91 9876543210"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-primary-700">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    className="border-primary-200 focus:border-primary-500"
                    placeholder="How can we help you?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-primary-700">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    className="border-primary-200 focus:border-primary-500"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-primary-700 mb-8">Contact Information</h2>

              <div className="space-y-8">
                <Card className="border-primary-100">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-primary-700 mb-2">Phone Support</h3>
                        <p className="text-primary-500 mb-2">Call us for immediate assistance</p>
                        <p className="text-primary-600 font-medium">+91 1800-123-4567</p>
                        <p className="text-primary-400 text-sm">Toll-free • Available 24/7</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary-100">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-primary-700 mb-2">Email Support</h3>
                        <p className="text-primary-500 mb-2">Send us your questions anytime</p>
                        <p className="text-primary-600 font-medium">info@nvhealthlabs.com</p>
                        <p className="text-primary-400 text-sm">Response within 24 hours</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary-100">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-primary-700 mb-2">Head Office</h3>
                        <p className="text-primary-500 mb-2">Visit our main office</p>
                        <p className="text-primary-600 font-medium">
                          123 Health Street, Medical District
                          <br />
                          Bangalore, Karnataka 560001
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary-100">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-primary-700 mb-2">Business Hours</h3>
                        <p className="text-primary-500 mb-2">When you can reach us</p>
                        <div className="text-primary-600 font-medium space-y-1">
                          <p>Monday - Friday: 6:00 AM - 10:00 PM</p>
                          <p>Saturday: 7:00 AM - 8:00 PM</p>
                          <p>Sunday: 8:00 AM - 6:00 PM</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-20 bg-primary-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need Immediate Assistance?</h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            For urgent medical concerns or emergency test results, contact our 24/7 helpline.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-50 px-8">
              <Phone className="w-4 h-4 mr-2" />
              Call Emergency Line
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-primary-700 px-8 bg-transparent"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email Support
            </Button>
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
