# CRUD Test Guide - Health Tracker

This guide explains how to use the comprehensive test suite for register, edit, and delete operations in the Health Tracker application.

## 📋 Test Files Overview

### 1. Database CRUD Test (`test_database_crud.html`)
**Purpose**: Tests the complete CRUD operations at the database level with API calls.

**Features**:
- ✅ Backend health monitoring
- ✅ User registration and authentication
- ✅ Health record creation, reading, updating, and deletion
- ✅ User profile management
- ✅ Real-time status tracking
- ✅ Comprehensive error logging

**What it tests**:
- User registration with validation
- User login and token management
- Health record CRUD operations
- Profile updates
- Error handling and validation

### 2. Frontend Integration Test (`test_frontend_integration.html`)
**Purpose**: Tests the actual user interface and user interactions.

**Features**:
- ✅ Application loading verification
- ✅ Form validation testing
- ✅ Data submission simulation
- ✅ Record editing interface testing
- ✅ Record deletion with confirmation
- ✅ UI element detection
- ✅ Error handling verification

**What it tests**:
- Application interface loading
- Form validation and error display
- Data submission through UI
- Inline editing functionality
- Delete confirmation dialogs
- UI responsiveness and updates

### 3. API Endpoints Test (`test_api_endpoints_crud.html`)
**Purpose**: Comprehensive testing of all API endpoints with detailed reporting.

**Features**:
- ✅ Complete API endpoint coverage
- ✅ Authentication testing
- ✅ CRUD operations for all resources
- ✅ Error handling validation
- ✅ Data validation testing
- ✅ Endpoint documentation display

**What it tests**:
- All authentication endpoints
- User management endpoints
- Health record CRUD endpoints
- Error scenarios and edge cases
- Data validation rules

## 🚀 Setup Instructions

### Prerequisites
1. **Backend Server**: Ensure the Node.js backend is running
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Database**: Ensure PostgreSQL is running
   ```bash
   docker-compose up -d
   ```

3. **Frontend**: Start a local server
   ```bash
   python -m http.server 8000
   ```

### Running the Tests

#### 1. Database CRUD Test
```bash
# Open in browser
http://localhost:8000/tests/test_database_crud.html
```

**Steps**:
1. Click "Run All Tests" to execute the complete test suite
2. Or run individual tests:
   - Test Backend Health
   - Test User Registration
   - Test User Login
   - Test Create Record
   - Test Update Record
   - Test Delete Record

#### 2. Frontend Integration Test
```bash
# Open in browser
http://localhost:8000/tests/test_frontend_integration.html
```

**Steps**:
1. The application will load in an iframe
2. Click "Run All Frontend Tests" for comprehensive testing
3. Or test individual components:
   - Test App Load
   - Test Form Validation
   - Test Data Submission
   - Test Record Editing
   - Test Record Deletion

#### 3. API Endpoints Test
```bash
# Open in browser
http://localhost:8000/tests/test_api_endpoints_crud.html
```

**Steps**:
1. Click "Run All Endpoint Tests" for complete API testing
2. Or test specific endpoint categories:
   - Test Authentication
   - Test User Endpoints
   - Test Health Records
   - Test Error Handling
   - Test Validation

## 📊 Test Results Interpretation

### Success Indicators
- ✅ **Green status indicators**: All systems operational
- ✅ **Success messages**: Operations completed successfully
- ✅ **Data persistence**: Records created, updated, and deleted properly
- ✅ **Error handling**: Invalid data properly rejected

### Error Indicators
- ❌ **Red status indicators**: System failures
- ❌ **Error messages**: Specific failure reasons
- ❌ **Connection errors**: Backend not accessible
- ❌ **Validation errors**: Invalid data not properly handled

### Common Issues and Solutions

#### Backend Connection Issues
**Problem**: "Backend connection error"
**Solutions**:
1. Ensure backend server is running on port 3000
2. Check firewall settings
3. Verify CORS configuration

#### Database Connection Issues
**Problem**: "Database connection failed"
**Solutions**:
1. Ensure PostgreSQL is running
2. Check database credentials in `.env` file
3. Verify database schema is initialized

#### Authentication Issues
**Problem**: "Authentication failed"
**Solutions**:
1. Check JWT_SECRET in environment variables
2. Verify user registration completed successfully
3. Ensure token is being sent in headers

