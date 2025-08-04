import { Pool } from 'pg'

// Database connection configuration
const pool = new Pool({
  user: process.env.DB_USER || 'nvhealth_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'nvhealth_labs',
  password: process.env.DB_PASSWORD || 'nvhealth_password_123',
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

// Test connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database')
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

export default pool
