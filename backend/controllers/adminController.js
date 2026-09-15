// controllers/adminController.js
// Admin-only operations: system-wide stats, full donor list (including
// unverified/unavailable, unlike the public directory), and verification actions.

const User = require('../models/User');
const EmergencyRequest = require('../models/EmergencyRequest');

// @desc    Get admin dashboard summary stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalDonors,
      verifiedDonors,
      pendingVerification,
      activeRequests,
      distinctAreas
    ] = await Promise.all([
      User.countDocuments({}),
      User.countDocuments({ role: 'donor' }),
      User.countDocuments({ role: 'donor', isVerified: true }),
      User.countDocuments({ role: 'donor', isVerified: false }),
      EmergencyRequest.countDocuments({ status: 'Active' }),
      User.distinct('area', { role: 'donor' })
    ]);

    res.status(200).json({
      totalUsers,
      totalDonors,
      verifiedDonors,
      pendingVerification,
      activeRequests,
      areasCovered: distinctAreas.length
    });
  } catch (error) {
    console.error('Get admin stats error:', error.message);
    res.status(500).json({ message: 'Server error fetching admin stats' });
  }
};

// @desc    Get ALL donors for admin management (including unavailable/unverified)
// @route   GET /api/admin/donors?status=pending
// @access  Private/Admin
const getAllDonorsForAdmin = async (req, res) => {
  try {
    const { status } = req.query; // 'pending' | 'verified' | undefined (all)

    const filter = { role: 'donor' };
    if (status === 'pending') filter.isVerified = false;
    if (status === 'verified') filter.isVerified = true;

    // Admins DO need to see CNIC numbers to actually perform verification,
    // unlike the public directory which always hides it.
    const donors = await User.find(filter).sort({ createdAt: -1 });

    res.status(200).json({ count: donors.length, donors });
  } catch (error) {
    console.error('Get all donors (admin) error:', error.message);
    res.status(500).json({ message: 'Server error fetching donors' });
  }
};

// @desc    Reject/unverify a donor (in case a verification was granted in error)
// @route   PATCH /api/admin/donors/:id/unverify
// @access  Private/Admin
const unverifyDonor = async (req, res) => {
  try {
    const donor = await User.findById(req.params.id);

    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    donor.isVerified = false;
    await donor.save();

    res.status(200).json({ message: `${donor.fullName}'s verification has been revoked` });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid donor ID' });
    }
    console.error('Unverify donor error:', error.message);
    res.status(500).json({ message: 'Server error updating verification' });
  }
};

// @desc    Admin: get ALL emergency requests regardless of status
// @route   GET /api/admin/emergency
// @access  Private/Admin
const getAllEmergencyRequestsForAdmin = async (req, res) => {
  try {
    const requests = await EmergencyRequest.find({})
      .populate('postedBy', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json({ count: requests.length, requests });
  } catch (error) {
    console.error('Get all emergency requests (admin) error:', error.message);
    res.status(500).json({ message: 'Server error fetching emergency requests' });
  }
};

// @desc    Admin: create a new donor directly (bypasses self-registration)
// @route   POST /api/admin/donors
// @access  Private/Admin
const createDonorForAdmin = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phoneNumber,
      cnicNumber,
      bloodGroup,
      area,
      preferredBrtStation,
      availabilityStatus,
      isVerified
    } = req.body;

    if (!fullName || !email || !password || !phoneNumber || !cnicNumber || !bloodGroup || !area) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { cnicNumber }]
    });

    if (existingUser) {
      const conflictField = existingUser.email === email.toLowerCase() ? 'email' : 'CNIC number';
      return res.status(409).json({ message: `A donor with this ${conflictField} already exists` });
    }

    const donor = await User.create({
      fullName,
      email,
      password,
      phoneNumber,
      cnicNumber,
      role: 'donor',
      bloodGroup,
      area,
      preferredBrtStation: preferredBrtStation || null,
      availabilityStatus: availabilityStatus || 'Available',
      // Unlike self-registration, an admin creating a donor directly can
      // mark them verified immediately (e.g. if CNIC was checked in person).
      isVerified: isVerified === true
    });

    res.status(201).json({
      _id: donor._id,
      fullName: donor.fullName,
      email: donor.email,
      phoneNumber: donor.phoneNumber,
      cnicNumber: donor.cnicNumber,
      bloodGroup: donor.bloodGroup,
      area: donor.area,
      preferredBrtStation: donor.preferredBrtStation,
      availabilityStatus: donor.availabilityStatus,
      isVerified: donor.isVerified
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('Create donor (admin) error:', error.message);
    res.status(500).json({ message: 'Server error creating donor' });
  }
};

