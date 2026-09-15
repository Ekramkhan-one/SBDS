// routes/donorRoutes.js
const express = require('express');
const router = express.Router();
const {
  getDonors,
  getDonorById,
  toggleAvailability,
  verifyDonor,
  getDashboardStats,
  getRecentDonors
} = require('../controllers/donorController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// NOTE ON ORDER: specific paths ('/availability', '/stats/summary', '/recent')
// must be declared BEFORE the generic '/:id' route below, otherwise Express
// will try to match them as an :id param and fail.
router.patch('/availability', protect, toggleAvailability);
router.get('/stats/summary', getDashboardStats);
router.get('/recent', getRecentDonors);

router.get('/', getDonors);
router.get('/:id', getDonorById);
router.patch('/:id/verify', protect, adminOnly, verifyDonor);

module.exports = router;
