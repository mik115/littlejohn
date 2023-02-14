const logger = require('pino')();

function getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        logger.warn('You are generating a JWT token with a default secret string');
        return ' ';
    }
    return secret;
}

module.exports = {
    jwt_secret: getJwtSecret(),
    port: process.env.HTTP_PORT || 8080,
};
