// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllDonorsForAdmin,
  createDonorForAdmin,
  updateDonorForAdmin,
  deleteDonorForAdmin,
  unverifyDonor,
  getAllEmergencyRequestsForAdmin,
  getReportsData
} = require('../controllers/adminController');
const { verifyDonor } = require('../controllers/donorController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Every route in this file requires both a valid login AND isAdmin === true.
// Applying middleware at the router level (instead of per-route) means we
// can't accidentally forget adminOnly on a new route added here later.
router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.get('/donors', getAllDonorsForAdmin);
router.post('/donors', createDonorForAdmin);
router.patch('/donors/:id', updateDonorForAdmin);
router.delete('/donors/:id', deleteDonorForAdmin);
router.patch('/donors/:id/verify', verifyDonor);
router.patch('/donors/:id/unverify', unverifyDonor);
router.get('/emergency', getAllEmergencyRequestsForAdmin);
router.get('/reports', getReportsData);

module.exports = router;
