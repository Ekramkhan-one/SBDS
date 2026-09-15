// server.js
// Entry point for the Smart Blood Donation System API.

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env before anything else touches process.env
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// --- Global Middleware ---

// Allow requests only from the configured frontend URL in production;
// falls back to allowing all origins in development for convenience
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : '*'
  })
);

app.use(express.json()); // parse JSON request bodies

// --- Routes ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/donors', require('./routes/donorRoutes'));
app.use('/api/emergency', require('./routes/emergencyRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

// Simple health check route - useful for confirming the API is alive
// after deploying to Render
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
