// controllers/notificationController.js
// Lets a logged-in user read and manage their own notifications.

const Notification = require('../models/Notification');

// @route   GET /api/notifications
// @access  Private
const getMyNotifications = async (req, res) => {
  try {
    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(30),
      Notification.countDocuments({ user: req.user._id, isRead: false })
    ]);
    res.status(200).json({ unreadCount, notifications });
  } catch (error) {
    console.error('Get notifications error:', error.message);
    res.status(500).json({ message: 'Server error fetching notifications' });
  }
};

// @route   PATCH /api/notifications/read-all
// @access  Private
const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all read error:', error.message);
    res.status(500).json({ message: 'Server error updating notifications' });
  }
};

// @route   PATCH /api/notifications/:id/read
// @access  Private
const markRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json(notification);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid notification ID' });
    }
    console.error('Mark read error:', error.message);
    res.status(500).json({ message: 'Server error updating notification' });
  }
};

module.exports = { getMyNotifications, markAllRead, markRead };
