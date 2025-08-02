import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { amount, bookingId, currency = "usd" } = await request.json()

    if (!amount || !bookingId) {
      return NextResponse.json({ error: "Amount and booking ID are required" }, { status: 400 })
    }

    // Mock Stripe payment intent creation
    // In production, use actual Stripe SDK:
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: Math.round(amount * 100), // Convert to cents
    //   currency: currency,
    //   metadata: { bookingId }
    // })

    const mockPaymentIntent = {
      id: `pi_mock_${Date.now()}`,
      client_secret: `pi_mock_${Date.now()}_secret_mock`,
      amount: Math.round(amount * 100),
      currency: currency,
      status: "requires_payment_method",
    }

    return NextResponse.json({
      success: true,
      paymentIntent: mockPaymentIntent,
    })
  } catch (error) {
    console.error("Payment intent creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
