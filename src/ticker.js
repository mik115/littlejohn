const express = require('express');
const moment = require('moment');

const router = express.Router();
const availableTickers = [
    'AAPL',
    'MSFT',
    'GOOG',
    'AMZN',
    'FB',
    'TSLA',
    'NVDA',
    'JPM',
    'BABA',
    'JNJ',
    'WMT',
    'PG',
    'PYPL',
    'DIS',
    'ADBE',
    'PFE',
    'V',
    'MA',
    'CRM',
    'NFLX',
];

function generateTickersList() {
    // Generate a random list of tickers. The list is of min 1 ticker to max 10 tickers
    // The list is randomly generated at every call.
    const tickers = availableTickers.sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 9 + 1)).sort();
    return tickers;
}

// Starting from the symbol of the ticker and the defined starting date generate a price.
function generateTickersPriceOfToday(ticker) {
    // The starting prices are defined by taking the ascii number of
    // each letter in the sybol, and multiplied those numbers divided by ten
    // es: 'PG' => 80, 71 => 8 * 7,1 = 56,8$
    const todaysPrice = ticker.split('').reduce((v, c) => v * (c.charCodeAt(0) / 10), 1).toFixed(2);
    return todaysPrice;
}

function generateTickersHistory(ticker) {
    // Get the today price
    const startingPrice = generateTickersPriceOfToday(ticker);
    let currentDate = moment().startOf('day');
    // Insert the first element of the history array (Today)
    const range = [{
        date: currentDate.format('yyyy-MM-DD'),
        price: startingPrice,
    }];
    let currentPrice = Number(startingPrice);
    // Let define the variation base for the ticker. In order to assure the required behavior
    // the variation is bounded to the symbol of the ticker
    const variationBase = ticker.split('').reduce((v, c) => v + (c.charCodeAt(0)), 1) / ticker.charCodeAt(0);
    for (let i = 1; i < 90; i += 1) {
        // Building the historic track record
        currentDate = currentDate.subtract(1, 'day');
        // This is the variation of this day. In order to assure some "random variation"
        // the sign of the variation is bounded to the current date.
        // evaluating the Mod 7 of the unix timestamp of the current date.
        // Then if the result of the module is even, the variation will be positive,
        // otherwise it will be negative
        // The variation is then multiplied by the result of the module to guarantee
        // a bit of "randomnes" also in the daily increment/decrement
        const variation = ((+currentDate % 7) % 2 === 0) ? variationBase * (+currentDate % 7)
            : variationBase * (+currentDate % 7) * (-1);
        currentPrice += variation;
        // Building the historic entry
        range.push({
            price: currentPrice.toFixed(2),
            date: currentDate.format('yyyy-MM-DD'),
        });
    }
    return range;
}

router.get('/', (req, res) => {
    const tickers = generateTickersList();
    const result = tickers.map((v) => ({
        symbol: v,
        price: generateTickersPriceOfToday(v),
    }));
    res.status(200).json(result);
});

router.get('/:symbol/history', (req, res) => {
    const { symbol } = req.params;
    if (availableTickers.indexOf(symbol) === -1) {
        res.status(404).send('Not Found');
        return;
    }
    const result = generateTickersHistory(symbol);
    res.status(200).json(result);
});

module.exports = {
    router,
    generateTickersList,
    generateTickersPriceOfToday,
    generateTickersHistory,
};
