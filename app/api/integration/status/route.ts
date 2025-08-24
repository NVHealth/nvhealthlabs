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
    last_sync_at: null as string | null,
    customer_notes: "",
    special_instructions: "",
    collection_address: null,
    collection_phone: null,
    collection_contact_person: null,
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-10T10:00:00Z",
  },
]

const statusLogs: Array<{
  booking_id: string;
  status: string;
  message: string;
  timestamp: string;
}> = []

// Helper function to authenticate API requests
function authenticateRequest(request: NextRequest) {
  const apiKey = request.headers.get("X-API-Key")
  const centerId = request.headers.get("X-Center-ID")

  if (!apiKey || !centerId) {
    return { authenticated: false, error: "Missing API key or Center ID" }
  }

  // In production, validate API key against database
  if (apiKey.length < 10) {
    return { authenticated: false, error: "Invalid API key" }
  }

  return { authenticated: true, centerId }
}

export async function POST(request: NextRequest) {
  try {
    const auth = authenticateRequest(request)
    if (!auth.authenticated) {
      return NextResponse.json({ error: auth.error }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.booking_number || !data.status) {
      return NextResponse.json({ error: "Missing required fields: booking_number, status" }, { status: 400 })
    }

    // Find booking
    const bookingIndex = bookings.findIndex(
      (b) => b.booking_number === data.booking_number && b.center_id === auth.centerId,
    )

    if (bookingIndex === -1) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    const booking = bookings[bookingIndex]
    const oldStatus = booking.status

    // Update booking status
    bookings[bookingIndex] = {
      ...booking,
      status: data.status,
      integration_status: "synced",
      last_sync_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Log status change
    const statusLog = {
      booking_id: booking.id,
      status: data.status,
      message: data.notes || `Status updated to ${data.status}`,
      timestamp: new Date().toISOString(),
    }

    statusLogs.push(statusLog)

    return NextResponse.json({
      message: "Status updated successfully",
      booking: bookings[bookingIndex],
      status_log: statusLog,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = authenticateRequest(request)
    if (!auth.authenticated) {
      return NextResponse.json({ error: auth.error }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const bookingNumber = searchParams.get("booking_number")

    if (!bookingNumber) {
      return NextResponse.json({ error: "Missing booking_number parameter" }, { status: 400 })
    }

    // Find booking
    const booking = bookings.find((b) => b.booking_number === bookingNumber && b.center_id === auth.centerId)

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Get status logs for this booking
    const logs = statusLogs.filter((log) => log.booking_id === booking.id)

    return NextResponse.json({
      booking: {
        booking_number: booking.booking_number,
        status: booking.status,
        appointment_date: booking.appointment_date,
        appointment_time: booking.appointment_time,
        tests: booking.tests,
        last_updated: booking.updated_at,
      },
      status_history: logs,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 })
  }
}
