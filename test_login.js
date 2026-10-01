
import axios from 'axios';

async function testRegisterAndLogin() {
    const registerUrl = 'https://admin.thirdbiome.com/api/v1/customers';
    const loginUrl = 'https://admin.thirdbiome.com/api/v1/customers/login'; // Let's try this again, but check 401 vs 404
    const loginUrl2 = 'https://admin.thirdbiome.com/api/v1/auth/login';

    const email = `testuser_${Date.now()}@example.com`;
    const password = 'password123';

    const registerPayload = {
        first_name: 'Test',
        last_name: 'Login',
        phone: '9876543210',
        email: email,
        password: password
    };

    console.log('--- Registering User ---');
    try {
        await axios.post(registerUrl, registerPayload);
        console.log(`Registration successful for ${email}`);
    } catch (error) {
        console.error('Registration failed:', error.response?.data || error.message);
        return;
    }

    const loginPayload = { email, password };

    console.log('\n--- Testing Login at /customers/login ---');
    try {
        const res = await axios.post(loginUrl, loginPayload);
        console.log('Login Success at /customers/login:', res.data);
    } catch (error) {
        console.error('Login failed at /customers/login:', error.response?.status, error.response?.data);
    }

    console.log('\n--- Testing Login at /customers/login with form-urlencoded ---');
    try {
        const params = new URLSearchParams();
        params.append('email', email);
        params.append('password', password);
        const res = await axios.post(loginUrl, params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        console.log('Login Success (form-urlencoded):', res.data);
    } catch (error) {
        console.error('Login failed (form-urlencoded):', error.response?.status, error.response?.data);
    }

    console.log('\n--- Testing Login at /customers/login with FormData ---');
    try {
        const formData = new URLSearchParams(); // Close enough for testing simple POST
        formData.append('email', email);
        formData.append('password', password);
        const res = await axios.post(loginUrl, formData);
        console.log('Login Success (FormData):', res.data);
    } catch (error) {
        console.error('Login failed (FormData):', error.response?.status, error.response?.data);
    }

    console.log('\n--- Testing duplicate registration as possible login ---');
    try {
        const res = await axios.post(registerUrl, { email: email, password: password });
        console.log('Registration/Login Success:', res.data);
    } catch (error) {
        console.error('Registration/Login failed:', error.response?.status, error.response?.data);
    }
}

testRegisterAndLogin();
