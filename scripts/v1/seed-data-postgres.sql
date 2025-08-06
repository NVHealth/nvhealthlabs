-- Seed data for NVHealth Labs (PostgreSQL)
-- This script populates the database with sample data for testing

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Store generated UUIDs for referencing
DO $$
DECLARE
    cat_blood_tests UUID := uuid_generate_v4();
    cat_diabetes UUID := uuid_generate_v4();
    cat_heart_health UUID := uuid_generate_v4();
    cat_liver_function UUID := uuid_generate_v4();
    cat_kidney_function UUID := uuid_generate_v4();
    cat_thyroid UUID := uuid_generate_v4();
    
    test_cbc UUID := uuid_generate_v4();
    test_lipid UUID := uuid_generate_v4();
    test_hba1c UUID := uuid_generate_v4();
    test_lft UUID := uuid_generate_v4();
    test_kft UUID := uuid_generate_v4();
    test_thyroid UUID := uuid_generate_v4();
    test_vitamin_d UUID := uuid_generate_v4();
    test_vitamin_b12 UUID := uuid_generate_v4();
    
    center_healthfirst UUID := uuid_generate_v4();
    center_medicore UUID := uuid_generate_v4();
    center_quicktest UUID := uuid_generate_v4();
    
    admin_user UUID := uuid_generate_v4();
