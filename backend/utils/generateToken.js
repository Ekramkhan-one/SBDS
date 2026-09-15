// utils/generateToken.js
// Small helper to sign a JWT for a given user ID.
// Kept separate from controllers so token logic lives in one place only.

const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

module.exports = generateToken;
