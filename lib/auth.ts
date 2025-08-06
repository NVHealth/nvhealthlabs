// Authentication utility functions
export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  isVerified: boolean
  isActive: boolean
  twoFactorEnabled?: boolean
}

export class AuthService {
  // Get stored token
  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken')
    }
    return null
  }

  // Set token
  static setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token)
    }
  }

  // Get stored user
  static getUser(): AuthUser | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user')
      return userStr ? JSON.parse(userStr) : null
    }
    return null
  }

  // Set user data
  static setUser(user: AuthUser): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user))
    }
  }

  // Check if token is valid (basic check for JWT structure and expiry)
  static isValidToken(token: string): boolean {
    if (!token) return false
    
    try {
      // Basic JWT structure check (header.payload.signature)
      const parts = token.split('.')
      if (parts.length !== 3) return false
      
      // Decode payload to check expiry
      const payload = JSON.parse(atob(parts[1]))
      const now = Math.floor(Date.now() / 1000)
      
      // Check if token is expired
      if (payload.exp && payload.exp < now) return false
      
      return true
    } catch (error) {
      return false
    }
  }

  // Clear all auth data
  static clearAuth(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const token = this.getToken()
    const user = this.getUser()
    return !!(token && user && this.isValidToken(token))
  }

  // Logout user
  static logout(): void {
    this.clearAuth()
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login'
    }
  }

  // Get authorization header for API calls
  static getAuthHeader(): Record<string, string> {
    const token = this.getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  // Check if user has specific role
  static hasRole(role: string): boolean {
    const user = this.getUser()
    return user?.role === role
  }

  // Check if user has any of the specified roles
  static hasAnyRole(roles: string[]): boolean {
    const user = this.getUser()
    return user ? roles.includes(user.role) : false
  }

  // Get dashboard URL based on user role
  static getDashboardUrl(role: string): string {
    switch (role) {
      case "patient":
      case "nvcustomer":
        return "/nvcustomer/dashboard"
      case "platform_admin":
        return "/admin/dashboard"
      case "center_admin":
        return "/center/dashboard"
      default:
        return "/"
    }
  }
}

// Custom hook for authentication
export function useAuth() {
  if (typeof window === 'undefined') {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      logout: () => {},
      hasRole: () => false,
      hasAnyRole: () => false
    }
  }

  return {
    user: AuthService.getUser(),
    token: AuthService.getToken(),
    isAuthenticated: AuthService.isAuthenticated(),
    logout: AuthService.logout,
    hasRole: AuthService.hasRole,
    hasAnyRole: AuthService.hasAnyRole
  }
}
