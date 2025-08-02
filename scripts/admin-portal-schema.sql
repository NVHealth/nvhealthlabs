-- Admin Portal Schema for NVHealth Labs
-- This script creates tables for managing diagnostic centers and lab tests

-- Enhanced diagnostic centers table with admin management fields
CREATE TABLE IF NOT EXISTS diagnostic_centers_admin (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'United States',
    
    -- Operating details
    operating_hours JSONB, -- Store as JSON: {"monday": {"open": "08:00", "close": "18:00"}, ...}
    services_offered TEXT[],
    certifications TEXT[],
    
    -- Integration settings
    integration_type VARCHAR(50) DEFAULT 'manual', -- 'api', 'webhook', 'manual', 'standard'
    api_endpoint VARCHAR(500),
    api_key VARCHAR(255),
    webhook_url VARCHAR(500),
    
    -- Capabilities
    home_collection_available BOOLEAN DEFAULT false,
    online_reports BOOLEAN DEFAULT true,
    emergency_services BOOLEAN DEFAULT false,
    
    -- Admin fields
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'suspended'
    created_by INTEGER,
    updated_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Contact person
    contact_person_name VARCHAR(255),
    contact_person_phone VARCHAR(20),
    contact_person_email VARCHAR(255),
    
    -- Business details
    license_number VARCHAR(100),
    tax_id VARCHAR(50),
    established_year INTEGER,
    
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- Enhanced lab tests table with admin management
CREATE TABLE IF NOT EXISTS lab_tests_admin (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    description TEXT,
    
    -- Test details
    sample_type VARCHAR(100), -- 'blood', 'urine', 'stool', etc.
    sample_volume VARCHAR(50),
    container_type VARCHAR(100),
    
    -- Pricing
    base_price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Test specifications
    reporting_time_hours INTEGER DEFAULT 24,
    fasting_required BOOLEAN DEFAULT false,
    preparation_instructions TEXT,
    
    -- Clinical information
    clinical_significance TEXT,
    reference_ranges JSONB, -- Store as JSON with age/gender specific ranges
    methodology VARCHAR(255),
    
    -- Admin fields
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'discontinued'
    is_popular BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    
    created_by INTEGER,
    updated_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- SEO and search
    search_keywords TEXT[],
    meta_description TEXT,
    
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- Center-specific test pricing overrides
CREATE TABLE IF NOT EXISTS center_test_pricing (
    id SERIAL PRIMARY KEY,
    center_id INTEGER NOT NULL,
    test_id INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (center_id) REFERENCES diagnostic_centers_admin(id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES lab_tests_admin(id) ON DELETE CASCADE,
    
    UNIQUE(center_id, test_id)
);

-- Test packages/panels
CREATE TABLE IF NOT EXISTS test_packages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    
    base_price DECIMAL(10,2) NOT NULL,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    
    is_popular BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'active',
    
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Tests included in packages
CREATE TABLE IF NOT EXISTS package_tests (
    id SERIAL PRIMARY KEY,
    package_id INTEGER NOT NULL,
    test_id INTEGER NOT NULL,
    
    FOREIGN KEY (package_id) REFERENCES test_packages(id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES lab_tests_admin(id) ON DELETE CASCADE,
    
    UNIQUE(package_id, test_id)
);

-- Enhanced bookings table for integration
CREATE TABLE IF NOT EXISTS bookings_enhanced (
    id SERIAL PRIMARY KEY,
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER NOT NULL,
    center_id INTEGER NOT NULL,
    
    -- Appointment details
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    appointment_type VARCHAR(50) DEFAULT 'lab_visit', -- 'lab_visit', 'home_collection'
    
    -- Tests and pricing
    tests JSONB NOT NULL, -- Array of test IDs and details
    total_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(10,2) NOT NULL,
    
    -- Status tracking
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'sample_collected', 'processing', 'completed', 'cancelled'
    payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
    
    -- Integration fields
    external_booking_id VARCHAR(255), -- ID from diagnostic center system
    integration_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'synced', 'failed'
    last_sync_at TIMESTAMP,
    
    -- Customer details
    customer_notes TEXT,
    special_instructions TEXT,
    
    -- Collection details (for home collection)
    collection_address TEXT,
    collection_phone VARCHAR(20),
    collection_contact_person VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (center_id) REFERENCES diagnostic_centers_admin(id)
);

-- Test results with file attachments
CREATE TABLE IF NOT EXISTS test_results (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL,
    test_id INTEGER NOT NULL,
    
    -- Result details
    result_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'abnormal', 'critical'
    
    -- Result data
    result_values JSONB, -- Structured test results
    reference_ranges JSONB,
    interpretation TEXT,
    doctor_comments TEXT,
    
    -- File attachments
    report_file_url VARCHAR(500),
    report_file_name VARCHAR(255),
    report_file_size INTEGER,
    
    -- Integration
    external_result_id VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings_enhanced(id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES lab_tests_admin(id)
);

-- Status update logs for tracking
CREATE TABLE IF NOT EXISTS booking_status_logs (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL,
    
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    
    updated_by VARCHAR(100), -- 'system', 'admin', 'integration', or user ID
    update_source VARCHAR(50), -- 'manual', 'api', 'webhook'
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (booking_id) REFERENCES bookings_enhanced(id) ON DELETE CASCADE
);

-- API integration logs
CREATE TABLE IF NOT EXISTS integration_logs (
    id SERIAL PRIMARY KEY,
    center_id INTEGER NOT NULL,
    
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    request_data JSONB,
    response_data JSONB,
    response_status INTEGER,
    
    execution_time_ms INTEGER,
    success BOOLEAN DEFAULT false,
    error_message TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (center_id) REFERENCES diagnostic_centers_admin(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_diagnostic_centers_status ON diagnostic_centers_admin(status);
CREATE INDEX IF NOT EXISTS idx_diagnostic_centers_city ON diagnostic_centers_admin(city);
CREATE INDEX IF NOT EXISTS idx_lab_tests_category ON lab_tests_admin(category);
CREATE INDEX IF NOT EXISTS idx_lab_tests_status ON lab_tests_admin(status);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings_enhanced(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings_enhanced(appointment_date);
CREATE INDEX IF NOT EXISTS idx_test_results_booking ON test_results(booking_id);
CREATE INDEX IF NOT EXISTS idx_integration_logs_center ON integration_logs(center_id);

-- Insert some sample data for testing
INSERT INTO diagnostic_centers_admin (
    name, email, phone, address, city, state, zip_code,
    operating_hours, services_offered, certifications,
    integration_type, home_collection_available,
    contact_person_name, contact_person_phone, contact_person_email,
    license_number, established_year
) VALUES 
(
    'HealthFirst Diagnostics',
    'admin@healthfirst.com',
    '+1-555-0101',
    '123 Medical Plaza, Suite 100',
    'New York',
    'NY',
    '10001',
    '{"monday": {"open": "08:00", "close": "18:00"}, "tuesday": {"open": "08:00", "close": "18:00"}, "wednesday": {"open": "08:00", "close": "18:00"}, "thursday": {"open": "08:00", "close": "18:00"}, "friday": {"open": "08:00", "close": "18:00"}, "saturday": {"open": "09:00", "close": "14:00"}, "sunday": {"open": "closed", "close": "closed"}}',
    ARRAY['Blood Tests', 'Urine Tests', 'Radiology', 'Pathology'],
    ARRAY['NABL Accredited', 'ISO 15189', 'CAP Certified'],
    'api',
    true,
    'Dr. Sarah Johnson',
    '+1-555-0102',
    'sarah.johnson@healthfirst.com',
    'HF-2024-001',
    2015
),
(
    'MediCore Labs',
    'contact@medicore.com',
    '+1-555-0201',
    '456 Health Street, Building B',
    'Los Angeles',
    'CA',
    '90001',
    '{"monday": {"open": "07:00", "close": "19:00"}, "tuesday": {"open": "07:00", "close": "19:00"}, "wednesday": {"open": "07:00", "close": "19:00"}, "thursday": {"open": "07:00", "close": "19:00"}, "friday": {"open": "07:00", "close": "19:00"}, "saturday": {"open": "08:00", "close": "16:00"}, "sunday": {"open": "09:00", "close": "13:00"}}',
    ARRAY['Clinical Chemistry', 'Hematology', 'Microbiology', 'Immunology'],
    ARRAY['CLIA Certified', 'NABL Accredited'],
    'webhook',
    true,
    'Michael Chen',
    '+1-555-0202',
    'michael.chen@medicore.com',
    'MC-2024-002',
    2018
);

INSERT INTO lab_tests_admin (
    name, category, subcategory, description,
    sample_type, sample_volume, container_type,
    base_price, reporting_time_hours, fasting_required,
    preparation_instructions, clinical_significance,
    reference_ranges, methodology, is_popular, search_keywords
) VALUES 
(
    'Complete Blood Count (CBC)',
    'Hematology',
    'Blood Count',
    'A comprehensive blood test that evaluates overall health and detects various disorders',
    'Blood',
    '3-5 mL',
    'EDTA Tube',
    25.00,
    4,
    false,
    'No special preparation required. Stay hydrated.',
    'Evaluates red blood cells, white blood cells, and platelets to diagnose anemia, infections, and blood disorders.',
    '{"hemoglobin": {"male": "13.8-17.2 g/dL", "female": "12.1-15.1 g/dL"}, "wbc": "4.0-11.0 K/uL", "platelets": "150-450 K/uL"}',
    'Automated Cell Counter',
    true,
    ARRAY['CBC', 'blood count', 'hemoglobin', 'anemia', 'infection']
),
(
    'Lipid Profile',
    'Clinical Chemistry',
    'Cardiac Markers',
    'Measures cholesterol and triglycerides to assess cardiovascular risk',
    'Blood',
    '5 mL',
    'Serum Tube',
    45.00,
    6,
    true,
    'Fast for 12-14 hours before the test. Only water is allowed.',
    'Assesses risk of heart disease and stroke by measuring different types of cholesterol and triglycerides.',
    '{"total_cholesterol": "<200 mg/dL", "ldl": "<100 mg/dL", "hdl": ">40 mg/dL (male), >50 mg/dL (female)", "triglycerides": "<150 mg/dL"}',
    'Enzymatic Method',
    true,
    ARRAY['cholesterol', 'lipid', 'heart', 'cardiovascular', 'triglycerides']
),
(
    'HbA1c (Glycated Hemoglobin)',
    'Clinical Chemistry',
    'Diabetes Monitoring',
    'Measures average blood sugar levels over the past 2-3 months',
    'Blood',
    '2 mL',
    'EDTA Tube',
    35.00,
    4,
    false,
    'No fasting required. Can be done at any time of day.',
    'Monitors long-term blood glucose control in diabetic patients and diagnoses diabetes.',
    '{"normal": "<5.7%", "prediabetes": "5.7-6.4%", "diabetes": "≥6.5%"}',
    'HPLC Method',
    true,
    ARRAY['diabetes', 'blood sugar', 'glucose', 'HbA1c', 'glycated hemoglobin']
),
(
    'Thyroid Profile (T3, T4, TSH)',
    'Endocrinology',
    'Thyroid Function',
    'Comprehensive thyroid function assessment',
    'Blood',
    '5 mL',
    'Serum Tube',
    65.00,
    8,
    false,
    'No special preparation required. Inform about any thyroid medications.',
    'Evaluates thyroid gland function to diagnose hyperthyroidism, hypothyroidism, and other thyroid disorders.',
    '{"tsh": "0.4-4.0 mIU/L", "t3": "80-200 ng/dL", "t4": "5.0-12.0 μg/dL"}',
    'Chemiluminescent Immunoassay',
    true,
    ARRAY['thyroid', 'TSH', 'T3', 'T4', 'hormone', 'metabolism']
);

-- Insert test packages
INSERT INTO test_packages (name, description, category, base_price, discount_percentage, is_popular) VALUES 
(
    'Basic Health Checkup',
    'Essential tests for overall health monitoring',
    'Preventive Care',
    120.00,
    15.0,
    true
),
(
    'Diabetes Monitoring Package',
    'Comprehensive diabetes management tests',
    'Diabetes Care',
    85.00,
    10.0,
    true
),
(
    'Heart Health Package',
    'Complete cardiovascular risk assessment',
    'Cardiac Care',
    150.00,
    20.0,
    true
);
