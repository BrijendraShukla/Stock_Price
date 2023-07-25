// DO NOT MODIFY ANYTHING HERE, THE PLACE WHERE YOU NEED TO WRITE CODE IS MARKED CLEARLY BELOW

require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(function (req, res, next) {
    const allowedOrigins = ['http://localhost:3000'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-credentials", true);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
    next();
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.enable('trust proxy');

app.post('/api/fetchStockData', async (req, res) => {
    const { stockSymbol, date } = req.body;

    try {
        // Make the API request to fetch trade statistics for the specified stock and date
        const response = await axios.get(
            `https://api.polygon.io/v1/open-close/${stockSymbol}/${date}?adjusted=true&apiKey=eFQpPDw_jG3oWsjcDavOI2JcjKNFVdpn`
        );

        // Extract the required fields (Open, High, Low, Close, Volume) from the response
        const { open, high, low, close, volume } = response.data;

        // Create an object with the required fields
        const stockData = {
            Open: open,
            High: high,
            Low: low,
            Close: close,
            Volume: volume,
        };

        // Send the stock data in JSON format
        res.json(stockData);
    } catch (error) {
        // Handle various edge cases and relevant response codes
        if (error.response) {
            // The request was made and the server responded with a status code
            res.status(error.response.status).json({ error: error.response.data });
        } else if (error.request) {
            // The request was made, but no response was received
            res.status(500).json({ error: 'No response from the server' });
        } else {
            // Something happened in setting up the request that triggered an Error
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
