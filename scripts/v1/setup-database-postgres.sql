-- NVHealth Labs Database Schema for PostgreSQL
-- HIPAA-compliant design with proper indexing and constraints

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (patients, admins, diagnostic center admins)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    role VARCHAR(20) CHECK (role IN ('patient', 'platform_admin', 'center_admin')) DEFAULT 'patient',
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Create indexes for users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Diagnostic Centers
CREATE TABLE diagnostic_centers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    certifications JSONB,
    operating_hours JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for diagnostic_centers table
CREATE INDEX idx_diagnostic_centers_city ON diagnostic_centers(city);
CREATE INDEX idx_diagnostic_centers_state ON diagnostic_centers(state);
CREATE INDEX idx_diagnostic_centers_active ON diagnostic_centers(is_active);
CREATE INDEX idx_diagnostic_centers_rating ON diagnostic_centers(rating);

-- Trigger for diagnostic_centers table
CREATE TRIGGER update_diagnostic_centers_updated_at BEFORE UPDATE ON diagnostic_centers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Center Admins relationship
CREATE TABLE center_admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    center_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (center_id) REFERENCES diagnostic_centers(id) ON DELETE CASCADE,
    UNIQUE(user_id, center_id)
);

-- Test Categories
CREATE TABLE test_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tests
CREATE TABLE tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID,
    preparation_instructions TEXT,
    sample_type VARCHAR(100),
    reporting_time VARCHAR(100),
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES test_categories(id) ON DELETE SET NULL
);

-- Create indexes for tests table
CREATE INDEX idx_tests_category ON tests(category_id);
CREATE INDEX idx_tests_popular ON tests(is_popular);
CREATE INDEX idx_tests_active ON tests(is_active);
-- Full-text search index for PostgreSQL
CREATE INDEX idx_tests_search ON tests USING GIN (to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Trigger for tests table
CREATE TRIGGER update_tests_updated_at BEFORE UPDATE ON tests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Center Tests (pricing and availability per center)
CREATE TABLE center_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    center_id UUID NOT NULL,
    test_id UUID NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    discounted_price DECIMAL(10,2),
    is_available BOOLEAN DEFAULT TRUE,
    home_collection_available BOOLEAN DEFAULT FALSE,
    home_collection_fee DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (center_id) REFERENCES diagnostic_centers(id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
    UNIQUE(center_id, test_id)
);

-- Create indexes for center_tests table
CREATE INDEX idx_center_tests_price ON center_tests(price);
CREATE INDEX idx_center_tests_available ON center_tests(is_available);

-- Trigger for center_tests table
CREATE TRIGGER update_center_tests_updated_at BEFORE UPDATE ON center_tests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Bookings
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_number VARCHAR(20) UNIQUE NOT NULL,
    user_id UUID NOT NULL,
    center_id UUID NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(20) CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
    payment_id VARCHAR(255),
    is_home_collection BOOLEAN DEFAULT FALSE,
    collection_address TEXT,
    special_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (center_id) REFERENCES diagnostic_centers(id) ON DELETE CASCADE
);

-- Create indexes for bookings table
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_center ON bookings(center_id);
CREATE INDEX idx_bookings_date ON bookings(appointment_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);

-- Trigger for bookings table
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Booking Items
CREATE TABLE booking_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL,
    test_id UUID NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    discounted_price DECIMAL(10,2),
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
);

-- Create indexes for booking_items table
CREATE INDEX idx_booking_items_booking ON booking_items(booking_id);

-- Test Results
CREATE TABLE test_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL,
    test_id UUID NOT NULL,
    result_data JSONB,
    report_url VARCHAR(500),
    status VARCHAR(20) CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending',
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE
);

-- Create indexes for test_results table
CREATE INDEX idx_test_results_booking ON test_results(booking_id);
CREATE INDEX idx_test_results_status ON test_results(status);

-- Trigger for test_results table
CREATE TRIGGER update_test_results_updated_at BEFORE UPDATE ON test_results
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Reviews
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    center_id UUID NOT NULL,
    booking_id UUID,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (center_id) REFERENCES diagnostic_centers(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
);

-- Create indexes for reviews table
CREATE INDEX idx_reviews_center ON reviews(center_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) CHECK (type IN ('booking', 'payment', 'result', 'reminder', 'general')) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for notifications table
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_type ON notifications(type);

-- Audit Log for HIPAA compliance
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for audit_logs table
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- Create a function to generate booking numbers
CREATE OR REPLACE FUNCTION generate_booking_number() RETURNS TEXT AS $$
BEGIN
    RETURN 'NV' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || LPAD(NEXTVAL('booking_number_seq')::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Create sequence for booking numbers
CREATE SEQUENCE booking_number_seq START 1;

-- Add trigger to auto-generate booking numbers
CREATE OR REPLACE FUNCTION set_booking_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.booking_number IS NULL OR NEW.booking_number = '' THEN
        NEW.booking_number := generate_booking_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_booking_number
    BEFORE INSERT ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION set_booking_number();