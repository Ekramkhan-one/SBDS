// routes/emergencyRoutes.js
const express = require('express');
const router = express.Router();
const {
  createEmergencyRequest,
  getEmergencyRequests,
  updateRequestStatus
} = require('../controllers/emergencyController');
const { protect } = require('../middleware/authMiddleware');
const optionalAuth = require('../middleware/optionalAuth');

router.post('/', optionalAuth, createEmergencyRequest);
router.get('/', getEmergencyRequests);
router.patch('/:id/status', protect, updateRequestStatus);

module.exports = router;
