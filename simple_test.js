// Simple test script to verify API fixes
const API_BASE = 'http://localhost:3000/api';

async function testAPI() {
    console.log('🧪 Testing API fixes...\n');

    try {
        // Test 1: Health check
        console.log('1. Testing health endpoint...');
        const healthResponse = await fetch(`${API_BASE}/health`);
        if (healthResponse.ok) {
            console.log('✅ Health endpoint working');
        } else {
            console.log('❌ Health endpoint failed');
            return;
        }

        // Test 2: Registration
        console.log('2. Testing registration...');
        const registerResponse = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: `test_${Date.now()}@example.com`,
                password: 'TestPassword123!',
                name: 'Test User'
            })
        });
        
        if (registerResponse.ok) {
            console.log('✅ Registration working');
            const registerData = await registerResponse.json();
            
            // Test 3: Login
            console.log('3. Testing login...');
            const loginResponse = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: registerData.user.email,
                    password: 'TestPassword123!'
                })
            });
            
            if (loginResponse.ok) {
                console.log('✅ Login working');
                const loginData = await loginResponse.json();
                const token = loginData.token;
                
                // Test 4: User profile
                console.log('4. Testing user profile...');
                const profileResponse = await fetch(`${API_BASE}/users/profile`, {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (profileResponse.ok) {
                    console.log('✅ User profile working');
                } else {
                    console.log('❌ User profile failed:', await profileResponse.text());
                }
                
                // Test 5: User stats
                console.log('5. Testing user stats...');
                const statsResponse = await fetch(`${API_BASE}/users/stats`, {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (statsResponse.ok) {
                    console.log('✅ User stats working');
                } else {
                    console.log('❌ User stats failed:', await statsResponse.text());
                }
                
                // Test 6: Health records
                console.log('6. Testing health records...');
                const healthRecordsResponse = await fetch(`${API_BASE}/health-records`, {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (healthRecordsResponse.ok) {
                    console.log('✅ Health records working');
                } else {
                    console.log('❌ Health records failed:', await healthRecordsResponse.text());
                }
                
            } else {
                console.log('❌ Login failed:', await loginResponse.text());
            }
        } else {
            console.log('❌ Registration failed:', await registerResponse.text());
        }
        
    } catch (error) {
        console.log('❌ Test error:', error.message);
    }
    
    console.log('\n🎉 Test completed!');
}

// Wait for server to start
setTimeout(testAPI, 2000); 