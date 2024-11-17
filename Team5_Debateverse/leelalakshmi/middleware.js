const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    try {
        
        let token = req.header('x-token');
        if (!token) {
            return res.status(400).send({ error:'Token Not Found'});
        }
        let decoded = jwt.verify(token, 'jwtSecret');
        req.user = decoded.user;
        next();
    } catch (error) {
        console.error(error);

        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).send({ error: 'Token Expired' }); 
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).send({ error: 'Invalid Token' });
        }
        return res.status(500).send({ error: 'Internal Server Error' });
    }
};
