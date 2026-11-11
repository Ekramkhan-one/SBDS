// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const {
  getMyNotifications,
  markAllRead,
  markRead
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getMyNotifications);
// read-all must be declared before /:id/read
router.patch('/read-all', protect, markAllRead);
router.patch('/:id/read', protect, markRead);

module.exports = router;
