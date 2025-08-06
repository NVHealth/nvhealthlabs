"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { AuthService, AuthUser } from '@/lib/auth'

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (userData: AuthUser, token: string) => void
  logout: () => void
  checkAuth: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/auth/login',
  '/auth/register',
  '/about',
  '/contact',
  '/centers',
  '/tests',
  '/packages'
]

// Define role-based redirect routes
const ROLE_REDIRECTS = {
  patient: '/nvcustomer/dashboard',
  center_admin: '/center/dashboard',
  platform_admin: '/admin/dashboard'
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const isAuthenticated = !!user

  // Check if current route is public
  const isPublicRoute = (path: string) => {
    return PUBLIC_ROUTES.some(route => {
      if (route === '/') return path === '/'
      return path.startsWith(route)
    })
  }

  // Get redirect path based on user role
  const getRoleRedirectPath = (userRole: string) => {
    return ROLE_REDIRECTS[userRole as keyof typeof ROLE_REDIRECTS] || '/nvcustomer/dashboard'
  }

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = AuthService.getToken()
        const userData = AuthService.getUser()

        if (token && userData && AuthService.isValidToken(token)) {
          setUser(userData)
          
          // If user is on login/register page and authenticated, redirect to dashboard
          if (pathname === '/auth/login' || pathname === '/auth/register') {
            const redirectPath = getRoleRedirectPath(userData.role)
            router.replace(redirectPath)
            return
          }
        } else {
          // Clear invalid auth data
          AuthService.clearAuth()
          setUser(null)
          
          // If on protected route, redirect to login
          if (!isPublicRoute(pathname)) {
            router.replace('/auth/login')
            return
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        AuthService.clearAuth()
        setUser(null)
        
        if (!isPublicRoute(pathname)) {
          router.replace('/auth/login')
        }
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [pathname, router])

  // Route protection effect
  useEffect(() => {
    if (isLoading) return

    // If user is authenticated but on auth pages, redirect to dashboard
    if (isAuthenticated && (pathname === '/auth/login' || pathname === '/auth/register')) {
      const redirectPath = getRoleRedirectPath(user.role)
      router.replace(redirectPath)
      return
    }

    // If user is not authenticated and on protected route, redirect to login
    if (!isAuthenticated && !isPublicRoute(pathname)) {
      router.replace('/auth/login')
      return
    }
  }, [isAuthenticated, isLoading, pathname, router, user])

  const login = (userData: AuthUser, token: string) => {
    AuthService.setToken(token)
    AuthService.setUser(userData)
    setUser(userData)
    
    // Redirect to appropriate dashboard based on role
    const redirectPath = getRoleRedirectPath(userData.role)
    router.replace(redirectPath)
  }

  const logout = () => {
    AuthService.clearAuth()
    setUser(null)
    router.replace('/auth/login')
  }

  const checkAuth = () => {
    const token = AuthService.getToken()
    const userData = AuthService.getUser()
    return !!(token && userData && AuthService.isValidToken(token))
  }

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-primary-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Higher-order component for protecting pages
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles?: string[]
) {
  return function AuthenticatedComponent(props: P) {
    const { user, isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
      return (
        <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      )
    }

    if (!isAuthenticated) {
      return null // AuthProvider will handle redirect
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      return (
        <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary-700 mb-4">Access Denied</h1>
            <p className="text-primary-500">You don't have permission to access this page.</p>
          </div>
        </div>
      )
    }

    return <WrappedComponent {...props} />
  }
}
