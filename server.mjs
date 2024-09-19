import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = 3000;

const API_KEY = 'input-api-here';

// Enable CORS
app.use(cors());

// Function to get the current date and the date 30 days from now
function getDateRange() {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const formatDate = (date) => date.toISOString().split('T')[0]; // Format as YYYY-MM-DD

    return { startDate: formatDate(today), endDate: formatDate(thirtyDaysFromNow) };
}

// Fetch flights over a 30-day range
app.get('/flights', async (req, res) => {
    const { startDate, endDate } = getDateRange();

    try {
        const flights = [];
        const apiUrl = `http://api.aviationstack.com/v1/flights?access_key=${API_KEY}&dep_iata=ATL&date_from=${startDate}&date_to=${endDate}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data && data.data) {
            flights.push(...data.data);
        }

        res.json({ data: flights });
    } catch (error) {
        console.error('Error fetching data from Aviationstack:', error);
        res.status(500).json({ error: 'Failed to fetch flight data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
