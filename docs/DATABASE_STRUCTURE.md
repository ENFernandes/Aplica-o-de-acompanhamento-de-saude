# 📊 Database Structure - Health Tracker

## 🗄️ Database Overview

The Health Tracker application uses **PostgreSQL** with a comprehensive schema designed for health monitoring and fitness tracking.

## 📋 Main Tables

### 1. **users** - User Accounts
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose:** Store user authentication and profile information

### 2. **health_records** - Main Health Data
```sql
CREATE TABLE health_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    weight DECIMAL(5,2),           -- Weight in kg
    height INTEGER,                 -- Height in cm
    age INTEGER,                    -- Age
    body_fat_percentage DECIMAL(4,2), -- Body fat %
    body_fat_kg DECIMAL(5,2),      -- Body fat in kg
    muscle_mass DECIMAL(5,2),      -- Muscle mass in kg
    bone_mass DECIMAL(4,2),        -- Bone mass in kg
    bmi DECIMAL(4,2),              -- Body Mass Index
    kcal INTEGER,                   -- Daily caloric needs
    metabolic_age INTEGER,          -- Metabolic age
    water_percentage DECIMAL(4,2),  -- Water percentage
    visceral_fat INTEGER,           -- Visceral fat level
    fat_right_arm DECIMAL(4,2),    -- Right arm fat %
    fat_left_arm DECIMAL(4,2),     -- Left arm fat %
    fat_right_leg DECIMAL(4,2),    -- Right leg fat %
    fat_left_leg DECIMAL(4,2),     -- Left leg fat %
    fat_trunk DECIMAL(4,2),        -- Trunk fat %
    notes TEXT,                     -- Additional notes
    mood VARCHAR(50),               -- Mood tracking
    sleep_hours DECIMAL(3,1),      -- Sleep hours
    exercise_minutes INTEGER,       -- Exercise minutes
    water_intake_liters DECIMAL(4,2), -- Water intake
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose:** Core health tracking data including weight, body composition, and measurements

### 3. **user_goals** - Fitness Goals
```sql
CREATE TABLE user_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    goal_type VARCHAR(50) NOT NULL, -- 'weight', 'body_fat', 'muscle_mass', 'bmi'
    target_value DECIMAL(8,2) NOT NULL,
    current_value DECIMAL(8,2),
    start_date DATE NOT NULL,
    target_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose:** Track user fitness goals and targets

### 4. **exercise_records** - Exercise Tracking
```sql
CREATE TABLE exercise_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    exercise_type VARCHAR(100) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    calories_burned INTEGER,
    intensity VARCHAR(20), -- 'low', 'medium', 'high'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose:** Track exercise sessions and workouts

### 5. **nutrition_records** - Nutrition Tracking
```sql
CREATE TABLE nutrition_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    meal_type VARCHAR(20) NOT NULL, -- 'breakfast', 'lunch', 'dinner', 'snack'
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
```

**Purpose:** Track nutrition and meal data

### 6. **measurement_records** - Body Measurements
```sql
CREATE TABLE measurement_records (
    id UUID PRIMARY KEY PRIMARY KEY DEFAULT uuid_generate_v4(),
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
```

**Purpose:** Track body circumference measurements

### 7. **user_settings** - User Preferences
```sql
CREATE TABLE user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, setting_key)
);
```

**Purpose:** Store user preferences and app settings

## 🔗 Relationships

```
users (1) ←→ (N) health_records
users (1) ←→ (N) user_goals
users (1) ←→ (N) exercise_records
users (1) ←→ (N) nutrition_records
users (1) ←→ (N) measurement_records
users (1) ←→ (N) user_settings
```

## 📊 Views

### **health_summary** - Comprehensive Health Summary
```sql
CREATE VIEW health_summary AS
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
```

## 🔧 Functions

### **calculate_bmi()** - BMI Calculation
```sql
CREATE FUNCTION calculate_bmi(weight_kg DECIMAL, height_cm INTEGER)
RETURNS DECIMAL AS $$
BEGIN
    IF weight_kg IS NULL OR height_cm IS NULL OR height_cm = 0 THEN
        RETURN NULL;
    END IF;
    
    RETURN weight_kg / POWER(height_cm::DECIMAL / 100, 2);
