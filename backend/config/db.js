// config/db.js
// Handles connection to MongoDB Atlas using Mongoose

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure if DB connection fails
    // The app is useless without the DB, so we fail fast and loud
    process.exit(1);
  }
};

module.exports = connectDB;
