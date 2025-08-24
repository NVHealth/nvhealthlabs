import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { JWT_CONFIG } from '../config/constants'

export interface JWTPayload {
  userId: string
  email: string
  role: string
  centerId?: string
}

export interface JWTOptions {
  expiresIn?: string
  audience?: string
  issuer?: string
}

export class JWTUtils {
  /**
   * Generate JWT token
   */
  static generateToken(payload: JWTPayload, options: JWTOptions = {}): string {
    const defaultOptions: jwt.SignOptions = {
      expiresIn: options.expiresIn || env.JWT_EXPIRES_IN,
      algorithm: JWT_CONFIG.ALGORITHM,
      issuer: options.issuer || JWT_CONFIG.ISSUER,
      audience: options.audience || JWT_CONFIG.AUDIENCE,
    } as jwt.SignOptions

    return jwt.sign(payload, env.JWT_SECRET, defaultOptions)
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token: string): JWTPayload {
    try {
      const payload = jwt.verify(token, env.JWT_SECRET, {
        algorithms: [JWT_CONFIG.ALGORITHM],
        issuer: JWT_CONFIG.ISSUER,
        audience: JWT_CONFIG.AUDIENCE,
      }) as JWTPayload

      return payload
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token has expired')
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token')
      }
      throw new Error('Token verification failed')
    }
  }

  /**
   * Decode JWT token without verification (for debugging)
   */
  static decodeToken(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload
    } catch {
      return null
    }
  }

  /**
   * Extract token from Authorization header
   */
  static extractTokenFromHeader(authHeader: string | null): string | null {
    if (!authHeader) return null
    
    const parts = authHeader.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null
    }
    
    return parts[1]
  }

  /**
   * Generate refresh token
   */
  static generateRefreshToken(payload: Omit<JWTPayload, 'exp'>): string {
    return this.generateToken(payload, {
      expiresIn: '7d', // Refresh tokens last longer
    })
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeToken(token)
      if (!decoded || typeof decoded !== 'object' || !('exp' in decoded)) {
        return true
      }
      
      const exp = decoded.exp as number
      return Date.now() >= exp * 1000
    } catch {
      return true
    }
  }
}
