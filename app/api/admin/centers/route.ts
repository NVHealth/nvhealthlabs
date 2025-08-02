import { type NextRequest, NextResponse } from "next/server"

// Mock data for demonstration - replace with actual database operations
const centers = [
  {
    id: "1",
    name: "HealthFirst Diagnostics",
    email: "admin@healthfirst.com",
    phone: "+1-555-0101",
    address: "123 Medical Plaza, Suite 100",
    city: "New York",
    state: "NY",
    zip_code: "10001",
    country: "United States",
    operating_hours: {
      monday: { open: "08:00", close: "18:00" },
      tuesday: { open: "08:00", close: "18:00" },
      wednesday: { open: "08:00", close: "18:00" },
      thursday: { open: "08:00", close: "18:00" },
      friday: { open: "08:00", close: "18:00" },
      saturday: { open: "09:00", close: "14:00" },
      sunday: { open: "closed", close: "closed" },
    },
    services_offered: ["Blood Tests", "Urine Tests", "Radiology", "Pathology"],
    certifications: ["NABL Accredited", "ISO 15189", "CAP Certified"],
    integration_type: "api",
    api_endpoint: "https://api.healthfirst.com/v1",
    webhook_url: "",
    home_collection_available: true,
    online_reports: true,
    emergency_services: false,
    status: "active",
    contact_person_name: "Dr. Sarah Johnson",
    contact_person_phone: "+1-555-0102",
    contact_person_email: "sarah.johnson@healthfirst.com",
    license_number: "HF-2024-001",
    established_year: 2015,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "MediCore Labs",
    email: "contact@medicore.com",
    phone: "+1-555-0201",
    address: "456 Health Street, Building B",
    city: "Los Angeles",
    state: "CA",
    zip_code: "90001",
    country: "United States",
    operating_hours: {
      monday: { open: "07:00", close: "19:00" },
      tuesday: { open: "07:00", close: "19:00" },
      wednesday: { open: "07:00", close: "19:00" },
      thursday: { open: "07:00", close: "19:00" },
      friday: { open: "07:00", close: "19:00" },
      saturday: { open: "08:00", close: "16:00" },
      sunday: { open: "09:00", close: "13:00" },
    },
    services_offered: ["Clinical Chemistry", "Hematology", "Microbiology", "Immunology"],
    certifications: ["CLIA Certified", "NABL Accredited"],
    integration_type: "webhook",
    api_endpoint: "",
    webhook_url: "https://medicore.com/webhook",
    home_collection_available: true,
    online_reports: true,
    emergency_services: false,
    status: "active",
    contact_person_name: "Michael Chen",
    contact_person_phone: "+1-555-0202",
    contact_person_email: "michael.chen@medicore.com",
    license_number: "MC-2024-002",
    established_year: 2018,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

export async function GET() {
  try {
    return NextResponse.json(centers)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch centers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const newCenter = {
      id: (centers.length + 1).toString(),
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    centers.push(newCenter)

    return NextResponse.json(newCenter, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create center" }, { status: 500 })
  }
}
