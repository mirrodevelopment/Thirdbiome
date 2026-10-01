
import axios from 'axios';

async function testRegistration() {
    const url = 'https://admin.thirdbiome.com/api/v1/customers';
    const payload = {
        first_name: 'Test',
        last_name: 'User',
        phone: '1234567890',
        email: `testuser_${Date.now()}@example.com`,
        password: 'password123'
    };

    console.log('Testing Registration URL:', url);
    console.log('Payload:', JSON.stringify(payload, null, 2));

    try {
        const response = await axios.post(url, payload, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        });

        console.log('Registration Success!');
        console.log('Status:', response.status);
        console.log('Response Data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Registration Failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Response Data:', error.response.data);

            // Helpful for debugging if it's HTML instead of JSON
            if (typeof error.response.data === 'string' && error.response.data.includes('<!DOCTYPE html>')) {
                console.error('Received HTML response instead of JSON. Check if the endpoint is correct or if there is a server error.');
            }
        } else {
            console.error('Error Message:', error.message);
        }
    }
}

testRegistration();
