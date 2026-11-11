// utils/notifyDonors.js
// When a new emergency request is created, notify the best-matching donors
// with an in-app notification (shown under the bell icon in the top bar).
//
// Must be awaited by the caller: on serverless hosts (Vercel) the function
// can be frozen as soon as the response is sent, so background work may never finish.

const Notification = require('../models/Notification');
const { findMatchingDonors } = require('./donorMatching');

const notifyMatchingDonors = async (request) => {
  const donors = await findMatchingDonors(request);
  if (donors.length === 0) return 0;

  const place = request.hospital === 'Other' ? request.hospitalOtherText || 'a hospital' : request.hospital;
  const units = request.unitsNeeded || 1;
  const title = `${request.urgencyLevel} blood request: ${request.requiredBloodGroup}`;
  const message = `${units} unit${units > 1 ? 's' : ''} of ${request.requiredBloodGroup} needed at ${place}. You match this request - please check the Emergency page.`;

  // ordered:false so one duplicate doesn't block the rest.
  try {
    await Notification.insertMany(
      donors.map((donor) => ({
        user: donor._id,
        type: 'emergency_match',
        emergencyRequest: request._id,
        title,
        message
      })),
      { ordered: false }
    );
  } catch (error) {
    // Duplicate-key errors are expected and harmless; log anything else
    if (error.code !== 11000 && !error.writeErrors) {
      console.error('Notification insert error:', error.message);
    }
  }

  return donors.length;
};

module.exports = { notifyMatchingDonors };
