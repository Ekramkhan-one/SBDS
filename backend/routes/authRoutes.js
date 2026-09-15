// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.patch('/profile', protect, updateProfile);
router.patch('/change-password', protect, changePassword);

module.exports = router;
