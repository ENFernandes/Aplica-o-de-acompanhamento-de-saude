-- Health Tracker Database Initialization
-- This script creates the database schema for the Health Tracker application

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create health_records table
CREATE TABLE IF NOT EXISTS health_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    weight DECIMAL(5,2),
    height INTEGER,
    age INTEGER,
    body_fat_percentage DECIMAL(4,2),
    body_fat_kg DECIMAL(5,2),
    muscle_mass DECIMAL(5,2),
    bone_mass DECIMAL(4,2),
    bmi DECIMAL(4,2),
    kcal INTEGER,
    metabolic_age INTEGER,
    water_percentage DECIMAL(4,2),
    visceral_fat INTEGER,
    fat_right_arm DECIMAL(4,2),
    fat_left_arm DECIMAL(4,2),
    fat_right_leg DECIMAL(4,2),
    fat_left_leg DECIMAL(4,2),
    fat_trunk DECIMAL(4,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_health_records_user_id ON health_records(user_id);
CREATE INDEX IF NOT EXISTS idx_health_records_date ON health_records(date);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_health_records_updated_at 
    BEFORE UPDATE ON health_records 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to calculate BMI
CREATE OR REPLACE FUNCTION calculate_bmi(weight_kg DECIMAL, height_cm INTEGER)
RETURNS DECIMAL AS $$
BEGIN
    IF weight_kg IS NULL OR height_cm IS NULL OR height_cm = 0 THEN
        RETURN NULL;
    END IF;
    
    RETURN weight_kg / POWER(height_cm::DECIMAL / 100, 2);
END;
$$ LANGUAGE plpgsql;

-- Create function to validate health record data
CREATE OR REPLACE FUNCTION validate_health_record()
RETURNS TRIGGER AS $$
BEGIN
    -- Validate BMI calculation if both weight and height are provided
    IF NEW.weight IS NOT NULL AND NEW.height IS NOT NULL AND NEW.bmi IS NOT NULL THEN
        DECLARE
            calculated_bmi DECIMAL;
        BEGIN
            calculated_bmi := calculate_bmi(NEW.weight, NEW.height);
            IF ABS(NEW.bmi - calculated_bmi) > 1.0 THEN
                RAISE EXCEPTION 'BMI value is inconsistent with weight and height';
            END IF;
        END;
    END IF;
    
    -- Validate body fat percentage calculation
    IF NEW.weight IS NOT NULL AND NEW.body_fat_kg IS NOT NULL AND NEW.body_fat_percentage IS NOT NULL THEN
        DECLARE
            calculated_percentage DECIMAL;
        BEGIN
            calculated_percentage := (NEW.body_fat_kg / NEW.weight) * 100;
            IF ABS(NEW.body_fat_percentage - calculated_percentage) > 1.0 THEN
                RAISE EXCEPTION 'Body fat percentage is inconsistent with weight and body fat kg';
            END IF;
        END;
    END IF;
    
    -- Validate component mass sum
    IF NEW.weight IS NOT NULL AND NEW.body_fat_kg IS NOT NULL AND NEW.muscle_mass IS NOT NULL AND NEW.bone_mass IS NOT NULL THEN
        DECLARE
            component_mass DECIMAL;
        BEGIN
            component_mass := NEW.body_fat_kg + NEW.muscle_mass + NEW.bone_mass;
            IF component_mass > NEW.weight + 1 THEN
                RAISE EXCEPTION 'Component masses exceed total weight';
            END IF;
        END;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for health record validation
CREATE TRIGGER validate_health_record_trigger
    BEFORE INSERT OR UPDATE ON health_records
    FOR EACH ROW EXECUTE FUNCTION validate_health_record();

-- Insert sample data for testing
INSERT INTO users (email, name, password_hash, is_email_verified) VALUES
    ('test@healthtracker.com', 'Test User', crypt('password123', gen_salt('bf')), true)
ON CONFLICT (email) DO NOTHING;

-- Get the test user ID for sample data
DO $$
DECLARE
    test_user_id UUID;
BEGIN
    SELECT id INTO test_user_id FROM users WHERE email = 'test@healthtracker.com';
    
    IF test_user_id IS NOT NULL THEN
        -- Insert sample health records
        INSERT INTO health_records (
            user_id, date, weight, height, age, body_fat_percentage, 
            body_fat_kg, muscle_mass, bone_mass, bmi, kcal, 
            metabolic_age, water_percentage, visceral_fat
        ) VALUES
            (test_user_id, '2025-07-20', 94.4, 169, 35, 27.2, 25.7, 65.3, 3.4, 33.1, 4263, 20, 62.1, 6),
            (test_user_id, '2025-07-21', 95.6, 169, 35, 28.8, 27.5, 64.6, 3.4, 33.6, 4218, 20, 62.1, 6),
            (test_user_id, '2025-07-22', 92.2, 169, 35, 25.6, 23.6, 65.1, 3.4, 32.4, 4269, 20, 63.4, 4),
            (test_user_id, '2025-07-23', 90.4, 169, 35, 22.7, 20.5, 66.4, 3.4, 31.8, 4264, 20, 68.9, 4),
            (test_user_id, '2025-07-24', 87.9, 169, 35, 21.6, 19.0, 65.7, 3.4, 30.9, 4124, 20, 62.2, 4)
        ON CONFLICT DO NOTHING;
    END IF;
END $$; 