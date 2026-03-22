const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "Authentication failed, Token missing" });
    }
    
    // Remove "Bearer " prefix if present
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET || 'secret_key')
        req.user = decode
        next();
    } catch (err) {
        console.error("❌ Token verification failed:", err.message);
        res.status(500).json({ message: 'Authentication failed. Invalid token.' })
    }
}

module.exports = auth