-- NVHealth Labs Database Schema
-- HIPAA-compliant design with proper indexing and constraints

-- Users table (patients, admins, diagnostic center admins)
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    role ENUM('patient', 'platform_admin', 'center_admin') DEFAULT 'patient',
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_role (role)
);

-- Diagnostic Centers
CREATE TABLE diagnostic_centers (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    certifications JSON,
    operating_hours JSON,
    is_active BOOLEAN DEFAULT TRUE,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_city (city),
    INDEX idx_state (state),
    INDEX idx_active (is_active),
    INDEX idx_rating (rating)
);

-- Center Admins relationship
CREATE TABLE center_admins (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    center_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (center_id) REFERENCES diagnostic_centers(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_center (user_id, center_id)
);

-- Test Categories
CREATE TABLE test_categories (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tests
CREATE TABLE tests (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id VARCHAR(36),
    preparation_instructions TEXT,
    sample_type VARCHAR(100),
    reporting_time VARCHAR(100),
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES test_categories(id) ON DELETE SET NULL,
    INDEX idx_category (category_id),
    INDEX idx_popular (is_popular),
    INDEX idx_active (is_active),
    FULLTEXT idx_search (name, description)
);

-- Center Tests (pricing and availability per center)
CREATE TABLE center_tests (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    center_id VARCHAR(36) NOT NULL,
    test_id VARCHAR(36) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    discounted_price DECIMAL(10,2),
    is_available BOOLEAN DEFAULT TRUE,
    home_collection_available BOOLEAN DEFAULT FALSE,
    home_collection_fee DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (center_id) REFERENCES diagnostic_centers(id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
    UNIQUE KEY unique_center_test (center_id, test_id),
    INDEX idx_price (price),
    INDEX idx_available (is_available)
);

-- Bookings
CREATE TABLE bookings (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    booking_number VARCHAR(20) UNIQUE NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    center_id VARCHAR(36) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    payment_id VARCHAR(255),
    is_home_collection BOOLEAN DEFAULT FALSE,
    collection_address TEXT,
    special_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (center_id) REFERENCES diagnostic_centers(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_center (center_id),
    INDEX idx_date (appointment_date),
    INDEX idx_status (status),
    INDEX idx_payment_status (payment_status)
);

-- Booking Items
CREATE TABLE booking_items (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    booking_id VARCHAR(36) NOT NULL,
    test_id VARCHAR(36) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    discounted_price DECIMAL(10,2),
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
    INDEX idx_booking (booking_id)
);

-- Test Results
CREATE TABLE test_results (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    booking_id VARCHAR(36) NOT NULL,
    test_id VARCHAR(36) NOT NULL,
    result_data JSON,
    report_url VARCHAR(500),
    status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES tests(id) ON DELETE CASCADE,
    INDEX idx_booking (booking_id),
    INDEX idx_status (status)
);

-- Reviews
CREATE TABLE reviews (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    center_id VARCHAR(36) NOT NULL,
    booking_id VARCHAR(36),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (center_id) REFERENCES diagnostic_centers(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
    INDEX idx_center (center_id),
    INDEX idx_rating (rating)
);

-- Notifications
CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('booking', 'payment', 'result', 'reminder', 'general') NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_read (is_read),
    INDEX idx_type (type)
);

-- Audit Log for HIPAA compliance
CREATE TABLE audit_logs (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36),
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(36),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_resource (resource_type, resource_id),
    INDEX idx_created (created_at)
);
