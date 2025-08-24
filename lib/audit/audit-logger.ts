import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

export interface AuditLogEntry {
  userId?: string
  action: string
  details?: Record<string, any>
  severity?: 'low' | 'medium' | 'high' | 'critical'
  ipAddress?: string
  userAgent?: string
  resourceType?: string
  resourceId?: string
  outcome?: 'success' | 'failure'
  metadata?: Record<string, any>
}

export interface AuditLogFilter {
  userId?: string
  action?: string
  severity?: string
  startDate?: Date
  endDate?: Date
  ipAddress?: string
  limit?: number
  offset?: number
}

export class AuditLogger {
  /**
   * Log an audit event
   * @param entry - Audit log entry
   */
  static async log(entry: AuditLogEntry): Promise<void> {
    try {
      // In a production environment, you might want to use a separate audit database
      // or a specialized audit logging service for HIPAA compliance
      
      // For now, we'll log to console and could extend to database/external service
      const logEntry = {
        timestamp: new Date().toISOString(),
        userId: entry.userId || 'anonymous',
        action: entry.action,
        details: entry.details || {},
        severity: entry.severity || 'medium',
        ipAddress: entry.ipAddress || 'unknown',
        userAgent: entry.userAgent || 'unknown',
        resourceType: entry.resourceType,
        resourceId: entry.resourceId,
        outcome: entry.outcome || 'success',
        metadata: entry.metadata || {}
      }

      // Log to console (in production, send to secure audit service)
      console.log(`[AUDIT] ${JSON.stringify(logEntry)}`)

      // TODO: In production, implement:
      // - Send to HIPAA-compliant audit logging service (e.g., AWS CloudTrail, Azure Monitor)
      // - Store in separate audit database with encryption at rest
      // - Implement tamper-proof logging mechanisms
      // - Add automated alerting for high/critical severity events

    } catch (error) {
      // Never let audit logging break the main application flow
      console.error('[AUDIT_ERROR]', error)
    }
  }

  /**
   * Log authentication events
   */
  static async logAuth(
    action: 'login_attempt' | 'login_success' | 'login_failed' | 'logout' | 'token_refresh',
    request: NextRequest,
    userId?: string,
    details?: Record<string, any>
  ): Promise<void> {
    const ip = this.getClientIP(request)
    const userAgent = request.headers.get('user-agent') || 'unknown'

    await this.log({
      userId,
      action,
      details: {
        ...details,
        endpoint: request.nextUrl.pathname,
        method: request.method
      },
      severity: action.includes('failed') ? 'high' : 'medium',
      ipAddress: ip,
      userAgent,
      resourceType: 'authentication'
    })
  }

  /**
   * Log data access events (HIPAA requirement)
   */
  static async logDataAccess(
    action: 'view' | 'create' | 'update' | 'delete' | 'export',
    request: NextRequest,
    userId: string,
    resourceType: string,
    resourceId?: string,
    details?: Record<string, any>
  ): Promise<void> {
    const ip = this.getClientIP(request)
    const userAgent = request.headers.get('user-agent') || 'unknown'

    await this.log({
      userId,
      action: `data_${action}`,
      details: {
        ...details,
        endpoint: request.nextUrl.pathname,
        method: request.method
      },
      severity: action === 'delete' ? 'high' : 'medium',
      ipAddress: ip,
      userAgent,
      resourceType,
      resourceId
    })
  }

  /**
   * Log security events
   */
  static async logSecurity(
    action: 'rate_limit_exceeded' | 'invalid_token' | 'unauthorized_access' | 'suspicious_activity',
    request: NextRequest,
    details?: Record<string, any>
  ): Promise<void> {
    const ip = this.getClientIP(request)
    const userAgent = request.headers.get('user-agent') || 'unknown'

    await this.log({
      action: `security_${action}`,
      details: {
        ...details,
        endpoint: request.nextUrl.pathname,
        method: request.method
      },
      severity: 'critical',
      ipAddress: ip,
      userAgent,
      resourceType: 'security'
    })
  }

  /**
   * Log OTP events for compliance
   */
  static async logOTP(
    action: 'generate' | 'send' | 'verify_success' | 'verify_failed' | 'expired',
    userId?: string,
    channel: 'email' | 'sms' = 'email',
    details?: Record<string, any>
  ): Promise<void> {
    await this.log({
      userId,
      action: `otp_${action}`,
      details: {
        ...details,
        channel,
        // Never log the actual OTP code
        otpHash: details?.otpHash ? '[REDACTED]' : undefined
      },
      severity: action.includes('failed') ? 'medium' : 'low',
      resourceType: 'otp_verification'
    })
  }

  /**
   * Query audit logs (for compliance reporting)
   */
  static async queryLogs(filter: AuditLogFilter): Promise<any[]> {
    // TODO: Implement audit log querying from secure storage
    // This would typically query from a dedicated audit database
    // or audit logging service
    
    console.log('[AUDIT_QUERY]', filter)
    return []
  }

  private static getClientIP(request: NextRequest): string {
    return (
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      request.headers.get('cf-connecting-ip') ||
      'unknown'
    )
  }
}

// Audit log middleware for automatic logging
export function withAuditLogging<T extends any[]>(
  action: string,
  resourceType?: string
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: T) {
      const startTime = Date.now()
      let outcome: 'success' | 'failure' = 'success'
      let error: any = null

      try {
        const result = await originalMethod.apply(this, args)
        return result
      } catch (err) {
        outcome = 'failure'
        error = err
        throw err
      } finally {
        const duration = Date.now() - startTime
        
        await AuditLogger.log({
          action: `method_${action}`,
          details: {
            method: propertyKey,
            duration,
            error: error?.message
          },
          severity: outcome === 'failure' ? 'medium' : 'low',
          resourceType,
          outcome
        })
      }
    }

    return descriptor
  }
}
