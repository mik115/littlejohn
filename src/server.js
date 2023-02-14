const express = require('express');
const logger = require('pino')();

const config = require('./config');

function startServer() {
    const app = express();
    const { port } = config;
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.listen(port, () => {
        logger.child({ port }).info('Webserver started');
    });
    return app;
}

module.exports = {
    startServer,
};
