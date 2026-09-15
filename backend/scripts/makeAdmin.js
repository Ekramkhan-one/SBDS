// scripts/makeAdmin.js
// One-time utility script to promote a user to admin by email.
// Run manually from the terminal: node scripts/makeAdmin.js your@email.com
//
// This is intentionally NOT an API endpoint - exposing "become admin" over
// HTTP would let anyone promote themselves. Running it locally via terminal
// means only someone with direct access to the server/database can grant
// admin rights, which is the appropriate level of friction for this action.

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

async function makeAdmin() {
  const email = process.argv[2];

  if (!email) {
    console.error('Usage: node scripts/makeAdmin.js <email>');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.error(`No user found with email: ${email}`);
      process.exit(1);
    }

    user.isAdmin = true;
    await user.save();

    console.log(`Success: ${user.fullName} (${user.email}) is now an admin.`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

makeAdmin();
