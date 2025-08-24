interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  blockDurationMs?: number
}

interface RateLimitEntry {
  count: number
  resetTime: number
  blocked?: number
}

export class RateLimiter {
  private store = new Map<string, RateLimitEntry>()
  private cleanupInterval: NodeJS.Timeout

  // Default rate limit configurations
  private static readonly CONFIGS: Record<string, RateLimitConfig> = {
    // Authentication endpoints
    login: { windowMs: 15 * 60 * 1000, maxRequests: 5, blockDurationMs: 30 * 60 * 1000 },
    register: { windowMs: 60 * 60 * 1000, maxRequests: 3 },
    otp_request: { windowMs: 60 * 60 * 1000, maxRequests: 5 },
    otp_verify: { windowMs: 15 * 60 * 1000, maxRequests: 5, blockDurationMs: 15 * 60 * 1000 },
    password_reset: { windowMs: 60 * 60 * 1000, maxRequests: 3 },
    
    // API endpoints
    api_general: { windowMs: 15 * 60 * 1000, maxRequests: 1000 },
    api_sensitive: { windowMs: 15 * 60 * 1000, maxRequests: 100 },
    
    // File uploads
    file_upload: { windowMs: 60 * 60 * 1000, maxRequests: 20 },
    
    // Global per IP
    global: { windowMs: 15 * 60 * 1000, maxRequests: 2000 }
  }

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 5 * 60 * 1000)
  }

  /**
   * Check if request is within rate limits
   * @param limitType - Type of rate limit to apply
   * @param identifier - Unique identifier (usually IP address)
   * @param customConfig - Optional custom rate limit configuration
   */
  async checkLimit(
    limitType: string,
    identifier: string,
    customConfig?: RateLimitConfig
  ): Promise<void> {
    const config = customConfig || RateLimiter.CONFIGS[limitType] || RateLimiter.CONFIGS.api_general
    const key = `${limitType}:${identifier}`
    const now = Date.now()
    
    let entry = this.store.get(key)
    
    // Check if currently blocked
    if (entry?.blocked && entry.blocked > now) {
      const remainingMs = entry.blocked - now
      throw new RateLimitError(
        `Rate limit exceeded. Blocked for ${Math.ceil(remainingMs / 1000)} more seconds.`,
        remainingMs
      )
    }
    
    // Initialize or reset if window expired
    if (!entry || entry.resetTime <= now) {
      entry = {
        count: 0,
        resetTime: now + config.windowMs
      }
    }
    
    // Check if limit exceeded
    if (entry.count >= config.maxRequests) {
      // Apply blocking if configured
      if (config.blockDurationMs) {
        entry.blocked = now + config.blockDurationMs
      }
      
      this.store.set(key, entry)
      
      const resetInSeconds = Math.ceil((entry.resetTime - now) / 1000)
      throw new RateLimitError(
        `Rate limit exceeded. Try again in ${resetInSeconds} seconds.`,
        entry.resetTime - now,
        {
          limit: config.maxRequests,
          remaining: 0,
          resetTime: new Date(entry.resetTime).toISOString()
        }
      )
    }
    
    // Increment counter
    entry.count++
    this.store.set(key, entry)
  }

  /**
   * Get current rate limit status
   * @param limitType - Type of rate limit
   * @param identifier - Unique identifier
   */
  getStatus(limitType: string, identifier: string): {
    limit: number
    remaining: number
    resetTime: string
    blocked: boolean
  } {
    const config = RateLimiter.CONFIGS[limitType] || RateLimiter.CONFIGS.api_general
    const key = `${limitType}:${identifier}`
    const entry = this.store.get(key)
    const now = Date.now()
    
    if (!entry || entry.resetTime <= now) {
      return {
        limit: config.maxRequests,
        remaining: config.maxRequests,
        resetTime: new Date(now + config.windowMs).toISOString(),
        blocked: false
      }
    }
    
    return {
      limit: config.maxRequests,
      remaining: Math.max(0, config.maxRequests - entry.count),
      resetTime: new Date(entry.resetTime).toISOString(),
      blocked: entry.blocked ? entry.blocked > now : false
    }
  }

  /**
   * Manually block an identifier
   * @param limitType - Type of rate limit
   * @param identifier - Unique identifier
   * @param durationMs - Block duration in milliseconds
   */
  block(limitType: string, identifier: string, durationMs: number): void {
    const key = `${limitType}:${identifier}`
    const now = Date.now()
    
    const entry = this.store.get(key) || {
      count: 0,
      resetTime: now + 15 * 60 * 1000 // 15 minutes default
    }
    
    entry.blocked = now + durationMs
    this.store.set(key, entry)
  }

  /**
   * Reset rate limit for an identifier
   * @param limitType - Type of rate limit
   * @param identifier - Unique identifier
   */
  reset(limitType: string, identifier: string): void {
    const key = `${limitType}:${identifier}`
    this.store.delete(key)
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now()
    
    for (const [key, entry] of this.store.entries()) {
      // Remove if reset time passed and not blocked, or if block expired
      if (entry.resetTime <= now && (!entry.blocked || entry.blocked <= now)) {
        this.store.delete(key)
      }
    }
  }

  /**
   * Get statistics about rate limiting
   */
  getStats(): {
    totalEntries: number
    blockedEntries: number
    activeEntries: number
  } {
    const now = Date.now()
    let blocked = 0
    let active = 0
    
    for (const entry of this.store.values()) {
      if (entry.blocked && entry.blocked > now) {
        blocked++
      }
      if (entry.resetTime > now) {
        active++
      }
    }
    
    return {
      totalEntries: this.store.size,
      blockedEntries: blocked,
      activeEntries: active
    }
  }

  /**
   * Destroy the rate limiter and clean up resources
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
    this.store.clear()
  }
}

export class RateLimitError extends Error {
  constructor(
    message: string,
    public retryAfterMs: number,
    public details?: {
      limit: number
      remaining: number
      resetTime: string
    }
  ) {
    super(message)
    this.name = 'RateLimitError'
  }
}

// Helper function for API routes to add rate limiting
export function withRateLimit(
  limitType: string,
  customConfig?: RateLimitConfig
) {
  return function (
    handler: (request: Request) => Promise<Response>
  ) {
    const rateLimiter = new RateLimiter()
    
    return async (request: Request): Promise<Response> => {
      try {
        // Extract IP address for rate limiting
        const forwarded = request.headers.get('x-forwarded-for')
        const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
        
        await rateLimiter.checkLimit(limitType, ip, customConfig)
        
        return await handler(request)
      } catch (error) {
        if (error instanceof RateLimitError) {
          return new Response(
            JSON.stringify({
              error: error.message,
              code: 'RATE_LIMIT_EXCEEDED',
              retryAfter: Math.ceil(error.retryAfterMs / 1000),
              details: error.details
            }),
            {
              status: 429,
              headers: {
                'Content-Type': 'application/json',
                'Retry-After': Math.ceil(error.retryAfterMs / 1000).toString(),
                'X-RateLimit-Limit': error.details?.limit.toString() || '0',
                'X-RateLimit-Remaining': error.details?.remaining.toString() || '0',
                'X-RateLimit-Reset': error.details?.resetTime || ''
              }
            }
          )
        }
        throw error
      }
    }
  }
}
