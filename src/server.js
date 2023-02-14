const express = require('express');
const logger = require('pino')();

const config = require('./config');
const authRoutes = require('./auth');
const ticker = require('./ticker');

function startServer() {
    const app = express();
    const { port } = config;
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/auth', authRoutes.router);
    app.use('/tickers', authRoutes.authMiddleware, ticker.router);

    app.listen(port, () => {
        logger.child({ port }).info('Webserver started');
    });
}

module.exports = {
    startServer,
};
