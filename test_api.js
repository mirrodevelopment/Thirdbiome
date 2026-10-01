
import axios from 'axios';

async function testApi() {
    try {
        const response = await axios.get('https://demo9.qin7.in/api/v1/products');
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error fetching products:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }

        // Try without /api/v1
        try {
            console.log('Trying without /api/v1...');
            const response2 = await axios.get('https://demo9.qin7.in/products');
            console.log(JSON.stringify(response2.data, null, 2));
        } catch (err2) {
            console.error('Error fetching products (no api/v1):', err2.message);
        }
    }
}

testApi();
