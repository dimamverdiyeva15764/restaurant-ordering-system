-- Create a temporary table to store unique users
CREATE TEMPORARY TABLE temp_users AS
SELECT DISTINCT ON (username) *
FROM users
ORDER BY username, id;

-- Delete all rows from the original table
DELETE FROM users;

-- Copy back the unique users
INSERT INTO users
SELECT * FROM temp_users;

-- Drop the temporary table
DROP TABLE temp_users;

-- Add unique constraint if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'users_username_key'
    ) THEN
        ALTER TABLE users ADD CONSTRAINT users_username_key UNIQUE (username);
    END IF;
END $$; 