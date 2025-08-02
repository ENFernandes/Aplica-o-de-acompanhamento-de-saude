// Using built-in fetch (Node.js 18+)

const API_BASE = 'http://localhost:3000/api';

async function testFixes() {
    console.log('🧪 Testing API fixes...\n');

    try {
        // Test 1: Registration
        console.log('1. Testing user registration...');
        const registerResponse = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: `test_${Date.now()}@example.com`,
                password: 'TestPassword123!',
                name: 'Test User'
            })
        });
        
                 const registerData = await registerResponse.json();
         if (registerResponse.ok) {
             console.log('✅ Registration successful');
             
             // Test 2: Login
             console.log('2. Testing user login...');
             const loginResponse = await fetch(`${API_BASE}/auth/login`, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({
                     email: registerData.user.email,
                     password: 'TestPassword123!'
                 })
             });
             
             const loginData = await loginResponse.json();
             if (loginResponse.ok) {
                 console.log('✅ Login successful');
                 const authToken = loginData.token;
                 console.log('Token received:', authToken.substring(0, 50) + '...');
                
                // Test 3: User stats endpoint (was missing)
                console.log('3. Testing user stats endpoint...');
                const statsResponse = await fetch(`${API_BASE}/users/stats`, {
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                
                if (statsResponse.ok) {
                    console.log('✅ User stats endpoint working');
                } else {
                    console.log('❌ User stats endpoint failed:', await statsResponse.text());
                }
                
                // Test 4: Health records with authentication
                console.log('4. Testing health records authentication...');
                const healthResponse = await fetch(`${API_BASE}/health-records`, {
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                
                if (healthResponse.ok) {
                    console.log('✅ Health records authentication working');
                } else {
                    console.log('❌ Health records authentication failed:', await healthResponse.text());
                }
                
                // Test 5: Create health record
                console.log('5. Testing health record creation...');
                const createResponse = await fetch(`${API_BASE}/health-records`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify({
                        date: new Date().toISOString().split('T')[0],
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
                    })
                });
                
                if (createResponse.ok) {
                    console.log('✅ Health record creation working');
                } else {
                    console.log('❌ Health record creation failed:', await createResponse.text());
                }
                
            } else {
                console.log('❌ Login failed:', loginData.error);
            }
        } else {
            console.log('❌ Registration failed:', registerData.error);
        }
        
    } catch (error) {
        console.log('❌ Test error:', error.message);
    }
    
    console.log('\n🎉 Test completed!');
}

testFixes(); 