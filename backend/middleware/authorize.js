// middleware/authorize.js
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY || 'your-secret-key';

// Middleware to check if the user is authenticated
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, secretKey);
        // Set user information directly from the JWT token
        req.user = {
            id: decoded.id,
            role: decoded.role
        };
        next();
    } catch (err) {
        console.error('Authentication error:', err);
        return res.status(401).send({ error: 'Invalid token' });
    }
};

// Middleware to check if user is an admin
const authorizeAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).send({ error: 'Unauthorized: No user information' });
    }
    
    if (req.user.role !== 'ADMIN') {
        return res.status(403).send({ error: 'Forbidden: Admin access required' });
    }
    
    next();
};

// Middleware to check if user is a student
const authorizeStudent = (req, res, next) => {
    if (!req.user) {
        return res.status(401).send({ error: 'Unauthorized: No user information' });
    }
    
    if (req.user.role !== 'STUDENT') {
        return res.status(403).send({ error: 'Forbidden: Student access required' });
    }
    
    next();
};

// Generic middleware to check for specific roles
const authorizeRoles = (roles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).send({ error: 'Unauthorized: No user information' });
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).send({ error: `Forbidden: Required roles: ${roles.join(', ')}` });
        }
        
        next();
    };
};

module.exports = {
    authenticate,
    authorizeAdmin,
    authorizeStudent,
    authorizeRoles
};
