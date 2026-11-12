// controllers/donorController.js
// Donor directory, search/filtering, availability toggle, and admin verification.

const User = require('../models/User');

// @desc    Get donors with optional filters (blood group, area)
// @route   GET /api/donors?bloodGroup=A+&area=Hayatabad
// @access  Public
const getDonors = async (req, res) => {
  try {
    const { bloodGroup, area, brtStation, verifiedOnly, q } = req.query;

    // Build a dynamic filter object based on which query params were sent.
    // Always restrict to role: 'donor' and Available status, since a
    // "directory" should show people who can actually donate right now.
    const filter = {
      role: 'donor',
      availabilityStatus: 'Available'
    };

    if (bloodGroup) {
      filter.bloodGroup = bloodGroup;
    }

    if (area) {
      filter.area = area;
    }

    if (brtStation) {
      filter.preferredBrtStation = brtStation;
    }

    if (verifiedOnly === 'true') {
      filter.isVerified = true;
    }

    // Free-text search (e.g. from the top-bar search box): matches a typed
    // word like "O+", "Hayatabad" or a donor's name against several fields
    // at once, so the person doesn't need to know which dropdown it belongs in.
    if (q && q.trim()) {
      // Escape regex special characters so a search like "A+" is treated literally
      const safeQuery = q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(safeQuery, 'i');
      filter.$or = [
        { fullName: pattern },
        { bloodGroup: pattern },
        { area: pattern },
        { preferredBrtStation: pattern }
      ];
    }

    // Never return password/cnicNumber in a public listing - CNIC is sensitive PII,
    // only needed internally for admin verification, not shown to other users
    const donors = await User.find(filter)
      .select('-password -cnicNumber')
      .sort({ isVerified: -1, createdAt: -1 }); // verified donors surface first

    res.status(200).json({ count: donors.length, donors });
  } catch (error) {
    console.error('Get donors error:', error.message);
    res.status(500).json({ message: 'Server error fetching donors' });
  }
};

// @desc    Get a single donor's public profile
// @route   GET /api/donors/:id
// @access  Public
const getDonorById = async (req, res) => {
  try {
    const donor = await User.findOne({ _id: req.params.id, role: 'donor' }).select(
      '-password -cnicNumber'
    );

    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    res.status(200).json(donor);
  } catch (error) {
    // Handles malformed ObjectId gracefully instead of a raw 500 crash
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid donor ID' });
    }
    console.error('Get donor by id error:', error.message);
    res.status(500).json({ message: 'Server error fetching donor' });
  }
};

// @desc    Toggle logged-in donor's own availability status
// @route   PATCH /api/donors/availability
// @access  Private (donor only)
const toggleAvailability = async (req, res) => {
  try {
    if (req.user.role !== 'donor') {
      return res.status(403).json({ message: 'Only donors can toggle availability' });
    }

    // Flip current status rather than requiring the client to send the new value -
    // avoids a race condition where the client's idea of "current status" is stale
    req.user.availabilityStatus =
      req.user.availabilityStatus === 'Available' ? 'Not Available' : 'Available';

    await req.user.save();

    res.status(200).json({
      message: 'Availability updated',
      availabilityStatus: req.user.availabilityStatus
    });
  } catch (error) {
    console.error('Toggle availability error:', error.message);
    res.status(500).json({ message: 'Server error updating availability' });
  }
};

// @desc    Admin: verify a donor's CNIC (issues the "Verified" badge)
// @route   PATCH /api/donors/:id/verify
// @access  Private/Admin
const verifyDonor = async (req, res) => {
  try {
    const donor = await User.findById(req.params.id);

    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    donor.isVerified = true;
    await donor.save();

    res.status(200).json({ message: `${donor.fullName} has been verified`, isVerified: true });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid donor ID' });
    }
    console.error('Verify donor error:', error.message);
    res.status(500).json({ message: 'Server error verifying donor' });
  }
};

// @desc    Get aggregate stats for the dashboard (totals, availability breakdown)
// @route   GET /api/donors/stats/summary
// @access  Public
const getDashboardStats = async (req, res) => {
  try {
    const [totalDonors, availableCount, verifiedCount, distinctAreas] = await Promise.all([
      User.countDocuments({ role: 'donor' }),
      User.countDocuments({ role: 'donor', availabilityStatus: 'Available' }),
      User.countDocuments({ role: 'donor', isVerified: true }),
      User.distinct('area', { role: 'donor' })
    ]);

    const notAvailableCount = totalDonors - availableCount;

    res.status(200).json({
      totalDonors,
      areasCovered: distinctAreas.length,
      verifiedDonors: verifiedCount,
      availability: {
        available: availableCount,
        notAvailable: notAvailableCount
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error.message);
    res.status(500).json({ message: 'Server error fetching dashboard stats' });
  }
};

// @desc    Get most recently registered donors (for "Recent Donors" table)
// @route   GET /api/donors/recent?limit=4
// @access  Public
const getRecentDonors = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 5, 20); // cap at 20 to prevent abuse

    const donors = await User.find({ role: 'donor' })
      .select('-password -cnicNumber')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({ count: donors.length, donors });
  } catch (error) {
    console.error('Get recent donors error:', error.message);
    res.status(500).json({ message: 'Server error fetching recent donors' });
  }
};

module.exports = {
  getDonors,
  getDonorById,
  toggleAvailability,
  verifyDonor,
  getDashboardStats,
  getRecentDonors
};
