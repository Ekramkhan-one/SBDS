// api/index.js
// Vercel serverless entry point. Vercel runs every file in /api as a function;
// vercel.json rewrites all incoming paths here, and Express does the routing.
module.exports = require('../server');
