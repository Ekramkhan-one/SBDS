// models/EmergencyRequest.js
// Public bulletin board for urgent blood requests.
// Not tied strictly to a registered user - anyone (logged in or via a simple
// public form) can post one, since emergencies shouldn't be gated by full signup.
// We still link to a User if the poster is logged in, for accountability.

const mongoose = require('mongoose');
const { BLOOD_GROUPS, PESHAWAR_AREAS } = require('./User');

const HOSPITALS = [
  'Lady Reading Hospital (LRH)',
  'Khyber Teaching Hospital (KTH)',
  'Hayatabad Medical Complex (HMC)',
  'Rehman Medical Institute (RMI)',
  'Northwest General Hospital',
  'Other'
];

const emergencyRequestSchema = new mongoose.Schema(
  {
    postedBy: {
      // Optional link to a registered User - null if posted anonymously/publicly
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
      maxlength: 100
    },
    requiredBloodGroup: {
      type: String,
      enum: BLOOD_GROUPS,
      required: [true, 'Required blood group is required']
    },
    hospital: {
      type: String,
      enum: HOSPITALS,
      required: [true, 'Hospital/location is required']
    },
    hospitalOtherText: {
      // Used only when hospital === 'Other', so posters aren't locked out
      // if their hospital isn't in the pre-filled list
      type: String,
      trim: true,
      maxlength: 150,
      default: ''
    },
    area: {
      // Optional - helps posters searching/filtering the board by locality,
      // separate from the specific hospital name.
      type: String,
      enum: PESHAWAR_AREAS,
      default: null
    },
    requiredBy: {
      // Optional deadline the poster needs the blood by - purely informational,
      // does not auto-expire the request (status still controls that).
      type: Date,
      default: null
    },
    contactInfo: {
      // Phone number to show/contact via WhatsApp for this specific request
      type: String,
      required: [true, 'Contact info is required'],
      trim: true,
      match: [/^03\d{9}$/, 'Contact number must be in the format 03XXXXXXXXX']
    },
    urgencyLevel: {
      type: String,
      enum: ['Critical', 'High', 'Moderate'],
      required: [true, 'Urgency level is required'],
      default: 'High'
    },
    unitsNeeded: {
      type: Number,
      min: 1,
      default: 1
    },
    additionalNotes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: ''
    },
    status: {
      // Allows the poster/admin to close a request once fulfilled,
      // so the bulletin board doesn't fill up with stale emergencies
      type: String,
      enum: ['Active', 'Fulfilled', 'Expired'],
      default: 'Active'
    }
  },
  {
    timestamps: true
  }
);

// Index for fast filtering on the bulletin board (most common queries)
emergencyRequestSchema.index({ status: 1, requiredBloodGroup: 1, createdAt: -1 });

module.exports = mongoose.model('EmergencyRequest', emergencyRequestSchema);
module.exports.HOSPITALS = HOSPITALS;
