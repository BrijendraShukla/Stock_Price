import React, { useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import './StockForm.css'

const StockForm = () => {
    const [symbol, setSymbol] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [stockDetails, setStockDetails] = useState(null); // State to store fetched stock details

    const handleSymbolChange = (event) => {
        const inputSymbol = event.target.value.trim().toUpperCase(); // Convert to uppercase and remove leading/trailing spaces
        setSymbol(inputSymbol);
    };

    const isWeekend = (date) => {
        const day = new Date(date).getDay();
        return day === 0 || day === 6; // Sunday is 0, Saturday is 6
    };

    const isDateInPast = (date) => {
        const today = new Date();
        const selected = new Date(date);
        return selected >= today;
    };

    const formatDate = (dateString) => {
        const parts = dateString.split('-');
        if (parts.length !== 3) return dateString; // Invalid format, return as is
        const [day, month, year] = parts;
        return `${year}-${month}-${day}`;
    };

    const handleDateChange = (event) => {
        const selectedDate = event.target.value;
        const formattedDate = formatDate(selectedDate); // Format the date to 'yyyy-mm-dd'
        setSelectedDate(formattedDate);

        if (isWeekend(selectedDate) || isDateInPast(selectedDate)) {
            alert('Please select a valid date (not on weekends or in the future).');
            return;
        }

        setSelectedDate(selectedDate);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!symbol || !selectedDate) {
            alert('Please enter a valid stock symbol and select a valid date.');
            return;
        }

        try {
            // Make the API request to the server (app.js)
            const response = await axios.post('http://localhost:5000/api/fetchStockData', {
                stockSymbol: symbol,
                date: selectedDate,
            });

            // Set the received stock data to the state
            setStockDetails(response.data);
            console.log("this is responce data=", stockDetails)
        } catch (error) {
            console.error('Error fetching stock data:', error);
            alert('Error fetching stock data. Please try again later.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="symbol">Stock Symbol:</label>
                <input
                    type="text"
                    id="symbol"
                    value={symbol}
                    onChange={handleSymbolChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="date">Select Date:</label>
                <input
                    type="date"
                    id="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    required
                />
            </div>
            <button type="submit">Submit</button>

            {stockDetails && (
                <div className='stock-details'>
                    <h2>Stock Details</h2>
                    <p>Open: {stockDetails.Open}</p>
                    <p>High: {stockDetails.High}</p>
                    <p>Low: {stockDetails.Low}</p>
                    <p>Close: {stockDetails.Close}</p>
                    <p>Volume: {stockDetails.Volume}</p>
                </div>
            )}
            {/* Stock Details
            <div className='stock-details'>
                <h2>Stock Details</h2>
                <p>Open: 100</p>
                <p>High: 120</p>
                <p>Low: 90</p>
                <p>Close: 110</p>
                <p>Volume: 50000</p>
            </div> */}
        </form>
    );
};

export default StockForm;
