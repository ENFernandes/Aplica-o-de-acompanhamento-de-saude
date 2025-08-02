# 🗑️ Delete All Users from Database

## 📋 Database Connection Details

| Setting | Value |
|---------|-------|
| **Host** | localhost |
| **Port** | 5432 |
| **Database** | health_tracker |
| **Username** | health_user |
| **Password** | health_password_2024 |

## 🔧 Method 1: Using DBeaver (Recommended)

### **Step 1: Connect to Database**
1. Open DBeaver
2. Create new PostgreSQL connection with the details above
3. Connect to the database

### **Step 2: Delete Users**
Run this SQL query in DBeaver:

```sql
-- Delete all users and related data
DELETE FROM health_records;
DELETE FROM user_goals;
DELETE FROM exercise_records;
DELETE FROM nutrition_records;
DELETE FROM measurement_records;
DELETE FROM user_settings;
DELETE FROM users;

-- Reset auto-increment sequences (if any)
-- ALTER SEQUENCE users_id_seq RESTART WITH 1;
```

### **Step 3: Verify Deletion**
```sql
-- Check if users are deleted
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_health_records FROM health_records;
```

## 🔧 Method 2: Using pgAdmin

### **Step 1: Access pgAdmin**
- **URL:** http://localhost:5050
- **Email:** admin@healthtracker.com
- **Password:** admin_password_2024

### **Step 2: Execute SQL**
1. Open Query Tool
2. Run the same SQL commands as above

## 🔧 Method 3: Using Command Line

### **Step 1: Connect to PostgreSQL Container**
```bash
docker exec -it health-tracker-db psql -U health_user -d health_tracker
```

### **Step 2: Delete Users**
```sql
-- Delete all data
DELETE FROM health_records;
DELETE FROM user_goals;
DELETE FROM exercise_records;
DELETE FROM nutrition_records;
DELETE FROM measurement_records;
DELETE FROM user_settings;
DELETE FROM users;

-- Exit PostgreSQL
\q
```

## 🔧 Method 4: Reset Entire Database

### **Option A: Drop and Recreate Database**
```bash
# Stop containers
docker-compose down

# Remove database volume
docker volume rm aplicaodeacompanhamentodesade_postgres_data

# Restart containers
docker-compose up -d
```

### **Option B: Reset with Docker**
```bash
# Stop and remove containers
docker-compose down

# Remove all data
docker volume rm aplicaodeacompanhamentodesade_postgres_data
docker volume rm aplicaodeacompanhamentodesade_pgadmin_data

# Start fresh
docker-compose up -d
```

## ⚠️ **Important Warnings**

### **⚠️ Data Loss Warning**
- **ALL USER DATA WILL BE PERMANENTLY DELETED**
- **This action cannot be undone**
- **Make sure you have backups if needed**

### **⚠️ Application Impact**
- All user accounts will be removed
- All health records will be deleted
- All goals and settings will be lost
- Users will need to register again

## 🔍 **Verification Commands**

### **Check Current Users**
```sql
-- Count total users
SELECT COUNT(*) as total_users FROM users;

-- List all users
SELECT id, email, name, created_at FROM users;

-- Check related data
SELECT COUNT(*) as health_records FROM health_records;
SELECT COUNT(*) as user_goals FROM user_goals;
SELECT COUNT(*) as exercise_records FROM exercise_records;
```

### **Check Database Size**
```sql
-- Database size information
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats
WHERE tablename IN ('users', 'health_records', 'user_goals');
```

## 🚀 **After Deletion**

### **Reinitialize Sample Data (Optional)**
If you want to add sample data back:

```sql
-- Insert sample user
INSERT INTO users (email, name, password_hash, is_email_verified) VALUES
    ('test@healthtracker.com', 'Test User', crypt('password123', gen_salt('bf')), true);

-- Get the test user ID
DO $$
DECLARE
    test_user_id UUID;
BEGIN
    SELECT id INTO test_user_id FROM users WHERE email = 'test@healthtracker.com';
    
    IF test_user_id IS NOT NULL THEN
        -- Insert sample health records
        INSERT INTO health_records (user_id, date, weight, height, age, body_fat_percentage, body_fat_kg, muscle_mass, bone_mass, bmi) VALUES
            (test_user_id, '2025-07-29', 85.0, 175, 30, 20.0, 17.0, 65.0, 3.0, 27.8);
    END IF;
END $$;
```

## 📊 **Quick Commands Summary**

### **Delete All Users (DBeaver/pgAdmin)**
```sql
DELETE FROM health_records;
DELETE FROM user_goals;
DELETE FROM exercise_records;
DELETE FROM nutrition_records;
DELETE FROM measurement_records;
DELETE FROM user_settings;
DELETE FROM users;
```

### **Reset Entire Database**
```bash
docker-compose down
docker volume rm aplicaodeacompanhamentodesade_postgres_data
docker-compose up -d
```

### **Check Results**
```sql
SELECT COUNT(*) as total_users FROM users;
```

Choose the method that best fits your needs! 🎯 