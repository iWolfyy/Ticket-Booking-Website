const express = require('express');
const router = express.Router();
const { createShow, getEventShows, updateShow, deleteShow, getShowByID } = require('../controllers/showController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Create a new show
router.post('/', protect, authorize('seller', 'admin', 'eventmanager'), createShow);

// Get Shows for a specific Event
router.get('/event/:eventId', getEventShows);

// Get Show by ID
router.get('/:id', getShowByID);

// Update Show
router.put('/:id', protect, authorize('seller', 'admin', 'eventmanager'), updateShow);

// Delete Show
router.delete('/:id', protect, authorize('seller', 'admin', 'eventmanager'), deleteShow);

module.exports = router;