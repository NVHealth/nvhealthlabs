# NVHealth Labs - Production Security Architecture

## 🔒 **HIPAA-Compliant Security Implementation**

This document outlines the comprehensive security architecture implemented for NVHealth Labs, ensuring HIPAA compliance, robust authentication, and production-ready security measures.

## 📋 **Security Components Overview**

### 1. **Authentication & Authorization**
- **JWT-based authentication** with secure token generation
- **Role-based access control (RBAC)** with three roles:
  - `patient` - Access to personal health data only
  - `center_admin` - Manage diagnostic center operations
  - `platform_admin` - System-wide administrative access
- **Secure OTP verification** for email verification and 2FA
- **Rate limiting** on authentication endpoints
- **Account lockout** after failed attempts

### 2. **Audit Logging (HIPAA Compliance)**
- **Comprehensive audit trails** for all data access and modifications
- **User authentication logging** (login attempts, successes, failures)
- **Data access logging** (view, create, update, delete operations)
- **Security event logging** (suspicious activities, rate limit violations)
- **OTP operation logging** with PII protection
- **Tamper-proof logging** design for compliance

### 3. **Rate Limiting & DDoS Protection**
- **Per-endpoint rate limiting** with different thresholds
- **IP-based blocking** for suspicious activities
- **Progressive penalties** for repeated violations
- **Configurable limits** for different operation types

### 4. **Data Protection**
- **Field-level encryption** for sensitive data
- **Secure password hashing** using bcrypt with high cost factor
- **OTP secure generation** using cryptographically secure random numbers
- **PII masking** in logs and error messages

## 🏗️ **Architecture Components**

### **Core Security Files**

```
lib/security/
├── auth-middleware.ts        # Authentication & authorization middleware
├── rate-limiter.ts          # Rate limiting implementation
└── secure-otp-service.ts    # Secure OTP generation and verification

lib/audit/
└── audit-logger.ts          # Comprehensive audit logging

lib/config/
└── security-config.ts       # Security configuration and validation

middleware.ts                 # Security headers and CSP
```

## 🔧 **Implementation Examples**

### **1. Protecting API Routes with RBAC**

```typescript
import { AuthMiddleware, requirePlatformAdmin } from '@/lib/security/auth-middleware'

// Platform admin only endpoint
export const GET = AuthMiddleware.withAuth(async (request, user) => {
  // Your business logic here
  // user object contains authenticated user data
  return Response.json({ data: "admin data" })
}, requirePlatformAdmin())

// Patient only endpoint
export const GET = AuthMiddleware.withAuth(async (request, user) => {
  // Patients can only access their own data
  const patientData = await getPatientData(user.id)
  return Response.json(patientData)
}, requirePatient())
```

### **2. Secure OTP Implementation**

```typescript
import { SecureOTPService } from '@/lib/security/secure-otp-service'

// Send OTP
const result = await SecureOTPService.generateAndSend(
  userId, 
  email, 
  'email_verification'
)

// Verify OTP
const verification = await SecureOTPService.verifyOTP(
  email, 
  otpCode, 
  'email_verification'
)
```

### **3. Audit Logging**

```typescript
import { AuditLogger } from '@/lib/audit/audit-logger'

// Log data access (HIPAA requirement)
await AuditLogger.logDataAccess(
  'view', 
  request, 
  userId, 
  'patient_records', 
  recordId
)

// Log authentication events
await AuditLogger.logAuth('login_success', request, userId)

// Log security events
await AuditLogger.logSecurity('suspicious_activity', request, details)
```

## 🛡️ **Security Features**

### **Authentication Security**
- ✅ Secure JWT token generation with configurable expiration
- ✅ Password hashing with bcrypt (12 rounds minimum)
- ✅ Account lockout after failed attempts
- ✅ Session timeout management
- ✅ Multi-factor authentication support (OTP)

### **Authorization Security**
- ✅ Role-based access control (RBAC)
- ✅ Resource-level permissions
- ✅ Principle of least privilege
- ✅ Server-side authorization enforcement

