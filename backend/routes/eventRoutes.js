const express = require('express');
const router = express.Router();
const { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent, searchEvents, searchTMDB, getMyEvents } = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// This handles both /api/events and /api/events?category=xyz
router.route('/')
    .get(getAllEvents) 
    .post(protect, authorize('seller', 'admin', 'eventmanager'), upload.single('bannerImage'), createEvent);

router.route('/search')
    .get(searchEvents);

// the search route
router.route('/tmdb-search').get(protect, searchTMDB);

// Management route
router.get('/manage', protect, authorize('seller', 'admin'), getMyEvents);

// Get events owned by the logged-in user
router.get('/me', protect, authorize('seller', 'admin'), getMyEvents);

router.route('/:id')
    .get(getEventById)
    .put(protect, authorize('seller', 'admin', 'eventmanager'), upload.single('bannerImage'), updateEvent)
    .delete(protect, authorize('seller', 'admin', 'eventmanager'), deleteEvent);



module.exports = router;