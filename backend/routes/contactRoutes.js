// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const {
  submitContactMessage,
  getContactMessages,
  markMessageRead
} = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', submitContactMessage);
router.get('/', protect, adminOnly, getContactMessages);
router.patch('/:id/read', protect, adminOnly, markMessageRead);

module.exports = router;