### **Data Protection**
- ✅ PII masking in logs
- ✅ Sensitive data field exclusion
- ✅ Secure random OTP generation
- ✅ Input validation and sanitization

### **Network Security**
- ✅ Rate limiting per endpoint and IP
- ✅ Security headers (CSP, HSTS, etc.)
- ✅ CORS policy enforcement
- ✅ Request size limits

### **HIPAA Compliance**
- ✅ Comprehensive audit logging
- ✅ Data access tracking
- ✅ User authentication logging
- ✅ 7-year log retention support
- ✅ Tamper-proof logging design

## ⚙️ **Configuration**

### **Environment Variables Required**

```bash
# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# JWT Security
JWT_SECRET=your-32-character-minimum-secret
JWT_EXPIRES_IN=24h

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
EMAIL_FROM=noreply@nvhealthlabs.com

# Security Settings
BCRYPT_SALT_ROUNDS=12
OTP_EXPIRY_MINUTES=30
MAX_LOGIN_ATTEMPTS=5
```

### **Production Security Checklist**

- [ ] **Environment Variables**: All secrets properly configured
- [ ] **SSL/HTTPS**: Enforced in production
- [ ] **Database Security**: SSL connections, restricted access
- [ ] **Rate Limiting**: Enabled on all endpoints
- [ ] **Audit Logging**: Configured with external storage
- [ ] **Monitoring**: Security event alerting setup
- [ ] **Backup**: Encrypted backups with secure storage
- [ ] **Access Control**: Principle of least privilege applied

## 📊 **Monitoring & Alerting**

### **Critical Security Events to Monitor**
1. **Multiple failed login attempts** from same IP
2. **Rate limit violations** (potential DDoS)
3. **Unauthorized access attempts** to admin endpoints
4. **Suspicious data access patterns**
5. **OTP generation/verification failures**
6. **System errors** in authentication flow

### **HIPAA Audit Requirements**
- **User access logs** (who accessed what, when)
- **Data modification logs** (what was changed, by whom)
- **System access logs** (login/logout events)
- **Failed access attempts** (security incidents)
- **Administrative actions** (user management, system changes)

## 🚀 **Deployment Considerations**

### **Production Hardening**
1. **Secrets Management**: Use proper secret management (AWS Secrets Manager, Azure Key Vault)
2. **Database Security**: Enable SSL, restrict network access, use connection pooling
3. **Monitoring**: Implement real-time security monitoring and alerting
4. **Backup Strategy**: Encrypted backups with tested recovery procedures
5. **Network Security**: WAF, DDoS protection, IP whitelisting where appropriate
6. **Compliance**: Regular security audits, penetration testing, compliance reporting

### **Scaling Considerations**
- **Rate Limiting**: Consider Redis for distributed rate limiting
- **Audit Logs**: Use dedicated audit logging service for high volume
- **Session Management**: Implement distributed session storage
- **Load Balancing**: Ensure session affinity for stateful operations

## 🔍 **Testing Security Implementation**

### **Test Scenarios**
1. **Authentication**: Valid/invalid credentials, account lockout
2. **Authorization**: Role-based access, unauthorized endpoint access
3. **Rate Limiting**: Endpoint limits, IP-based limiting
4. **OTP Security**: Generation, verification, expiration, max attempts
5. **Audit Logging**: Verify all security events are logged
6. **Input Validation**: SQL injection, XSS, malformed requests

## 📝 **Maintenance & Updates**

### **Regular Security Tasks**
- **Weekly**: Review audit logs for suspicious activities
- **Monthly**: Update dependencies for security patches
- **Quarterly**: Security assessment and penetration testing
- **Annually**: HIPAA compliance audit and documentation review

This security architecture provides enterprise-grade protection suitable for healthcare applications handling PHI (Protected Health Information) and ensures HIPAA compliance while maintaining system performance and usability.
