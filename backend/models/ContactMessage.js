// models/ContactMessage.js
// Stores messages submitted via the public Contact page.
// Kept separate from EmergencyRequest since this is general inquiries,
// not blood-request bulletin board content.

const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 100
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    subject: {
      type: String,
      trim: true,
      maxlength: 150,
      default: ''
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: 2000
    },
    isRead: {
      // Lets an admin mark inquiries as handled, similar in spirit to
      // isVerified on donors - a simple boolean status flag.
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
