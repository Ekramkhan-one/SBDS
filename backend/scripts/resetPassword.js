// scripts/resetPassword.js
// One-time utility script to reset a user's password by email.
// Run manually from the terminal: node scripts/resetPassword.js <email> <newPassword>
//
// This goes through the User model (not raw DB edits) so the password gets
// properly bcrypt-hashed via the existing pre('save') hook - editing the
// password field directly in Atlas's UI would store it as PLAIN TEXT,
// which would silently break login (since login always compares against
// a bcrypt hash) and would be a serious security issue if left that way.

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

async function resetPassword() {
  const email = process.argv[2];
  const newPassword = process.argv[3];

  if (!email || !newPassword) {
    console.error('Usage: node scripts/resetPassword.js <email> <newPassword>');
    process.exit(1);
  }

  if (newPassword.length < 6) {
    console.error('Password must be at least 6 characters.');
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

    user.password = newPassword; // pre('save') hook hashes this automatically
    await user.save();

    console.log(`Success: password for ${user.fullName} (${user.email}) has been updated.`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

resetPassword();
