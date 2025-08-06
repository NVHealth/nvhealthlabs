#!/bin/bash

# NVHealth Labs Complete PostgreSQL Database Setup
# This script sets up the complete database with all schemas and sample data

set -e

# Database configuration
DB_NAME="nvhealth_labs"
DB_USER="nvhealth_user"
DB_PASSWORD="nvhealth_password"
DB_HOST="localhost"
DB_PORT="5432"

# Get the directory where this script is located
SCRIPT_DIR="$(dirname "$0")"

echo "🏥 NVHealth Labs Complete Database Setup"
echo "========================================"

# Check if PostgreSQL is installed and running
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    echo "   On macOS: brew install postgresql@14"
    echo "   On Ubuntu: sudo apt-get install postgresql postgresql-contrib"
    exit 1
fi

if ! /opt/homebrew/opt/postgresql@14/bin/pg_isready -h $DB_HOST -p $DB_PORT &> /dev/null; then
    echo "❌ PostgreSQL service is not running. Please start PostgreSQL service."
    echo "   On macOS: brew services start postgresql@14"
    echo "   On Ubuntu: sudo systemctl start postgresql"
    exit 1
fi

echo "✅ PostgreSQL is installed and running"

# Function to run SQL file
run_sql_file() {
    local file=$1
    local description=$2
    
    if [ -f "$SCRIPT_DIR/$file" ]; then
        echo "🔧 $description..."
        /opt/homebrew/opt/postgresql@14/bin/psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$SCRIPT_DIR/$file"
        echo "✅ $description completed"
    else
        echo "⚠️  Warning: $file not found, skipping $description"
    fi
}

# Step 1: Create database and user (if not exists)
echo "📝 Setting up database and user..."
/opt/homebrew/opt/postgresql@14/bin/createuser --createdb --login $DB_USER 2>/dev/null || echo "User already exists"
/opt/homebrew/opt/postgresql@14/bin/createdb -U $DB_USER $DB_NAME 2>/dev/null || echo "Database already exists"
/opt/homebrew/opt/postgresql@14/bin/psql -d postgres -c "ALTER USER $DB_USER PASSWORD '$DB_PASSWORD';" 2>/dev/null || echo "Password already set"

# Step 2: Create main database schema
run_sql_file "setup-database-postgres.sql" "Creating main database schema"

# Step 3: Add verification fields
run_sql_file "update-verification-schema-postgres.sql" "Adding verification schema"

# Step 4: Create admin portal tables
run_sql_file "admin-portal-schema-postgres.sql" "Creating admin portal schema"

# Step 5: Insert sample data
run_sql_file "seed-data-postgres.sql" "Inserting sample data"

# Step 6: Verify installation
echo "🔍 Verifying database setup..."
TABLE_COUNT=$(/opt/homebrew/opt/postgresql@14/bin/psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
echo "📊 Created $TABLE_COUNT tables"

echo ""
echo "🎉 Database setup completed successfully!"
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
echo ""
echo "📝 Available tables:"
/opt/homebrew/opt/postgresql@14/bin/psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\dt"
