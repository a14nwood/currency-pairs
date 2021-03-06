const {
  blocksToPairs,
  getTimespanParams,
  getTimestamps,
  timestampsToBlocks
} = require('./utils');
const express = require('express');
const pageResults = require('graph-results-pager');

const EXCHANGE_API
  = 'https://api.thegraph.com/subgraphs/name/sushiswap/exchange';

const symbolsToPairAddress = new Map();

const PORT = process.env.PORT || 3001;
const app = express();

app.get('/pair/:pair', async (req, res) => {
  const [currency1, currency2] = req.params.pair.substring(1).split('-');
  let pairAddress = symbolsToPairAddress.get(`${currency1}-${currency2}`);
  let priceAccess = 'token0Price';
  if (!pairAddress) {
    pairAddress = symbolsToPairAddress.get(`${currency2}-${currency1}`);
    priceAccess = 'token1Price';
  }
  const timespan = req.query.timespan;

  try {
    let data = [];
    const timestamps = getTimestamps(...getTimespanParams(timespan), data);
    const blocks = await timestampsToBlocks(timestamps);
    const pairs = await blocksToPairs(blocks, pairAddress);
    pairs.forEach((pair, i) => {
      data[i].price = pair ? Number(pair[priceAccess]) : null
    });
    data = data.filter(item => item.price !== null);
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

app.listen(PORT, async () => {
  try {
    const pairs = await pageResults({
      api: EXCHANGE_API,
      query: {
        entity: 'pairs',
        properties: ['id', 'token0 { symbol }, token1 { symbol }']
      }
    });
    for (const pair of pairs) {
      symbolsToPairAddress.set(
        `${pair.token0.symbol}-${pair.token1.symbol}`, pair.id
      );
    }
  } catch (err) {
    console.error(err);
  }
  console.log(`Server is listening on port ${PORT}`);
});
