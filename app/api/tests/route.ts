import { type NextRequest, NextResponse } from "next/server"

// Mock data - replace with database queries
const mockTests = [
  {
    id: "test-1",
    name: "Complete Blood Count (CBC)",
    description: "Comprehensive blood analysis including RBC, WBC, platelets",
    category: "Blood Tests",
    preparation_instructions: "No special preparation required",
    sample_type: "Blood",
    reporting_time: "4-6 hours",
    is_popular: true,
    min_price: 18.0,
    max_price: 25.0,
  },
  {
    id: "test-2",
    name: "Lipid Profile",
    description: "Cholesterol, triglycerides, HDL, LDL analysis",
    category: "Heart Health",
    preparation_instructions: "12-hour fasting required",
    sample_type: "Blood",
    reporting_time: "6-8 hours",
    is_popular: true,
    min_price: 35.0,
    max_price: 48.0,
  },
  {
    id: "test-3",
    name: "HbA1c",
    description: "Average blood sugar levels over 2-3 months",
    category: "Diabetes",
    preparation_instructions: "No fasting required",
    sample_type: "Blood",
    reporting_time: "4-6 hours",
    is_popular: true,
    min_price: 30.0,
    max_price: 40.0,
  },
  {
    id: "test-4",
    name: "Liver Function Test (LFT)",
    description: "ALT, AST, bilirubin, and liver enzymes",
    category: "Liver Function",
    preparation_instructions: "8-hour fasting recommended",
    sample_type: "Blood",
    reporting_time: "6-8 hours",
    is_popular: false,
    min_price: 30.0,
    max_price: 42.0,
  },
  {
    id: "test-5",
    name: "Kidney Function Test (KFT)",
    description: "Creatinine, BUN, uric acid analysis",
    category: "Kidney Function",
    preparation_instructions: "No special preparation",
    sample_type: "Blood",
    reporting_time: "4-6 hours",
    is_popular: false,
    min_price: 22.0,
    max_price: 32.0,
  },
  {
    id: "test-6",
    name: "Thyroid Profile (TSH, T3, T4)",
    description: "Complete thyroid function assessment",
    category: "Thyroid",
    preparation_instructions: "Morning sample preferred",
    sample_type: "Blood",
    reporting_time: "8-12 hours",
    is_popular: true,
    min_price: 42.0,
    max_price: 58.0,
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const category = searchParams.get("category")
    const popular = searchParams.get("popular")

    let filteredTests = [...mockTests]

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filteredTests = filteredTests.filter(
        (test) =>
          test.name.toLowerCase().includes(searchLower) ||
          test.description.toLowerCase().includes(searchLower) ||
          test.category.toLowerCase().includes(searchLower),
      )
    }

    // Apply category filter
    if (category && category !== "all") {
      filteredTests = filteredTests.filter((test) => test.category.toLowerCase() === category.toLowerCase())
    }

    // Apply popular filter
    if (popular === "true") {
      filteredTests = filteredTests.filter((test) => test.is_popular)
    }

    return NextResponse.json({
      success: true,
      tests: filteredTests,
      total: filteredTests.length,
    })
  } catch (error) {
    console.error("Tests API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
