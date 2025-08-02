# 🚀 Production Setup Guide - Health Tracker

## 📋 Overview

This guide will help you prepare the Health Tracker application for real users with proper security, authentication, and production-ready features.

## 🔒 Security Improvements Implemented

### ✅ **Enhanced Authentication**
- **Strong Password Requirements:** Minimum 8 characters, uppercase, lowercase, numbers, special characters
- **JWT Token Security:** Secure token generation and validation
- **Password Hashing:** bcrypt with 12 salt rounds
- **Session Management:** Automatic token refresh and expiry
- **Rate Limiting:** Protection against brute force attacks

### ✅ **Input Validation**
- **Email Validation:** Proper email format checking
- **Name Validation:** Character limits and format restrictions
- **Password Strength:** Real-time password validation
- **Data Sanitization:** Protection against injection attacks

### ✅ **API Security**
- **CORS Configuration:** Proper cross-origin resource sharing
- **Helmet Security:** HTTP headers protection
- **Request Validation:** Input sanitization and validation
- **Error Handling:** Secure error messages

## 🛠️ Production Setup Steps

### **Step 1: Environment Configuration**

Create a production `.env` file in the backend directory:

```bash
# Database Configuration
DB_HOST=your-production-db-host
DB_PORT=5432
DB_NAME=health_tracker_prod
DB_USER=health_user_prod
DB_PASSWORD=your-super-secure-password-here

# JWT Configuration - CHANGE THIS IMMEDIATELY!
JWT_SECRET=your-production-jwt-secret-key-here-make-it-very-long-and-random
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=production

# Email Configuration (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-production-email@gmail.com
EMAIL_PASS=your-app-specific-password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=https://your-domain.com

# Security Configuration
BCRYPT_SALT_ROUNDS=12
PASSWORD_MIN_LENGTH=8
SESSION_TIMEOUT=86400000
```

### **Step 2: Database Setup**

#### **Option A: PostgreSQL on Cloud Provider**
```bash
# Example for AWS RDS or similar
# Create a PostgreSQL database instance
# Update the DB_HOST, DB_USER, DB_PASSWORD in your .env file
```

#### **Option B: Docker in Production**
```bash
# Create production docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    container_name: health-tracker-db-prod
    restart: unless-stopped
    environment:
      POSTGRES_DB: health_tracker_prod
      POSTGRES_USER: health_user_prod
      POSTGRES_PASSWORD: your-super-secure-password-here
    volumes:
      - postgres_data_prod:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    networks:
      - health-tracker-network-prod

volumes:
  postgres_data_prod:
    driver: local

networks:
  health-tracker-network-prod:
    driver: bridge
```

### **Step 3: Backend Deployment**

#### **Install Dependencies**
```bash
cd backend
npm install --production
```

#### **Database Migration**
```bash
# Run the database initialization scripts
docker-compose up -d postgres
# Wait for database to be ready
# The init scripts will run automatically
```

#### **Start Backend Server**
```bash
# For development
npm run dev

# For production
npm start

# Or with PM2 for process management
npm install -g pm2
pm2 start server.js --name "health-tracker-api"
pm2 save
pm2 startup
```

### **Step 4: Frontend Deployment**

#### **Option A: Static Hosting (Recommended)**
```bash
# Build for production
# Serve the static files with a web server like nginx

# Example nginx configuration:
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/health-tracker;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### **Option B: CDN Deployment**
```bash
# Upload files to CDN (AWS S3, Cloudflare, etc.)
# Configure CORS properly for API calls
```

### **Step 5: SSL/HTTPS Setup**

#### **Using Let's Encrypt**
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔧 Configuration Files

### **Security Configuration (`backend/security-config.js`)**
```javascript
// Production security settings
module.exports = {
    password: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        maxLength: 128
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: '7d',
        refreshExpiresIn: '30d'
    },
    // ... other settings
};
```

### **Frontend Configuration**
Update `src/js/firebaseConfig.js`:
```javascript
// Set useLocalStorage to false for production
export const useLocalStorage = false;
```

## 📊 Monitoring and Logging

### **Application Monitoring**
```bash
# Install monitoring tools
npm install winston morgan

# Add to server.js
const winston = require('winston');
const morgan = require('morgan');

// Configure logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}
```

### **Database Monitoring**
```sql
-- Monitor user registrations
SELECT COUNT(*) as total_users, 
       DATE(created_at) as registration_date
FROM users 
GROUP BY DATE(created_at) 
ORDER BY registration_date DESC;

-- Monitor active sessions
SELECT COUNT(*) as active_sessions
FROM users 
WHERE updated_at > NOW() - INTERVAL '24 hours';
```

## 🔐 Security Checklist

### **✅ Pre-Deployment**
- [ ] Change all default passwords
- [ ] Generate strong JWT secret
- [ ] Configure SSL/HTTPS
- [ ] Set up firewall rules
- [ ] Configure rate limiting
- [ ] Enable security headers
- [ ] Set up monitoring and logging

### **✅ Post-Deployment**
- [ ] Test user registration
- [ ] Test login/logout flow
- [ ] Test password reset
- [ ] Verify email functionality
- [ ] Test API endpoints
- [ ] Monitor error logs
- [ ] Set up automated backups

### **✅ Ongoing Security**
- [ ] Regular security updates
- [ ] Monitor access logs
- [ ] Backup verification
- [ ] SSL certificate renewal
- [ ] Database maintenance

## 🚨 Important Security Notes

### **Critical Security Requirements**
1. **Change JWT Secret:** Generate a strong, random JWT secret
2. **Secure Database:** Use strong database passwords
3. **HTTPS Only:** Never use HTTP in production
4. **Environment Variables:** Never commit secrets to version control
5. **Regular Updates:** Keep dependencies updated
6. **Backup Strategy:** Implement automated backups
7. **Monitoring:** Set up application and security monitoring

### **Password Requirements for Users**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### **API Rate Limiting**
- 100 requests per 15 minutes per IP
- Configurable in security-config.js

## 📞 Support and Maintenance

### **Monitoring Tools**
- **Application:** PM2, Winston logs
- **Database:** pgAdmin, DBeaver
- **Server:** htop, nginx status
- **SSL:** Certbot, SSL Labs

### **Backup Strategy**
```bash
# Database backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U health_user_prod health_tracker_prod > backup_$DATE.sql
gzip backup_$DATE.sql
# Upload to cloud storage
```

### **Update Process**
```bash
# 1. Backup database
pg_dump health_tracker_prod > backup.sql

# 2. Update code
git pull origin main

# 3. Install dependencies
npm install

# 4. Restart application
pm2 restart health-tracker-api

# 5. Verify functionality
curl https://your-domain.com/api/health
```

## 🎯 Next Steps

1. **Deploy to staging environment first**
2. **Test all authentication flows**
3. **Set up monitoring and alerts**
4. **Configure automated backups**
5. **Plan for scaling as user base grows**

Your Health Tracker application is now ready for real users with enterprise-grade security! 🔒✨ 