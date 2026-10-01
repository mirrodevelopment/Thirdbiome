
import axios from 'axios';

async function testOrders() {
    const baseUrl = 'https://admin.thirdbiome.com/api/v1';

    console.log('--- Fetching all orders ---');
    try {
        const response = await axios.get(`${baseUrl}/orders`);
        console.log('Response structure:', Object.keys(response.data));

        // Handle pagination if present
        const orders = response.data.data?.data || response.data.data || response.data;
        console.log('Orders found:', Array.isArray(orders) ? orders.length : 'Not an array');

        if (Array.isArray(orders) && orders.length > 0) {
            const firstOrder = orders[0];
            console.log('First order keys:', Object.keys(firstOrder));
            console.log('First order ID:', firstOrder.id || firstOrder._id);
            console.log('First order Number:', firstOrder.orderNumber);

            // Try fetching by ID
            const id = firstOrder.id || firstOrder._id;
            console.log(`\n--- Testing fetch by ID: ${id} ---`);
            try {
                const idRes = await axios.get(`${baseUrl}/orders/${id}`);
                console.log('ByID success:', idRes.data.success);
            } catch (e) {
                console.error('ByID failed:', e.response?.status, e.response?.data);
            }

            // Try fetching by Number
            const num = firstOrder.orderNumber;
            if (num) {
                console.log(`\n--- Testing fetch by Number: ${num} ---`);
                try {
                    const numRes = await axios.get(`${baseUrl}/orders/number/${num}`);
                    console.log('ByNumber success:', numRes.data.success);
                } catch (e) {
                    console.error('ByNumber failed:', e.response?.status, e.response?.data);
                }
            }
        }
    } catch (error) {
        console.error('Orders fetch failed:', error.response?.status, error.response?.data || error.message);
    }
}

testOrders();
