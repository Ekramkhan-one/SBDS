// controllers/contactController.js
// Handles submissions from the public Contact page.

const ContactMessage = require('../models/ContactMessage');

// @desc    Submit a contact message
// @route   POST /api/contact
// @access  Public
const submitContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const contactMessage = await ContactMessage.create({ name, email, subject, message });

    res.status(201).json({
      message: "Thanks for reaching out — we'll get back to you soon.",
      id: contactMessage._id
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('Submit contact message error:', error.message);
    res.status(500).json({ message: 'Server error submitting your message' });
  }
};

// @desc    Admin: view all contact messages
// @route   GET /api/contact
// @access  Private/Admin
const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
    res.status(200).json({ count: messages.length, messages });
  } catch (error) {
    console.error('Get contact messages error:', error.message);
    res.status(500).json({ message: 'Server error fetching messages' });
  }
};

// @desc    Admin: mark a contact message as read
// @route   PATCH /api/contact/:id/read
// @access  Private/Admin
const markMessageRead = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(200).json(message);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid message ID' });
    }
    console.error('Mark message read error:', error.message);
    res.status(500).json({ message: 'Server error updating message' });
  }
};

module.exports = { submitContactMessage, getContactMessages, markMessageRead };
