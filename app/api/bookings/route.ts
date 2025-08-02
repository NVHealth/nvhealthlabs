import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const {
      userId,
      centerId,
      testIds,
      appointmentDate,
      appointmentTime,
      isHomeCollection,
      collectionAddress,
      specialInstructions,
    } = await request.json()

    // Validate required fields
    if (!userId || !centerId || !testIds || !appointmentDate || !appointmentTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate booking number
    const bookingNumber = `NVH${Date.now().toString().slice(-6)}`

    // Calculate total amount (mock calculation)
    const mockTestPrices = {
      "test-1": 25.0,
      "test-2": 45.0,
      "test-3": 35.0,
      "test-4": 40.0,
      "test-5": 30.0,
      "test-6": 55.0,
    }

    let totalAmount = 0
    testIds.forEach((testId: string) => {
      totalAmount += mockTestPrices[testId as keyof typeof mockTestPrices] || 0
    })

    // Add home collection fee if applicable
    if (isHomeCollection) {
      totalAmount += 15.0 // Mock home collection fee
    }

    // Create booking (mock creation)
    const newBooking = {
      id: `booking-${Date.now()}`,
      booking_number: bookingNumber,
      user_id: userId,
      center_id: centerId,
      test_ids: testIds,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      status: "pending",
      total_amount: totalAmount,
      payment_status: "pending",
      is_home_collection: isHomeCollection,
      collection_address: collectionAddress,
      special_instructions: specialInstructions,
      created_at: new Date().toISOString(),
    }

    // In production, save to database here

    return NextResponse.json({
      success: true,
      booking: newBooking,
      message: "Booking created successfully",
    })
  } catch (error) {
    console.error("Booking creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const status = searchParams.get("status")

    // Mock bookings data
    const mockBookings = [
      {
        id: "1",
        booking_number: "NVH001",
        appointment_date: "2024-01-15",
        appointment_time: "09:00",
        status: "completed",
        total_amount: 85.0,
        center_name: "HealthFirst Diagnostics",
        tests: ["Complete Blood Count", "Lipid Profile"],
      },
      {
        id: "2",
        booking_number: "NVH002",
        appointment_date: "2024-01-20",
        appointment_time: "14:30",
        status: "confirmed",
        total_amount: 45.0,
        center_name: "MediCore Labs",
        tests: ["HbA1c"],
      },
    ]

    let filteredBookings = [...mockBookings]

    if (status) {
      filteredBookings = filteredBookings.filter((booking) => booking.status === status)
    }

    return NextResponse.json({
      success: true,
      bookings: filteredBookings,
      total: filteredBookings.length,
    })
  } catch (error) {
    console.error("Bookings fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
