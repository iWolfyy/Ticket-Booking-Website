const express = require('express');
const router = express.Router();
const { createEvent, getAllEvents } = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
// Public route to get all events
    .get(getAllEvents)


// Private route to create a new event (Seller/Admin only)
    .post(protect, authorize('seller', 'admin'), createEvent)

module.exports = router;