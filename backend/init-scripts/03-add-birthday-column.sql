-- Add birthday column to users table
-- Migration script to add birthday field for age calculation

-- Add birthday column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS birthday DATE;

-- Add birthday column to user_settings table if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_settings') THEN
        ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS birthday DATE;
    END IF;
END $$;

-- Update existing users with a default birthday (optional)
-- This is commented out to avoid setting incorrect data
-- UPDATE users SET birthday = '1990-01-01' WHERE birthday IS NULL;

-- Create index for birthday queries if needed
CREATE INDEX IF NOT EXISTS idx_users_birthday ON users(birthday);

-- Add comment to document the column
COMMENT ON COLUMN users.birthday IS 'User birthday for automatic age calculation in health records';

