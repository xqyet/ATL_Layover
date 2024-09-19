import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

app.get('/flights', async (req, res) => {
    const apiUrl = `http://api.aviationstack.com/v1/flights?access_key=71695646c7fc6057ce995558359a5ea9&dep_iata=ATL&flight_date=2023-09-23`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching data from Aviationstack:', error);
        res.status(500).json({ error: 'Failed to fetch flight data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
