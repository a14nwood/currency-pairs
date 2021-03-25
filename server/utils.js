const { DateTime } = require('luxon');
const { request, gql } = require('graphql-request');

const EXCHANGE_API
  = 'https://api.thegraph.com/subgraphs/name/sushiswap/exchange';
const BLOCKLYTICS_API
  = 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks';

async function blocksToPairs(blocks, pairAddress) {
  const result = await request(EXCHANGE_API, gql`{
    ${blocks.map((block, i) => gql`
      block${i}: pair(id: "${pairAddress}", block: { number: ${block} }) {
        token0Price, token1Price
      }
    `)}
  }`);
  return Object.entries(result)
    .sort((a, b) => (
      Number(a[0].split('block')[1]) - Number(b[0].split('block')[1])
    ))
    .map(entry => entry[1]);
}

function getTimespanParams(timespan) {
  switch (timespan) {
    case '1D':
      return [
        DateTime.now().minus({ day: 1 }).startOf('hour'),
        6 * 24,
        { minute: 10 }
      ];
    case '7D':
      return [
        DateTime.now().minus({ week: 1 }).startOf('hour'),
        24 * 7,
        { hour: 1 }
      ];
    case '30D':
      return [
        DateTime.now().minus({ day: 30 }).startOf('day'),
        4 * 30,
        { hour: 6 }
      ];
    case '90D':
      return [
        DateTime.now().minus({ day: 90 }).startOf('day'),
        90,
        { day: 1 }
      ];
    case '365D':
      return [
        DateTime.now().minus({ day: 365 }).startOf('day'),
        365 / 5,
        { day: 5 }
      ];
    default:
      return [-1, -1, -1];
  }
}

function getTimestamps(initialTime, timeBound, timeIncrement, data) {
  let time = initialTime;
  const timestamps = [];
  for (let i = 0; i < timeBound; ++i) {
    time = time.plus(timeIncrement);
    data.push({ time: time.toString() });
    timestamps.push(time.toSeconds());
  }
  return timestamps;
}

async function timestampsToBlocks(timestamps) {
  let result = await request(BLOCKLYTICS_API, gql`{
    ${timestamps.map(timestamp => (gql`
      timestamp${timestamp}: blocks(
        first: 1,
        orderBy: timestamp,
        orderDirection: desc,
        where: { timestamp_lte: ${timestamp}}
      ) { number }`
    ))}
  }`);

  result = Object.keys(result)
    .map(key => ({ ...result[key], timestamp: key.split("timestamp")[1] }))
    .sort((a, b) => Number(a.timestamp) - b.timestamp);
  result.forEach(e => delete e.timestamp);
  return Object.values(result).map(e => Number(e[0].number));
}

module.exports = {
  blocksToPairs,
  getTimespanParams,
  getTimestamps,
  timestampsToBlocks
};
