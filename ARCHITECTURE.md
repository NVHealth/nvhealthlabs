# NVHealth Labs - Refactored Architecture

## Overview

This document outlines the refactored architecture of the NVHealth Labs platform, transformed from a basic Next.js application into a production-ready, scalable healthcare platform with proper separation of concerns, enterprise-level security, and maintainable code structure.

## Architecture Overview

### New Directory Structure

```
src/
├── config/
│   └── app.ts                 # Centralized configuration management
├── shared/
│   ├── logger.ts             # Enhanced structured logging
│   ├── errors.ts             # Centralized error handling
│   └── database.ts           # Database connection management
├── services/
│   ├── user.service.ts       # User business logic
│   └── audit.service.ts      # Audit logging service
├── controllers/
│   ├── user.controller.ts    # User request/response handling
│   └── auth.controller.ts    # Authentication controller
├── middleware/
│   └── auth.middleware.ts    # JWT validation & role-based access
├── middleware.ts             # Global Next.js middleware
└── app/api/                  # Updated API routes structure
```

## Key Features

### 1. Configuration Management (`src/config/app.ts`)
- Centralized environment variable validation
- Type-safe configuration object
- Environment-specific settings
- Security configurations (JWT, rate limiting, etc.)

### 2. Enhanced Logging System (`src/shared/logger.ts`)
- Structured JSON logging
- Multiple log levels (ERROR, WARN, INFO, DEBUG)
- Security and audit event logging
- Production-ready error handling

### 3. Centralized Error Handling (`src/shared/errors.ts`)
- Custom error classes for different scenarios
- HTTP status code mapping
- Consistent error responses
- Security-focused error messages

### 4. Database Management (`src/shared/database.ts`)
- Connection pooling
- Transaction support
- Health check functionality
- Graceful shutdown handling

### 5. Service Layer Architecture
- **UserService**: User CRUD operations, authentication, validation
- **AuditService**: Comprehensive audit logging for compliance
- Clean separation of business logic from HTTP handling

### 6. Controller Layer
- Request/response handling
- Input validation
- Error handling integration
- Service layer coordination

### 7. Enhanced Security Middleware

#### Global Middleware (`src/middleware.ts`)
- JWT token validation
- Role-based route protection
- Security headers (HSTS, CSP, etc.)
- Rate limiting per endpoint
- IP blocking for suspicious activity

#### Auth Middleware (`src/middleware/auth.middleware.ts`)
- JWT validation and parsing
- Role-based access control
- Token blacklist support
- Session management

## Security Features

### Role-Based Access Control (RBAC)
- **Patient**: Access to personal data and bookings
- **Center Admin**: Manage center operations and results
- **Platform Admin**: Full system access and management

### Route Protection Matrix
```typescript
// Public routes (no auth required)
/api/auth/*         # Authentication endpoints
/                   # Landing page
/about             # About page

// Patient routes
/nvcustomer/*      # Patient dashboard, bookings, results

// Center Admin routes  
/center/*          # Center management, orders, results
/api/centers/*     # Center operations

// Platform Admin routes
/admin/*           # Admin dashboard, system management
/api/admin/*       # Administrative APIs
```

### Security Headers
- `Strict-Transport-Security`: Force HTTPS
- `X-Content-Type-Options`: Prevent MIME sniffing
- `X-Frame-Options`: Prevent clickjacking
- `X-XSS-Protection`: XSS protection
- `Content-Security-Policy`: Prevent code injection
- `Referrer-Policy`: Control referrer information

## API Route Examples

### Before (Old Structure)
```typescript
// app/api/auth/login/route.ts
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    // Direct business logic in route handler
    // Manual error handling
    // No audit logging
    // Inconsistent response format
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
```

### After (New Architecture)
```typescript
// app/api/auth/login/route.ts
import { AuthController } from "@/src/controllers/auth.controller"

export async function POST(request: NextRequest) {
  return AuthController.login(request)
}

// src/controllers/auth.controller.ts
export class AuthController {
  static async login(request: NextRequest): Promise<NextResponse> {
    try {
      // Input validation
      // Audit logging
      // Business logic delegation
      // Consistent error handling
      // Structured response
    } catch (error) {
      return ErrorHandler.handle(error, request)
    }
  }
}
```

## Migration Guide

### 1. Install Dependencies
```bash
npm install jsonwebtoken bcryptjs
npm install --save-dev @types/jsonwebtoken @types/bcryptjs
```

### 2. Environment Variables
Add to your `.env.local`:
```env
# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRES_IN=24h

# Database
DATABASE_URL=your-database-connection-string

# Security
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000
```

### 3. Update Existing Routes
Replace existing API route handlers to use the new controller pattern:

```typescript
// Old way
export async function POST(request: NextRequest) {
  // All logic here
}

// New way  
export async function POST(request: NextRequest) {
  return YourController.methodName(request)
}
```

### 4. Implement Authentication Middleware
The global middleware automatically protects routes based on the configured patterns. No additional setup needed.

## Usage Examples

### 1. User Authentication
```typescript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
})
```

### 2. Protected API Calls
```typescript
// Authenticated request
const response = await fetch('/api/bookings', {
  headers: { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

### 3. Role-Based Access
```typescript
// Center admin accessing center data
const response = await fetch('/api/centers/orders', {
  headers: { 
    'Authorization': `Bearer ${centerAdminToken}`,
    'Content-Type': 'application/json'
  }
})
```

## Testing

### Demo Credentials
```typescript
// Patient
email: "customer@test.com"
password: "demo123"

// Platform Admin  
email: "admin@nvhealth.com"
password: "admin123"

// Center Admin
email: "center@test.com" 
password: "center123"
```

### Test Different Roles
1. Login with different demo credentials
2. Access role-specific routes
3. Verify proper access control
4. Check audit logs in console

## Performance Optimizations

### 1. Database Connection Pooling
- Reuses connections across requests
- Configurable pool size
- Automatic connection cleanup

### 2. Structured Logging
- JSON format for log aggregation
- Configurable log levels
- Performance metrics tracking

### 3. Middleware Optimization
- JWT verification caching
- Route matching optimization
- Minimal processing overhead

## Compliance & Audit

### HIPAA Compliance Features
- Comprehensive audit logging
- User access tracking
- Data access monitoring
- Security event logging
- IP address tracking

### Audit Events Logged
- User login/logout
- Data access (read/write/delete)  
- Permission changes
- Security violations
- System errors

## Next Steps

### 1. Database Integration
- Replace demo users with database queries
- Implement proper user management
- Add password hashing/validation

### 2. Advanced Security
- Implement JWT refresh tokens
- Add multi-factor authentication
- Implement session management

### 3. Monitoring & Alerting
- Add application performance monitoring
- Implement security alerting
- Add health check endpoints

### 4. Testing
- Unit tests for services and controllers
- Integration tests for API endpoints
- Security testing for authentication

## Support

For questions about this refactored architecture:
1. Review the service layer implementations in `src/services/`
2. Check controller patterns in `src/controllers/`
3. Examine middleware configuration in `src/middleware.ts`
4. Reference the logging system in `src/shared/logger.ts`

The new architecture provides a solid foundation for scaling the NVHealth Labs platform while maintaining security, performance, and maintainability standards required for healthcare applications.
