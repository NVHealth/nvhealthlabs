// Re-export Prisma client for backward compatibility
export { prisma as default } from './prisma'

// Test database connection
import { prisma } from './prisma'

async function testConnection() {
    try {
        await prisma.$connect()
        console.log('✓ Connected to PostgreSQL database via Prisma')
    } catch (error) {
        console.error('✗ Failed to connect to database:', error)
    }
}

// Test connection on module load
testConnection()
