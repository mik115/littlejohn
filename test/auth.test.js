const moment = require('moment');

const auth = require('../src/auth');

describe('token generation', () => {
    test('generate token successfully', () => {
        const username = 'username';
        const token = auth.generateToken(username);
        expect(token.length).toBeGreaterThan(0);
        expect(token.split('.').length).toBe(3);
        const payload = auth.validateToken(token);
        expect(payload.exp).toBeGreaterThan(moment().unix());
        expect(payload.user).toBe(username);
    });

    test('validation token fails for malformed tokens', () => {
        try {
            auth.validateToken('aaaaaaaaaaaaa');
        } catch (error) {
            expect(error.message).toBe('jwt malformed');
        }
    });

    test('validation token fails for invalid signature', () => {
        try {
            auth.validateToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE2NzYxOTQ4Mzh9.ho3F6NviOzDf8H8zXtQMt7Noi0afdz3L_t7I7ya0TbU');
        } catch (error) {
            expect(error.message).toBe('invalid signature');
        }
    });
});
