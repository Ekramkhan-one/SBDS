// server.js
// Entry point for the Smart Blood Donation System API.
// Works in two modes:
//   1. Locally / on a normal host: `node server.js` starts an HTTP server.
//   2. On Vercel (serverless): api/index.js imports this file and uses the
//      exported Express app directly - no app.listen() is called.

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env before anything else touches process.env
dotenv.config();

const app = express();

// --- Global Middleware ---

// Allow requests only from the configured frontend URL in production;
// falls back to allowing all origins in development for convenience.
// A trailing slash is stripped because browsers send the Origin header without one.
const clientUrl = (process.env.CLIENT_URL || '').replace(/\/+$/, '');

app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? clientUrl : '*'
  })
);

app.use(express.json()); // parse JSON request bodies

// Make sure MongoDB is connected before handling any request.
// The connection is cached, so this is only slow on the first request
// (a cold start on serverless hosts).
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(503).json({ message: 'Database connection failed' });
  }
});

// --- Routes ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/donors', require('./routes/donorRoutes'));
app.use('/api/emergency', require('./routes/emergencyRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Simple health check route - useful for confirming the API is alive
// after deploying
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'SBDS API is running' });
});

// --- 404 handler for unmatched routes ---
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// --- Global error handler (catches anything thrown/passed to next()) ---
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

// Only start a listening server when run directly (npm start / npm run dev).
// When imported by Vercel, this block is skipped.
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      });
    })
    .catch(() => {
      // The app is useless without the DB locally, so fail fast and loud
      process.exit(1);
    });
}

module.exports = app;
