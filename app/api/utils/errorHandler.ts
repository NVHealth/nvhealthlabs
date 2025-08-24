import { NextRequest, NextResponse } from 'next/server'
import { STATUS_CODES, MESSAGES } from '../config/constants'

export class AppError extends Error {
  public statusCode: number
  public isOperational: boolean

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, STATUS_CODES.BAD_REQUEST)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = MESSAGES.ERROR.UNAUTHORIZED) {
    super(message, STATUS_CODES.UNAUTHORIZED)
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = MESSAGES.ERROR.FORBIDDEN) {
    super(message, STATUS_CODES.FORBIDDEN)
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = MESSAGES.ERROR.NOT_FOUND) {
    super(message, STATUS_CODES.NOT_FOUND)
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, STATUS_CODES.CONFLICT)
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = MESSAGES.ERROR.INTERNAL_ERROR) {
    super(message, STATUS_CODES.INTERNAL_SERVER_ERROR)
  }
}

export class ErrorHandler {
  /**
   * Handle and format errors for API responses
   */
  static handle(error: unknown, request?: NextRequest): NextResponse {
    console.error('API Error:', error)

    // Handle known application errors
    if (error instanceof AppError) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          statusCode: error.statusCode,
        },
        { status: error.statusCode }
      )
    }

    // Handle Prisma errors
    if (this.isPrismaError(error)) {
      return this.handlePrismaError(error)
    }

    // Handle validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        {
          success: false,
          error: MESSAGES.ERROR.VALIDATION_ERROR,
          details: error.message,
        },
        { status: STATUS_CODES.BAD_REQUEST }
      )
    }

    // Handle JWT errors
    if (error instanceof Error && (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError' ||
      error.name === 'NotBeforeError'
    )) {
      return NextResponse.json(
        {
          success: false,
          error: MESSAGES.ERROR.UNAUTHORIZED,
          details: error.message,
        },
        { status: STATUS_CODES.UNAUTHORIZED }
      )
    }

    // Handle unknown errors
    const message = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return NextResponse.json(
      {
        success: false,
        error: MESSAGES.ERROR.INTERNAL_ERROR,
        ...(process.env.NODE_ENV === 'development' && { details: message }),
      },
      { status: STATUS_CODES.INTERNAL_SERVER_ERROR }
    )
  }

  /**
   * Check if error is a Prisma error
   */
  private static isPrismaError(error: unknown): error is { code: string; message: string } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      typeof (error as any).code === 'string'
    )
  }

  /**
   * Handle Prisma-specific errors
   */
  private static handlePrismaError(error: { code: string; message: string }): NextResponse {
    switch (error.code) {
      case 'P2002':
        return NextResponse.json(
          {
            success: false,
            error: 'Resource already exists',
            details: 'A resource with this information already exists',
          },
          { status: STATUS_CODES.CONFLICT }
        )
      
      case 'P2025':
        return NextResponse.json(
          {
            success: false,
            error: MESSAGES.ERROR.NOT_FOUND,
            details: 'The requested resource was not found',
          },
          { status: STATUS_CODES.NOT_FOUND }
        )
      
      default:
        console.error('Unhandled Prisma error:', error)
        return NextResponse.json(
          {
            success: false,
            error: MESSAGES.ERROR.INTERNAL_ERROR,
            ...(process.env.NODE_ENV === 'development' && { details: error.message }),
          },
          { status: STATUS_CODES.INTERNAL_SERVER_ERROR }
        )
    }
  }
}

/**
 * Async wrapper for API route handlers
 */
export function asyncHandler(
  fn: (request: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      return await fn(request, context)
    } catch (error) {
      return ErrorHandler.handle(error, request)
    }
  }
}

/**
 * Type-safe response helpers
 */
export class ResponseHelper {
  static success<T>(data: T, message?: string, statusCode?: number) {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
      },
      { status: statusCode || STATUS_CODES.OK }
    )
  }

  static error(message: string, statusCode = STATUS_CODES.BAD_REQUEST, details?: any) {
    return NextResponse.json(
      {
        success: false,
        error: message,
        details,
      },
      { status: statusCode }
    )
  }

  static paginated<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
    message?: string
  ) {
    const totalPages = Math.ceil(total / limit)
    
    return NextResponse.json(
      {
        success: true,
        message,
        data,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasMore: page < totalPages,
        },
      },
      { status: STATUS_CODES.OK }
    )
  }
}
