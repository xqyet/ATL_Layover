document.addEventListener('DOMContentLoaded', function () {
    const resultsDiv = document.getElementById('results');

    // Fetch request to the proxy server (API key is now on server-side)
    const apiUrl = "http://localhost:3000/flights";

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Full API response:', data); // Log the full API response to the console

            if (data.data && data.data.length > 0) {
                // Filter flights departing from ATL (already done by backend)
                const filteredFlights = data.data;

                // Sort flights by layover duration (if available)
                const sortedFlights = filteredFlights.sort((a, b) => {
                    const layoverA = calculateLayover(a);
                    const layoverB = calculateLayover(b);
                    return layoverB - layoverA; // Sort by longest layover
                });

                // Display flights
                sortedFlights.forEach(flight => {
                    const flightElement = document.createElement('div');
                    flightElement.classList.add('flight-row');

                    const departureAirport = flight.departure.iata || 'Unknown';
                    const arrivalAirport = flight.arrival.iata || 'Unknown';
                    const flightNumber = flight.flight.number || 'N/A';
                    const departureTime = flight.departure.scheduled || 'Unknown';
                    const arrivalTime = flight.arrival.scheduled || 'Unknown';
                    const layoverMinutes = calculateLayover(flight);
                    const layoverHours = (layoverMinutes / 60).toFixed(2); // Convert layover from minutes to hours

                    // Display flight details
                    flightElement.innerHTML = `
                        <div><strong>Flight Number:</strong> ${flightNumber}</div>
                        <div><strong>Airline:</strong> ${flight.airline.name || 'Unknown Airline'}</div>
                        <div><strong>Departure Airport:</strong> ${departureAirport}</div>
                        <div><strong>Arrival Airport:</strong> ${arrivalAirport}</div>
                        <div><strong>Departure Time:</strong> ${new Date(departureTime).toLocaleString()}</div>
                        <div><strong>Arrival Time:</strong> ${new Date(arrivalTime).toLocaleString()}</div>
                        <div><strong>Layover Time:</strong> ${layoverHours} Hours</div>
                    `;

                    resultsDiv.appendChild(flightElement);
                });
            } else {
                resultsDiv.innerHTML = '<p>No flights found for the specified criteria.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching flight data:', error);
            resultsDiv.innerHTML = '<p>Failed to load flight data.</p>';
        });

    // Function to calculate layover time (if available)
    function calculateLayover(flight) {
        // Placeholder for real layover calculation logic. Adjust based on actual data structure.
        const arrivalTime = new Date(flight.arrival.scheduled).getTime();
        const nextDepartureTime = new Date(flight.departure.scheduled).getTime();
        const layover = Math.abs(nextDepartureTime - arrivalTime) / (1000 * 60); // in minutes
        return layover || 0;
    }
});
