const express = require('express');
const router = express.Router();
const { createEvent, getAllEvents, updateEvent, deleteEvent} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(getAllEvents)
    .post(protect, authorize('seller', 'admin'), createEvent);

router.route('/:id')
    .put(protect, authorize('seller', 'admin'), updateEvent)
    .delete(protect, authorize('seller', 'admin'), deleteEvent);


module.exports = router;