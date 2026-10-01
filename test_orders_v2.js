
import axios from 'axios';

async function testOrders() {
    const baseUrl = 'https://admin.thirdbiome.com/api/v1';

    console.log('--- Fetching all orders ---');
    try {
        const response = await axios.get(`${baseUrl}/orders`);
        const ordersData = response.data.data?.data || response.data.data || response.data;

        if (Array.isArray(ordersData)) {
            console.log(`Found ${ordersData.length} orders.`);
            ordersData.slice(0, 5).forEach((order, i) => {
                console.log(`Order ${i + 1}: ID=${order.id || order._id}, orderNumber=${order.orderNumber}`);
            });

            if (ordersData.length > 0) {
                const target = ordersData[0];
                const id = target.id || target._id;
                const num = target.orderNumber;

                console.log(`\n--- Testing fetch by ID ${id} ---`);
                try {
                    const idRes = await axios.get(`${baseUrl}/orders/${id}`);
                    console.log('ID Fetch Success:', idRes.data.success);
                    console.log('Data structure:', Object.keys(idRes.data.data || {}));
                } catch (e) {
                    console.error('ID Fetch Failed:', e.response?.status, e.response?.data?.message || e.message);
                }

                if (num) {
                    console.log(`\n--- Testing fetch by Number ${num} ---`);
                    try {
                        const numRes = await axios.get(`${baseUrl}/orders/number/${num}`);
                        console.log('Number Fetch Success:', numRes.data.success);
                        console.log('Data structure:', Object.keys(numRes.data.data || {}));
                    } catch (e) {
                        console.error('Number Fetch Failed:', e.response?.status, e.response?.data?.message || e.message);
                    }
                }
            }
        } else {
            console.log('Orders data is not an array:', typeof ordersData);
        }
    } catch (error) {
        console.error('Global Error:', error.message);
    }
}

testOrders();
