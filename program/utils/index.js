const { log } = require('console');
const crypto = require('crypto');
const gizliAnahtar = "seraKibris_2024";
const jwt = require('jsonwebtoken');


const generateToken = (user_data) => {
    const options = { expiresIn: '1d' };

    return jwt.sign(user_data, gizliAnahtar, options);
};
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }
    
    let decoded = jwt.verify(token, gizliAnahtar);
    req.user = decoded;
    next();
};

module.exports = { gizliAnahtar, generateToken,authenticateToken };