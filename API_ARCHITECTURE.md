# NV Health Labs - API Architecture Documentation

## Overview

This document describes the scalable backend architecture implemented for the NV Health Labs platform, organized within the `/app/api` directory following Next.js App Router patterns.

## Architecture Structure

```
app/api/
├── config/                    # Configuration management
│   ├── constants.ts          # Application constants, enums, messages
│   └── env.ts               # Environment configuration
├── utils/                    # Utility functions
│   ├── errorHandler.ts      # Error handling and response helpers
│   └── jwt.ts              # JWT token utilities
├── models/                   # Database models and utilities
│   └── prisma.ts           # Enhanced Prisma client setup
├── schemas/                  # Validation schemas
│   └── user.schema.ts      # Zod validation schemas
├── middlewares/             # Authentication and authorization
│   ├── auth.middleware.ts  # Authentication middleware
│   └── role.middleware.ts  # Role-based access control
├── services/                # Business logic layer
│   ├── auth.service.ts     # Authentication business logic
│   └── user.service.ts     # User management business logic
├── controllers/             # Request/response handling
│   ├── auth.controller.ts  # Authentication controllers
│   └── user.controller.ts  # User management controllers
└── [routes]/               # API endpoints
    ├── auth/
    │   ├── login/route.ts
    │   └── register/route.ts
    ├── users/
    │   ├── route.ts          # GET /api/users (list), POST /api/users (create)
    │   ├── me/route.ts       # GET/PUT /api/users/me (current user)
    │   ├── search/route.ts   # GET /api/users/search
    │   ├── stats/route.ts    # GET /api/users/stats
    │   └── [id]/
    │       ├── route.ts      # GET/PUT/DELETE /api/users/:id
    │       ├── verify/route.ts    # POST /api/users/:id/verify
    │       └── status/route.ts    # PUT /api/users/:id/status
    ├── centers/route.ts      # Center management
    └── tests/route.ts        # Test catalog management
```

## Core Components

### 1. Configuration (`/app/api/config/`)

**env.ts**: Environment configuration with validation
- JWT secrets and expiration
- Database connection strings
- Server configuration
- Rate limiting settings

**constants.ts**: Application-wide constants
- User roles enum
- HTTP status codes
- Success/error messages
- Validation constants

### 2. Utilities (`/app/api/utils/`)

**jwt.ts**: JWT token management
- Token generation with role-based claims
- Token verification and payload extraction
- Refresh token handling
- Security event logging

**errorHandler.ts**: Centralized error handling
- Custom error classes (AppError, ValidationError, etc.)
- Response helpers for success/error responses
- Async error wrapper for controllers
- Structured logging

### 3. Models (`/app/api/models/`)

**prisma.ts**: Enhanced database client
- Connection pooling and management
- Transaction helpers
- Database health checks
- Graceful shutdown handling
- Query logging and monitoring

### 4. Schemas (`/app/api/schemas/`)

**user.schema.ts**: Zod validation schemas
- User registration/login validation
- Profile update schemas
- Admin user management schemas
- Query parameter validation

### 5. Middlewares (`/app/api/middlewares/`)

**auth.middleware.ts**: Authentication middleware
- JWT token verification
- User context extraction
- Security event logging
- Rate limiting integration

**role.middleware.ts**: Authorization middleware
- Role-based access control
- Permission checking
- Admin/center admin restrictions
- Audit trail logging

### 6. Services (`/app/api/services/`)

**auth.service.ts**: Authentication business logic
- User login with credential validation
- User registration with email verification
- Password hashing and validation
- Demo user management

**user.service.ts**: User management business logic
- CRUD operations for users
- User profile management
- Admin user operations
- Search and filtering

### 7. Controllers (`/app/api/controllers/`)

**auth.controller.ts**: Authentication request handlers
- Login endpoint with rate limiting
- Registration endpoint with validation
- Token refresh handling
- Logout functionality

**user.controller.ts**: User management request handlers
- Current user profile operations
- Admin user management
- User search and statistics
- Bulk operations

## Authentication & Authorization

### Role-Based Access Control

Three user roles are supported:
- **patient**: Basic user access
- **center_admin**: Manage center-specific data
- **platform_admin**: Full system access

