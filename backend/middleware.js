require('dotenv').config();
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']; 
    console.log('Authorization Header:', authHeader);
    
    const token = authHeader && authHeader.split(' ')[1]; 
    console.log('token:', token);


    if (!token) { 
        console.log('token doent exists');
        return res.sendStatus(401); 
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log(`${err.message}   Invalid access token`); 
            return res.sendStatus(403); 
        }

        req.user = user;
        next(); // Proceed to the next middleware or route
    });
};

module.exports = authenticateToken;
