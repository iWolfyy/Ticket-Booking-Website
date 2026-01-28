const express = require('express');
const router = express.Router();
const { createEvent, getAllEvents, updateEvent, deleteEvent, searchEvents} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(getAllEvents)
    .post(protect, authorize('seller', 'admin'), upload.single('bannerImage'), createEvent);

router.route('/:id')
    .put(protect, authorize('seller', 'admin'), upload.single('bannerImage'), updateEvent)
    .delete(protect, authorize('seller', 'admin'), deleteEvent);


router.route('/search')
    .get(searchEvents);

module.exports = router;