// @desc    Admin: update any donor's full details
// @route   PATCH /api/admin/donors/:id
// @access  Private/Admin
const updateDonorForAdmin = async (req, res) => {
  try {
    const donor = await User.findById(req.params.id);

    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    const {
      fullName,
      phoneNumber,
      bloodGroup,
      area,
      preferredBrtStation,
      availabilityStatus,
      isVerified
    } = req.body;

    // Same rationale as the self-service profile update: email and CNIC are
    // left out of the editable field list here too. An admin correcting a
    // typo in either would be rare enough to handle as a deliberate
    // one-off (e.g. directly noting it) rather than opening a routine edit
    // path that could be used to swap a verified identity after the fact.
    if (fullName) donor.fullName = fullName;
    if (phoneNumber) donor.phoneNumber = phoneNumber;
    if (bloodGroup) donor.bloodGroup = bloodGroup;
    if (area) donor.area = area;
    if ('preferredBrtStation' in req.body) {
      donor.preferredBrtStation = preferredBrtStation || null;
    }
    if (availabilityStatus) donor.availabilityStatus = availabilityStatus;
    if (typeof isVerified === 'boolean') donor.isVerified = isVerified;

    await donor.save();

    res.status(200).json({
      _id: donor._id,
      fullName: donor.fullName,
      email: donor.email,
      phoneNumber: donor.phoneNumber,
      cnicNumber: donor.cnicNumber,
      bloodGroup: donor.bloodGroup,
      area: donor.area,
      preferredBrtStation: donor.preferredBrtStation,
      availabilityStatus: donor.availabilityStatus,
      isVerified: donor.isVerified
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid donor ID' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('Update donor (admin) error:', error.message);
    res.status(500).json({ message: 'Server error updating donor' });
  }
};

// @desc    Admin: delete a donor account
// @route   DELETE /api/admin/donors/:id
// @access  Private/Admin
const deleteDonorForAdmin = async (req, res) => {
  try {
    const donor = await User.findById(req.params.id);

    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    await donor.deleteOne();

    res.status(200).json({ message: `${donor.fullName} has been removed` });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid donor ID' });
    }
    console.error('Delete donor (admin) error:', error.message);
    res.status(500).json({ message: 'Server error deleting donor' });
  }
};

// @desc    Admin: get aggregated data for the Reports & Analytics page
// @route   GET /api/admin/reports
// @access  Private/Admin
const getReportsData = async (req, res) => {
  try {
    const [bloodGroupBreakdown, areaBreakdown, requestsByUrgency, requestsByStatus, donorRoleSplit] =
      await Promise.all([
        // How many donors per blood group - helps spot which groups are scarce
        User.aggregate([
          { $match: { role: 'donor' } },
          { $group: { _id: '$bloodGroup', count: { $sum: 1 } } },
          { $sort: { _id: 1 } }
        ]),
        // How many donors per Peshawar area
        User.aggregate([
          { $match: { role: 'donor' } },
          { $group: { _id: '$area', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        // Emergency requests grouped by urgency level
        EmergencyRequest.aggregate([
          { $group: { _id: '$urgencyLevel', count: { $sum: 1 } } }
        ]),
        // Emergency requests grouped by status (Active/Fulfilled/Expired)
        EmergencyRequest.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        // Donor vs recipient split among all registered users
        User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }])
      ]);

    // Reshape aggregation output ([{_id, count}]) into simple {label: count}
    // maps, which are easier for the frontend to consume directly in charts.
    const toMap = (arr) =>
      arr.reduce((acc, item) => {
        acc[item._id || 'Unspecified'] = item.count;
        return acc;
      }, {});

    res.status(200).json({
      bloodGroupBreakdown: toMap(bloodGroupBreakdown),
      areaBreakdown: toMap(areaBreakdown),
      requestsByUrgency: toMap(requestsByUrgency),
      requestsByStatus: toMap(requestsByStatus),
      donorRoleSplit: toMap(donorRoleSplit)
    });
  } catch (error) {
    console.error('Get reports data error:', error.message);
    res.status(500).json({ message: 'Server error fetching reports data' });
  }
};

module.exports = {
  getAdminStats,
  getAllDonorsForAdmin,
  createDonorForAdmin,
  updateDonorForAdmin,
  deleteDonorForAdmin,
  unverifyDonor,
  getAllEmergencyRequestsForAdmin,
  getReportsData
};
