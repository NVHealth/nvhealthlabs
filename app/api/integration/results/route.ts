import { type NextRequest, NextResponse } from "next/server"

// Mock data - replace with actual database operations
const testResults = [
  {
    id: "1",
    booking_id: "1",
    booking_number: "NVH001",
    test_id: "1",
    test_name: "Complete Blood Count (CBC)",
    result_date: "2024-01-16T10:00:00Z",
    status: "completed",
    result_values: {
      hemoglobin: { value: "14.2", unit: "g/dL", status: "normal" },
      wbc: { value: "7.8", unit: "K/uL", status: "normal" },
      platelets: { value: "285", unit: "K/uL", status: "normal" },
    },
    reference_ranges: {
      hemoglobin: "12.0-15.5 g/dL",
      wbc: "4.0-11.0 K/uL",
      platelets: "150-450 K/uL",
    },
    interpretation: "All parameters within normal limits",
    doctor_comments: "Normal blood count. Continue regular monitoring.",
    report_file_url: "/reports/nvh001-cbc.pdf",
    report_file_name: "CBC_Report_NVH001.pdf",
    report_file_size: 245760,
    external_result_id: "EXT001",
    created_at: "2024-01-16T10:00:00Z",
    updated_at: "2024-01-16T10:00:00Z",
  },
]

const bookings = [
  {
    id: "1",
    booking_number: "NVH001",
    center_id: "1",
    status: "completed",
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
    const requiredFields = ["booking_number", "test_id", "result_values"]
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Find booking
    const booking = bookings.find((b) => b.booking_number === data.booking_number && b.center_id === auth.centerId)

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Check if result already exists
    const existingResult = testResults.find(
      (r) => r.booking_number === data.booking_number && r.test_id === data.test_id,
    )

    if (existingResult) {
      return NextResponse.json({ error: "Result already exists for this test" }, { status: 409 })
    }

    const newResult = {
      id: (testResults.length + 1).toString(),
      booking_id: booking.id,
      booking_number: data.booking_number,
      test_id: data.test_id,
      test_name: data.test_name || "",
      result_date: data.result_date || new Date().toISOString(),
      status: data.status || "completed",
      result_values: data.result_values,
      reference_ranges: data.reference_ranges || {},
      interpretation: data.interpretation || "",
      doctor_comments: data.doctor_comments || "",
      report_file_url: data.report_file_url || "",
      report_file_name: data.report_file_name || "",
      report_file_size: data.report_file_size || 0,
      external_result_id: data.external_result_id || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    testResults.push(newResult)

    return NextResponse.json(
      {
        message: "Result uploaded successfully",
        result: newResult,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: "Failed to upload result" }, { status: 500 })
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
    const testId = searchParams.get("test_id")
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let filteredResults = testResults.filter((r) => {
      const booking = bookings.find((b) => b.id === r.booking_id)
      return booking && booking.center_id === auth.centerId
    })

    if (bookingNumber) {
      filteredResults = filteredResults.filter((r) => r.booking_number === bookingNumber)
    }

    if (testId) {
      filteredResults = filteredResults.filter((r) => r.test_id === testId)
    }

    if (status) {
      filteredResults = filteredResults.filter((r) => r.status === status)
    }

    const paginatedResults = filteredResults.slice(offset, offset + limit)

    return NextResponse.json({
      results: paginatedResults,
      total: filteredResults.length,
      limit,
      offset,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = authenticateRequest(request)
    if (!auth.authenticated) {
      return NextResponse.json({ error: auth.error }, { status: 401 })
    }

    const data = await request.json()

    if (!data.booking_number || !data.test_id) {
      return NextResponse.json({ error: "Missing required fields: booking_number, test_id" }, { status: 400 })
    }

    // Find result
    const resultIndex = testResults.findIndex((r) => {
      const booking = bookings.find((b) => b.id === r.booking_id)
      return (
        r.booking_number === data.booking_number &&
        r.test_id === data.test_id &&
        booking &&
        booking.center_id === auth.centerId
      )
    })

    if (resultIndex === -1) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 })
    }

    // Update result
    testResults[resultIndex] = {
      ...testResults[resultIndex],
      ...data,
      updated_at: new Date().toISOString(),
    }

    return NextResponse.json({
      message: "Result updated successfully",
      result: testResults[resultIndex],
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update result" }, { status: 500 })
  }
}
