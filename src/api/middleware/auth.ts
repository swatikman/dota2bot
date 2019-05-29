import * as jwt from 'jsonwebtoken';
import Config = require('../../Config');

export const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send({ error: 'Access denied! No token provided.' });
    try {
        req.user = jwt.verify(token, Config.PRIVATE_KEY);
        next();
    } catch (exc) {
        res.status(400).send({ error: 'Invalid token.' });
    }
    
};
