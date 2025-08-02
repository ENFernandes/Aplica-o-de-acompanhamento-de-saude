# 🔗 DBeaver Connection Guide - Health Tracker Database

## 📋 Prerequisites

1. **DBeaver installed** on your system
2. **Docker Desktop running** (for the database)
3. **Database containers started**

## 🚀 Step 1: Start the Database

```bash
# Navigate to your project directory
cd "C:\Users\Elder\Desktop\Projects\Aplicação de Acompanhamento de Saúde"

# Start the database containers
docker-compose up -d
```

**Expected output:**
```
[+] Running 2/2
 ✔ Container health-tracker-db       Healthy
 ✔ Container health-tracker-pgadmin  Running
```

## 🔧 Step 2: Open DBeaver

1. **Launch DBeaver**
2. **Click "New Database Connection"** (plug icon)
3. **Select "PostgreSQL"** from the database list

## ⚙️ Step 3: Configure Connection

### **Main Settings Tab:**

| Field | Value | Description |
|-------|-------|-------------|
| **Host** | `localhost` | Database server address |
| **Port** | `5432` | PostgreSQL default port |
| **Database** | `health_tracker` | Database name |
| **Username** | `health_user` | Database user |
| **Password** | `health_password_2024` | Database password |

### **Driver Properties Tab (Optional):**

| Property | Value | Description |
|----------|-------|-------------|
| **ApplicationName** | `HealthTracker` | Application identifier |
| **sslmode** | `disable` | SSL mode (for local development) |

## 🔍 Step 4: Test Connection

1. **Click "Test Connection"** button
2. **You should see:** "Connected" message
3. **Click "OK"** to save the connection

## 📊 Step 5: Explore the Database

### **Tables You'll See:**

1. **`users`** - User accounts and authentication
2. **`health_records`** - Main health tracking data
3. **`user_goals`** - Fitness goals and targets
4. **`exercise_records`** - Exercise tracking
5. **`nutrition_records`** - Nutrition tracking
6. **`measurement_records`** - Body measurements
7. **`user_settings`** - User preferences

### **Views:**

1. **`health_summary`** - Comprehensive health summary

### **Functions:**

1. **`calculate_bmi()`** - BMI calculation function
2. **`get_user_progress()`** - User progress tracking

## 🔍 Step 6: Sample Queries

### **View All Health Records:**
```sql
SELECT * FROM health_records ORDER BY date DESC;
```

### **View User Summary:**
```sql
SELECT * FROM health_summary;
```

### **View Sample Data:**
```sql
SELECT 
    hr.date,
    hr.weight,
    hr.body_fat_percentage,
    hr.muscle_mass,
    hr.bmi
FROM health_records hr
JOIN users u ON hr.user_id = u.id
WHERE u.email = 'test@healthtracker.com'
ORDER BY hr.date DESC;
```

### **View User Goals:**
```sql
SELECT 
    ug.goal_type,
    ug.target_value,
    ug.current_value,
    ug.start_date,
    ug.target_date,
    ug.is_active
FROM user_goals ug
JOIN users u ON ug.user_id = u.id
WHERE u.email = 'test@healthtracker.com';
```

## 🛠️ Troubleshooting

### **Connection Failed:**

1. **Check if Docker is running:**
   ```bash
   docker ps
   ```

2. **Check if database container is healthy:**
   ```bash
   docker-compose ps
   ```

3. **Restart containers if needed:**
   ```bash
   docker-compose down
   docker-compose up -d
   ```

### **Port Already in Use:**

If port 5432 is already in use, you can:
1. **Stop other PostgreSQL services**
2. **Or modify the docker-compose.yml to use a different port**

### **Authentication Failed:**

1. **Verify credentials:**
   - Username: `health_user`
   - Password: `health_password_2024`

2. **Check if database exists:**
   ```sql
   SELECT current_database();
   ```

## 📈 Database Statistics

### **Sample Data Available:**

- **1 Test User:** test@healthtracker.com
- **5 Health Records:** Weight progression data
- **3 User Goals:** Weight, body fat, muscle mass targets
- **3 Exercise Records:** Weight training, cardio, yoga
- **3 Nutrition Records:** Breakfast, lunch, dinner
- **1 Measurement Record:** Body circumference data

### **Database Size:**
- **Tables:** 7 main tables
- **Indexes:** 15+ performance indexes
- **Functions:** 3 utility functions
- **Views:** 1 summary view
- **Triggers:** 8 automatic triggers

## 🔐 Security Notes

- **Local Development:** SSL is disabled for local development
- **Production:** Enable SSL and use strong passwords in production
- **Backup:** Regular database backups recommended
- **Access Control:** Limit database access to authorized users only

## 📞 Alternative: pgAdmin Access

You can also access the database through pgAdmin:

- **URL:** http://localhost:5050
- **Email:** admin@healthtracker.com
- **Password:** admin_password_2024

## 🎯 Next Steps

1. **Explore the tables** to understand the data structure
2. **Run sample queries** to see the data
3. **Create custom queries** for your specific needs
4. **Export data** if needed for analysis
5. **Monitor database performance** using DBeaver's tools

Your Health Tracker database is now accessible through DBeaver! 🎉 