END;
$$ LANGUAGE plpgsql;
```

### **get_user_progress()** - User Progress Tracking
```sql
CREATE FUNCTION get_user_progress(p_user_id UUID, p_days INTEGER DEFAULT 30)
RETURNS TABLE (
    date DATE,
    weight DECIMAL(5,2),
    body_fat_percentage DECIMAL(4,2),
    muscle_mass DECIMAL(5,2),
    bmi DECIMAL(4,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        hr.date,
        hr.weight,
        hr.body_fat_percentage,
        hr.muscle_mass,
        hr.bmi
    FROM health_records hr
    WHERE hr.user_id = p_user_id
    AND hr.date >= CURRENT_DATE - INTERVAL '1 day' * p_days
    ORDER BY hr.date DESC;
END;
$$ LANGUAGE plpgsql;
```

## 🗂️ Indexes

### Performance Indexes
```sql
-- Users table
CREATE INDEX idx_users_email ON users(email);

-- Health records table
CREATE INDEX idx_health_records_user_id ON health_records(user_id);
CREATE INDEX idx_health_records_date ON health_records(date);
CREATE INDEX idx_health_records_date_user ON health_records(date, user_id);
CREATE INDEX idx_health_records_weight ON health_records(weight);
CREATE INDEX idx_health_records_bmi ON health_records(bmi);

-- Other tables
CREATE INDEX idx_user_goals_user_id ON user_goals(user_id);
CREATE INDEX idx_user_goals_active ON user_goals(is_active);
CREATE INDEX idx_exercise_records_user_id ON exercise_records(user_id);
CREATE INDEX idx_exercise_records_date ON exercise_records(date);
CREATE INDEX idx_nutrition_records_user_id ON nutrition_records(user_id);
CREATE INDEX idx_nutrition_records_date ON nutrition_records(date);
CREATE INDEX idx_measurement_records_user_id ON measurement_records(user_id);
CREATE INDEX idx_measurement_records_date ON measurement_records(date);
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);
```

## 🔄 Triggers

### **Automatic Updates**
- `update_updated_at_column()` - Updates `updated_at` timestamp on all tables
- `validate_health_record()` - Validates health record data consistency
- `calculate_bmi_from_weight_height()` - Automatically calculates BMI

## 📈 Sample Data

The database includes sample data for testing:
- **Test User:** test@healthtracker.com
- **Sample Health Records:** 5 records with weight progression
- **Sample Goals:** Weight, body fat, and muscle mass targets
- **Sample Exercise:** Weight training, cardio, yoga sessions
- **Sample Nutrition:** Breakfast, lunch, dinner entries
- **Sample Measurements:** Body circumference data

## 🚀 Database Connection

**Default Configuration:**
- **Host:** localhost
- **Port:** 5432
- **Database:** health_tracker
- **User:** health_user
- **Password:** health_password_2024

## 📋 Data Types Summary

| Field Type | Description | Examples |
|------------|-------------|----------|
| `UUID` | Unique identifiers | User IDs, Record IDs |
| `DECIMAL(5,2)` | Weight measurements | 85.50 kg |
| `DECIMAL(4,2)` | Percentages | 25.30% |
| `INTEGER` | Whole numbers | Age, Height (cm) |
| `DATE` | Date values | 2025-07-29 |
| `TEXT` | Long text | Notes, descriptions |
| `VARCHAR` | Short text | Names, types |
| `BOOLEAN` | True/False | Active flags |

This comprehensive database structure supports all the health tracking features of the application while maintaining data integrity and performance. 