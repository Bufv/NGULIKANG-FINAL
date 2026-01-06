const jwt = require('jsonwebtoken');
const env = require('../config/env');

const authenticate = (req, res, next) => {
  const header = req.headers.authorization;
  console.log('[Auth] Authorization header:', header ? 'Present' : 'Missing');

  if (!header) {
    console.error('[Auth] No authorization header');
    return res.status(401).json({ message: 'Missing Authorization header' });
  }

  const [type, token] = header.split(' ');
  console.log('[Auth] Token type:', type);
  console.log('[Auth] Token exists:', !!token);

  if (type !== 'Bearer' || !token) {
    console.error('[Auth] Invalid authorization format');
    return res.status(401).json({ message: 'Invalid Authorization header' });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    console.log('[Auth] Token verified, payload:', { sub: payload.sub, role: payload.role });
    req.user = { id: payload.sub, role: payload.role };
    console.log('[Auth] req.user set:', req.user);
    return next();
  } catch (error) {
    console.error('[Auth] Token verification failed:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  return next();
};

module.exports = {
  authenticate,
  authorize
};
