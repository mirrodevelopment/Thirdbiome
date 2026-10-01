import axios from 'axios';

async function testClubApplication() {
    const url = "https://admin.thirdbiome.com/api/v1/t3b-club-applications";

    const payload = {
        name: "Test User",
        age: 25,
        sex: "Male",
        occupation: "Software Tester",
        whatsappNumber: "9876543210",
        email: "test_club_" + Date.now() + "@example.com"
    };

    console.log("Testing POST /t3b-club-applications...");
    console.log("Payload:", JSON.stringify(payload, null, 2));

    try {
        const response = await axios.post(url, payload, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        console.log("SUCCESS!");
        console.log("Status Code:", response.status);
        console.log("Response Data:", JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error("FAILURE!");
        if (error.response) {
            console.error("Status Code:", error.response.status);
            console.error("Error Data:", JSON.stringify(error.response.data, null, 2));
        } else {
            console.error("Error Message:", error.message);
        }
    }
}

testClubApplication();
