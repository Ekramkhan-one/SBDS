// config/db.js
// Handles connection to MongoDB Atlas using Mongoose.
// The connection is cached so it can be reused between requests. This matters
// on serverless hosts (Vercel), where the same function instance handles many
// requests and a new connection per request would exhaust Atlas's free limit.

const mongoose = require('mongoose');

const cached = global._mongooseCache || (global._mongooseCache = { conn: null, promise: null });

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log(`MongoDB Connected: ${cached.conn.connection.host}`);
  } catch (error) {
    cached.promise = null; // allow a retry on the next request
    console.error(`Error connecting to MongoDB: ${error.message}`);
    throw error;
  }

  return cached.conn;
};

module.exports = connectDB;
