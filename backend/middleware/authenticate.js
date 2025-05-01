const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY || 'your-secret-key';

const checkAuthMiddleWare = (req, res, next) => {
  // Get the current path and check if it's an admin route
  const isAdminRoute = req.path.startsWith('/api/admin');
  
  // Skip authentication for certain paths that don't require auth
  const publicPaths = ['/api/auth/login', '/api/auth/register', '/api/auth/forgot-password'];
  if (publicPaths.includes(req.path)) {
    return next();
  }

  const authHeader = req.headers.authorization;
  
  // If no auth header is provided
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // For admin routes, immediately return 401 Unauthorized
    if (isAdminRoute) {
      return res.status(401).send({ error: 'Authentication required for admin routes' });
    }
    // For other routes, set user as null and continue
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
    
    // For admin routes, ensure the role is ADMIN (case insensitive)
    if (isAdminRoute && decoded.role.toUpperCase() !== 'ADMIN') {
      return res.status(403).send({ error: 'Forbidden: Admin access required' });
    }
    
    next();
  } catch (err) {
    // For admin routes, return 401 for invalid tokens
    if (isAdminRoute) {
      console.error('Authentication error for admin route:', err);
      return res.status(401).send({ error: 'Invalid or expired token' });
    }
    // For other routes, proceed but set user as null
    console.error('Authentication error:', err);
    req.user = null;
    next();
  }
};

module.exports = checkAuthMiddleWare;
