#!/usr/bin/env python3
"""
Health Tracker Backend API Test Script
Tests the Node.js backend API endpoints
"""

import requests
import json
import time
from datetime import datetime

# API Configuration
BASE_URL = "http://localhost:3000/api"
HEADERS = {
    'Content-Type': 'application/json'
}

def test_server_health():
    """Test if the backend server is running"""
    print("🔍 Testing Backend Server Health...")
    
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Server is running!")
            print(f"   - Status: {data.get('status', 'unknown')}")
            print(f"   - Database: {data.get('database', 'unknown')}")
            print(f"   - Timestamp: {data.get('timestamp', 'unknown')}")
            return True
        else:
            print(f"❌ Server responded with status: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend server!")
        print("   Make sure the server is running on http://localhost:3000")
        return False
    except Exception as e:
        print(f"❌ Error testing server health: {e}")
        return False

def test_authentication():
    """Test authentication endpoints"""
    print("\n🔐 Testing Authentication Endpoints...")
    
    # Test registration
    print("Testing user registration...")
    register_data = {
        "email": "testapi@healthtracker.com",
        "password": "testpassword123",
        "name": "API Test User"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", 
                               headers=HEADERS, 
                               json=register_data)
        
        if response.status_code == 201:
            data = response.json()
            print(f"✅ Registration successful!")
            print(f"   - User ID: {data.get('user', {}).get('id', 'unknown')}")
            print(f"   - Email: {data.get('user', {}).get('email', 'unknown')}")
            token = data.get('token')
            return token
        else:
            print(f"❌ Registration failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Registration error: {e}")
        return None

def test_login():
    """Test login with existing user"""
    print("\n🔑 Testing Login...")
    
    login_data = {
        "email": "test@healthtracker.com",
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", 
                               headers=HEADERS, 
                               json=login_data)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Login successful!")
            print(f"   - User: {data.get('user', {}).get('name', 'unknown')}")
            print(f"   - Email: {data.get('user', {}).get('email', 'unknown')}")
            return data.get('token')
        else:
            print(f"❌ Login failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Login error: {e}")
        return None

def test_health_records(token):
    """Test health records endpoints"""
    print("\n📊 Testing Health Records API...")
    
    if not token:
        print("❌ No authentication token available")
        return False
    
    headers = HEADERS.copy()
    headers['Authorization'] = f'Bearer {token}'
    
    # Test getting health records
    try:
        response = requests.get(f"{BASE_URL}/health-records", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            records = data.get('records', [])
            print(f"✅ Retrieved {len(records)} health records")
            
            if records:
                latest = records[0]
                print(f"   - Latest record: {latest.get('date')}")
                print(f"   - Weight: {latest.get('weight')}kg")
                print(f"   - BMI: {latest.get('bmi')}")
            
            return True
        else:
            print(f"❌ Failed to get health records: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Health records error: {e}")
        return False

def test_create_health_record(token):
    """Test creating a new health record"""
    print("\n➕ Testing Create Health Record...")
    
    if not token:
        print("❌ No authentication token available")
        return False
    
    headers = HEADERS.copy()
    headers['Authorization'] = f'Bearer {token}'
    
    record_data = {
        "date": datetime.now().strftime("%Y-%m-%d"),
        "weight": 88.5,
        "height": 175,
        "age": 30,
        "body_fat_percentage": 20.5,
        "muscle_mass": 66.2,
        "bmi": 28.9
    }
    
    try:
        response = requests.post(f"{BASE_URL}/health-records", 
                               headers=headers, 
                               json=record_data)
        
        if response.status_code == 201:
            data = response.json()
            print(f"✅ Health record created successfully!")
            print(f"   - Record ID: {data.get('record', {}).get('id', 'unknown')}")
            print(f"   - Date: {data.get('record', {}).get('date', 'unknown')}")
            return data.get('record', {}).get('id')
        else:
            print(f"❌ Failed to create health record: {response.status_code}")
            print(f"   Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Create record error: {e}")
        return None

def test_user_profile(token):
    """Test user profile endpoints"""
    print("\n👤 Testing User Profile API...")
    
    if not token:
        print("❌ No authentication token available")
        return False
    
    headers = HEADERS.copy()
    headers['Authorization'] = f'Bearer {token}'
    
    try:
        response = requests.get(f"{BASE_URL}/users/profile", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            user = data.get('user', {})
            print(f"✅ User profile retrieved!")
            print(f"   - Name: {user.get('name', 'unknown')}")
            print(f"   - Email: {user.get('email', 'unknown')}")
            print(f"   - Created: {user.get('created_at', 'unknown')}")
            return True
        else:
            print(f"❌ Failed to get user profile: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ User profile error: {e}")
        return False

def test_api_endpoints():
    """Test various API endpoints"""
    print("\n🌐 Testing API Endpoints...")
    
    endpoints = [
        "/auth/register",
        "/auth/login", 
        "/health-records",
        "/users/profile"
    ]
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"{BASE_URL}{endpoint}", timeout=5)
            print(f"   {endpoint}: {response.status_code}")
        except:
            print(f"   {endpoint}: ❌ Connection failed")

def main():
    """Run all backend API tests"""
    print("🚀 Health Tracker Backend API Test Suite")
    print("=" * 50)
    
    # Test server health
    server_ok = test_server_health()
    if not server_ok:
        print("\n❌ Backend server is not running!")
        print("Please start the backend server first:")
        print("1. Install Node.js from https://nodejs.org/")
        print("2. Navigate to backend directory: cd backend")
        print("3. Install dependencies: npm install")
        print("4. Create .env file: copy env.example .env")
        print("5. Start server: npm run dev")
        return
    
    # Test authentication
    token = test_login()
    if not token:
        token = test_authentication()
    
    # Test other endpoints
    health_ok = test_health_records(token) if token else False
    profile_ok = test_user_profile(token) if token else False
    
    # Test creating a record
    if token:
        record_id = test_create_health_record(token)
        record_ok = record_id is not None
    else:
        record_ok = False
    
    # Summary
    print("\n" + "=" * 50)
    print("📋 Backend API Test Summary:")
    print(f"   Server Health: {'✅ PASS' if server_ok else '❌ FAIL'}")
    print(f"   Authentication: {'✅ PASS' if token else '❌ FAIL'}")
    print(f"   Health Records: {'✅ PASS' if health_ok else '❌ FAIL'}")
    print(f"   User Profile: {'✅ PASS' if profile_ok else '❌ FAIL'}")
    print(f"   Create Record: {'✅ PASS' if record_ok else '❌ FAIL'}")
    
    if all([server_ok, token, health_ok, profile_ok, record_ok]):
        print("\n🎉 All backend API tests passed!")
        print("The backend is fully functional and ready to use.")
    else:
        print("\n⚠️  Some tests failed. Please check the backend setup.")
        print("Refer to NODEJS_SETUP.md for installation instructions.")

if __name__ == "__main__":
    main() 