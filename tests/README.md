# Test Files

This folder contains all test files for the Health Monitoring Application.

## HTML Test Files

### Authentication Tests
- `test_auth.html` - Authentication functionality tests
- `test_login.html` - Login form tests
- `test_login_flow.html` - Complete login flow testing
- `test_registration.html` - User registration tests
- `debug_login.html` - Debug version of login functionality

### UI Component Tests
- `test_dropdown.html` - Dropdown component tests
- `test_height_field.html` - Height input field tests
- `test_profile_modal.html` - Profile modal component tests
- `test_height_population.html` - Height auto-population from profile tests
- `test_height_age_population.html` - Height and age population tests
- `test_height_profile.html` - Height profile integration tests

### API and Backend Tests
- `test_api_endpoints.html` - API endpoint testing
- `test_all_routes.html` - All route testing
- `test_health_records.html` - Health records API testing
- `test_profile_update.html` - Profile update functionality tests
- `debug_routes.html` - Route debugging utilities
- `quick_test.html` - Quick API health checks

### Database Tests
- `test_db_columns.html` - Database column verification tests
- `test_birthday_age.html` - Birthday and age calculation tests

### Application Tests
- `test_clean_app.html` - Clean application state tests
- `test_fixes.html` - Bug fixes and improvements tests
- `simple_test.html` - Basic functionality tests
- `simple_app_test.html` - Simple application tests
- `direct_app_test.html` - Direct application testing
- `test_fix_verification.html` - Fix verification tests

### Debug Files
- `debug.html` - General debugging utilities

## Python Test Files

### API Tests
- `test_api.py` - General API testing
- `test_backend_api.py` - Backend API specific tests

## Test Categories

### 🔐 Authentication & Security
- Login, registration, and authentication flow tests
- Security validation and token testing

### 🎨 UI Components
- Form field testing and validation
- Modal and dropdown component tests
- Height and age auto-population tests

### 🔌 API Integration
- Backend API endpoint testing
- Health records CRUD operations
- Profile management API tests

### 🗄️ Database
- Database schema verification
- Column existence and data type tests
- Birthday and age calculation tests

### 🐛 Debugging
- Route debugging and verification
- Quick health checks
- Fix verification and testing

## Usage

### HTML Tests
1. Start the backend server: `cd backend && npm start`
2. Start the frontend server: `python -m http.server 8000`
3. Open test files in browser: `http://localhost:8000/tests/[test-file].html`

### Python Tests
1. Install Python dependencies: `pip install requests`
2. Run tests: `python tests/test_api.py` or `python tests/test_backend_api.py`

## Quick Test Guide

### For API Testing
- Use `quick_test.html` for basic health checks
- Use `test_api_endpoints.html` for comprehensive API testing
- Use `test_health_records.html` for health records functionality

### For UI Testing
- Use `test_height_population.html` for height auto-population
- Use `test_profile_update.html` for profile management
- Use `test_registration.html` for user registration

### For Debugging
- Use `debug_routes.html` for route debugging
- Use `test_fix_verification.html` for fix verification
- Use `debug.html` for general debugging

## Notes

- All test files have been organized from the root directory to this structured folder
- Each test file focuses on specific functionality or components
- Debug files are included for troubleshooting purposes
- Tests are categorized by functionality for easy navigation
- Both HTML and Python tests are available for different testing needs 