import { type NextRequest, NextResponse } from "next/server"

// Mock bookings data - replace with actual database operations
const bookings = [
  {
    id: "1",
    booking_number: "NVH001",
    user_id: "1",
    center_id: "1",
    appointment_date: "2024-01-15",
    appointment_time: "09:00",
    appointment_type: "lab_visit",
    tests: [
      { id: "1", name: "Complete Blood Count (CBC)", price: 25.0 },
      { id: "2", name: "Lipid Profile", price: 45.0 },
    ],
    total_amount: 70.0,
    discount_amount: 0.0,
    final_amount: 70.0,
    status: "confirmed",
    payment_status: "paid",
    external_booking_id: null,
    integration_status: "pending",
    last_sync_at: null,
    customer_notes: "",
    special_instructions: "",
    collection_address: null,
    collection_phone: null,
    collection_contact_person: null,
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-10T10:00:00Z",
  },
]

// Helper function to authenticate API requests
function authenticateRequest(request: NextRequest) {
  const apiKey = request.headers.get("X-API-Key")
  const centerId = request.headers.get("X-Center-ID")

  if (!apiKey || !centerId) {
    return { authenticated: false, error: "Missing API key or Center ID" }
  }

  // In production, validate API key against database
  // For demo, we'll accept any non-empty key
  if (apiKey.length < 10) {
    return { authenticated: false, error: "Invalid API key" }
  }

  return { authenticated: true, centerId }
}

export async function GET(request: NextRequest) {
  try {
    const auth = authenticateRequest(request)
    if (!auth.authenticated) {
      return NextResponse.json({ error: auth.error }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const date = searchParams.get("date")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let filteredBookings = bookings.filter((b) => b.center_id === auth.centerId)

    if (status) {
      filteredBookings = filteredBookings.filter((b) => b.status === status)
    }

    if (date) {
      filteredBookings = filteredBookings.filter((b) => b.appointment_date === date)
    }

    const paginatedBookings = filteredBookings.slice(offset, offset + limit)

    return NextResponse.json({
      bookings: paginatedBookings,
      total: filteredBookings.length,
      limit,
      offset,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = authenticateRequest(request)
    if (!auth.authenticated) {
      return NextResponse.json({ error: auth.error }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    const requiredFields = ["user_id", "appointment_date", "appointment_time", "tests"]
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Generate booking number
    const bookingNumber = `NVH${String(bookings.length + 1).padStart(3, "0")}`

    const newBooking = {
      id: (bookings.length + 1).toString(),
      booking_number: bookingNumber,
      center_id: auth.centerId,
      ...data,
      status: "pending",
      payment_status: "pending",
      integration_status: "synced",
      last_sync_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    bookings.push(newBooking)

    return NextResponse.json(newBooking, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
