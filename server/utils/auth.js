const jsonWT = require('jsonwebtoken');

const secret = 'mysecret';
const expiration = '2h';

module.exports = {
    signToken: function({ username, email, _id }) {
        const payload = { username, email, _id };

        return jsonWT.sign({ data: payload } , secret, { expiresIn: expiration });
    },
    authMiddleware: function({ req }) {
        let token = req.body.token || req.query.token || req.headers.authorization;

        if (req.headers.authorization) {
            token = token
            .split(' ')
            .pop()
            .trim();
        }

        if (!token) {
            return req;
        }

        try {
            const { data } = jsonWT.verify(token, secret, { maxAge: expiration });
            req.user = data;
        } catch {
            console.log('Token is invalid.');
        }
        return req;
    }
}