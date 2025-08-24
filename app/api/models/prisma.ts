import { PrismaClient } from '@/lib/generated/prisma'
import { env, isDevelopment } from '../config/env'

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: isDevelopment() ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: env.DATABASE_URL
    }
  }
})

if (isDevelopment()) globalForPrisma.prisma = prisma

/**
 * Database utilities and helpers
 */
export class DatabaseUtils {
  /**
   * Connect to database (called automatically)
   */
  static async connect(): Promise<void> {
    try {
      await prisma.$connect()
      console.log('✅ Database connected successfully')
    } catch (error) {
      console.error('❌ Database connection failed:', error)
      throw error
    }
  }

  /**
   * Disconnect from database
   */
  static async disconnect(): Promise<void> {
    await prisma.$disconnect()
  }

  /**
   * Run operations in a transaction
   */
  static async transaction<T>(
    fn: (tx: Omit<PrismaClient, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">) => Promise<T>
  ): Promise<T> {
    return await prisma.$transaction(fn)
  }

  /**
   * Health check
   */
  static async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy'
    connection: boolean
    timestamp: string
  }> {
    try {
      await prisma.$queryRaw`SELECT 1`
      return {
        status: 'healthy',
        connection: true,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('Database health check failed:', error)
      return {
        status: 'unhealthy',
        connection: false,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * Clean database (for testing)
   */
  static async clean(): Promise<void> {
    if (!isDevelopment()) {
      throw new Error('Clean operation is only allowed in development environment')
    }

    try {
      const tablenames = await prisma.$queryRaw<
        Array<{ tablename: string }>
      >`SELECT tablename FROM pg_tables WHERE schemaname='public'`

      const tables = tablenames
        .map(({ tablename }) => tablename)
        .filter((name) => name !== '_prisma_migrations')
        .map((name) => `"public"."${name}"`)
        .join(', ')

      if (tables) {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`)
      }
    } catch (error) {
      console.log('Database clean error:', error)
    }
  }
}
