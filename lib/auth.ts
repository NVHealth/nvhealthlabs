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

  // Get stored user
  static getUser(): AuthUser | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user')
      return userStr ? JSON.parse(userStr) : null
    }
    return null
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUser()
  }

  // Logout user
  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
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
