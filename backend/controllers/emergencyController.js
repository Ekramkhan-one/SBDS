// controllers/emergencyController.js
// Public emergency request bulletin board - create, list, and close requests.

const EmergencyRequest = require('../models/EmergencyRequest');

// @desc    Create a new emergency request
// @route   POST /api/emergency
// @access  Public (works whether or not the poster is logged in)
const createEmergencyRequest = async (req, res) => {
  try {
    const {
      patientName,
      requiredBloodGroup,
      hospital,
      hospitalOtherText,
      area,
      requiredBy,
      contactInfo,
      urgencyLevel,
      unitsNeeded,
      additionalNotes
    } = req.body;

    if (!patientName || !requiredBloodGroup || !hospital || !contactInfo) {
      return res.status(400).json({
        message: 'Patient name, blood group, hospital, and contact info are required'
      });
    }

    const request = await EmergencyRequest.create({
      // If the request came in with a valid auth token, req.user will exist
      // (see routes file - this endpoint uses an OPTIONAL auth check, not `protect`)
      postedBy: req.user ? req.user._id : null,
      patientName,
      requiredBloodGroup,
      hospital,
      hospitalOtherText: hospital === 'Other' ? hospitalOtherText : '',
      area: area || null,
      requiredBy: requiredBy || null,
      contactInfo,
      urgencyLevel: urgencyLevel || 'High',
      unitsNeeded: unitsNeeded || 1,
      additionalNotes
    });

    res.status(201).json(request);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('Create emergency request error:', error.message);
    res.status(500).json({ message: 'Server error creating emergency request' });
  }
};

// @desc    Get all active emergency requests (bulletin board feed)
// @route   GET /api/emergency?bloodGroup=O-&urgency=Critical
// @access  Public
const getEmergencyRequests = async (req, res) => {
  try {
    const { bloodGroup, urgency, status } = req.query;

    // Default to showing only Active requests so the board doesn't clutter
    // with fulfilled/expired ones unless specifically asked for
    const filter = { status: status || 'Active' };

    if (bloodGroup) filter.requiredBloodGroup = bloodGroup;
    if (urgency) filter.urgencyLevel = urgency;

    const requests = await EmergencyRequest.find(filter)
      .populate('postedBy', 'fullName isVerified') // show poster's name/badge if logged in
      .sort({ urgencyLevel: 1, createdAt: -1 }); // newest + most urgent surface first

    res.status(200).json({ count: requests.length, requests });
  } catch (error) {
    console.error('Get emergency requests error:', error.message);
    res.status(500).json({ message: 'Server error fetching emergency requests' });
  }
};

// @desc    Update request status (e.g., mark as Fulfilled)
// @route   PATCH /api/emergency/:id/status
// @access  Private (only the original poster or an admin should do this in practice -
//          enforced at the route/controller level below)
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Active', 'Fulfilled', 'Expired'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const request = await EmergencyRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Emergency request not found' });
    }

    // Only the original poster or an admin can close/update someone's request.
    // Anonymous posts (postedBy: null) can only be updated by an admin.
    const isOwner = request.postedBy && request.postedBy.toString() === req.user._id.toString();
    if (!isOwner && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }

    request.status = status;
    await request.save();

    res.status(200).json(request);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid request ID' });
    }
    console.error('Update request status error:', error.message);
    res.status(500).json({ message: 'Server error updating request status' });
  }
};

module.exports = { createEmergencyRequest, getEmergencyRequests, updateRequestStatus };