#### Frontend Loading Issues
**Problem**: "Application not loading"
**Solutions**:
1. Ensure frontend server is running
2. Check browser console for JavaScript errors
3. Verify all required files are accessible

## 🔧 Test Data

### User Test Data
```javascript
{
  email: "test_[timestamp]@healthtracker.com",
  name: "Test User",
  password: "TestPassword123!"
}
```

### Health Record Test Data
```javascript
{
  date: "2025-01-XX",
  weight: 75.5,
  height: 180,
  age: 30,
  body_fat_percentage: 15.2,
  body_fat_kg: 11.5,
  muscle_mass: 60.0,
  bone_mass: 3.2,
  bmi: 23.3,
  kcal: 2500,
  metabolic_age: 28,
  water_percentage: 65.0,
  visceral_fat: 5,
  fat_right_arm: 2.5,
  fat_left_arm: 2.5,
  fat_right_leg: 4.0,
  fat_left_leg: 4.0,
  fat_trunk: 8.0
}
```

## 📈 Test Coverage

### Database Operations
- ✅ **Create**: User registration, health record creation
- ✅ **Read**: User profile, health records, statistics
- ✅ **Update**: User profile, health record modifications
- ✅ **Delete**: Health record removal

### API Endpoints
- ✅ **Authentication**: `/auth/register`, `/auth/login`
- ✅ **Users**: `/users/profile`, `/users/stats`
- ✅ **Health Records**: Full CRUD operations
- ✅ **Statistics**: Summary and analytics

### Frontend Features
- ✅ **Form Validation**: Input validation and error display
- ✅ **Data Submission**: Form submission and feedback
- ✅ **Record Management**: Edit and delete operations
- ✅ **UI Updates**: Dynamic content updates
- ✅ **Error Handling**: User-friendly error messages

## 🛠️ Customization

### Adding New Tests
1. **Database Tests**: Add new test functions in the script section
2. **Frontend Tests**: Add UI interaction tests
3. **API Tests**: Add new endpoint test functions

### Modifying Test Data
1. Update the `testUserData` and `testRecordData` objects
2. Modify validation rules in the backend
3. Adjust expected responses in test functions

### Extending Coverage
1. **New Endpoints**: Add corresponding test functions
2. **New UI Features**: Add frontend interaction tests
3. **New Validation Rules**: Update test data and expectations

## 📝 Troubleshooting

### Test Failures
1. **Check Backend Logs**: Look for server-side errors
2. **Check Browser Console**: Look for client-side errors
3. **Verify Database**: Ensure data is being persisted correctly
4. **Check Network**: Verify API calls are reaching the server

### Performance Issues
1. **Database Queries**: Check for slow queries
2. **API Response Times**: Monitor endpoint performance
3. **Frontend Loading**: Check for large file sizes

### Security Testing
1. **Authentication**: Test with invalid tokens
2. **Authorization**: Test access to other users' data
3. **Input Validation**: Test with malicious data
4. **SQL Injection**: Test with special characters

## 🎯 Best Practices

### Running Tests
1. **Start Fresh**: Clear browser cache before testing
2. **Sequential Testing**: Run tests in order for dependencies
3. **Monitor Logs**: Watch both frontend and backend logs
4. **Clean Data**: Remove test data after testing

### Development Workflow
1. **Test First**: Write tests before implementing features
2. **Continuous Testing**: Run tests after each change
3. **Documentation**: Update this guide when adding new tests
4. **Version Control**: Commit test files with code changes

### Maintenance
1. **Regular Updates**: Keep test data current
2. **Dependency Updates**: Update test frameworks as needed
3. **Coverage Monitoring**: Track test coverage metrics
4. **Performance Monitoring**: Track test execution times

## 📞 Support

For issues with the test suite:
1. Check the troubleshooting section above
2. Review backend and frontend logs
3. Verify all prerequisites are met
4. Test with a fresh browser session

For feature requests or improvements:
1. Document the new test requirements
2. Update this guide accordingly
3. Ensure backward compatibility
4. Add appropriate error handling

---

**Last Updated**: January 2025
**Version**: 1.0
**Test Coverage**: Complete CRUD operations for users and health records 