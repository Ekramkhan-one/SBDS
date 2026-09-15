// models/Station.js
// BRT Peshawar (Zu Peshawar) station list, used as meetup point options.
//
// DESIGN DECISION: This is modeled as its own collection (rather than a hardcoded
// frontend array) so it's easy to add/remove stations later without a code deploy.
// If you'd rather keep it simple as a static JSON list on the frontend only,
// that's also fine for an FYP - we'll provide that static list in Phase 3 too.

const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    route: {
      // BRT Peshawar has multiple corridors; helpful metadata, not required for MVP
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Station', stationSchema);
