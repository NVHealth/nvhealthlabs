# PostgreSQL Migration Summary

## Files Converted from MySQL to PostgreSQL

### 🔄 **Converted Scripts:**

1. **`setup-database.sql` → `setup-database-postgres.sql`**
   - ✅ Already created and running
   - Converted MySQL `ENUM` to PostgreSQL `VARCHAR` with `CHECK` constraints
   - Changed `VARCHAR(36)` with `UUID()` to `UUID` with `uuid_generate_v4()`
   - Added proper triggers for `updated_at` columns
   - Used `JSONB` instead of `JSON` for better performance

2. **`seed-data.sql` → `seed-data-postgres.sql`**
   - ✅ Converted hardcoded IDs to proper UUID generation
   - Used PostgreSQL's `DO` block for proper UUID referencing
   - Maintained all sample data relationships

3. **`update-verification-schema.sql` → `update-verification-schema-postgres.sql`**
   - ✅ Changed `SERIAL` to `UUID` primary keys
   - Updated foreign key references to use `UUID`
   - Added proper trigger for `updated_at` column

4. **`admin-portal-schema.sql` → `admin-portal-schema-postgres.sql`**
   - ✅ Already mostly PostgreSQL compatible (was using `SERIAL`, `JSONB`, `TEXT[]`)
   - Changed `SERIAL` to `UUID` for consistency
   - Added proper triggers for `updated_at` columns
   - Updated foreign key references

### 🆕 **New Scripts:**

5. **`setup-postgres.sh`** - Individual PostgreSQL setup
6. **`setup-complete-postgres.sh`** - Complete database setup with all schemas

### 📋 **Key Changes Made:**

#### Data Types:
- `VARCHAR(36)` with `UUID()` → `UUID` with `uuid_generate_v4()`
- `SERIAL` → `UUID PRIMARY KEY DEFAULT uuid_generate_v4()`
- `JSON` → `JSONB` (better performance in PostgreSQL)
- `INT` → `INTEGER`
- `ENUM('value1', 'value2')` → `VARCHAR(20) CHECK (column IN ('value1', 'value2'))`

#### Indexes:
- `INDEX idx_name (column)` → `CREATE INDEX idx_name ON table(column)`
- Added `GIN` indexes for full-text search
- Used `INET` type for IP addresses

#### Triggers:
- Replaced MySQL `ON UPDATE CURRENT_TIMESTAMP` with PostgreSQL triggers
- Created reusable `update_updated_at_column()` function

#### Functions:
- Added booking number generation with sequences
- Auto-generating UUIDs with proper referential integrity

### 🚀 **Usage:**

```bash
# Run individual setup
./scripts/setup-postgres.sh

# Or run complete setup with all schemas and data
./scripts/setup-complete-postgres.sh
```

### 🔗 **Connection Details:**
- **Database**: `nvhealth_labs`
- **User**: `nvhealth_user`
- **Password**: `nvhealth_password`
<!-- - **Connection URL**: `postgresql://nvhealth_user:nvhealth_password@localhost:5432/nvhealth_labs` -->
- **Connection URL**: `postgresql://nvhealth_user:nvhealth@123:5432/nvhealth_labs`

### 📊 **Tables Created:**
- Core tables: 12 (users, diagnostic_centers, tests, bookings, etc.)
- Admin portal tables: 8 (enhanced tables for admin management)
- Verification tables: 1 (verification_codes)
- **Total**: ~21 tables with proper indexes and relationships

### ✅ **Benefits of PostgreSQL Migration:**
1. **Better JSON Support**: JSONB provides better performance and indexing
2. **UUID Support**: Native UUID generation and storage
3. **Advanced Indexing**: GIN indexes for full-text search
4. **Better Constraints**: More robust data validation
5. **HIPAA Compliance**: Enhanced audit logging capabilities
6. **Scalability**: Better performance for large datasets
