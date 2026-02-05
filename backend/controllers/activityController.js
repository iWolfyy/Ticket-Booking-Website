const Activity = require('../models/activity');

// @desc    Create a manual activity (Primarily for testing/system triggers)
// @route   POST /api/activities
const createManualActivity = async (req, res) => {
  try {
    const { user, type, title, description, link } = req.body;

    // Basic validation
    if (!user || !type || !title) {
      return res.status(400).json({ message: 'Please provide user, type, and title' });
    }

    const activity = await Activity.create({
      user,
      type,
      title,
      description,
      link
    });

    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get all activities for the logged-in user
// @route   GET /api/activities
const getUserActivities = async (req, res) => {
  try {
    // Fetch activities for the user, sorted by newest first
    const activities = await Activity.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50); // Optional: limit to recent 50

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Mark a specific activity as read
// @route   PATCH /api/activities/:id/read
const markAsRead = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Ensure the activity belongs to the user requesting the update
    if (activity.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    activity.isRead = true;
    await activity.save();

    res.status(200).json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Mark all user activities as read
// @route   PATCH /api/activities/read-all
const markAllAsRead = async (req, res) => {
  try {
    await Activity.updateMany(
      { user: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({ message: 'All activities marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Utility function (Not a route) 
// Use this inside other controllers (e.g., Booking or Event controllers)
const createActivity = async (userId, type, title, description, link) => {
  try {
    await Activity.create({
      user: userId,
      type,
      title,
      description,
      link
    });
  } catch (error) {
    console.error('Activity creation failed:', error);
  }
};

module.exports = {
  getUserActivities,
  markAsRead,
  markAllAsRead,
  createActivity,
  createManualActivity
};