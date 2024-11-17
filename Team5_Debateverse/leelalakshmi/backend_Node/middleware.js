const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    try {
        // Extract token from request header
        let token = req.header('x-token');
        
        // If there's no token, return an error response
        if (!token) {
            return res.status(400).send({ error:'Token Not Found'});
        }

        // Verify the token using the secret key
        let decoded = jwt.verify(token, 'jwtSecret');
        
        // Attach the decoded user data to the request object
        req.user = decoded.user;
        
        // Call the next middleware or route handler
        next();
    } catch (error) {
        console.error(error);

        // Check for specific JWT errors and handle accordingly
        if (error.name === 'TokenExpiredError') {
            return res.status(401).send({ error: 'Token Expired' }); // Token expired
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).send({ error: 'Invalid Token' }); // Invalid token
        }

        // For other errors, send a general server error
        return res.status(500).send({ error: 'Internal Server Error' });
    }
};