### JWT Token Structure
```json
{
  "userId": "user-id",
  "email": "user@example.com",
  "role": "patient|center_admin|platform_admin",
  "isVerified": true,
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Demo Authentication

For development and testing, demo users are available:

```typescript
// Demo Users
const DEMO_USERS = {
  'demo@patient.com': { role: 'patient', password: 'demo123' },
  'demo@center.com': { role: 'center_admin', password: 'demo123' },
  'demo@admin.com': { role: 'platform_admin', password: 'demo123' }
}
```

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### User Management Endpoints

- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile
- `GET /api/users` - List users (Admin only)
- `GET /api/users/search?q=term` - Search users (Admin only)
- `GET /api/users/stats` - User statistics (Admin only)
- `GET /api/users/:id` - Get user by ID (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)
- `POST /api/users/:id/verify` - Verify user (Admin only)
- `PUT /api/users/:id/status` - Update user status (Admin only)

### Centers & Tests Endpoints

- `GET /api/centers` - List diagnostic centers
- `GET /api/tests` - List available tests

## Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {},
  "timestamp": "2025-08-07T12:00:00Z"
}
```

### Custom Error Classes
- `AppError`: Base error class
- `ValidationError`: Input validation errors
- `UnauthorizedError`: Authentication failures
- `ForbiddenError`: Authorization failures
- `NotFoundError`: Resource not found
- `ConflictError`: Resource conflicts

## Security Features

### Security Measures
- JWT token authentication
- Role-based access control
- Password hashing with bcryptjs
- Rate limiting on sensitive endpoints
- Input validation with Zod
- SQL injection prevention with Prisma
- Security event logging
- CORS protection

### Security Events Logged
- Login attempts (success/failure)
- Registration attempts
- Admin actions on users
- Token refresh events
- Unauthorized access attempts

## Database Integration

### Prisma ORM Features
- Type-safe database queries
- Connection pooling
- Transaction support
- Migration management
- Query optimization

### Example Service Usage
```typescript
// User Service Example
export class UserService {
  static async createUser(userData: CreateUserData) {
    const hashedPassword = await bcrypt.hash(userData.password, 12)
    
    return await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        isActive: true,
        isVerified: false
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true
      }
    })
  }
}
```

## Deployment Considerations

### Environment Variables
```bash
# Database
DATABASE_URL="postgresql://..."

# JWT Configuration  
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN="24h"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_REFRESH_EXPIRES_IN="7d"

# Application
NODE_ENV="production"
API_BASE_URL="https://your-domain.com/api"

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000
```

### Performance Optimization
- Connection pooling configuration
- Query optimization with Prisma
- Response caching strategies
- Database indexing
- API rate limiting

### Monitoring & Logging
- Structured logging with timestamps
- Security event tracking  
- Error logging and alerting
- Performance metrics
- Health check endpoints

## Development Workflow

### Adding New Endpoints

1. **Create Schema** (`/schemas/`): Define validation schemas
2. **Add Service Logic** (`/services/`): Implement business logic
3. **Create Controller** (`/controllers/`): Handle requests/responses
4. **Add Route** (`/[route]/route.ts`): Connect HTTP methods to controllers
5. **Add Tests**: Unit and integration tests
6. **Update Documentation**: API documentation

### Testing Strategy
- Unit tests for services and utilities
- Integration tests for API endpoints
- Authentication flow testing
- Role-based access testing
- Error handling validation

## Migration Guide

### From Previous Architecture
1. Update import statements to use new utility locations
2. Replace direct Prisma usage with service layer
3. Update error handling to use ResponseHelper
4. Implement role-based middleware
5. Update environment configuration

## Best Practices

### Code Organization
- Separate concerns by layer (service/controller/route)
- Use TypeScript for type safety
- Implement proper error boundaries
- Follow RESTful API design principles
- Use consistent naming conventions

### Security Best Practices
- Never expose sensitive data in responses
- Always validate input data
- Use proper HTTP status codes
- Implement proper CORS policies
- Log security-relevant events
- Use environment variables for secrets

### Performance Best Practices  
- Use database transactions appropriately
- Implement proper pagination
- Cache frequently accessed data
- Optimize database queries
- Use compression for API responses

This architecture provides a solid foundation for a scalable, secure, and maintainable healthcare platform API.
