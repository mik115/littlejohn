const express = require('express');
const jwt = require('jsonwebtoken');
const logger = require('pino')();

const config = require('./config');

const router = express.Router();

function generateToken(username) {
    return jwt.sign({ user: username }, config.jwt_secret, { expiresIn: '24h' });
}

router.route('/login').post((req, res) => {
    try {
        const token = generateToken(req.body.username);
        res.status(200).json({ token });
    } catch (err) {
        logger.child({ error: err.toString() }).fatal('Error generating the access token');
        res.status(500).send('Internal server error');
    }
});

function validateToken(jwtToken) {
    const decoded = jwt.verify(jwtToken, config.jwt_secret);
    return decoded;
}

function authMiddleware(req, res, next) {
    try {
        const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
        // The token is inside the username part, with empty password
        const token = Buffer.from(b64auth, 'base64').toString().split(':')[0];
        validateToken(token);
        next();
    } catch (err) {
        logger.child({ error: err.toString() }).info('Error during the validation of the access token');
        res.status(401).send('Unhautorized').end();
    }
}

module.exports = {
    router,
    authMiddleware,
    validateToken,
    generateToken,
};
