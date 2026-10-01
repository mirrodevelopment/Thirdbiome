
import axios from 'axios';

async function testApi() {
    try {
        const response = await axios.get('https://admin.thirdbiome.com/api/v1/products');
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error fetching products:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

testApi();
