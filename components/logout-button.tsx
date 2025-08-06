"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useAuth } from "./auth-provider"

interface LogoutButtonProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  showIcon?: boolean
  className?: string
}

export function LogoutButton({ 
  variant = "outline", 
  size = "default", 
  showIcon = true,
  className = ""
}: LogoutButtonProps) {
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      className={className}
    >
      {showIcon && <LogOut className="w-4 h-4 mr-2" />}
      Logout
    </Button>
  )
}
