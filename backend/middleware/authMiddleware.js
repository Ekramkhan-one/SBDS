// middleware/authMiddleware.js
// Verifies JWT on protected routes and attaches the user to req.user.
// Also provides an "admin only" gate for CNIC verification actions.

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Main auth guard - use on any route that requires a logged-in user
const protect = async (req, res, next) => {
  let token;

  // Expect header format: "Authorization: Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request, excluding password (already excluded by default,
      // but being explicit here for clarity)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found, authorization denied' });
      }

      return next();
    } catch (error) {
      console.error('JWT verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Admin-only guard - chain AFTER `protect` on routes like CNIC verification
// Usage: router.put('/verify/:id', protect, adminOnly, verifyController)
const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  return res.status(403).json({ message: 'Not authorized as an admin' });
};

module.exports = { protect, adminOnly };
