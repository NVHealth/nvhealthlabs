#!/bin/bash

# NVHealth Labs PostgreSQL Database Setup Script
# This script creates the database and runs the schema

set -e

# Database configuration
DB_NAME="nvhealth_labs"
DB_USER="nvhealth_user"
DB_PASSWORD="nvhealth_password"
DB_HOST="localhost"
DB_PORT="5432"

echo "🏥 NVHealth Labs Database Setup"
echo "================================"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    echo "   On macOS: brew install postgresql"
    echo "   On Ubuntu: sudo apt-get install postgresql postgresql-contrib"
    exit 1
fi

# Check if PostgreSQL service is running
if ! pg_isready -h $DB_HOST -p $DB_PORT &> /dev/null; then
    echo "❌ PostgreSQL service is not running. Please start PostgreSQL service."
    echo "   On macOS: brew services start postgresql"
    echo "   On Ubuntu: sudo systemctl start postgresql"
    exit 1
fi

echo "✅ PostgreSQL is installed and running"

# Create database user if it doesn't exist
echo "📝 Creating database user..."
createuser -h $DB_HOST -p $DB_PORT --createdb --login $DB_USER 2>/dev/null || echo "User already exists"

# Set password for the user
echo "🔐 Setting user password..."
psql -h $DB_HOST -p $DB_PORT -U postgres -c "ALTER USER $DB_USER PASSWORD '$DB_PASSWORD';" 2>/dev/null || echo "Password already set"

# Create database if it doesn't exist
echo "🗄️  Creating database..."
createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME 2>/dev/null || echo "Database already exists"

# Run the schema
echo "🏗️  Creating database schema..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$(dirname "$0")/setup-database-postgres.sql"

echo ""
echo "✅ Database setup completed successfully!"
echo ""
echo "📋 Connection Details:"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"
echo "   Password: $DB_PASSWORD"
echo "   Host: $DB_HOST"
echo "   Port: $DB_PORT"
echo ""
echo "🔗 Connection URL:"
echo "   postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
echo ""
echo "🚀 You can now connect to your database using:"
echo "   psql postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
