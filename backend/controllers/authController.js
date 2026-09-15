// controllers/authController.js
// Handles registration and login for both Donors and Recipients.

const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user (donor or recipient)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phoneNumber,
      cnicNumber,
      role,
      bloodGroup,
      area,
      preferredBrtStation
    } = req.body;

    // Basic presence check - Mongoose schema validation will catch format issues,
    // but we check here first to fail fast with a clean error before hitting the DB
    if (!fullName || !email || !password || !phoneNumber || !cnicNumber || !bloodGroup || !area) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    // Check for existing user by email OR CNIC (both must be unique)
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { cnicNumber }]
    });

    if (existingUser) {
      const conflictField = existingUser.email === email.toLowerCase() ? 'email' : 'CNIC number';
      return res.status(409).json({ message: `An account with this ${conflictField} already exists` });
    }

    // Password hashing happens automatically via the pre('save') hook in User model
    const user = await User.create({
      fullName,
      email,
      password,
      phoneNumber,
      cnicNumber,
      role: role || 'donor',
      bloodGroup,
      area,
      // preferredBrtStation is optional and its enum validator rejects an empty
      // string, so an unselected dropdown (sent as '') must become null here.
      preferredBrtStation: preferredBrtStation || null
    });

    const token = generateToken(user._id);

    // Return user data (without password) + token
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      cnicNumber: user.cnicNumber,
      role: user.role,
      bloodGroup: user.bloodGroup,
      area: user.area,
      preferredBrtStation: user.preferredBrtStation,
      availabilityStatus: user.availabilityStatus,
      isVerified: user.isVerified,
      token
    });
  } catch (error) {
    // Handle Mongoose validation errors with a readable message
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('Register error:', error.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Explicitly select password since schema has select: false on it
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      // Deliberately vague message - don't reveal whether email exists or password was wrong
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      cnicNumber: user.cnicNumber,
      role: user.role,
      bloodGroup: user.bloodGroup,
      area: user.area,
      preferredBrtStation: user.preferredBrtStation,
      availabilityStatus: user.availabilityStatus,
      isVerified: user.isVerified,
      isAdmin: user.isAdmin,
      token
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Get currently logged-in user's profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  // req.user is set by the `protect` middleware
  res.status(200).json(req.user);
};

// @desc    Update the logged-in user's own profile
// @route   PATCH /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { fullName, phoneNumber, bloodGroup, area, preferredBrtStation } = req.body;

    // CNIC and email are intentionally NOT editable here:
    // - CNIC is the identity anchor behind the "Verified" badge, so letting
    //   a user change it post-verification would undermine the whole trust
    //   mechanism the badge is meant to signal.
    // - Email changes would normally require re-verification (e.g. a
    //   confirmation link) which is out of scope for this project, so for
    //   now email stays fixed to avoid a half-built, insecure flow.
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (fullName) user.fullName = fullName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bloodGroup) user.bloodGroup = bloodGroup;
    if (area) user.area = area;
    // preferredBrtStation can be intentionally cleared, so check for the key
    // being present rather than truthiness (empty string -> null, same rule
    // as registration).
    if ('preferredBrtStation' in req.body) {
      user.preferredBrtStation = preferredBrtStation || null;
    }

    await user.save();

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      cnicNumber: user.cnicNumber,
      role: user.role,
      bloodGroup: user.bloodGroup,
      area: user.area,
      preferredBrtStation: user.preferredBrtStation,
      availabilityStatus: user.availabilityStatus,
      isVerified: user.isVerified,
      isAdmin: user.isAdmin
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('Update profile error:', error.message);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

// @desc    Change the logged-in user's own password
// @route   PATCH /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    // Explicitly select password since schema has select: false on it
    const user = await User.findById(req.user._id).select('+password');

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword; // pre('save') hook hashes this automatically
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error.message);
    res.status(500).json({ message: 'Server error changing password' });
  }
};

module.exports = { registerUser, loginUser, getMe, updateProfile, changePassword };
