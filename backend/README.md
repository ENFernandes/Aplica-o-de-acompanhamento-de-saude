# Health Tracker Backend API

A Node.js/Express backend API for the Health Tracker application with PostgreSQL database support.

## Features

- 🔐 **JWT Authentication** - Secure user authentication and authorization
- 📊 **Health Records Management** - CRUD operations for health data
- 👤 **User Profile Management** - User account and profile operations
- 🔒 **Data Validation** - Comprehensive input validation using Joi
- 🛡️ **Security** - Rate limiting, CORS, and security headers
- 📈 **Statistics** - Health data analytics and user statistics
- 🗄️ **PostgreSQL** - Robust database with data integrity constraints

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- Docker (optional, for database setup)

## Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Start the database:**
   ```bash
   # Using Docker Compose (recommended)
   docker-compose up -d postgres
   
   # Or connect to your existing PostgreSQL instance
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=health_tracker
DB_USER=health_user
DB_PASSWORD=health_password_2024

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:8000
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Request password reset

### Health Records

- `GET /api/health-records` - Get all health records
- `GET /api/health-records/:id` - Get specific health record
- `POST /api/health-records` - Create new health record
- `PUT /api/health-records/:id` - Update health record
- `DELETE /api/health-records/:id` - Delete health record
- `GET /api/health-records/stats/summary` - Get health statistics

### User Profile

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/stats` - Get user statistics

### Health Check

- `GET /api/health` - API health check

## Database Schema

### Users Table
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

### Health Records Table
```sql
CREATE TABLE health_records (
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
```

## Data Validation

The API includes comprehensive validation for:

- **User Registration**: Email format, password strength, name length
- **Health Records**: Numeric ranges, data consistency, required fields
- **Profile Updates**: Name validation
- **Password Changes**: Current password verification, new password strength

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt with salt rounds
- **Rate Limiting** - Prevents abuse
- **CORS Protection** - Cross-origin request control
- **Input Validation** - Prevents malicious input
- **SQL Injection Protection** - Parameterized queries

## Error Handling

The API provides consistent error responses:

```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Internal Server Error

## Development

### Running in Development Mode
```bash
npm run dev
```

### Running Tests
```bash
npm test
```

### Production Build
```bash
npm start
```

## Docker Support

The application includes Docker Compose configuration for easy database setup:

```bash
# Start PostgreSQL and pgAdmin
docker-compose up -d

# Stop services
docker-compose down
```

## API Documentation

### Authentication Flow

1. **Register**: `POST /api/auth/register`
   ```json
   {
     "email": "user@example.com",
     "password": "password123",
     "name": "John Doe"
   }
   ```

2. **Login**: `POST /api/auth/login`
   ```json
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

3. **Use Token**: Include in Authorization header
   ```
   Authorization: Bearer <jwt_token>
   ```

### Health Record Example

```json
{
  "date": "2025-07-28",
  "weight": 75.5,
  "height": 175,
  "age": 30,
  "body_fat_percentage": 15.2,
  "body_fat_kg": 11.5,
  "muscle_mass": 60.2,
  "bone_mass": 3.8,
  "bmi": 24.7,
  "kcal": 2500,
  "metabolic_age": 28,
  "water_percentage": 65.3,
  "visceral_fat": 4
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details. 