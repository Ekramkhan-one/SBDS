// middleware/optionalAuth.js
// Like `protect`, but does NOT reject the request if no/invalid token is present.
// Used on routes that should work for both logged-in and anonymous users
// (e.g., posting an emergency request), while still attaching req.user when possible.

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Silently ignore invalid/expired tokens here - just proceed as anonymous
      req.user = null;
    }
  }

  next();
};

module.exports = optionalAuth;
