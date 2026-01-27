const express = require('express');
const router = express.Router();
const { createShow, getEventShows, updateShow, deleteShow } = require('../controllers/showController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Create a new show
router.post('/', protect, authorize('seller', 'admin'), createShow);

// Get Shows for a specific Event
router.get('/event/:eventId', getEventShows);

// Update Show
router.put('/:id', protect, authorize('seller', 'admin'), updateShow);

// Delete Show
router.delete('/:id', protect, authorize('seller', 'admin'), deleteShow);

module.exports = router;