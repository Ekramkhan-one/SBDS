// models/User.js
// Core user schema for both Donors and Recipients.
// A single schema with a "role" field is simpler than two separate collections
// since donors and recipients share almost all fields (name, contact, area, etc.)

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Peshawar-specific blood groups - kept here for reference,
// actual dropdown values enforced via enum below
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// Peshawar areas - used for donor search/filtering
// NOTE: This list is duplicated in Phase 3 (Peshawar datasets) for frontend dropdowns.
// Keep both lists in sync if you add/remove areas.
const PESHAWAR_AREAS = [
  'Hayatabad',
  'University Road',
  'Saddar',
  'Gulberg',
  'Tehkal',
  'Chamkani',
  'Warsak Road',
  'Pajjagi Road',
  'Faqirabad',
  'Board Bazaar',
  'Regi Model Town',
  'Charsadda Road',
  'Ring Road',
  'Danishabad',
  'Karkhano Market'
];

// Zu Peshawar BRT stations - used to designate a mutually convenient meetup point
// between donor and recipient, per the project's localized Peshawar features.
const BRT_STATIONS = [
  'Chamkani',
  'Karkhano Market',
  'Tehkal',
  'University of Peshawar',
  'Malik Saad Shaheed',
  'Bacha Khan Chowk',
  'Firdous',
  'Board Bazaar',
  'Hayatabad'
];

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: 3,
      maxlength: 100
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false // never return password field by default in queries
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      // Pakistani mobile format: 03XXXXXXXXX (11 digits) - used to build WhatsApp links later
      match: [/^03\d{9}$/, 'Phone number must be in the format 03XXXXXXXXX']
    },
    cnicNumber: {
      type: String,
      required: [true, 'CNIC number is required'],
      unique: true,
      trim: true,
      // Pakistani CNIC format: 13 digits, e.g. 1234512345671
      match: [/^\d{13}$/, 'CNIC must be exactly 13 digits, no dashes']
    },
    role: {
      type: String,
      enum: ['donor', 'recipient'],
      required: [true, 'Role is required'],
      default: 'donor'
    },
    bloodGroup: {
      type: String,
      enum: BLOOD_GROUPS,
      required: [true, 'Blood group is required']
    },
    area: {
      type: String,
      enum: PESHAWAR_AREAS,
      required: [true, 'Area is required']
    },
    preferredBrtStation: {
      // Optional meetup point - not every donor may be near a BRT corridor,
      // so this stays optional rather than required like area/bloodGroup.
      type: String,
      enum: BRT_STATIONS,
      default: null
    },
    availabilityStatus: {
      // Only meaningful for donors, but harmless to have on all users
      type: String,
      enum: ['Available', 'Not Available'],
      default: 'Available'
    },
    isVerified: {
      // CNIC verification badge - set to true by admin after manual/automated check
      type: Boolean,
      default: false
    },
    isAdmin: {
      // Simple flag for admin accounts that can verify CNICs
      type: Boolean,
      default: false
    },
    lastDonationDate: {
      // Optional - helps recipients see how "fresh" a donor is
      type: Date,
      default: null
    }
  },
  {
    timestamps: true // adds createdAt / updatedAt automatically
  }
);

// --- Mongoose Middleware ---

// Hash password before saving, but only if it was modified
// (prevents re-hashing an already-hashed password on unrelated updates)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// --- Instance Methods ---

// Compare a plaintext password (login attempt) against the hashed one in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Export constants too so controllers/routes can validate against the same list
module.exports = mongoose.model('User', userSchema);
module.exports.BLOOD_GROUPS = BLOOD_GROUPS;
module.exports.PESHAWAR_AREAS = PESHAWAR_AREAS;
module.exports.BRT_STATIONS = BRT_STATIONS;
