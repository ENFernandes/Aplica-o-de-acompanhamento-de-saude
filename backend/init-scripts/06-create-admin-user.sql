-- Create default admin user
-- This script creates a default admin user for the Health Tracker application

-- Insert admin user if not exists
INSERT INTO users (email, name, password_hash, is_email_verified) VALUES
    ('admin@healthtracker.com', 'Administrator', crypt('admin123', gen_salt('bf')), true)
ON CONFLICT (email) DO NOTHING;

-- Set admin role for the admin user
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Get the admin user ID
    SELECT id INTO admin_user_id FROM users WHERE email = 'admin@healthtracker.com';
    
    IF admin_user_id IS NOT NULL THEN
        -- Insert admin role if not exists (check first to avoid duplicates)
        IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = admin_user_id AND role = 'admin') THEN
            INSERT INTO user_roles (user_id, role)
            VALUES (admin_user_id, 'admin');
        END IF;
        
        -- Update users table for backward compatibility
        UPDATE users SET role = 'admin' WHERE id = admin_user_id;
        
        RAISE NOTICE 'Admin user created/updated successfully with ID: %', admin_user_id;
    ELSE
        RAISE NOTICE 'Admin user not found or could not be created';
    END IF;
END $$;

