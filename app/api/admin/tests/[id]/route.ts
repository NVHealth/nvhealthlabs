import { type NextRequest, NextResponse } from "next/server"

// Mock data - replace with actual database operations
const tests = [
  {
    id: "1",
    name: "Complete Blood Count (CBC)",
    category: "Hematology",
    subcategory: "Blood Count",
    description: "A comprehensive blood test that evaluates overall health and detects various disorders",
    sample_type: "blood",
    sample_volume: "3-5 mL",
    container_type: "EDTA Tube",
    base_price: 25.0,
    currency: "USD",
    reporting_time_hours: 4,
    fasting_required: false,
    preparation_instructions: "No special preparation required. Stay hydrated.",
    clinical_significance:
      "Evaluates red blood cells, white blood cells, and platelets to diagnose anemia, infections, and blood disorders.",
    reference_ranges: {
      hemoglobin: { male: "13.8-17.2 g/dL", female: "12.1-15.1 g/dL" },
      wbc: "4.0-11.0 K/uL",
      platelets: "150-450 K/uL",
    },
    methodology: "Automated Cell Counter",
    status: "active",
    is_popular: true,
    display_order: 1,
    search_keywords: ["CBC", "blood count", "hemoglobin", "anemia", "infection"],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Lipid Profile",
    category: "Clinical Chemistry",
    subcategory: "Cardiac Markers",
    description: "Measures cholesterol and triglycerides to assess cardiovascular risk",
    sample_type: "blood",
    sample_volume: "5 mL",
    container_type: "Serum Tube",
    base_price: 45.0,
    currency: "USD",
    reporting_time_hours: 6,
    fasting_required: true,
    preparation_instructions: "Fast for 12-14 hours before the test. Only water is allowed.",
    clinical_significance:
      "Assesses risk of heart disease and stroke by measuring different types of cholesterol and triglycerides.",
    reference_ranges: {
      total_cholesterol: "<200 mg/dL",
      ldl: "<100 mg/dL",
      hdl: ">40 mg/dL (male), >50 mg/dL (female)",
      triglycerides: "<150 mg/dL",
    },
    methodology: "Enzymatic Method",
    status: "active",
    is_popular: true,
    display_order: 2,
    search_keywords: ["cholesterol", "lipid", "heart", "cardiovascular", "triglycerides"],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "HbA1c (Glycated Hemoglobin)",
    category: "Clinical Chemistry",
    subcategory: "Diabetes Monitoring",
    description: "Measures average blood sugar levels over the past 2-3 months",
    sample_type: "blood",
    sample_volume: "2 mL",
    container_type: "EDTA Tube",
    base_price: 35.0,
    currency: "USD",
    reporting_time_hours: 4,
    fasting_required: false,
    preparation_instructions: "No fasting required. Can be done at any time of day.",
    clinical_significance: "Monitors long-term blood glucose control in diabetic patients and diagnoses diabetes.",
    reference_ranges: {
      normal: "<5.7%",
      prediabetes: "5.7-6.4%",
      diabetes: "≥6.5%",
    },
    methodology: "HPLC Method",
    status: "active",
    is_popular: true,
    display_order: 3,
    search_keywords: ["diabetes", "blood sugar", "glucose", "HbA1c", "glycated hemoglobin"],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    name: "Thyroid Profile (T3, T4, TSH)",
    category: "Endocrinology",
    subcategory: "Thyroid Function",
    description: "Comprehensive thyroid function assessment",
    sample_type: "blood",
    sample_volume: "5 mL",
    container_type: "Serum Tube",
    base_price: 65.0,
    currency: "USD",
    reporting_time_hours: 8,
    fasting_required: false,
    preparation_instructions: "No special preparation required. Inform about any thyroid medications.",
    clinical_significance:
      "Evaluates thyroid gland function to diagnose hyperthyroidism, hypothyroidism, and other thyroid disorders.",
    reference_ranges: {
      tsh: "0.4-4.0 mIU/L",
      t3: "80-200 ng/dL",
      t4: "5.0-12.0 μg/dL",
    },
    methodology: "Chemiluminescent Immunoassay",
    status: "active",
    is_popular: true,
    display_order: 4,
    search_keywords: ["thyroid", "TSH", "T3", "T4", "hormone", "metabolism"],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const test = tests.find((t) => t.id === params.id)

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 })
    }

    return NextResponse.json(test)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch test" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const testIndex = tests.findIndex((t) => t.id === params.id)

    if (testIndex === -1) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 })
    }

    tests[testIndex] = {
      ...tests[testIndex],
      ...data,
      updated_at: new Date().toISOString(),
    }

    return NextResponse.json(tests[testIndex])
  } catch (error) {
    return NextResponse.json({ error: "Failed to update test" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const testIndex = tests.findIndex((t) => t.id === params.id)

    if (testIndex === -1) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 })
    }

    tests.splice(testIndex, 1)

    return NextResponse.json({ message: "Test deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete test" }, { status: 500 })
  }
}
