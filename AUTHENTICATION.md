# Global Authentication System

Your NVHealth Labs application now includes a comprehensive global authentication system that provides seamless authentication across the entire application.

## ✅ **What's Implemented**

### **Core Components**

1. **Global AuthProvider** (`/components/auth-provider.tsx`)
   - Wraps the entire application in the root layout
   - Automatically handles authentication state globally
   - Provides authentication context to all components
   - Handles automatic redirects based on user roles
   - Manages route protection automatically

2. **Enhanced AuthService** (`/lib/auth.ts`)
   - Token management with validation
   - User data storage and retrieval
   - JWT token expiry checking
   - Authentication state management

3. **Protected Route Component** (`/components/protected-route.tsx`)
   - Role-based access control
   - Automatic authentication checks
   - Fallback UI for unauthorized access

4. **Logout Button Component** (`/components/logout-button.tsx`)
   - Integrated with global auth provider
   - Customizable styling and behavior

## 🚀 **Key Features**

### **Automatic Route Protection**
- **Public Routes**: `/`, `/auth/login`, `/auth/register`, `/about`, `/contact`, `/centers`, `/tests`, `/packages`
- **Protected Routes**: All other routes automatically require authentication
- **Role-Based Redirects**: Users are automatically sent to appropriate dashboards

### **Role-Based Access Control**
- **`patient`**: Redirected to `/nvcustomer/dashboard`
- **`center_admin`**: Redirected to `/center/dashboard`
- **`platform_admin`**: Redirected to `/admin/dashboard`

### **Seamless User Experience**
- **Global Loading States**: Consistent loading UI during authentication checks
- **Automatic Redirects**: No manual navigation needed
- **Persistent Authentication**: Login state maintained across browser sessions
- **Token Validation**: Automatic JWT token expiry handling

## 🔧 **How to Use**

### **1. Using the useAuth Hook**

```tsx
"use client"
import { useAuth } from "@/components/auth-provider"

export default function MyComponent() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {isAuthenticated ? (
        <>
          <h1>Welcome, {user?.firstName}!</h1>
          <p>Role: {user?.role}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  )
}
```

### **2. Using the withAuth HOC**

```tsx
import { withAuth } from "@/components/auth-provider"

function AdminComponent() {
  return <div>Admin only content</div>
}

// Protect with authentication only
export default withAuth(AdminComponent)

// Protect with specific roles
export default withAuth(AdminComponent, ['platform_admin'])
```

### **3. Using Protected Routes**

```tsx
import { ProtectedRoute } from "@/components/protected-route"

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={['platform_admin']}>
      <div>Admin dashboard content</div>
    </ProtectedRoute>
  )
}
```

### **4. Using the Logout Button**

```tsx
import { LogoutButton } from "@/components/logout-button"

export default function Header() {
  return (
    <header>
      <h1>My App</h1>
      <LogoutButton variant="outline" size="sm" />
    </header>
  )
}
```

## 📋 **Authentication Flow**

1. **App Initialization**: AuthProvider checks for existing authentication
2. **Token Validation**: JWT tokens are validated for expiry and structure
3. **Route Protection**: Current route is checked against public routes list
4. **Role-Based Redirect**: Authenticated users sent to appropriate dashboard
5. **Global State**: Authentication state available to all components

## 🔐 **Security Features**

- **JWT Token Validation**: Automatic expiry checking and structure validation
- **Secure Token Storage**: Tokens stored in localStorage with proper cleanup
- **Role-Based Access**: Granular permission system for different user types
- **Audit Logging**: All authentication events logged in database
- **Password Security**: bcrypt hashing for secure password storage

## 🎯 **Benefits**

### **For Developers**
- **No Manual Auth Checks**: Authentication handled automatically
- **Consistent Experience**: Same authentication behavior across all pages
- **Easy Integration**: Simple hooks and components for authentication
- **Type Safety**: Full TypeScript support with proper types

### **For Users**
- **Seamless Experience**: No authentication interruptions
- **Fast Loading**: Optimized authentication checks
- **Persistent Sessions**: Stay logged in across browser sessions
- **Role-Appropriate Access**: Automatic redirect to correct dashboard

## 🧪 **Testing**

You can test the authentication system with these demo accounts:

```
Platform Admin:
Email: admin@nvhealth.com
Password: admin123

Center Admin:
Email: center@nvhealth.com  
Password: center123

Patient:
Email: patient@nvhealth.com
Password: patient123
```

## 🔄 **Authentication States**

The global authentication system manages these states:

- **`isLoading`**: Initial authentication check in progress
- **`isAuthenticated`**: User has valid authentication
- **`user`**: Current user data with role and profile information
- **Public Route**: User on route that doesn't require authentication
- **Protected Route**: User on route that requires authentication
- **Role Mismatch**: User doesn't have permission for requested resource

## 🎉 **Result**

Your application now has **seamless global authentication** that:
- ✅ Protects all routes automatically
- ✅ Handles user login/logout seamlessly  
- ✅ Redirects users to appropriate dashboards
- ✅ Provides authentication state globally
- ✅ Manages token validation automatically
- ✅ Offers role-based access control
- ✅ Maintains consistent user experience

The authentication system works completely behind the scenes - users and developers get a smooth, secure experience without any manual authentication management!
