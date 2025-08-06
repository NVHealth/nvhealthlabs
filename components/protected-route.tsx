"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/lib/auth"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: string[]
  redirectTo?: string
}

export function ProtectedRoute({ 
  children, 
  requiredRoles = [], 
  redirectTo = "/auth/login" 
}: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      // Check if user is authenticated
      if (!AuthService.isAuthenticated()) {
        router.push(redirectTo)
        return
      }

      // Check if user has required roles (if specified)
      if (requiredRoles.length > 0) {
        if (!AuthService.hasAnyRole(requiredRoles)) {
          // Redirect to appropriate dashboard based on user's actual role
          const user = AuthService.getUser()
          if (user) {
            const dashboardUrl = AuthService.getDashboardUrl(user.role)
            router.push(dashboardUrl)
            return
          }
        }
      }

      setIsAuthorized(true)
      setIsLoading(false)
    }

    checkAuth()
  }, [router, requiredRoles, redirectTo])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
