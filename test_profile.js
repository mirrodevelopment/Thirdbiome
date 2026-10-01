
import axios from 'axios';

async function testProfileEndpoints() {
    const baseUrl = 'https://admin.thirdbiome.com/api/v1';
    const email = `profile_test_${Date.now()}@example.com`;
    const password = 'password123';

    console.log('--- Registering User ---');
    try {
        await axios.post(`${baseUrl}/customers`, {
            first_name: 'Profile',
            last_name: 'Test',
            phone: '1234567890',
            email: email,
            password: password
        });
        console.log(`Registered user: ${email}`);
    } catch (error) {
        console.error('Registration failed:', error.response?.status, error.response?.data || error.message);
        return;
    }

    console.log('\n--- Logging in to get token ---');
    let token;
    let userId;
    try {
        const loginRes = await axios.post(`${baseUrl}/customers/login`, { email, password });
        console.log('Login successful response:', JSON.stringify(loginRes.data, null, 2));
        token = loginRes.data.token;
        userId = loginRes.data.user?.id || loginRes.data.user?._id;
        console.log('Token obtained. User ID:', userId);
    } catch (error) {
        console.error('Login failed (you might need to register first or use correct credentials):', error.response?.status, error.response?.data);
        return;
    }

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
    };

    console.log('\n--- Testing GET /profile ---');
    try {
        const res = await axios.get(`${baseUrl}/profile`, { headers });
        console.log('GET /profile success:', res.data);
    } catch (error) {
        console.error('GET /profile failed:', error.response?.status, error.response?.data);
    }

    console.log('\n--- Testing GET /customers/profile ---');
    try {
        const res = await axios.get(`${baseUrl}/customers/profile`, { headers });
        console.log('GET /customers/profile success:', res.data);
    } catch (error) {
        console.error('GET /customers/profile failed:', error.response?.status, error.response?.data);
    }
}

testProfileEndpoints();
