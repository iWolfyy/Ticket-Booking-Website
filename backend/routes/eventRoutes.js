const express = require('express');
const router = express.Router();
const { createEvent, getAllEvents, updateEvent, deleteEvent, searchEvents } = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// This handles both /api/events and /api/events?category=xyz
router.route('/')
    .get(getAllEvents) 
    .post(protect, authorize('seller', 'admin'), upload.single('bannerImage'), createEvent);

router.route('/search')
    .get(searchEvents);

router.route('/:id')
    .get(getAllEvents) // You can also use a getEventById here
    .put(protect, authorize('seller', 'admin'), upload.single('bannerImage'), updateEvent)
    .delete(protect, authorize('seller', 'admin'), deleteEvent);

module.exports = router;