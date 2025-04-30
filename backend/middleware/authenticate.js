const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY || 'your-secret-key';

const checkAuthMiddleWare = (req, res, next) => {
  // Skip authentication for certain paths that don't require auth
  const publicPaths = ['/api/auth/login', '/api/auth/register', '/api/auth/forgot-password'];
  if (publicPaths.includes(req.path)) {
    return next();
  }

  const authHeader = req.headers.authorization;
  
  // If no auth header is provided, proceed but set user as null
  // This allows API endpoints to handle both authenticated and unauthenticated requests
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = {
      id: decoded.id,
      role: decoded.role
    };
    next();
  } catch (err) {
    // For invalid tokens, proceed but set user as null
    // This lets individual routes decide how to handle auth failures
    console.error('Authentication error:', err);
    req.user = null;
    next();
  }
};

module.exports = checkAuthMiddleWare;
