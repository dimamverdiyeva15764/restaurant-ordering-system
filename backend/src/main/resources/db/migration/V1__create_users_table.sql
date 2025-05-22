-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    full_name VARCHAR(100),
    active BOOLEAN DEFAULT true
);

-- Insert test user with encoded password (password: 'password123')
INSERT INTO users (username, password, role, full_name, active) VALUES
    ('kitchen', '$2a$10$rDkPvvAFV6GgJjXpYWYqUOQxZxZxZxZxZxZxZxZxZxZxZxZxZxZ', 'KITCHEN_STAFF', 'Kitchen Staff', true)
ON CONFLICT (username) DO NOTHING; 