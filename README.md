# Currency Pair Viewer

## Features
- Allows typing the symbols of any two currencies for which a pair in the Sushiswap network exists, updating as soon as they are typed
- Displays current price of specified pair
- Interactively graphs price history over five selectable timespans
- Scales to various window sizes

## How to run
After cloning the repository, `cd` to its directory and run the following commands:
```
npm install
npm run install-all-deps
npm start
```
The application should open automatically in your browser. If not, go to [localhost:3000](localhost:3000) after the terminal has indicated that the server is running and compilation was successful.

## Note
I suspected that the challenge of using GraphQL over `sushi-data` was a bit of a trick, testing to see if I would insist on rolling my own solution when it is not necessary. Even if that is the case, however, I think the use of in-house GraphQL calls was justified as it reduced the amount of data to transport to only that which the application needs, greatly improving load times.

## Production tweaks
Were this application to be deployed to production, the first addition would likely be to cache pair prices using `memcached` or otherwise so users could see further reduced load times.

## Credits
[graphql-request](https://github.com/prisma-labs/graphql-request) is used for GraphQL queries;

[Luxon](https://moment.github.io/luxon/) is helpful for date manipulation.

[sushi-data](https://github.com/sushiswap/sushi-data)'s GraphQL code was referenced to get a sense of how the exchange/block graphs are organized.

[React](https://github.com/facebook/react), [Express](https://github.com/expressjs/express), and [Node.js](https://github.com/nodejs) make up the web stack.
