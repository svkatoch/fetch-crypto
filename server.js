const express = require('express');
const axios = require('axios');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// PostgreSQL connection configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'wazirx',
  password: '12345',
  port: 5433,
});

// Endpoint to fetch and store data
app.get('/fetch-and-store', async (req, res) => {
  try {
    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const data = response.data;

    const top10 = Object.values(data).slice(0, 10).map(item => ({
      name: item.name,
      last: item.last,
      buy: item.buy,
      sell: item.sell,
      volume: item.volume,
      base_unit: item.base_unit,
    }));

    const client = await pool.connect();
    for (const item of top10) {
      await client.query(
        'INSERT INTO tickers (name, last, buy, sell, volume, base_unit) VALUES ($1, $2, $3, $4, $5, $6)',
        [item.name, item.last, item.buy, item.sell, item.volume, item.base_unit]
      );
    }
    client.release();

    res.send('Data fetched and stored successfully');
  } catch (error) {
    console.error('Error fetching data or storing to database:', error);
    res.status(500).send('An error occurred');
  }
});

// Endpoint to get data from the database
app.get('/get-data', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT name, last, buy, sell, volume, base_unit FROM tickers');
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching data from database:', error);
    res.status(500).send('An error occurred');
  }
});

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
