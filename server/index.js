const { DateTime } = require('luxon');
const { exchange } = require('@sushiswap/sushi-data');
const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

app.get('/pair:id', async (req, res) => {
  const data = [];

  const oneDayAgo = DateTime.now().minus({ day: 1 }).startOf('hour');
  const pairPromises = [];
  const pairAddress = '0x397ff1542f962076d0bfe58ea045ffa2d347aca0';
  for (let minute = 0; minute <= 48 * 30; minute += 10) {
    const time = oneDayAgo.plus({ minute });
    data.push({ time });
    pairPromises.push(
      exchange.pair({ pair_address: pairAddress, timestamp: time.toSeconds() })
    );
  }

  try {
    const pairs = await Promise.all(pairPromises);
    pairs.forEach((pair, i) => data[i].price = pair.token0Price);
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
