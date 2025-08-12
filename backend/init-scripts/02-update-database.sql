-- See root init-scripts/02-update-database.sql
-- Copied for container build on Render

-- Create additional indexes for better performance
CREATE INDEX IF NOT EXISTS idx_health_records_date_user ON health_records(date, user_id);
CREATE INDEX IF NOT EXISTS idx_health_records_weight ON health_records(weight);
CREATE INDEX IF NOT EXISTS idx_health_records_bmi ON health_records(bmi);

-- Add new columns to health_records table for enhanced tracking
ALTER TABLE health_records ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE health_records ADD COLUMN IF NOT EXISTS mood VARCHAR(50);
ALTER TABLE health_records ADD COLUMN IF NOT EXISTS sleep_hours DECIMAL(3,1);
ALTER TABLE health_records ADD COLUMN IF NOT EXISTS exercise_minutes INTEGER;
ALTER TABLE health_records ADD COLUMN IF NOT EXISTS water_intake_liters DECIMAL(4,2);

-- Create a new table for goals and targets
CREATE TABLE IF NOT EXISTS user_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    goal_type VARCHAR(50) NOT NULL,
    target_value DECIMAL(8,2) NOT NULL,
    current_value DECIMAL(8,2),
    start_date DATE NOT NULL,
    target_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_user_goals_user_id ON user_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_goals_active ON user_goals(is_active);

-- Exercise tracking
CREATE TABLE IF NOT EXISTS exercise_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    exercise_type VARCHAR(100) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    calories_burned INTEGER,
    intensity VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_exercise_records_user_id ON exercise_records(user_id);
CREATE INDEX IF NOT EXISTS idx_exercise_records_date ON exercise_records(date);

-- Nutrition tracking
CREATE TABLE IF NOT EXISTS nutrition_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    meal_type VARCHAR(20) NOT NULL,
    food_name VARCHAR(200) NOT NULL,
    calories INTEGER,
    protein_grams DECIMAL(5,2),
    carbs_grams DECIMAL(5,2),
    fat_grams DECIMAL(5,2),
    fiber_grams DECIMAL(5,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_nutrition_records_user_id ON nutrition_records(user_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_records_date ON nutrition_records(date);

-- Measurements
CREATE TABLE IF NOT EXISTS measurement_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    chest_cm DECIMAL(5,2),
    waist_cm DECIMAL(5,2),
    hips_cm DECIMAL(5,2),
    biceps_cm DECIMAL(5,2),
    thighs_cm DECIMAL(5,2),
    calves_cm DECIMAL(5,2),
    neck_cm DECIMAL(5,2),
    forearm_cm DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_measurement_records_user_id ON measurement_records(user_id);
CREATE INDEX IF NOT EXISTS idx_measurement_records_date ON measurement_records(date);

-- User settings
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, setting_key)
);

CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- Triggers
CREATE TRIGGER update_user_goals_updated_at 
    BEFORE UPDATE ON user_goals 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercise_records_updated_at 
    BEFORE UPDATE ON exercise_records 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nutrition_records_updated_at 
    BEFORE UPDATE ON nutrition_records 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_measurement_records_updated_at 
    BEFORE UPDATE ON measurement_records 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at 
    BEFORE UPDATE ON user_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Views and functions
CREATE OR REPLACE VIEW health_summary AS
SELECT 
    u.id as user_id,
    u.name,
    u.email,
    COUNT(hr.id) as total_records,
    MIN(hr.date) as first_record_date,
    MAX(hr.date) as last_record_date,
    AVG(hr.weight) as avg_weight,
    MIN(hr.weight) as min_weight,
    MAX(hr.weight) as max_weight,
    AVG(hr.bmi) as avg_bmi,
    AVG(hr.body_fat_percentage) as avg_body_fat,
    AVG(hr.muscle_mass) as avg_muscle_mass,
    COUNT(ug.id) as active_goals,
    COUNT(er.id) as exercise_sessions,
    COUNT(nr.id) as nutrition_entries
FROM users u
LEFT JOIN health_records hr ON u.id = hr.user_id
LEFT JOIN user_goals ug ON u.id = ug.user_id AND ug.is_active = true
LEFT JOIN exercise_records er ON u.id = er.user_id
LEFT JOIN nutrition_records nr ON u.id = nr.user_id
GROUP BY u.id, u.name, u.email;

CREATE OR REPLACE FUNCTION calculate_bmi_from_weight_height()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.weight IS NOT NULL AND NEW.height IS NOT NULL THEN
        NEW.bmi := calculate_bmi(NEW.weight, NEW.height);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS calculate_bmi_trigger ON health_records;
CREATE TRIGGER calculate_bmi_trigger
    BEFORE INSERT OR UPDATE ON health_records
    FOR EACH ROW EXECUTE FUNCTION calculate_bmi_from_weight_height();

-- Permissions
GRANT SELECT ON health_summary TO health_user;
GRANT EXECUTE ON FUNCTION get_user_progress(UUID, INTEGER) TO health_user;

-- Backfill BMI when missing
UPDATE health_records 
SET bmi = calculate_bmi(weight, height) 
WHERE bmi IS NULL AND weight IS NOT NULL AND height IS NOT NULL;

-- Comments
COMMENT ON TABLE users IS 'User accounts and authentication information';
COMMENT ON TABLE health_records IS 'Main health tracking data including weight, body composition, and measurements';
COMMENT ON TABLE user_goals IS 'User-defined health and fitness goals';
COMMENT ON TABLE exercise_records IS 'Exercise and workout tracking data';
COMMENT ON TABLE nutrition_records IS 'Nutrition and meal tracking data';
COMMENT ON TABLE measurement_records IS 'Body circumference and measurement tracking';
COMMENT ON TABLE user_settings IS 'User preferences and application settings';
COMMENT ON VIEW health_summary IS 'Comprehensive summary view of user health data and activity';

