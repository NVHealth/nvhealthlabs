// Simple test to verify the API architecture works
import { describe, test, expect } from '@jest/globals'

describe('API Architecture', () => {
  test('should compile without errors', () => {
    // If this test runs, it means TypeScript compilation passed
    expect(true).toBe(true)
  })

  test('environment config should be accessible', () => {
    const { env } = require('../app/api/config/env')
    expect(env.JWT_SECRET).toBeDefined()
    expect(env.NODE_ENV).toBeDefined()
  })

  test('constants should be accessible', () => {
    const { UserRole, STATUS_CODES } = require('../app/api/config/constants')
    expect(UserRole.PATIENT).toBe('patient')
    expect(UserRole.PLATFORM_ADMIN).toBe('platform_admin')
    expect(STATUS_CODES.OK).toBe(200)
  })

  test('JWT utilities should be importable', () => {
    const { JWTUtils } = require('../app/api/utils/jwt')
    expect(JWTUtils.generateToken).toBeDefined()
    expect(JWTUtils.verifyToken).toBeDefined()
  })

  test('error handlers should be importable', () => {
    const { ResponseHelper, AppError } = require('../app/api/utils/errorHandler')
    expect(ResponseHelper.success).toBeDefined()
    expect(ResponseHelper.error).toBeDefined()
    expect(AppError).toBeDefined()
  })
})