BEGIN
    -- Insert test categories
    INSERT INTO test_categories (id, name, description, icon, sort_order) VALUES
    (cat_blood_tests, 'Blood Tests', 'Complete blood count, lipid profile, and more', 'droplet', 1),
    (cat_diabetes, 'Diabetes', 'Blood sugar, HbA1c, and diabetes monitoring', 'activity', 2),
    (cat_heart_health, 'Heart Health', 'Cardiac markers, cholesterol, and heart function', 'heart', 3),
    (cat_liver_function, 'Liver Function', 'Liver enzymes and function tests', 'shield', 4),
    (cat_kidney_function, 'Kidney Function', 'Creatinine, BUN, and kidney health', 'droplets', 5),
    (cat_thyroid, 'Thyroid', 'TSH, T3, T4 and thyroid function', 'zap', 6);

    -- Insert sample tests
    INSERT INTO tests (id, name, description, category_id, preparation_instructions, sample_type, reporting_time, is_popular) VALUES
    (test_cbc, 'Complete Blood Count (CBC)', 'Comprehensive blood analysis including RBC, WBC, platelets', cat_blood_tests, 'No special preparation required', 'Blood', '4-6 hours', TRUE),
    (test_lipid, 'Lipid Profile', 'Cholesterol, triglycerides, HDL, LDL analysis', cat_heart_health, '12-hour fasting required', 'Blood', '6-8 hours', TRUE),
    (test_hba1c, 'HbA1c', 'Average blood sugar levels over 2-3 months', cat_diabetes, 'No fasting required', 'Blood', '4-6 hours', TRUE),
    (test_lft, 'Liver Function Test (LFT)', 'ALT, AST, bilirubin, and liver enzymes', cat_liver_function, '8-hour fasting recommended', 'Blood', '6-8 hours', FALSE),
    (test_kft, 'Kidney Function Test (KFT)', 'Creatinine, BUN, uric acid analysis', cat_kidney_function, 'No special preparation', 'Blood', '4-6 hours', FALSE),
    (test_thyroid, 'Thyroid Profile (TSH, T3, T4)', 'Complete thyroid function assessment', cat_thyroid, 'Morning sample preferred', 'Blood', '8-12 hours', TRUE),
    (test_vitamin_d, 'Vitamin D', 'Vitamin D3 levels assessment', cat_blood_tests, 'No special preparation', 'Blood', '24-48 hours', FALSE),
    (test_vitamin_b12, 'Vitamin B12', 'B12 deficiency screening', cat_blood_tests, 'No special preparation', 'Blood', '24-48 hours', FALSE);

    -- Insert sample diagnostic centers
    INSERT INTO diagnostic_centers (id, name, description, address, city, state, zip_code, phone, email, license_number, operating_hours, rating, total_reviews) VALUES
    (center_healthfirst, 'HealthFirst Diagnostics', 'State-of-the-art diagnostic facility with NABL accreditation', '123 Medical Plaza, Downtown', 'New York', 'NY', '10001', '+1-555-0101', 'info@healthfirst.com', 'LIC001', '{"monday": "7:00-19:00", "tuesday": "7:00-19:00", "wednesday": "7:00-19:00", "thursday": "7:00-19:00", "friday": "7:00-19:00", "saturday": "8:00-16:00", "sunday": "closed"}', 4.5, 150),
    (center_medicore, 'MediCore Labs', 'Comprehensive diagnostic services with home collection', '456 Health Street, Midtown', 'New York', 'NY', '10002', '+1-555-0102', 'contact@medicore.com', 'LIC002', '{"monday": "6:00-20:00", "tuesday": "6:00-20:00", "wednesday": "6:00-20:00", "thursday": "6:00-20:00", "friday": "6:00-20:00", "saturday": "7:00-17:00", "sunday": "8:00-14:00"}', 4.2, 89),
    (center_quicktest, 'QuickTest Center', 'Fast and reliable diagnostic testing', '789 Wellness Ave, Uptown', 'New York', 'NY', '10003', '+1-555-0103', 'hello@quicktest.com', 'LIC003', '{"monday": "8:00-18:00", "tuesday": "8:00-18:00", "wednesday": "8:00-18:00", "thursday": "8:00-18:00", "friday": "8:00-18:00", "saturday": "9:00-15:00", "sunday": "closed"}', 4.0, 67);

    -- Insert center tests with pricing
    INSERT INTO center_tests (center_id, test_id, price, discounted_price, home_collection_available, home_collection_fee) VALUES
    -- HealthFirst Diagnostics
    (center_healthfirst, test_cbc, 25.00, 20.00, TRUE, 10.00),
    (center_healthfirst, test_lipid, 45.00, 35.00, TRUE, 10.00),
    (center_healthfirst, test_hba1c, 35.00, 30.00, TRUE, 10.00),
    (center_healthfirst, test_lft, 40.00, 32.00, TRUE, 10.00),
    (center_healthfirst, test_kft, 30.00, 25.00, TRUE, 10.00),
    (center_healthfirst, test_thyroid, 55.00, 45.00, TRUE, 10.00),
    (center_healthfirst, test_vitamin_d, 50.00, 40.00, FALSE, 0.00),
    (center_healthfirst, test_vitamin_b12, 45.00, 35.00, FALSE, 0.00),

    -- MediCore Labs
    (center_medicore, test_cbc, 22.00, 18.00, TRUE, 15.00),
    (center_medicore, test_lipid, 42.00, 38.00, TRUE, 15.00),
    (center_medicore, test_hba1c, 38.00, 32.00, TRUE, 15.00),
    (center_medicore, test_lft, 38.00, 30.00, TRUE, 15.00),
    (center_medicore, test_kft, 28.00, 22.00, TRUE, 15.00),
    (center_medicore, test_thyroid, 52.00, 42.00, TRUE, 15.00),
    (center_medicore, test_vitamin_d, 48.00, 38.00, TRUE, 15.00),
    (center_medicore, test_vitamin_b12, 42.00, 32.00, TRUE, 15.00),

    -- QuickTest Center
    (center_quicktest, test_cbc, 28.00, NULL, FALSE, 0.00),
    (center_quicktest, test_lipid, 48.00, 40.00, FALSE, 0.00),
    (center_quicktest, test_hba1c, 40.00, 35.00, FALSE, 0.00),
    (center_quicktest, test_lft, 42.00, NULL, FALSE, 0.00),
    (center_quicktest, test_kft, 32.00, 28.00, FALSE, 0.00),
    (center_quicktest, test_thyroid, 58.00, 50.00, FALSE, 0.00);

    -- Insert sample admin user
    INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_verified, is_active) VALUES
    (admin_user, 'admin@nvhealth.com', '$2b$10$example_hash_here', 'Platform', 'Admin', 'platform_admin', TRUE, TRUE);

    -- Insert sample reviews
    INSERT INTO reviews (user_id, center_id, rating, comment, is_verified) VALUES
    (admin_user, center_healthfirst, 5, 'Excellent service and quick results. Staff was very professional.', TRUE),
    (admin_user, center_healthfirst, 4, 'Good experience overall. Clean facility and timely service.', TRUE),
    (admin_user, center_medicore, 4, 'Home collection was convenient. Results were accurate and on time.', TRUE),
    (admin_user, center_quicktest, 4, 'Fast service as promised. Would recommend for urgent tests.', TRUE);

END $$;
