// models/Notification.js
// In-app notification shown under the bell icon in the dashboard top bar.
// Currently created automatically when a new emergency request matches a donor.

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ['emergency_match'],
      default: 'emergency_match'
    },
    emergencyRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EmergencyRequest',
      default: null
    },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 400 },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// One notification per donor per request - prevents duplicates
notificationSchema.index(
  { user: 1, emergencyRequest: 1 },
  { unique: true, partialFilterExpression: { emergencyRequest: { $type: 'objectId' } } }
);

module.exports = mongoose.model('Notification', notificationSchema);
