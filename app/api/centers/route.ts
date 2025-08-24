import { NextRequest } from 'next/server'
import { ResponseHelper } from '../utils/errorHandler'

const mockCenters = [
  {
    id: "center-1",
    name: "HealthFirst Diagnostics",
    description: "State-of-the-art diagnostic facility with NABL accreditation",
    address: "123 Medical Plaza, Downtown",
    city: "New York",
    state: "NY",
    zip_code: "10001",
    phone: "+1-555-0101",
    email: "info@healthfirst.com",
    rating: 4.5,
    total_reviews: 150,
    operating_hours: {
      monday: "7:00-19:00",
      tuesday: "7:00-19:00",
      wednesday: "7:00-19:00",
      thursday: "7:00-19:00",
      friday: "7:00-19:00",
      saturday: "8:00-16:00",
      sunday: "closed",
    },
    certifications: ["NABL", "ISO 15189", "CAP"],
    home_collection: true,
  },
  {
    id: "center-2",
    name: "MediCore Labs",
    description: "Comprehensive diagnostic services with home collection",
    address: "456 Health Street, Midtown",
    city: "New York",
    state: "NY",
    zip_code: "10002",
    phone: "+1-555-0102",
    email: "contact@medicore.com",
    rating: 4.2,
    total_reviews: 89,
    operating_hours: {
      monday: "6:00-20:00",
      tuesday: "6:00-20:00",
      wednesday: "6:00-20:00",
      thursday: "6:00-20:00",
      friday: "6:00-20:00",
      saturday: "7:00-17:00",
      sunday: "8:00-14:00",
    },
    certifications: ["NABL", "ISO 15189"],
    home_collection: true,
  },
  {
    id: "center-3",
    name: "QuickTest Center",
    description: "Fast and reliable diagnostic testing",
    address: "789 Wellness Ave, Uptown",
    city: "New York",
    state: "NY",
    zip_code: "10003",
    phone: "+1-555-0103",
    email: "hello@quicktest.com",
    rating: 4.0,
    total_reviews: 67,
    operating_hours: {
      monday: "8:00-18:00",
      tuesday: "8:00-18:00",
      wednesday: "8:00-18:00",
      thursday: "8:00-18:00",
      friday: "8:00-18:00",
      saturday: "9:00-15:00",
      sunday: "closed",
    },
    certifications: ["NABL"],
    home_collection: false,
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get("city")
    const homeCollection = searchParams.get("homeCollection")

    let filteredCenters = [...mockCenters]

    if (city) {
      filteredCenters = filteredCenters.filter((center) => 
        center.city.toLowerCase().includes(city.toLowerCase())
      )
    }

    if (homeCollection === "true") {
      filteredCenters = filteredCenters.filter((center) => center.home_collection)
    }

    return ResponseHelper.success(
      {
        centers: filteredCenters,
        total: filteredCenters.length,
      },
      'Centers retrieved successfully'
    )
  } catch (error) {
    console.error("Centers API error:", error)
    return ResponseHelper.error('Failed to retrieve centers')
  }
}
