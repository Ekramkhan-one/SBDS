// utils/donorMatching.js
// Finds the best donors for an emergency request.
//
// A donor must pass three filters:
//   1. Blood compatibility - their group can safely be given to the patient
//   2. Availability        - marked "Available" on their profile
//   3. Eligibility         - not within the cooldown period after their last donation
//
// Matching donors are then ranked by a trust/relevance score (highest first):
//   - CNIC verified ........ +40
//   - Same area ............ +25
//   - Exact blood group .... +20  (preferred over a merely compatible group)
//   - Has donated before ... +15

const User = require('../models/User');

// Which donor blood groups can give to each patient blood group (red cell compatibility)
const COMPATIBLE_DONORS = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  'AB-': ['A-', 'B-', 'AB-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-']
};

// Minimum days between donations. Adjust to your local medical guidelines.
const COOLDOWN_DAYS = parseInt(process.env.DONATION_COOLDOWN_DAYS, 10) || 90;

// How many donors to notify at most per request
const MAX_NOTIFIED = parseInt(process.env.MAX_NOTIFIED_DONORS, 10) || 30;

// Used only when the request has no area of its own.
// Verify these against the real hospital locations.
const HOSPITAL_AREA = {
  'Hayatabad Medical Complex (HMC)': 'Hayatabad',
  'Rehman Medical Institute (RMI)': 'Hayatabad',
  'Khyber Teaching Hospital (KTH)': 'University Road'
};

const scoreDonor = (donor, request, targetArea) => {
  let score = 0;
  if (donor.isVerified) score += 40;
  if (targetArea && donor.area === targetArea) score += 25;
  if (donor.bloodGroup === request.requiredBloodGroup) score += 20;
  if (donor.lastDonationDate) score += 15;
  return score;
};

const findMatchingDonors = async (request) => {
  const compatibleGroups = COMPATIBLE_DONORS[request.requiredBloodGroup] || [];
  if (compatibleGroups.length === 0) return [];

  const cooldownDate = new Date(Date.now() - COOLDOWN_DAYS * 24 * 60 * 60 * 1000);

  const filter = {
    role: 'donor',
    availabilityStatus: 'Available',
    bloodGroup: { $in: compatibleGroups },
    $or: [{ lastDonationDate: null }, { lastDonationDate: { $lte: cooldownDate } }]
  };

  // Never notify the person who posted the request
  if (request.postedBy) filter._id = { $ne: request.postedBy };

  const donors = await User.find(filter).select(
    'fullName email area bloodGroup isVerified lastDonationDate'
  );

  const targetArea = request.area || HOSPITAL_AREA[request.hospital] || null;

  return donors
    .map((donor) => ({ donor, score: scoreDonor(donor, request, targetArea) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_NOTIFIED)
    .map((entry) => entry.donor);
};

module.exports = { findMatchingDonors, COMPATIBLE_DONORS, COOLDOWN_DAYS };
