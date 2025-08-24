import { NextRequest } from 'next/server'
import { AuthMiddleware, requirePatient } from '@/lib/security/auth-middleware'
import { AuditLogger } from '@/lib/audit/audit-logger'
import { prisma } from '@/lib/prisma'

/**
 * Patient Dashboard - Get patient's own data and recent activity
 * Demonstrates patient role restrictions and data privacy
 */
export const GET = AuthMiddleware.withAuth(async (request: NextRequest, user) => {
  try {
    // Log data access for HIPAA compliance
    await AuditLogger.logDataAccess('view', request, user.id, 'patient_dashboard', user.id, {
      action: 'view_dashboard'
    })

    // Get patient's profile data (users can only access their own data)
    const patientData = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        dateOfBirth: true,
        gender: true,
        isVerified: true,
        createdAt: true,
        lastLogin: true
        // Explicitly exclude sensitive fields like passwordHash
      }
    })

    if (!patientData) {
      return Response.json(
        { error: 'Patient data not found' },
        { status: 404 }
      )
    }

    // TODO: Add patient-specific data like test results, appointments, etc.
    // For now, we'll return basic profile and placeholder data
    
    const dashboardData = {
      profile: patientData,
      stats: {
        totalTests: 0, // TODO: Count from tests table
        completedTests: 0,
        pendingResults: 0
      },
      recentActivity: [], // TODO: Get from audit logs or activity table
      upcomingAppointments: [] // TODO: Get from appointments table
    }

    return Response.json({
      success: true,
      data: dashboardData
    })

  } catch (error) {
    await AuditLogger.log({
      userId: user.id,
      action: 'patient_dashboard_error',
      details: {
        error: error instanceof Error ? error.message : String(error)
      },
      severity: 'medium'
    })

    return Response.json(
      { error: 'Failed to load dashboard data' },
      { status: 500 }
    )
  }
}, requirePatient())

/**
 * Update patient profile - patients can only update their own data
 */
export const PATCH = AuthMiddleware.withAuth(async (request: NextRequest, user) => {
  try {
    const updates = await request.json()

    // Define allowed fields that patients can update
    const allowedFields = ['firstName', 'lastName', 'phone', 'dateOfBirth', 'gender']
    const updateData: any = {}

    // Validate and filter updates
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key) && value !== null && value !== undefined) {
        if (key === 'dateOfBirth' && typeof value === 'string') {
          updateData[key] = new Date(value)
        } else {
          updateData[key] = value
        }
      }
    }

    if (Object.keys(updateData).length === 0) {
      return Response.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    // Log the update attempt
    await AuditLogger.logDataAccess('update', request, user.id, 'patient_profile', user.id, {
      updates: Object.keys(updateData)
    })

    // Update only the patient's own profile
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...updateData,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        dateOfBirth: true,
        gender: true,
        updatedAt: true
      }
    })

    return Response.json({
      success: true,
      message: 'Profile updated successfully',
      profile: updatedUser
    })

  } catch (error) {
    await AuditLogger.log({
      userId: user.id,
      action: 'patient_profile_update_error',
      details: {
        error: error instanceof Error ? error.message : String(error)
      },
      severity: 'medium'
    })

    return Response.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}, requirePatient())
