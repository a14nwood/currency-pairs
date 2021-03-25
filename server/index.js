const { blocksToPairs, getTimespanParams, timestampsToBlocks } = require('./utils');
const { request, gql } = require('graphql-request');
const express = require('express');
const pageResults = require('graph-results-pager');

const EXCHANGE_API
  = 'https://api.thegraph.com/subgraphs/name/sushiswap/exchange';

const symbolsToPairAddress = new Map();

const PORT = process.env.PORT || 3001;
const app = express();

app.get('/pair/:pair', async (req, res) => {
  const [currency1, currency2] = req.params.pair.substring(1).split('-');
  const pairAddress = symbolsToPairAddress.get(`${currency1}-${currency2}`);
  const timespan = '1D';
  const [initialTime, timeBound, timeIncrement] = getTimespanParams(timespan);

  const data = [];

  try {
    const timestamps = [];
    let time = initialTime;
    for (let i = 0; i < timeBound; ++i) {
      time = time.plus(timeIncrement);
      data.push({ time: time.toString() });
      timestamps.push(time.toSeconds());
    }
    const blocks = await timestampsToBlocks(timestamps);
    const pairs = await blocksToPairs(blocks, pairAddress);
    console.log(pairs);
    pairs.forEach((pair, i) => data[i].price = Number(pair.token0Price));
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
  console.log(`Server is listening on ${PORT}`);
});
