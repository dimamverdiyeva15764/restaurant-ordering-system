-- Delete existing test user if exists
DELETE FROM users WHERE username = 'kitchen';
 
-- Insert test user with properly encoded password (password: 'password123')
INSERT INTO users (username, password, role, full_name, active) VALUES
    ('kitchen', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'KITCHEN_STAFF', 'Kitchen Staff', true); 