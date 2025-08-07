-- Add user roles table
CREATE TABLE IF NOT EXISTS user_roles (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- Insert default admin user if not exists
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'
FROM users 
WHERE email = 'admin@healthtracker.com' 
AND NOT EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = users.id
);

-- Add role column to users table for backward compatibility
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'customer';

-- Update existing users to have customer role
UPDATE users SET role = 'customer' WHERE role IS NULL;

-- Create function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID)
RETURNS VARCHAR(20) AS $$
BEGIN
    RETURN COALESCE(
        (SELECT role FROM user_roles WHERE user_id = user_uuid ORDER BY created_at DESC LIMIT 1),
        (SELECT role FROM users WHERE id = user_uuid),
        'customer'
    );
END;
$$ LANGUAGE plpgsql;

-- Create function to set user role
CREATE OR REPLACE FUNCTION set_user_role(user_uuid UUID, new_role VARCHAR(20))
RETURNS VOID AS $$
BEGIN
    -- Insert new role record
    INSERT INTO user_roles (user_id, role) VALUES (user_uuid, new_role);
    
    -- Update users table for backward compatibility
    UPDATE users SET role = new_role WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql; 