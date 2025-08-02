-- Seed data for NVHealth Labs

-- Insert test categories
INSERT INTO test_categories (id, name, description, icon, sort_order) VALUES
('cat-1', 'Blood Tests', 'Complete blood count, lipid profile, and more', 'droplet', 1),
('cat-2', 'Diabetes', 'Blood sugar, HbA1c, and diabetes monitoring', 'activity', 2),
('cat-3', 'Heart Health', 'Cardiac markers, cholesterol, and heart function', 'heart', 3),
('cat-4', 'Liver Function', 'Liver enzymes and function tests', 'shield', 4),
('cat-5', 'Kidney Function', 'Creatinine, BUN, and kidney health', 'droplets', 5),
('cat-6', 'Thyroid', 'TSH, T3, T4 and thyroid function', 'zap', 6);

-- Insert sample tests
INSERT INTO tests (id, name, description, category_id, preparation_instructions, sample_type, reporting_time, is_popular) VALUES
('test-1', 'Complete Blood Count (CBC)', 'Comprehensive blood analysis including RBC, WBC, platelets', 'cat-1', 'No special preparation required', 'Blood', '4-6 hours', TRUE),
('test-2', 'Lipid Profile', 'Cholesterol, triglycerides, HDL, LDL analysis', 'cat-3', '12-hour fasting required', 'Blood', '6-8 hours', TRUE),
('test-3', 'HbA1c', 'Average blood sugar levels over 2-3 months', 'cat-2', 'No fasting required', 'Blood', '4-6 hours', TRUE),
('test-4', 'Liver Function Test (LFT)', 'ALT, AST, bilirubin, and liver enzymes', 'cat-4', '8-hour fasting recommended', 'Blood', '6-8 hours', FALSE),
('test-5', 'Kidney Function Test (KFT)', 'Creatinine, BUN, uric acid analysis', 'cat-5', 'No special preparation', 'Blood', '4-6 hours', FALSE),
('test-6', 'Thyroid Profile (TSH, T3, T4)', 'Complete thyroid function assessment', 'cat-6', 'Morning sample preferred', 'Blood', '8-12 hours', TRUE),
('test-7', 'Vitamin D', 'Vitamin D3 levels assessment', 'cat-1', 'No special preparation', 'Blood', '24-48 hours', FALSE),
('test-8', 'Vitamin B12', 'B12 deficiency screening', 'cat-1', 'No special preparation', 'Blood', '24-48 hours', FALSE);

-- Insert sample diagnostic centers
INSERT INTO diagnostic_centers (id, name, description, address, city, state, zip_code, phone, email, license_number, operating_hours, rating, total_reviews) VALUES
('center-1', 'HealthFirst Diagnostics', 'State-of-the-art diagnostic facility with NABL accreditation', '123 Medical Plaza, Downtown', 'New York', 'NY', '10001', '+1-555-0101', 'info@healthfirst.com', 'LIC001', '{"monday": "7:00-19:00", "tuesday": "7:00-19:00", "wednesday": "7:00-19:00", "thursday": "7:00-19:00", "friday": "7:00-19:00", "saturday": "8:00-16:00", "sunday": "closed"}', 4.5, 150),
('center-2', 'MediCore Labs', 'Comprehensive diagnostic services with home collection', '456 Health Street, Midtown', 'New York', 'NY', '10002', '+1-555-0102', 'contact@medicore.com', 'LIC002', '{"monday": "6:00-20:00", "tuesday": "6:00-20:00", "wednesday": "6:00-20:00", "thursday": "6:00-20:00", "friday": "6:00-20:00", "saturday": "7:00-17:00", "sunday": "8:00-14:00"}', 4.2, 89),
('center-3', 'QuickTest Center', 'Fast and reliable diagnostic testing', '789 Wellness Ave, Uptown', 'New York', 'NY', '10003', '+1-555-0103', 'hello@quicktest.com', 'LIC003', '{"monday": "8:00-18:00", "tuesday": "8:00-18:00", "wednesday": "8:00-18:00", "thursday": "8:00-18:00", "friday": "8:00-18:00", "saturday": "9:00-15:00", "sunday": "closed"}', 4.0, 67);

-- Insert center tests with pricing
INSERT INTO center_tests (center_id, test_id, price, discounted_price, home_collection_available, home_collection_fee) VALUES
-- HealthFirst Diagnostics
('center-1', 'test-1', 25.00, 20.00, TRUE, 10.00),
('center-1', 'test-2', 45.00, 35.00, TRUE, 10.00),
('center-1', 'test-3', 35.00, 30.00, TRUE, 10.00),
('center-1', 'test-4', 40.00, 32.00, TRUE, 10.00),
('center-1', 'test-5', 30.00, 25.00, TRUE, 10.00),
('center-1', 'test-6', 55.00, 45.00, TRUE, 10.00),
('center-1', 'test-7', 50.00, 40.00, FALSE, 0.00),
('center-1', 'test-8', 45.00, 35.00, FALSE, 0.00),

-- MediCore Labs
('center-2', 'test-1', 22.00, 18.00, TRUE, 15.00),
('center-2', 'test-2', 42.00, 38.00, TRUE, 15.00),
('center-2', 'test-3', 38.00, 32.00, TRUE, 15.00),
('center-2', 'test-4', 38.00, 30.00, TRUE, 15.00),
('center-2', 'test-5', 28.00, 22.00, TRUE, 15.00),
('center-2', 'test-6', 52.00, 42.00, TRUE, 15.00),
('center-2', 'test-7', 48.00, 38.00, TRUE, 15.00),
('center-2', 'test-8', 42.00, 32.00, TRUE, 15.00),

-- QuickTest Center
('center-3', 'test-1', 28.00, NULL, FALSE, 0.00),
('center-3', 'test-2', 48.00, 40.00, FALSE, 0.00),
('center-3', 'test-3', 40.00, 35.00, FALSE, 0.00),
('center-3', 'test-4', 42.00, NULL, FALSE, 0.00),
('center-3', 'test-5', 32.00, 28.00, FALSE, 0.00),
('center-3', 'test-6', 58.00, 50.00, FALSE, 0.00);

-- Insert sample admin user
INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_verified, is_active) VALUES
('admin-1', 'admin@nvhealth.com', '$2b$10$example_hash_here', 'Platform', 'Admin', 'platform_admin', TRUE, TRUE);

-- Insert sample reviews
INSERT INTO reviews (user_id, center_id, rating, comment, is_verified) VALUES
('admin-1', 'center-1', 5, 'Excellent service and quick results. Staff was very professional.', TRUE),
('admin-1', 'center-1', 4, 'Good experience overall. Clean facility and timely service.', TRUE),
('admin-1', 'center-2', 4, 'Home collection was convenient. Results were accurate and on time.', TRUE),
('admin-1', 'center-3', 4, 'Fast service as promised. Would recommend for urgent tests.', TRUE);
