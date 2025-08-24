# NV Health Labs - Healthcare Platform

A modern, scalable healthcare platform built with Next.js, featuring comprehensive diagnostic center management, test booking, and result management capabilities.

## 🚀 Features

### For Patients
- **User Registration & Authentication** - Secure account creation with email verification
- **Diagnostic Center Discovery** - Find nearby labs and diagnostic centers  
- **Test Catalog** - Browse available tests with detailed information
- **Appointment Booking** - Schedule tests at preferred centers
- **Result Management** - Access and download test reports
- **Profile Management** - Update personal information and preferences

### For Center Administrators
- **Center Dashboard** - Manage center operations and appointments
- **Order Management** - Process and track test orders
- **Result Upload** - Upload and manage test results
- **Staff Management** - Manage center staff and permissions

### For Platform Administrators  
- **User Management** - Complete user administration capabilities
- **Center Management** - Oversee all diagnostic centers
- **System Analytics** - Platform-wide statistics and insights
- **Content Management** - Manage test catalog and platform content

## 🏗️ Architecture

This project implements a scalable, enterprise-grade architecture organized within the `/app/api` directory following Next.js App Router patterns.

### Backend Architecture (`/app/api/`)

```
app/api/
├── config/          # Configuration management
├── utils/           # Utility functions & helpers
├── models/          # Database models & client
├── schemas/         # Validation schemas (Zod)
├── middlewares/     # Authentication & authorization
├── services/        # Business logic layer
├── controllers/     # Request/response handlers
└── [routes]/        # API endpoints
```

### Key Components

- **Authentication & Authorization**: JWT-based with role-based access control
- **Database**: Prisma ORM with PostgreSQL
- **Validation**: Zod schemas for type-safe validation
- **Error Handling**: Centralized error handling with structured logging
- **Security**: Password hashing, rate limiting, CORS protection

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern UI component library
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Primary database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Zod** - Request/response validation

### Development
- **TypeScript** - Static type checking
- **ESLint** - Code linting
- **Prettier** - Code formatting (configured in package.json)

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nvhealth-labs
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/nvhealth"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_EXPIRES_IN="24h"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed demo data (optional)**
   ```bash
   npx prisma db seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Authentication

### Demo Users
For development and testing, the following demo users are available:

- **Patient**: `demo@patient.com` / `demo123`
- **Center Admin**: `demo@center.com` / `demo123`  
- **Platform Admin**: `demo@admin.com` / `demo123`

### API Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### User Management
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile
- `GET /api/users` - List all users (Admin only)
- `GET /api/users/search?q=term` - Search users (Admin only)
- `GET /api/users/stats` - User statistics (Admin only)

### Centers & Tests
- `GET /api/centers` - List diagnostic centers
- `GET /api/tests` - List available tests

For detailed API documentation, see [API_ARCHITECTURE.md](./API_ARCHITECTURE.md).

## 🗄️ Database Schema

The application uses PostgreSQL with the following main entities:

- **Users** - Patient and admin accounts
- **Centers** - Diagnostic center information  
- **Tests** - Available test catalog
- **Bookings** - Test appointments and orders
- **Results** - Test result reports

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables for Production
Ensure the following environment variables are set:

```env
NODE_ENV=production
DATABASE_URL="your-production-db-url"
JWT_SECRET="your-production-jwt-secret"
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🔧 Development

### Code Style
The project uses ESLint and Prettier for code consistency. Configuration is in:
- `.eslintrc.json`
- Prettier config in `package.json`

### Type Checking
```bash
# Check TypeScript without emitting files
npx tsc --noEmit
```

### Database Operations
```bash
# Generate Prisma client
npx prisma generate

# View database in Prisma Studio
npx prisma studio

# Create and apply migrations
npx prisma migrate dev --name <migration-name>
```

## 📂 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # Backend API architecture
│   ├── (pages)/           # Frontend pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── ...               # Feature-specific components
├── lib/                  # Utility libraries
├── hooks/                # Custom React hooks
├── public/               # Static assets
├── prisma/               # Database schema and migrations
├── scripts/              # Database scripts
└── __tests__/            # Test files
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)  
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the [API Documentation](./API_ARCHITECTURE.md)
- Review existing issues and discussions

---

**NV Health Labs** - Making healthcare accessible through technology.
