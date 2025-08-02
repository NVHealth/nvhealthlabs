"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Key, Server, Database, Zap } from "lucide-react"

export default function APIDocsPage() {
  return (
    <div className="min-h-screen bg-secondary-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">NVHealth Labs Integration API</h1>
          <p className="text-xl text-gray-600">
            Complete API documentation for integrating diagnostic centers with the NVHealth Labs platform
          </p>
        </div>

        {/* Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              API Overview
            </CardTitle>
            <CardDescription>
              The NVHealth Labs Integration API allows diagnostic centers to seamlessly integrate their systems with our
              platform for booking management, status updates, and result delivery.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Database className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">RESTful API</h3>
                <p className="text-sm text-gray-600">Standard HTTP methods with JSON payloads</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Key className="w-6 h-6 text-success" />
                </div>
                <h3 className="font-semibold mb-2">Secure Authentication</h3>
                <p className="text-sm text-gray-600">API key-based authentication with center isolation</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-accent-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">Real-time Updates</h3>
                <p className="text-sm text-gray-600">Instant synchronization of booking status and results</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Authentication */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>All API requests require authentication using API keys</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Required Headers</h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                  <div>X-API-Key: your_api_key_here</div>
                  <div>X-Center-ID: your_center_id</div>
                  <div>Content-Type: application/json</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Getting API Credentials</h4>
                <p className="text-sm text-gray-600">
                  Contact the NVHealth Labs admin team to obtain your API key and Center ID. Each diagnostic center
                  receives unique credentials for secure access.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Endpoints */}
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bookings">Bookings API</TabsTrigger>
            <TabsTrigger value="status">Status Updates</TabsTrigger>
            <TabsTrigger value="results">Results API</TabsTrigger>
          </TabsList>

          {/* Bookings API */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Bookings Management</CardTitle>
                <CardDescription>Create and retrieve appointment bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* GET Bookings */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-blue-500 text-white">GET</Badge>
                      <code className="text-sm">/api/integration/bookings</code>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Retrieve bookings for your diagnostic center</p>

                    <h5 className="font-medium mb-2">Query Parameters</h5>
                    <div className="bg-gray-50 p-3 rounded text-sm space-y-1">
                      <div>
                        <code>status</code> - Filter by booking status (optional)
                      </div>
                      <div>
                        <code>date</code> - Filter by appointment date (YYYY-MM-DD) (optional)
                      </div>
                      <div>
                        <code>limit</code> - Number of results (default: 50) (optional)
                      </div>
                      <div>
                        <code>offset</code> - Pagination offset (default: 0) (optional)
                      </div>
                    </div>

                    <h5 className="font-medium mb-2 mt-4">Example Request</h5>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                      <div>
                        curl -X GET
                        "https://api.nvhealthlabs.com/api/integration/bookings?status=confirmed&date=2024-01-15" \
                      </div>
                      <div> -H "X-API-Key: your_api_key_here" \</div>
                      <div> -H "X-Center-ID: your_center_id"</div>
                    </div>

                    <h5 className="font-medium mb-2 mt-4">Example Response</h5>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{`{
  "bookings": [
    {
      "id": "1",
      "booking_number": "NVH001",
      "user_id": "123",
      "appointment_date": "2024-01-15",
      "appointment_time": "09:00",
      "appointment_type": "lab_visit",
      "tests": [
        {
          "id": "1",
          "name": "Complete Blood Count (CBC)",
          "price": 25.00
        }
      ],
      "total_amount": 25.00,
      "status": "confirmed",
      "payment_status": "paid",
      "created_at": "2024-01-10T10:00:00Z"
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}`}</pre>
                    </div>
                  </div>

                  {/* POST Bookings */}
                  <div className="border-t pt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-green-500 text-white">POST</Badge>
                      <code className="text-sm">/api/integration/bookings</code>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Create a new booking</p>

                    <h5 className="font-medium mb-2">Request Body</h5>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{`{
  "user_id": "123",
  "appointment_date": "2024-01-15",
  "appointment_time": "09:00",
  "appointment_type": "lab_visit",
  "tests": [
    {
      "id": "1",
      "name": "Complete Blood Count (CBC)",
      "price": 25.00
    }
  ],
  "total_amount": 25.00,
  "discount_amount": 0.00,
  "final_amount": 25.00,
  "customer_notes": "First time patient",
  "special_instructions": "Fasting required"
}`}</pre>
                    </div>

                    <h5 className="font-medium mb-2 mt-4">Example Request</h5>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                      <div>curl -X POST "https://api.nvhealthlabs.com/api/integration/bookings" \</div>
                      <div> -H "X-API-Key: your_api_key_here" \</div>
                      <div> -H "X-Center-ID: your_center_id" \</div>
                      <div> -H "Content-Type: application/json" \</div>
                      <div> -d '@booking.json'</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Status Updates API */}
          <TabsContent value="status">
            <Card>
              <CardHeader>
                <CardTitle>Status Updates</CardTitle>
                <CardDescription>Update and track booking status in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* POST Status Update */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-green-500 text-white">POST</Badge>
                      <code className="text-sm">/api/integration/status</code>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Update booking status</p>

                    <h5 className="font-medium mb-2">Available Status Values</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                      <Badge variant="outline">pending</Badge>
                      <Badge variant="outline">confirmed</Badge>
                      <Badge variant="outline">sample_collected</Badge>
                      <Badge variant="outline">processing</Badge>
                      <Badge variant="outline">completed</Badge>
                      <Badge variant="outline">cancelled</Badge>
                    </div>

                    <h5 className="font-medium mb-2">Request Body</h5>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{`{
  "booking_number": "NVH001",
  "status": "sample_collected",
  "notes": "Blood sample collected successfully",
  "additional_data": {
    "collection_time": "2024-01-15T09:15:00Z",
    "technician_id": "TECH001"
  }
}`}</pre>
                    </div>

                    <h5 className="font-medium mb-2 mt-4">Example Request</h5>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                      <div>curl -X POST "https://api.nvhealthlabs.com/api/integration/status" \</div>
                      <div> -H "X-API-Key: your_api_key_here" \</div>
                      <div> -H "X-Center-ID: your_center_id" \</div>
                      <div> -H "Content-Type: application/json" \</div>
                      <div> -d '{`{"booking_number": "NVH001", "status": "sample_collected"}`}'</div>
                    </div>
                  </div>

                  {/* GET Status */}
                  <div className="border-t pt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-blue-500 text-white">GET</Badge>
                      <code className="text-sm">/api/integration/status?booking_number=NVH001</code>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Get current status and history for a booking</p>

                    <h5 className="font-medium mb-2 mt-4">Example Response</h5>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{`{
  "booking": {
    "booking_number": "NVH001",
    "status": "sample_collected",
    "appointment_date": "2024-01-15",
    "appointment_time": "09:00",
    "tests": [
      {
        "id": "1",
        "name": "Complete Blood Count (CBC)",
        "price": 25.00
      }
    ],
    "last_updated": "2024-01-15T09:15:00Z"
  },
  "status_history": [
    {
      "old_status": "confirmed",
      "new_status": "sample_collected",
      "updated_by": "integration",
      "notes": "Blood sample collected successfully",
      "created_at": "2024-01-15T09:15:00Z"
    }
  ]
}`}</pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results API */}
          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
                <CardDescription>Upload and manage test results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* POST Results */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-green-500 text-white">POST</Badge>
                      <code className="text-sm">/api/integration/results</code>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Upload test results</p>

                    <h5 className="font-medium mb-2">Request Body</h5>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <pre>{`{
  "booking_number": "NVH001",
  "test_id": "1",
  "test_name": "Complete Blood Count (CBC)",
  "result_date": "2024-01-16T10:00:00Z",
  "status": "completed",
  "result_values": {
    "hemoglobin": {
      "value": "14.2",
      "unit": "g/dL",
      "status": "normal"
    },
    "wbc": {
      "value": "7.8",
      "unit": "K/uL",
      "status": "normal"
    },
    "platelets": {
      "value": "285",
      "unit": "K/uL",
      "status": "normal"
    }
  },
  "reference_ranges": {
    "hemoglobin": "12.0-15.5 g/dL",
    "wbc": "4.0-11.0 K/uL",
    "platelets": "150-450 K/uL"
  },
  "interpretation": "All parameters within normal limits",
  "doctor_comments": "Normal blood count. Continue regular monitoring.",
  "report_file_url": "https://your-server.com/reports/nvh001-cbc.pdf",
  "report_file_name": "CBC_Report_NVH001.pdf",
  "external_result_id": "EXT001"
}`}</pre>
                    </div>
                  </div>

                  {/* GET Results */}
                  <div className="border-t pt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-blue-500 text-white">GET</Badge>
                      <code className="text-sm">/api/integration/results</code>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Retrieve test results</p>

                    <h5 className="font-medium mb-2">Query Parameters</h5>
                    <div className="bg-gray-50 p-3 rounded text-sm space-y-1">
                      <div>
                        <code>booking_number</code> - Filter by booking number (optional)
                      </div>
                      <div>
                        <code>test_id</code> - Filter by test ID (optional)
                      </div>
                      <div>
                        <code>status</code> - Filter by result status (optional)
                      </div>
                      <div>
                        <code>limit</code> - Number of results (default: 50) (optional)
                      </div>
                      <div>
                        <code>offset</code> - Pagination offset (default: 0) (optional)
                      </div>
                    </div>
                  </div>

                  {/* PUT Results */}
                  <div className="border-t pt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-orange-500 text-white">PUT</Badge>
                      <code className="text-sm">/api/integration/results</code>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Update existing test results</p>
                    <p className="text-xs text-gray-500">
                      Use the same request body format as POST, but include booking_number and test_id to identify the
                      result to update.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Error Codes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>HTTP Status Codes</CardTitle>
            <CardDescription>Standard HTTP status codes used by the API</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-green-600 mb-2">Success Codes</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <code>200 OK</code> - Request successful
                  </div>
                  <div>
                    <code>201 Created</code> - Resource created successfully
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-red-600 mb-2">Error Codes</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <code>400 Bad Request</code> - Invalid request data
                  </div>
                  <div>
                    <code>401 Unauthorized</code> - Invalid or missing API key
                  </div>
                  <div>
                    <code>404 Not Found</code> - Resource not found
                  </div>
                  <div>
                    <code>409 Conflict</code> - Resource already exists
                  </div>
                  <div>
                    <code>500 Internal Server Error</code> - Server error
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rate Limiting */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Rate Limiting</CardTitle>
            <CardDescription>API usage limits and best practices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Current Limits</h4>
                <div className="space-y-2 text-sm">
                  <div>• 1000 requests per hour per API key</div>
                  <div>• 100 requests per minute per API key</div>
                  <div>• 10 MB maximum request size</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Best Practices</h4>
                <div className="space-y-2 text-sm">
                  <div>• Implement exponential backoff for retries</div>
                  <div>• Cache responses when appropriate</div>
                  <div>• Use pagination for large datasets</div>
                  <div>• Monitor rate limit headers in responses</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card>
          <CardHeader>
            <CardTitle>Support & Contact</CardTitle>
            <CardDescription>Get help with API integration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Technical Support</h4>
                <div className="space-y-2 text-sm">
                  <div>Email: api-support@nvhealthlabs.com</div>
                  <div>Phone: +1-800-NVH-LABS</div>
                  <div>Hours: 24/7 for critical issues</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Resources</h4>
                <div className="space-y-2 text-sm">
                  <div>• API Status Page: status.nvhealthlabs.com</div>
                  <div>• Developer Portal: developers.nvhealthlabs.com</div>
                  <div>• Integration Examples: github.com/nvhealthlabs</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
