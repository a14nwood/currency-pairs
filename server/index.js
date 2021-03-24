const { DateTime } = require('luxon');
const { exchange, timeseries } = require('@sushiswap/sushi-data');
const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

app.get('/pair:id', (req, res) => {
  const oneDayAgo = DateTime.now().minus({ day: 1 }).startOf('hour');
  const pairPromises = [];
  const pairAddress = '0x397ff1542f962076d0bfe58ea045ffa2d347aca0';
  for (let hours = 0; hours <= 24; ++hours) {
    const timestamp = oneDayAgo.plus({ hour: hours }).toSeconds();
    pairPromises.push(exchange.pair({ pair_address: pairAddress, timestamp }));
  }

  Promise.all(pairPromises)
    .then(pairs => {
      res.status(200).json(pairs.map(pair => pair.token0Price.toFixed(2)));
    })
    .catch(err => {
      console.error(err);
      res.status(400).json(err);
    });
});

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
