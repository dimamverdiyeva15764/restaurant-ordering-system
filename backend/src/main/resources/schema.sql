CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL,
    full_name VARCHAR(255)
);

-- Reset the sequence to start after our manually inserted IDs
ALTER SEQUENCE users_id_seq RESTART WITH 5;
