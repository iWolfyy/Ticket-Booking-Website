const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  getUserActivities, 
  markAsRead, 
  markAllAsRead,
  createManualActivity 
} = require('../controllers/activityController');

router.get('/', protect, getUserActivities);
router.patch('/read-all', protect, markAllAsRead);
router.patch('/:id/read', protect, markAsRead);
router.post('/', protect, createManualActivity);

module.exports = router;