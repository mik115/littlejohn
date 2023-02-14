const moment = require('moment');

const ticker = require('../src/ticker');

describe('ticker retrieval and generation test', () => {
    test('ticker list length is between 1 and 10', () => {
        const list = ticker.generateTickersList();
        expect(list.length).toBeGreaterThan(0);
        expect(list.length).toBeLessThan(11);
    });

    test('ticker today price to be different from other ticker\'s today price', () => {
        const priceAAPL = Number(ticker.generateTickersPriceOfToday('AAPL'));
        const priceMSFT = Number(ticker.generateTickersPriceOfToday('MSFT'));
        expect(priceAAPL).toBeGreaterThan(0);
        expect(priceMSFT).toBeGreaterThan(0);
        expect(priceAAPL).not.toBe(priceMSFT);
    });

    test('ticker history is of 90 days starting from today', () => {
        const history = ticker.generateTickersHistory('AAPL');
        expect(history[0].date).toBe(moment().format('yyyy-MM-DD'));
        expect(history.length).toBe(90);
        expect(history[89].date).toBe(moment().subtract(89, 'day').format('yyyy-MM-DD'));
    });
});
